"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./_components/table";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/libs/api";

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

export default function Categories() {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => api.get("/api/settings/category"),
  });

  return (
    <div className="px-6 pt-6">
      <h1 className="text-1xl font-bold mb-2">Categorias</h1>
      <Tabs defaultValue="saidas">
        <TabsList>
          <TabsTrigger value="saidas" className="w-32">
            Saídas
          </TabsTrigger>
          <TabsTrigger value="entradas" className="w-32">
            Entradas
          </TabsTrigger>
          <TabsTrigger value="outros" className="w-32">
            Outros
          </TabsTrigger>
        </TabsList>
        <TabsContent value="saidas">
          {categoriesQuery.isPending ? <Skeleton /> : <DataTable data={data} />}
        </TabsContent>
        <TabsContent value="outros">
          {categoriesQuery.isPending ? <Skeleton /> : <DataTable data={data} />}
        </TabsContent>
        <TabsContent value="entradas">
          {categoriesQuery.isPending ? <Skeleton /> : <DataTable data={data} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
