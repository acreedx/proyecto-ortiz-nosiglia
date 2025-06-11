"use client";
import { useEffect, useState } from "react";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import { Heading, useDialog } from "@chakra-ui/react";
import { Appointment, Prisma, User } from "@prisma/client";
import AppointmentsCancelForm from "../components/appointments-cancel-form";
import AppointmentsCompleteForm from "../components/appointments-complete-form";
import AppointmentsCreateCalendarForm from "../components/appointments-create-calendar-form";
import AppointmentsEditForm from "../components/appointments-edit-form";
import AppointmentsViewForm from "../components/appointments-view-form";
import AppointmentAccordion from "../components/appointments-accordion";
import AppointmentsCalendar from "../components/appointments-calendar";
export default function AppointmentsSection({
  props,
}: {
  props: {
    appointments: Prisma.AppointmentGetPayload<{
      include: {
        patient: {
          include: {
            user: true;
          };
        };
        doctor: {
          include: {
            staff: {
              include: {
                user: true;
              };
            };
          };
        };
      };
    }>[];
    patients: User[];
  };
}) {
  const createAppointmentDialog = useDialog();
  const editAppointmentDialog = useDialog();
  const completeAppointmentDialog = useDialog();
  const cancelAppointmentDialog = useDialog();
  const viewAppointmentDialog = useDialog();
  const [selectedDate, setselectedDate] = useState<Date>();
  const [selectedAppointment, setselectedAppointment] = useState<Appointment>();
  const [Events, setEvents] = useState<
    Prisma.AppointmentGetPayload<{
      include: {
        patient: {
          include: {
            user: true;
          };
        };
        doctor: {
          include: {
            staff: {
              include: {
                user: true;
              };
            };
          };
        };
      };
    }>[]
  >([]);
  useEffect(() => {
    setEvents(props.appointments);
  }, [props.appointments]);
  return (
    <div className="flex flex-row w-full pt-4 gap-4 h-full">
      <div className="w-1/4 h-auto px-4">
        <Heading>Listado de citas</Heading>
        <AppointmentAccordion
          props={{
            appointments: props.appointments,
            createAppointmentDialog: createAppointmentDialog,
            editAppointmentDialog: editAppointmentDialog,
            completeAppointmentDialog: completeAppointmentDialog,
            cancelAppointmentDialog: cancelAppointmentDialog,
            viewAppointmentDialog: viewAppointmentDialog,
            setselectedAppointment: setselectedAppointment,
          }}
        />
      </div>
      <div className="w-3/4 h-auto">
        <AppointmentsCalendar
          props={{
            appointments: Events,
            setselectedDate: setselectedDate,
            createAppointmentDialog: createAppointmentDialog,
            editAppointmentDialog: editAppointmentDialog,
            completeAppointmentDialog: completeAppointmentDialog,
            cancelAppointmentDialog: cancelAppointmentDialog,
            viewAppointmentDialog: viewAppointmentDialog,
            setselectedAppointment: setselectedAppointment,
          }}
        />
      </div>
      <EditDialog dialog={createAppointmentDialog}>
        <AppointmentsCreateCalendarForm
          props={{ pacientes: props.patients, selectedDate: selectedDate }}
        />
      </EditDialog>
      <EditDialog dialog={editAppointmentDialog}>
        <AppointmentsEditForm
          props={{ selectedAppointment: selectedAppointment }}
        />
      </EditDialog>
      <EditDialog dialog={completeAppointmentDialog}>
        <AppointmentsCompleteForm
          props={{
            selectedAppointment: selectedAppointment,
          }}
        />
      </EditDialog>
      <EditDialog dialog={cancelAppointmentDialog}>
        <AppointmentsCancelForm
          props={{
            selectedAppointment: selectedAppointment,
          }}
        />
      </EditDialog>
      <EditDialog dialog={viewAppointmentDialog}>
        <AppointmentsViewForm
          props={{
            selectedAppointment: selectedAppointment,
          }}
        />
      </EditDialog>
    </div>
  );
}
