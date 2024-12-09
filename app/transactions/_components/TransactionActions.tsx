"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash } from "lucide-react";

export function TransactionActions({ transactionId }: { transactionId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="text-gray-600">...</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => console.log(`Edit transaction ${transactionId}`)}>
          <Pencil className="mr-2" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log(`Delete transaction ${transactionId}`)}>
          <Trash className="mr-2" /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}