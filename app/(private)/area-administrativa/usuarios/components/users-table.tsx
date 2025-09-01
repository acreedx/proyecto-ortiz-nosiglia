/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useMemo, useState } from "react";
import type {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton, useDialog } from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { Prisma, Role } from "@prisma/client";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { userStatusList } from "../../../../../types/statusList";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";
import { eliminate, restore } from "../actions/operations";
import UsersEditForm from "./users-edit-form";
import { Session } from "next-auth";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import { getUsers } from "../data/datasource";
import { Tooltip } from "../../../../../components/ui/tooltip";
import Image from "next/image";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function UsersTable({
  props,
}: {
  props: {
    roles: Role[];
    session: Session;
  };
}) {
  const editDialog = useDialog();
  const [selectedUser, setSelectedUser] =
    useState<Prisma.UserGetPayload<{ include: { role: true } }>>();

  const [colDefs] = useState<ColDef[]>([
    {
      field: "photo_url",
      width: 100,
      headerName: "Foto",
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
    {
      field: "identification",
      headerName: "Carnet",
      filter: "agTextColumnFilter",
    },
    {
      field: "first_name",
      headerName: "Nombre completo",
      filter: "agTextColumnFilter",
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return `${props.value ?? ""} ${props.data.last_name ?? ""}`;
        }
      },
    },
    {
      field: "birth_date",
      headerName: "Fecha de Nacimiento",
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(params.value))
          : "—",
    },
    { field: "phone", headerName: "Teléfono" },
    { field: "mobile", headerName: "Celular" },
    { field: "address_line", headerName: "Dirección" },
    { field: "address_city", headerName: "Ciudad" },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.INACTIVO:
            return "Inactivo";
          case userStatusList.BLOQUEADO:
            return "Bloqueado";
          case userStatusList.NUEVO:
            return "Nuevo";
          default:
            return "—";
        }
      },
    },
    {
      field: "role.role_name",
      headerName: "Rol",
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return props.data.role?.role_name;
        }
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      filter: false,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return (
            <div className="flex flex-row items-center justify-center w-full">
              {props.data.role.role_name !== rolesList.ADMINISTRADOR && (
                <Tooltip content="Editar usuario">
                  <IconButton
                    size="sm"
                    colorScheme="orange"
                    variant="outline"
                    aria-label="Editar"
                    onClick={() => {
                      editDialog.setOpen(true);
                      setSelectedUser(props.data);
                    }}
                  >
                    <FaEdit color="orange" />
                  </IconButton>
                </Tooltip>
              )}
              {props.data.status === userStatusList.ACTIVO &&
                props.data.role.role_name !== rolesList.ADMINISTRADOR && (
                  <Tooltip content="Deshabilitar usuario">
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      aria-label="Deshabilitar"
                      ml={2}
                      onClick={async () => handleDelete(props.data.id)}
                    >
                      <FaTrash color="red" />
                    </IconButton>
                  </Tooltip>
                )}
              {props.data.status === userStatusList.INACTIVO &&
                props.data.role.role_name !== rolesList.ADMINISTRADOR && (
                  <Tooltip content="Rehabilitar usuario">
                    <IconButton
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      aria-label="Rehabilitar"
                      ml={2}
                      onClick={async () => handleRestore(props.data.id)}
                    >
                      <FaCheck color="green" />
                    </IconButton>
                  </Tooltip>
                )}
            </div>
          );
        }
      },
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
    },
  ]);

  const handleDelete = async (id: number) => {
    const confirmed = await mostrarAlertaConfirmacion({
      mensaje: "¿Está seguro de deshabilitar al usuario?",
    });
    if (confirmed) {
      const res = await eliminate({ id });
      toaster.create({
        description: res.ok
          ? "Usuario deshabilitado con éxito"
          : "Error al deshabilitar",
        type: res.ok ? "success" : "error",
      });
    }
  };

  const handleRestore = async (id: number) => {
    const confirmed = await mostrarAlertaConfirmacion({
      mensaje: "¿Está seguro de rehabilitar al usuario?",
    });
    if (confirmed) {
      const res = await restore({ id });
      toaster.create({
        description: res.ok
          ? "Usuario rehabilitado con éxito"
          : "Error al rehabilitar",
        type: res.ok ? "success" : "error",
      });
    }
  };
  const onGridReady = useCallback((params: GridReadyEvent) => {
    const datasource: IDatasource = {
      rowCount: undefined,
      getRows: async (gridParams: IGetRowsParams) => {
        try {
          const { rows, total } = await getUsers({
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
    params.api.setGridOption("datasource", datasource);
  }, []);
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
        <UsersEditForm props={{ user: selectedUser, roles: props.roles }} />
      </EditDialog>
    </div>
  );
}
