import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Circle } from "lucide-react";

export function AccountDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-xs ml-auto">
          <Circle /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar banco</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right">
              Nome do banco
            </Label>
            <Input id="name" className="col-span-3" placeholder="Banco Itau" />
          </div>
          <div>
            <Label htmlFor="username" className="text-right">
              Saldo inicial
            </Label>
            <Input id="username" className="col-span-3" placeholder="R$ 0,00" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
