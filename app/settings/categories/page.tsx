import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./_components/table";

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
          <DataTable data={data} />
        </TabsContent>
        <TabsContent value="outros">
          <DataTable data={data} />
        </TabsContent>
        <TabsContent value="entradas">
          <DataTable data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
