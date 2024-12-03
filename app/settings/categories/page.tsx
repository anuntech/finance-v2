import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./_components/table";

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
          <DataTable />
        </TabsContent>
        <TabsContent value="outros">
          <DataTable />
        </TabsContent>
        <TabsContent value="entradas">
          <DataTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
