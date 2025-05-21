"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton, useDialog } from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { Permission, Prisma, Role } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import { userStatusList } from "../../../../../types/statusList";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import RolesEditForm from "./roles-edit-form";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { eliminate, restore } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function RolesTable({
  props,
}: {
  props: {
    roles: Prisma.RoleGetPayload<{
      include: {
        role_permissions: {
          include: {
            permission: true;
          };
        };
      };
    }>[];
    permissions: Permission[];
  };
}) {
  const editDialog = useDialog();
  const [selectedRole, setselectedRole] = useState<
    Prisma.RoleGetPayload<{
      include: {
        role_permissions: {
          include: {
            permission: true;
          };
        };
      };
    }>
  >();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "role_name", headerName: "Nombre del Rol", filter: true },
    { field: "description", headerName: "Descripción", filter: true },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.INACTIVO:
            return "Inactivo";
          default:
            return "—";
        }
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => (
        <div className="flex flex-row items-center justify-center w-full">
          {params.data.role_name !== rolesList.ADMINISTRADOR && (
            <>
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                onClick={async () => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
              {params.data.status === userStatusList.ACTIVO && (
                <IconButton
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  aria-label="Deshabilitar"
                  ml={2}
                  onClick={async () => handleDelete(params.data)}
                >
                  <FaTrash color="red" />
                </IconButton>
              )}
              {params.data.status === userStatusList.INACTIVO && (
                <IconButton
                  size="sm"
                  colorPalette="green"
                  variant="outline"
                  aria-label="Rehabilitar"
                  ml={2}
                  onClick={async () => handleRestore(params.data)}
                >
                  <FaCheck color="green" />
                </IconButton>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
    },
  ]);
  const handleEdit = async (e: Role) => {
    setselectedRole(
      e as Prisma.RoleGetPayload<{
        include: {
          role_permissions: {
            include: {
              permission: true;
            };
          };
        };
      }>
    );
    editDialog.setOpen(true);
  };
  const handleDelete = async (e: Role) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de deshabilitar este rol?",
    });
    if (isConfirmed) {
      const res = await eliminate({
        id: e.id,
      });
      if (res.ok) {
        toaster.create({
          description: "Rol deshabilitado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al deshabilitar el rol",
          type: "success",
        });
      }
    }
  };
  const handleRestore = async (e: Role) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de rehabilitar este rol?",
    });
    if (isConfirmed) {
      const res = await restore({
        id: e.id,
      });
      if (res.ok) {
        toaster.create({
          description: "Rol rehabilitado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al rehabilitar el rol",
          type: "success",
        });
      }
    }
  };
  useEffect(() => {
    setRowData([...props.roles]);
  }, [props.roles]);
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
        <RolesEditForm
          props={{
            role: selectedRole,
            permissions: props.permissions,
          }}
        />
      </EditDialog>
    </div>
  );
}
