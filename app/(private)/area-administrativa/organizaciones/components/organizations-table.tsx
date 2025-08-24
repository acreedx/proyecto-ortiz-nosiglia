/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { IconButton, useDialog } from "@chakra-ui/react";
import { Organization } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { userStatusList } from "../../../../../types/statusList";
import { toaster } from "../../../../../components/ui/toaster";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import EditOrganizationsForm from "./organizations-edit-form";
import {
  eliminateOrganization,
  rehabilitateOrganization,
} from "../actions/operations";
import { Tooltip } from "../../../../../components/ui/tooltip";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function OrganizationsTable({
  props,
}: {
  props: {
    organizations: Organization[];
  };
}) {
  //Manejo de modal de editar
  const editDialog = useDialog();
  const [selectedOrganization, setselectedOrganization] =
    useState<Organization>();

  //Definición de la tabla
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "name", headerName: "Nombre", filter: true },
    { field: "address", headerName: "Dirección", filter: true },
    {
      field: "status",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params) =>
        params.value === userStatusList.ACTIVO ? "activo" : "inactivo",
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (params: any) => {
        return (
          <div className="flex flex-row items-center justify-center w-full">
            <Tooltip content="Editar organización">
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                mr={2}
                onClick={async () => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
            </Tooltip>
            {params.data.status === userStatusList.ACTIVO && (
              <Tooltip content="Deshabilitar organización">
                <IconButton
                  size="sm"
                  colorPalette="orange"
                  variant="outline"
                  aria-label="Eliminar"
                  onClick={async () => handleDelete(params.data)}
                >
                  <FaTrash color="red" />
                </IconButton>
              </Tooltip>
            )}
            {params.data.status === userStatusList.INACTIVO && (
              <Tooltip content="Rehabilitar organización">
                <IconButton
                  size="sm"
                  colorPalette="orange"
                  variant="outline"
                  aria-label="Rehabilitar"
                  onClick={async () => handleRehabilitate(params.data)}
                >
                  <FaUndo color="green" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
    },
  ]);

  //Acciones para el manejo de datos
  const handleEdit = (e: any) => {
    setselectedOrganization(e as Organization);
    editDialog.setOpen(true);
  };
  const handleDelete = async (e: any) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Estas seguro que quieres deshabilitar esta organización?",
    });
    if (isConfirmed) {
      const res = await eliminateOrganization({ id: e.id });
      if (res.ok) {
        toaster.create({
          description: "Organización deshabilitada con éxito",
          type: "success",
        });
      }
      if (!res.ok) {
        toaster.create({
          description: "Error al actualizar los datos",
          type: "error",
        });
      }
    }
  };
  const handleRehabilitate = async (e: any) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Estas seguro que quieres rehabilitar esta organización?",
    });
    if (isConfirmed) {
      const res = await rehabilitateOrganization({ id: e.id });
      if (res.ok) {
        toaster.create({
          description: "Organización rehabilitada con éxito",
          type: "success",
        });
      }
      if (!res.ok) {
        toaster.create({
          description: "Error al actualizar los datos",
          type: "error",
        });
      }
    }
  };

  //Carga de datos iniciales
  useEffect(() => {
    setRowData([...props.organizations]);
  }, [props.organizations]);

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
        <EditOrganizationsForm organization={selectedOrganization} />
      </EditDialog>
    </div>
  );
}
