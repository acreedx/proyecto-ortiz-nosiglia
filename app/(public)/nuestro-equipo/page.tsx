import React from "react";
import { prisma } from "../../../lib/prisma/prisma";
import TeamCard from "../../../components/index/team-card";
import { userStatusList } from "../../../types/statusList";

export default async function Page() {
  const dentistas = await prisma.doctor.findMany({
    where: {
      staff: {
        user: {
          status: userStatusList.ACTIVO,
        },
      },
    },
    include: {
      qualification: true,
      staff: {
        include: {
          user: true,
        },
      },
    },
  });
  return (
    <main className="bg-white">
      <section className="h-[750px] bg-[url('/images/paginaweb/team.png')] bg-cover bg-center">
        <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-50"></div>
      </section>
      <section className="pb-20 mt-16 flex w-full flex-col flex-wrap content-center justify-center">
        {dentistas.length <= 0 ? (
          <div className="text-xl">No se encontraron dentistas registrados</div>
        ) : (
          <div>
            <h1 className="text-orange mb-8 py-4 text-center text-3xl font-bold text-orange-400">
              Nuestro equipo
            </h1>
            <div className="flex flex-wrap items-start justify-center gap-12">
              {dentistas.map((dentista, index) => (
                <TeamCard
                  key={index}
                  url={dentista.staff.user!.photo_url}
                  imgAlt={`${dentista.staff.user!.first_name} - ${dentista.staff.user!.last_name}`}
                  name={`Dr. ${dentista.staff.user!.first_name} - ${dentista.staff.user!.last_name}`}
                  description={
                    dentista.qualification.length > 0
                      ? dentista.qualification
                          .map(
                            (q) => `${q.name} - ${q.institution} - ${q.country}`
                          )
                          .join(", ")
                      : "-"
                  }
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
