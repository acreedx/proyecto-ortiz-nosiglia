import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CanStaff from "../../../../lib/rbac/can-staff";
import LineChart from "./components/LineChart";
import AppointmentStats from "./components/AppointmentStats";
import PieChart from "./components/PieChart";
import { ScatterChart } from "./components/ScatterPlot";
import BarChart from "./components/BarChart";
import { prisma } from "../../../../lib/prisma/prisma";
import {
  appointmentStatusList,
  treatmentStatusList,
} from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import KPIIndicator from "./components/KPIIndicator";
import { billingStatus } from "../../../../types/billingStatus";
import KPIPorcentageIndicator from "./components/KPIPorcentageIndicator";

export default async function Page() {
  const appointments = await prisma.appointment.findMany();
  //primer gráfico
  const citasDelAño = appointments.filter(
    (e) => e.programed_date_time.getFullYear() === new Date().getFullYear()
  );
  const datosCitas = {
    citas_canceladas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_CANCELADA
    ).length,
    citas_completadas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_COMPLETADA
    ).length,
    citas_confirmadas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_CONFIRMADA
    ).length,
    citas_no_asistidas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_NO_ASISTIDA
    ).length,
    citas_pendientes: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_PENDIENTE
    ).length,
    citas_totales: appointments.length,
  };
  //segundo gráfico
  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const values = [
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 0).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 1).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 2).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 3).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 4).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 5).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 6).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 7).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 8).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 9).length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 10)
      .length,
    citasDelAño.filter((e) => e.programed_date_time.getUTCMonth() === 11)
      .length,
  ];
  //tercer gráfico
  const usuarios = await prisma.user.findMany({
    include: {
      role: true,
    },
  });
  const labelsPie = [
    "Administrativos",
    "Dentistas",
    "Enfermeros",
    "Médicos temporales",
    "Pacientes",
    "Secretarios",
    "Otros roles",
  ];
  const dataPie = [
    usuarios.filter((e) => e.role.role_name === rolesList.ADMINISTRADOR).length,
    usuarios.filter((e) => e.role.role_name === rolesList.DENTISTA).length,
    usuarios.filter((e) => e.role.role_name === rolesList.ENFERMERO).length,
    usuarios.filter((e) => e.role.role_name === rolesList.MEDICO_TEMPORAL)
      .length,
    usuarios.filter((e) => e.role.role_name === rolesList.PACIENTE).length,
    usuarios.filter((e) => e.role.role_name === rolesList.SECRETARIO).length,
    usuarios.filter(
      (e) =>
        e.role.role_name !== rolesList.ADMINISTRADOR &&
        e.role.role_name !== rolesList.DENTISTA &&
        e.role.role_name !== rolesList.ENFERMERO &&
        e.role.role_name !== rolesList.MEDICO_TEMPORAL &&
        e.role.role_name !== rolesList.PACIENTE &&
        e.role.role_name !== rolesList.SECRETARIO
    ).length,
  ];
  //cuarto gráfico
  const puntos = [
    { x: 1, y: 3 },
    { x: 2, y: 7 },
    { x: 3, y: 4 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
  ];
  //
  const labelsBars = [
    "Administrativos",
    "Dentistas",
    "Enfermeros",
    "Médicos temporales",
    "Pacientes",
    "Secretarios",
    "Otros roles",
  ];
  const dataBars = [
    usuarios.filter((e) => e.role.role_name === rolesList.ADMINISTRADOR).length,
    usuarios.filter((e) => e.role.role_name === rolesList.DENTISTA).length,
    usuarios.filter((e) => e.role.role_name === rolesList.ENFERMERO).length,
    usuarios.filter((e) => e.role.role_name === rolesList.MEDICO_TEMPORAL)
      .length,
    usuarios.filter((e) => e.role.role_name === rolesList.PACIENTE).length,
    usuarios.filter((e) => e.role.role_name === rolesList.SECRETARIO).length,
    usuarios.filter(
      (e) =>
        e.role.role_name !== rolesList.ADMINISTRADOR &&
        e.role.role_name !== rolesList.DENTISTA &&
        e.role.role_name !== rolesList.ENFERMERO &&
        e.role.role_name !== rolesList.MEDICO_TEMPORAL &&
        e.role.role_name !== rolesList.PACIENTE &&
        e.role.role_name !== rolesList.SECRETARIO
    ).length,
  ];
  //
  const tiempoDeConsultas = citasDelAño
    .filter((e) => e.completed_date_time)
    .map((e) => {
      const diferenciaEnMinutos =
        (e.completed_date_time!.getTime() - e.programed_date_time.getTime()) /
        60000;
      return diferenciaEnMinutos;
    });
  const total = tiempoDeConsultas.reduce((sum, t) => sum + t, 0);
  const promedioDeTiempoDeConsultas = tiempoDeConsultas.length
    ? total / citasDelAño.filter((e) => e.completed_date_time).length
    : 0;
  //
  const citasTotales = appointments.length;
  const citasCompletadas = appointments.filter(
    (e) => e.status === appointmentStatusList.STATUS_COMPLETADA
  ).length;
  const porcentajeCumplidas = (citasCompletadas / citasTotales) * 100;
  const citasNoAsistidas = appointments.filter(
    (e) => e.status === appointmentStatusList.STATUS_NO_ASISTIDA
  ).length;
  const porcentajeNoAsistidas = (citasNoAsistidas / citasTotales) * 100;
  const citasCanceladas = appointments.filter(
    (e) => e.status === appointmentStatusList.STATUS_CANCELADA
  ).length;
  //
  const porcentajeCanceladas = (citasCanceladas / citasTotales) * 100;
  const cuentasConDeudas = (await prisma.account.findMany()).filter(
    (e) => e.billing_status === billingStatus.DEUDA
  ).length;
  //
  const tratamientos = await prisma.carePlan.findMany();
  const tratamientosFinalizados = tratamientos.filter(
    (e) => e.status === treatmentStatusList.COMPLETADO
  ).length;
  const porcentajeTratamientosFinalizados =
    (tratamientosFinalizados / tratamientos.length) * 100;
  //
  const invoices = await prisma.invoice.findMany();
  const pagosTiempo = invoices
    .filter((e) => e.date_payment)
    .map((e) => {
      const diferenciaEnMinutos =
        (e.date_payment!.getTime() - e.date_issued.getTime()) / 60000;
      return diferenciaEnMinutos;
    });
  const totalTiempoPagos = pagosTiempo.reduce((sum, t) => sum + t, 0);
  const promedioDeCobroDeudas = invoices.length
    ? totalTiempoPagos / invoices.filter((e) => e.date_payment).length
    : 0;
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Panel de control" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Dashboard</Heading>
        </div>
        <section className="mt-4">
          <AppointmentStats
            props={{
              citas_canceladas: datosCitas.citas_canceladas,
              citas_completadas: datosCitas.citas_completadas,
              citas_confirmadas: datosCitas.citas_confirmadas,
              citas_no_asitidas: datosCitas.citas_no_asistidas,
              citas_pendientes: datosCitas.citas_pendientes,
              citas_totales: datosCitas.citas_totales,
            }}
          />
        </section>
        <div className="w-full h-[400px] flex items-center justify-center mt-8">
          <LineChart labels={labels} data={values} />
        </div>
        <div className="w-full h-[400px] flex items-center justify-center  mt-4">
          <PieChart labels={labelsPie} data={dataPie} />
        </div>
        <div className="w-full h-[400px] flex items-center justify-center  mt-4">
          <ScatterChart data={puntos} />
        </div>
        <div className="w-full h-[400px] flex items-center justify-center  mt-4">
          <BarChart labels={labelsBars} data={dataBars} />
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4 mt-4 items-center justify-center">
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIIndicator
              texto="Tiempo promedio de consultas"
              valor={promedioDeTiempoDeConsultas}
              medida="minutos"
            />
          </div>
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIPorcentageIndicator
              texto="Tasa de cumplimiento de citas"
              valor={porcentajeCumplidas}
              medida="%"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4 mt-4">
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIPorcentageIndicator
              texto="Tasa de inasistencia de citas"
              valor={porcentajeNoAsistidas}
              medida="%"
            />
          </div>
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIPorcentageIndicator
              texto="Tasa de cancelación de citas"
              valor={porcentajeCanceladas}
              medida="%"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4 mt-4">
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIIndicator
              texto="Cuentas con deudas pendientes"
              valor={cuentasConDeudas}
              medida="cuentas"
            />
          </div>
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIPorcentageIndicator
              texto="Tasa de tratamientos finalizados"
              valor={porcentajeTratamientosFinalizados}
              medida="%"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-4 mt-4">
          <div className="w-full md:w-1/2 items-center justify-center flex">
            <KPIIndicator
              texto="Tiempo promedio de cobro de deudas"
              valor={promedioDeCobroDeudas}
              medida="minutos"
            />
          </div>
        </div>
      </main>
    </CanStaff>
  );
}
