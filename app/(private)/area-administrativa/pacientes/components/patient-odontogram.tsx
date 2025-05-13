"use client";

import { Table } from "@chakra-ui/react";
import { OdontogramRow } from "@prisma/client";

export default function PatientOdontogram({
  props,
}: {
  props: {
    odontogramRows: OdontogramRow[] | undefined;
  };
}) {
  return (
    <form className="mt-4">
      <Table.Root size="sm" variant={"outline"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>MSC</Table.ColumnHeader>
            <Table.ColumnHeader>Temp</Table.ColumnHeader>
            <Table.ColumnHeader>Piezas</Table.ColumnHeader>
            <Table.ColumnHeader>Fecha</Table.ColumnHeader>
            <Table.ColumnHeader>Diagnóstico</Table.ColumnHeader>
            <Table.ColumnHeader>Tratamiento en curso</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.odontogramRows?.map((odontogram) => {
            return (
              <Table.Row key={odontogram.id}>
                <Table.Cell>{odontogram.msc}</Table.Cell>
                <Table.Cell>{odontogram.temp}</Table.Cell>
                <Table.Cell>{odontogram.pieza}</Table.Cell>
                <Table.Cell>
                  {odontogram.fecha
                    ? odontogram.fecha.toLocaleDateString()
                    : ""}
                </Table.Cell>
                <Table.Cell>{odontogram.diagnostico}</Table.Cell>
                <Table.Cell>{odontogram.tratamiento}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </form>
  );
}
