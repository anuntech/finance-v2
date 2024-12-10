"use client";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender, // Adicionado aqui
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { TransactionActions } from "./TransactionActions";
import { AddTransactionDialog } from "./AddTransactionDialog";

const transactions = [
  {
    id: "txn1",
    date: "2024-12-09",
    description: "Compra de equipamentos",
    amount: 5000,
    category: "Investimentos",
    type: "Despesa",
  },
  {
    id: "txn2",
    date: "2024-12-08",
    description: "Venda de produtos",
    amount: 15000,
    category: "Receitas",
    type: "Receita",
  },
];

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => <div>R$ {row.getValue("amount").toFixed(2)}</div>,
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <TransactionActions transactionId={row.original.id} />,
  },
];

export function TransactionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Pesquisar transações..."
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <AddTransactionDialog />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}