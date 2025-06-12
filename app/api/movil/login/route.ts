import { NextRequest, NextResponse } from "next/server";
const key = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    //todo actualizar el inicio de sesion
    if (!key) {
      return NextResponse.json(
        { error: "No se tiene el token JWT en las variables de entorno" },
        { status: 500 }
      );
    }
    //if ("rol" in user && user.rol) {
    //  const isPermited = PersonHasPermission(
    //    user.rol.permissions,
    //    permissionsList.APLICACION_MOVIL,
    //  );

    //  if (isPermited) {
    //    const token = jwt.sign({ access_token: user }, key, {
    //      expiresIn: "1h",
    //    });
    //    return NextResponse.json({ access_token: token });
    //  } else {
    //    return NextResponse.json(
    //      { error: "El usuario no tiene los permisos requeridos" },
    //      { status: 403 },
    //    );
    //  }
    //} else {
    //  return NextResponse.json(
    //    { error: "El usuario no tiene los permisos requeridos" },
    //    { status: 500 },
    //  );
    //}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
