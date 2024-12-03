"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Circle,
  CircleDashed,
  CornerDownLeft,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CategoryActions } from "./table-actions";
import { AddCategoryDialog } from "./add-category-dialog";

const data = [
  {
    id: "m5gr84i9",
    name: "Anuntech",
    color: "#000",
    type: "output",
    subCategories: [
      {
        id: "m5gr8421",
        name: "Anuntech",
      },
      {
        id: "m5gr8426",
        name: "Anuntech sub",
      },
    ],
  },
  {
    id: "3u1reuv4",
    name: "Anuntech",
    color: "#000",
    type: "output",
    subCategories: [
      {
        id: "m5gr8421",
        name: "Anuntech",
      },
    ],
  },
  {
    id: "derv1ws0",
    name: "Anuntech",
    color: "#000",
    type: "output",
    subCategories: [
      {
        id: "m5gr8421",
        name: "Anuntech",
      },
    ],
  },
  {
    id: "5kma53ae",
    name: "Anuntech",
    color: "#000",
    type: "output",
    subCategories: [],
  },
  {
    id: "bhqecj4p",
    name: "Anuntech",
    color: "#000",
    type: "output",
    subCategories: [],
  },
];

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Categoria",
    cell: ({ row }) => <div className="text-left">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end items-center font-medium gap-2">
          <Button variant="ghost" size="icon">
            <Circle className="size-5" color="blue" />
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowUp className="size-5" />
          </Button>
        </div>
      );
    },
  },
];

export function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Pesquisar..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddCategoryDialog />
        </div>
        <div className="rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className={cn(
                          header.column.id === "select" && "w-[40px]"
                        )}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {row.original.subCategories.map((sub: any) => (
                      <TableRow key={sub.id} className="h-[54px]">
                        <TableCell className="text-left text-sm text-muted-foreground w-[40px]">
                          <ArrowRight className="size-5" />
                        </TableCell>

                        <TableCell
                          style={{ width: "40px", padding: 0 }}
                          className={"w-[40px] p-0 ml-4"}
                        >
                          <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                            className="ml-3"
                          />
                        </TableCell>

                        <TableCell
                          colSpan={columns.length - 8}
                          className="w-[400px] absolute left-[5.3rem] mt-[8px] text-left text-sm text-muted-foreground"
                        >
                          {sub.name}
                        </TableCell>

                        <div className="mt-[8px] right-4 absolute text-left text-sm text-muted-foreground">
                          <CategoryActions />
                        </div>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 ">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
