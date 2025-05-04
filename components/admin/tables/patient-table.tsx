"use client";

import {
  Stack,
  Heading,
  Table,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function PatientTable({
  items,
  pacientes,
}: {
  items: { id: number; name: string; category: string; price: number }[];
  pacientes: Prisma.PatientGetPayload<{
    include: {
      user: true;
    };
  }>[];
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Stack width="full" gap="5" mt={4}>
      <Heading size="xl">Pacientes</Heading>
      <Table.Root size="sm" variant="outline" striped>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Product</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedItems.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell textAlign="end">{item.price}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination.Root
        count={items.length}
        pageSize={pageSize}
        page={page}
        onPageChange={(newPage) => setPage(newPage.page)}
      >
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton disabled={page === 1}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(p) => (
              <IconButton
                key={p.value}
                onClick={() => setPage(p.value)}
                variant={p.value === page ? "outline" : "ghost"}
              >
                {p.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton disabled={page === pageCount}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
}
