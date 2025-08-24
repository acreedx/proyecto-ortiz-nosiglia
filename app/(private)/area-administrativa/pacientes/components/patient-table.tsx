"use client";
import { Organization, Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import Image from "next/image";
import { IconButton, useDialog } from "@chakra-ui/react";
import { FaBookMedical, FaEdit, FaFile, FaXRay } from "react-icons/fa";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import NextLink from "next/link";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import EditPatientForm from "./patient-edit-form";
import { LuSiren } from "react-icons/lu";
import EmergencyContactEditForm from "./emergency-contact-edit-form";
import { Tooltip } from "../../../../../components/ui/tooltip";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function PatientTable({
  props,
}: {
  props: {
    pacientes: Prisma.UserGetPayload<{
      include: {
        role: true;
        patient: {
          include: {
            emergency_contact: true;
          };
        };
      };
    }>[];
    organizations: Organization[];
  };
}) {
  const editDialog = useDialog();
  const emergencyContactDialog = useDialog();
  const [selectedPatient, setselectedPatient] = useState<
    Prisma.PatientGetPayload<{
      include: {
        emergency_contact: true;
      };
    }>
  >();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "photo_url",
      headerName: "Foto",
      width: 100,
      autoHeight: false,
      filter: false,
      sortable: false,
      flex: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (props: any) => {
        return (
          <Image
            alt={`${props.value}`}
            src={`${props.value}`}
            width={50}
            height={50}
            className="h-[50px] rounded-full shadow-lg border border-black"
          />
        );
      },
    },
    { field: "first_name", headerName: "Nombre" },
    { field: "last_name", headerName: "Apellido" },
    {
      field: "birth_date",
      headerName: "Fecha de nacimiento",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "phone", headerName: "Teléfono" },
    { field: "mobile", headerName: "Celular" },
    { field: "address_line", headerName: "Dirección" },
    {
      field: "patient.allergies",
      headerName: "Alergias",
      valueFormatter: (params) => (params.value ? params.value : "Ninguna"),
    },
    {
      field: "patient.preconditions",
      headerName: "Precondiciones",
      valueFormatter: (params) => (params.value ? params.value : "Ninguna"),
    },
    {
      field: "actions",
      headerName: "Acciones",
      filter: false,
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return (
          <div>
            <Tooltip content="Editar paciente">
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar paciente"
                mr={2}
                onClick={() => {
                  editDialog.setOpen(true);
                  setselectedPatient(params.data.patient);
                }}
              >
                <FaEdit color="blue" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Contacto de emergencia">
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Contacto de emergencia"
                mr={2}
                onClick={() => {
                  emergencyContactDialog.setOpen(true);
                  setselectedPatient(params.data.patient);
                }}
              >
                <LuSiren color="red" />
              </IconButton>
            </Tooltip>

            <Tooltip content="Odontograma">
              <NextLink
                href={`/area-administrativa/pacientes/odontograma/${params.data.id}`}
              >
                <IconButton
                  size="sm"
                  colorPalette="orange"
                  variant="outline"
                  aria-label="Odontograma"
                  mr={2}
                >
                  <FaFile color="gray" />
                </IconButton>
              </NextLink>
            </Tooltip>
            <Tooltip content="Radiografías">
              <NextLink
                href={`/area-administrativa/pacientes/imaging-studies/${params.data.id}`}
              >
                <IconButton
                  size="sm"
                  colorPalette="orange"
                  variant="outline"
                  aria-label="Radiografías"
                  mr={2}
                >
                  <FaXRay color={"orange"} />
                </IconButton>
              </NextLink>
            </Tooltip>
            <Tooltip content="Historial clínico">
              <NextLink
                href={`/area-administrativa/pacientes/historial/${params.data.id}`}
              >
                <IconButton
                  size="sm"
                  colorPalette="whiteAlpha"
                  variant="outline"
                  aria-label="Historial clínico del paciente"
                >
                  <FaBookMedical color={"green"} />
                </IconButton>
              </NextLink>
            </Tooltip>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
    setRowData([...props.pacientes]);
  }, [props.pacientes]);

  return (
    <div className="w-full h-full mb-4">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        colResizeDefault="shift"
        pagination
        localeText={AG_GRID_LOCALE_ES}
        defaultColDef={{
          resizable: false,
          sortable: true,
          filter: true,
          filterParams: {
            filterOptions: ["contains", "equals"],
            maxNumConditions: 1,
          },
          flex: 1,
          wrapText: true,
          autoHeight: true,
        }}
        suppressCellFocus
        cellSelection={false}
      />
      <EditDialog dialog={editDialog}>
        <EditPatientForm
          props={{
            patient: selectedPatient,
            organizations: props.organizations,
          }}
        />
      </EditDialog>
      <EditDialog dialog={emergencyContactDialog}>
        <EmergencyContactEditForm
          props={{
            patient: selectedPatient,
          }}
        />
      </EditDialog>
    </div>
  );
}
