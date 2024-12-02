import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outputs } from "./_components/outputs";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-1xl font-bold mb-2">Home</h1>
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
          <Outputs />
        </TabsContent>
        <TabsContent value="entradas">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
