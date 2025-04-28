import React from "react";
import { prisma } from "../../../lib/prisma/prisma";
import TeamCard from "../../../components/index/team-card";
import { rolesList } from "../../../lib/nextauth/rolesList";

export default async function Page() {
  const dentistas = await prisma.user.findMany({
    where: {
      role: {
        role_name: rolesList.DENTISTA,
      },
    },
    include: {
      staff: {
        include: {
          doctor: {
            include: {
              qualification: true,
            },
          },
        },
      },
    },
  });
  dentistas.map((e) => {
    console.log(e.staff);
  });
  return (
    <div className="bg-white">
      <section className="h-[750px] bg-[url('/images/paginaweb/team.png')] bg-cover bg-center">
        <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-50"></div>
      </section>
      <section className="pb-20 mt-16 flex w-full flex-col flex-wrap content-center justify-center">
        <h1 className="text-orange mb-8 py-4 text-center text-3xl font-bold text-orange-400">
          Nuestro equipo
        </h1>
        <div className="flex flex-wrap items-start justify-center gap-12">
          {dentistas.map((dentista, index) => (
            <TeamCard
              key={index}
              url={dentista.photo_url}
              imgAlt={`${dentista.first_name} - ${dentista.last_name}`}
              name={`Dr. ${dentista.first_name} - ${dentista.last_name}`}
              description={
                " asd" /*dentista.staff[0]?.doctor[0]?.qualification
                .map((q) => `${q.name} - ${q.institution}`)
                .join(", ")*/
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
