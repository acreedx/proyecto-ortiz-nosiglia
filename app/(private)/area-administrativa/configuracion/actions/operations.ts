"use server";
import { prisma } from "../../../../../lib/prisma/prisma";
import { userStatusList } from "../../../../../types/statusList";
import { billingStatus } from "../../../../../types/billingStatus";
import generateStrongPassword, {
  getPasswordExpiration,
} from "../../../../../lib/bcrypt/password-generator";
import { hashPassword } from "../../../../../lib/bcrypt/hasher";
import { ImportPatient } from "../models/import-patient";

export async function createPatients({
  data,
}: {
  data: ImportPatient[];
}): Promise<{ ok: boolean }> {
  try {
    data.forEach(async (data) => {
      if (!data.carnetDeIdentidad) {
        return;
      }
      const isIdTaken = await prisma.user.findFirst({
        where: {
          identification: data.carnetDeIdentidad,
        },
      });
      if (isIdTaken) {
        return;
      }
      const generatedPassword = generateStrongPassword(12);
      const formatedLastName = [data.apellidoPaterno, data.apellidoMaterno]
        .filter(Boolean)
        .join(" ");
      const generatedUserName = generateStrongPassword(12);
      await prisma.user.create({
        data: {
          identification: extractDigits(data.carnetDeIdentidad),
          first_name: data.primerNombre ? data.primerNombre : "",
          last_name: formatedLastName,
          birth_date: data.fechaDeNacimiento ? data.fechaDeNacimiento : "",
          phone: data.telefono ? extractDigits(data.telefono) : "",
          mobile: data.celular ? extractDigits(data.celular) : "",
          email: data.email || "",
          address_line: data.direccion || "",
          address_city: data.direccion || "",
          photo_url:
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
          username: data.carnetDeIdentidad
            ? extractDigits(data.carnetDeIdentidad)
            : generatedUserName,
          password: await hashPassword(generatedPassword),
          password_expiration: getPasswordExpiration(),
          password_attempts: 0,
          is_super_admin: false,
          status: userStatusList.NUEVO,
          role_id: 6,
          staff: {
            create: {
              status: userStatusList.ACTIVO,
              contratation_date: new Date(),
              payroll: {
                create: {},
              },
              doctor: {
                create: {
                  specialization: "No registrada",
                },
              },
            },
          },
          patient: {
            create: {
              odontogram: {
                create: {
                  status: userStatusList.ACTIVO,
                  odontogram_row: {
                    createMany: {
                      data: [
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ICSI",
                          temp: "61",
                          pieza: "21",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ILSI",
                          temp: "62",
                          pieza: "22",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "CSI",
                          temp: "63",
                          pieza: "23",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1PMSI",
                          temp: "64",
                          pieza: "24",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2PMSI",
                          temp: "65",
                          pieza: "25",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1MSI",
                          pieza: "26",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2MSI",
                          pieza: "27",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "3MSI",
                          pieza: "28",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "3MII",
                          pieza: "38",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2MII",
                          pieza: "37",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1MII",
                          pieza: "36",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2PMII",
                          temp: "75",
                          pieza: "35",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1PMII",
                          temp: "74",
                          pieza: "34",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "CII",
                          temp: "73",
                          pieza: "33",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ILII",
                          temp: "72",
                          pieza: "32",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ICII",
                          temp: "71",
                          pieza: "31",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ICSD",
                          temp: "51",
                          pieza: "11",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ILSD",
                          temp: "52",
                          pieza: "12",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "CSD",
                          temp: "53",
                          pieza: "13",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1PMSD",
                          temp: "54",
                          pieza: "14",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2PMSD",
                          temp: "55",
                          pieza: "15",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1MSD",
                          pieza: "16",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2MSD",
                          pieza: "17",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "3MSD",
                          pieza: "18",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "3MID",
                          pieza: "48",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2MID",
                          pieza: "47",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1MID",
                          pieza: "46",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "2PMID",
                          temp: "85",
                          pieza: "45",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "1PMID",
                          temp: "84",
                          pieza: "44",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "CID",
                          temp: "83",
                          pieza: "43",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ILID",
                          temp: "82",
                          pieza: "42",
                        },
                        {
                          status: userStatusList.ACTIVO,
                          msc: "ICID",
                          temp: "81",
                          pieza: "41",
                        },
                      ],
                    },
                  },
                },
              },
              allergies: data.alergias,
              status: userStatusList.ACTIVO,
              account: {
                create: {
                  balance: 0.0,
                  billing_status: billingStatus.SINDEUDA,
                  calculated_at: new Date(),
                  status: userStatusList.ACTIVO,
                },
              },
            },
          },
        },
      });
    });
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
const extractDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};
