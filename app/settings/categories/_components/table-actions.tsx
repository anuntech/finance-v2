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
import { DeleteCategory } from "./delete-category";
import { Button } from "@/components/ui/button";

export function CategoryActions() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex font-bold text-xl text-center items-center justify-center">
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Pencil className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            <Trash2 className="mr-2 size-4" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCategory open={open} setOpen={setOpen} />
    </>
  );
}

export function SubCategoryActions() {}
