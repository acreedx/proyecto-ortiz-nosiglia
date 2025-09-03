"use client";
import { Organization } from "@prisma/client";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
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
import { getPatients } from "../data/datasource";
import { useState, useMemo, useCallback, useRef } from "react";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function PatientTable({
  props,
}: {
  props: { organizations: Organization[] };
}) {
  const editDialog = useDialog();
  const emergencyContactDialog = useDialog();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPatient, setselectedPatient] = useState<any>();

  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: "photo_url",
        headerName: "Foto",
        width: 100,
        filter: false,
        sortable: false,
        cellRenderer: (props: CustomCellRendererProps) => {
          if (props.value !== undefined) {
            return (
              <div className="flex flex-row items-center justify-center">
                <Image
                  alt={`${props.value}`}
                  src={`${props.value}`}
                  width={40}
                  height={40}
                  className="h-[40px] rounded-full shadow-lg border border-black"
                />
              </div>
            );
          }
        },
      },
      { field: "first_name", headerName: "Nombre" },
      { field: "last_name", headerName: "Apellido" },
      {
        field: "birth_date",
        headerName: "Fecha de nacimiento",
        filter: false,
        sortable: true,
        valueFormatter: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "",
      },
      { field: "phone", headerName: "Teléfono" },
      { field: "mobile", headerName: "Celular" },
      { field: "address_line", headerName: "Dirección" },
      {
        field: "patient.allergies",
        headerName: "Alergias",
        valueFormatter: (params) => params.value ?? "Ninguna",
      },
      {
        field: "patient.preconditions",
        headerName: "Precondiciones",
        valueFormatter: (params) => params.value ?? "Ninguna",
      },
      {
        field: "actions",
        headerName: "Acciones",
        filter: false,
        minWidth: 240,
        sortable: false,
        cellRenderer: (props: CustomCellRendererProps) => {
          if (props.data !== undefined) {
            return (
              <div className="flex flex-row justify-center items-center">
                <Tooltip content="Editar paciente">
                  <IconButton
                    size="sm"
                    colorPalette="orange"
                    variant="outline"
                    aria-label="Editar paciente"
                    mr={2}
                    onClick={() => {
                      editDialog.setOpen(true);
                      setselectedPatient(props.data.patient);
                    }}
                  >
                    <FaEdit color="orange" />
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
                      setselectedPatient(props.data.patient);
                    }}
                  >
                    <LuSiren color="red" />
                  </IconButton>
                </Tooltip>

                <Tooltip content="Odontograma">
                  <NextLink
                    href={`/area-administrativa/pacientes/odontograma/${props.data.id}`}
                    className="flex flex-row"
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
                    href={`/area-administrativa/pacientes/imaging-studies/${props.data.id}`}
                    className="flex flex-row"
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
                    href={`/area-administrativa/pacientes/historial/${props.data.id}`}
                    className="flex flex-row"
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
          }
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: false,
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ["contains", "equals"],
        maxNumConditions: 1,
      },
    }),
    []
  );

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    const datasource: IDatasource = {
      rowCount: undefined,
      getRows: async (gridParams: IGetRowsParams) => {
        try {
          const { rows, total } = await getPatients({
            startRow: gridParams.startRow,
            endRow: gridParams.endRow,
            filterModel: gridParams.filterModel,
            sortModel: gridParams.sortModel,
          });
          gridParams.successCallback(rows, total);
        } catch (err) {
          console.error("Error cargando pacientes:", err);
          gridParams.failCallback();
        }
      },
    };
    datasourceRef.current = datasource;
    params.api.setGridOption("datasource", datasource);
  }, []);
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  return (
    <div className="w-full h-full mb-4 ag-theme-quartz">
      <AgGridReact
        columnDefs={colDefs}
        rowBuffer={0}
        colResizeDefault="shift"
        rowModelType="infinite"
        cacheBlockSize={100}
        maxBlocksInCache={10}
        maxConcurrentDatasourceRequests={1}
        cacheOverflowSize={2}
        infiniteInitialRowCount={20}
        paginationPageSize={20}
        pagination
        localeText={AG_GRID_LOCALE_ES}
        defaultColDef={defaultColDef}
        suppressCellFocus
        cellSelection={false}
        onGridReady={onGridReady}
      />
      <EditDialog dialog={editDialog}>
        <EditPatientForm
          props={{
            patient: selectedPatient,
            organizations: props.organizations,
            dialog: editDialog,
            gridApiRef: gridApiRef,
            datasourceRef: datasourceRef,
          }}
        />
      </EditDialog>
      <EditDialog dialog={emergencyContactDialog}>
        <EmergencyContactEditForm
          props={{
            patient: selectedPatient,
            dialog: emergencyContactDialog,
            gridApiRef: gridApiRef,
            datasourceRef: datasourceRef,
          }}
        />
      </EditDialog>
    </div>
  );
}
