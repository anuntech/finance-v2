"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Delete } from "./delete";
import { Button } from "@/components/ui/button";
import { EditDialog } from "./edit-dialog";

export function CategoryActions() {
  const [openCategory, setOpenCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex font-bold text-xl text-center items-center justify-center">
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setOpenEditCategory(true)}>
            <Pencil className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpenCategory(true)}>
            <Trash2 className="mr-2 size-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Delete open={openCategory} setOpen={setOpenCategory} />
      <EditDialog open={openEditCategory} setOpen={setOpenEditCategory} />
    </>
  );
}

export function SubCategoryActions() {}