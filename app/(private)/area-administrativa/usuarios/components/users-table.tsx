"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton, Image, useDialog } from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { Prisma, Role } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import { userStatusList } from "../../../../../types/statusList";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";
import { eliminate, restore } from "../actions/operations";
import UsersEditForm from "./users-edit-form";
import { Session } from "next-auth";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function UsersTable({
  props,
}: {
  props: {
    usuarios: Prisma.UserGetPayload<{
      include: {
        role: true;
      };
    }>[];
    roles: Role[];
    session: Session;
  };
}) {
  const editDialog = useDialog();
  const [selectedUser, setselectedUser] = useState<
    Prisma.UserGetPayload<{
      include: {
        role: true;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => (
        <Image
          src={params.value}
          alt="Foto"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      ),
    },
    { field: "identification", headerName: "Carnet", filter: true },
    {
      field: "first_name",
      headerName: "Nombre completo",
      filter: true,
      valueFormatter: (params) => {
        return `${params.value} ${params.data.last_name}`;
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
            })
              .format(new Date(params.value))
              .toString()
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
      valueGetter: (params) => params.data.role?.role_name || "—",
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => (
        <div className="flex flex-row items-center justify-center w-full">
          <>
            {params.data.role.role_name !== rolesList.ADMINISTRADOR && (
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                onClick={() => {
                  editDialog.setOpen(true);
                  setselectedUser(params.data);
                }}
              >
                <FaEdit color="orange" />
              </IconButton>
            )}
            {params.data.status === userStatusList.ACTIVO &&
              params.data.role.role_name !== rolesList.ADMINISTRADOR && (
                <IconButton
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  aria-label="Deshabilitar"
                  ml={2}
                  onClick={async () => handleDelete(params.data.id)}
                >
                  <FaTrash color="red" />
                </IconButton>
              )}
            {params.data.status === userStatusList.INACTIVO &&
              params.data.role.role_name !== rolesList.ADMINISTRADOR && (
                <IconButton
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  aria-label="Rehabilitar"
                  ml={2}
                  onClick={async () => handleRestore(params.data.id)}
                >
                  <FaCheck color="green" />
                </IconButton>
              )}
          </>
        </div>
      ),
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
    },
  ]);
  useEffect(() => {
    setRowData([...props.usuarios]);
  }, [props.usuarios]);
  const handleDelete = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de deshabilitar al usuario?",
    });
    if (isConfirmed) {
      const res = await eliminate({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Usuario deshabilitado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al deshabilitar al usuario",
          type: "error",
        });
      }
    }
  };
  const handleRestore = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de rehabilitar al usuario?",
    });
    if (isConfirmed) {
      const res = await restore({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Usuario deshabilitado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al deshabilitar al usuario",
          type: "error",
        });
      }
    }
  };
  return (
    <div className="w-full h-full mb-4 pt-4">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        colResizeDefault="shift"
        pagination
        localeText={AG_GRID_LOCALE_ES}
        defaultColDef={{
          flex: 1,
          resizable: false,
          sortable: true,
          filter: false,
          filterParams: {
            filterOptions: ["contains", "equals"],
            maxNumConditions: 1,
          },
          wrapText: true,
          autoHeight: true,
        }}
        suppressCellFocus
        cellSelection={false}
        autoSizeStrategy={{
          type: "fitGridWidth",
        }}
      />
      <EditDialog dialog={editDialog}>
        <UsersEditForm
          props={{
            user: selectedUser,
            roles: props.roles,
          }}
        />
      </EditDialog>
    </div>
  );
}
