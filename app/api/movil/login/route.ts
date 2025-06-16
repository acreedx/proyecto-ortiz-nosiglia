import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { userStatusList } from "../../../../types/statusList";
import { SignInApiSchema } from "../../../../lib/zod/z-sign-in-cycle-schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { permissionsList } from "../../../../types/permissionsList";
import { ZodError } from "zod";
const key = process.env.JWT_SECRET;

export async function POST(req: NextRequest): Promise<
  NextResponse<{
    access_token?: string;
    message?: string;
  }>
> {
  try {
    if (!key) {
      return NextResponse.json(
        { message: "No se tiene el token JWT en las variables de entorno" },
        { status: 500 }
      );
    }
    //validar la estructura de las credenciales
    const { username, password } = await SignInApiSchema.parseAsync(
      await req.json()
    );
    //validar si existe el usuario con el username
    const dbUser = await prisma.user.findFirst({
      where: {
        username: username,
        OR: [
          {
            status: userStatusList.ACTIVO,
          },
          {
            status: userStatusList.NUEVO,
          },
          {
            status: userStatusList.BLOQUEADO,
          },
        ],
      },
      include: {
        role: {
          include: {
            role_permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    if (!dbUser) {
      return NextResponse.json(
        { message: "Usuario o contraseña incorrectos" },
        { status: 500 }
      );
    }
    //validar el password
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    //Validación de contraseña incorrecta
    if (!isPasswordValid) {
      if (dbUser.password_attempts >= 5) {
        await prisma.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            status: userStatusList.BLOQUEADO,
          },
        });
        return NextResponse.json(
          { message: "Usuario o contraseña incorrectos" },
          { status: 500 }
        );
      }
      await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          password_attempts: dbUser.password_attempts + 1,
        },
      });
      return NextResponse.json(
        { message: "Usuario o contraseña incorrectos" },
        { status: 500 }
      );
    }
    //Validar al usuario bloqueado
    if (dbUser.status === userStatusList.BLOQUEADO) {
      return NextResponse.json(
        {
          message:
            "El usuario está bloqueado, cambie su contraseña para continuar",
        },
        { status: 500 }
      );
    }
    if (dbUser.password_expiration < new Date()) {
      return NextResponse.json(
        {
          message:
            "Su contraseña ha expirado, debe cambiarla para iniciar sesión",
        },
        { status: 500 }
      );
    }
    if (dbUser.last_login !== null && dbUser.status === userStatusList.NUEVO) {
      return NextResponse.json(
        {
          message:
            "Usuario nuevo, debe cambiar su contraseña para poder continuar",
        },
        { status: 500 }
      );
    }
    if (
      !dbUser.role.role_permissions.some(
        (e) => e.permission.code === permissionsList.APLICACION_MOVIL
      )
    ) {
      return NextResponse.json(
        {
          message: "El usuario no tiene los permisos requeridos",
        },
        { status: 500 }
      );
    }
    await prisma.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        password_attempts: 0,
        last_login: new Date(),
      },
    });
    const token = jwt.sign({ access_token: dbUser }, key, {
      expiresIn: "1h",
    });
    return NextResponse.json({ access_token: token });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = error.errors[0]?.message || "Error de validación";
      return NextResponse.json({ message: message }, { status: 500 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
