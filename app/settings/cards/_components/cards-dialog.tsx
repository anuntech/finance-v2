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

export function CardsDialog({
  isEdit,
  accountId,
  isOpen,
  setOpen,
}: {
  isEdit?: boolean;
  accountId?: string;
  isOpen?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setOpen(v);
        setTimeout(() => (document.body.style.pointerEvents = ""), 500);
      }}
    >
      {!isEdit && (
        <DialogTrigger asChild>
          <Button className="text-xs ml-auto">
            <Circle /> Adicionar
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar" : "Adicionar"} Cartão</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name" className="text-right">
              Bandeira
            </Label>
            <Input id="name" className="col-span-3" placeholder="Banco Itau" />
          </div>
          <div>
            <Label htmlFor="username" className="text-right">
              Conta que o cartão está vinculado
            </Label>
            <Input id="username" className="col-span-3" placeholder="R$ 0,00" />
          </div>
          <div>
            <Label htmlFor="name" className="text-right">
              Nome do cartão
            </Label>
            <Input id="name" className="col-span-3" placeholder="Cartão Itau" />
          </div>
          <div>
            <Label htmlFor="username" className="text-right">
              Fechamento
            </Label>
            <Input id="username" className="col-span-3" placeholder="R$ 0,00" />
          </div>

          <div>
            <Label htmlFor="username" className="text-right">
              Vencimento
            </Label>
            <Input id="username" className="col-span-3" placeholder="R$ 0,00" />
          </div>
          <div>
            <Label htmlFor="username" className="text-right">
              Limite
            </Label>
            <Input id="username" className="col-span-3" placeholder="R$ 0,00" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            {isEdit ? "Salvar alterações" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
