"use client";

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

export function ColorPicker({
  onChange,
}: {
  onChange?: (color: string) => void;
}) {
  const [color, setColor] = useState("#aabbcc");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (onChange) onChange(newColor); // Envia o valor hexadecimal ao callback
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <HexColorPicker
        color={color}
        onChange={handleColorChange}
        className="w-64 h-40"
      />
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-600">Cor Selecionada:</span>
        <span className="text-sm font-bold" style={{ color }}>
          {color.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
