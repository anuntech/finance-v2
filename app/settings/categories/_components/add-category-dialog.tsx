"use client";

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
import { Switch } from "@/components/ui/switch";
import { Circle } from "lucide-react";
import { useState } from "react";
import { Check } from "lucide-react";
import { ColorPicker } from "@/components/color-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddCategoryDialog() {
  const [isSubCategory, setIsSubCategory] = useState(false);

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setIsSubCategory(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-xs ml-auto">
          <Circle /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Adicionar {isSubCategory ? "subcategoria" : "categoria"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">
              Nome da {isSubCategory ? "subcategoria" : "categoria"}
              <span className="text-red-500">*</span>
            </Label>
            <Input id="name" placeholder="Nome da categoria" className="w-80" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is-sub-category"
              onCheckedChange={(val) => setIsSubCategory(val)}
            />
            <Label htmlFor="is-sub-category">É uma subcategoria</Label>
          </div>
          {!isSubCategory && <SelectColorToCategory />}
          {isSubCategory && <SelectSubCategory />}
        </div>

        <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SelectColorToCategory({
  onChange,
}: {
  onChange?: (color: string) => void;
}) {
  const colors = [
    { hex: "#B71C1C", name: "bg-[#B71C1C]" },
    { hex: "#C62828", name: "bg-[#C62828]" },
    { hex: "#D32F2F", name: "bg-[#D32F2F]" },
    { hex: "#E53935", name: "bg-[#E53935]" },
    { hex: "#F44336", name: "bg-[#F44336]" },
    { hex: "#EF5350", name: "bg-[#EF5350]" },
    { hex: "#E57373", name: "bg-[#E57373]" },
    { hex: "#FFCDD2", name: "bg-[#FFCDD2]" },
    { hex: "#880E4F", name: "bg-[#880E4F]" },
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorClick = (hex: string) => {
    setSelectedColor(hex);
    if (onChange) onChange(hex);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-muted-foreground">
        Cor para identificação em relatórios
      </div>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => handleColorClick(color.hex)}
            className={`w-6 h-6 rounded-full cursor-pointer ${color.name} flex items-center justify-center`}
          >
            {selectedColor === color.hex && (
              <Check className="text-white w-4 h-4" />
            )}
          </button>
        ))}
      </div>
      <ColorPickerDialog />
    </div>
  );
}

export function ColorPickerDialog() {
  const [selectedColor, setSelectedColor] = useState("#aabbcc");
  const defaultColor = "#aabbcc";

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleReset = () => {
    setSelectedColor(defaultColor);
  };

  const handleSave = () => {
    console.log("Cor selecionada:", selectedColor);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-3 text-gray-600 text-sm w-max relative group">
          Mostrar cores
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-400 transition-all group-hover:w-full"></span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <h2 className="text-lg font-bold">Escolha uma cor</h2>
        <p className="text-sm text-gray-600">
          Selecione uma cor abaixo para identificar sua categoria.
        </p>
        <div className="flex flex-col items-center gap-4">
          <ColorPicker onChange={handleColorChange} />
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Resetar
          </Button>
          <Button type="button" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SelectSubCategory() {
  return (
    <div>
      <Label htmlFor="name">
        Categoria principal
        <span className="text-red-500">*</span>
      </Label>
      <SelectDemo />
    </div>
  );
}

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger>
        <div className="flex gap-2 items-center">
          <Circle size={25} />
          <SelectValue placeholder="Select a fruit" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
