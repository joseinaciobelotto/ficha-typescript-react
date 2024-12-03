import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
const idmestre = localStorage.getItem("userId");

interface FichaJogador {
  id: string;
  nome: string;
  classe: string;
  descricao: string;
  atributo: {
    forca: number; 
    destreza: number; 
    constituicao: number; 
    inteligencia: number; 
    sabedoria: number; 
    carisma: number; 
  };
  habilidades: string[];
  mestre: {
    idmestre: number;
  };
  mesa: {
    idmesa: number;
  };
}


interface Mestre {
  idmestre: number;
  nome: string;
  senha: string;
}

interface RPGTable {
  idmesa: number;
  nome: string;
  descricao: string;
  tema: string;
  mestre: Mestre;
}

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animation: `twinkle ${Math.random() * 5 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

const CreateFichaModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  idmesa: number | null;  // Recebe o idmesa da mesa onde a ficha será criada
  onCreate: () => void;
}> = ({ isOpen, onClose, idmesa, onCreate }) => {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");
  const [descricao, setDescricao] = useState("");
  const [atributos, setAtributos] = useState<number[]>([]);
  const [habilidades, setHabilidades] = useState<string[]>([]);

  const handleCreateFicha = async () => {
    if (!idmesa) {
      console.error("ID da mesa não fornecido.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/Ficha`, {
        nome,
        classe,
        descricao,
        atributo: atributos,
        habilidades,
        mestre: {
          idmestre,
        },
        mesa: {
          idmesa,  // Usando o idmesa recebido como parâmetro
        },
      });

      onCreate();
      onClose();
    } catch (error) {
      console.error("Erro ao criar ficha:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-300">Criar Nova Ficha</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome da Ficha"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            placeholder="Classe"
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
          />
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Input
            placeholder="Atributos (separados por vírgula)"
            value={atributos.join(",")}
            onChange={(e) => setAtributos(e.target.value.split(",").map(Number))}
          />
          <Input
            placeholder="Habilidades (separadas por vírgula)"
            value={habilidades.join(",")}
            onChange={(e) => setHabilidades(e.target.value.split(","))}
          />
          <Button onClick={handleCreateFicha}>Criar Ficha</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const RPGTableComponent: React.FC<{
  table: RPGTable;
}> = ({ table }) => {
  const [isFichaModalOpen, setIsFichaModalOpen] = useState(false);

  return (
    <Card className="mb-6 bg-opacity-80 backdrop-blur-sm bg-gray-800 border-gray-700 text-white">
      <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-cyan-300">{table.nome}</CardTitle>
        <Button
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={() => setIsFichaModalOpen(true)}
        >
          Criar Ficha
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-400">{table.descricao}</p>
      </CardContent>
      
      {/* Passando o idmesa corretamente para o modal */}
      <CreateFichaModal
        isOpen={isFichaModalOpen}
        onClose={() => setIsFichaModalOpen(false)}
        idmesa={table.idmesa}
        onCreate={() => setIsFichaModalOpen(false)}
      />
    </Card>
  );
};


const CreateTableModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}> = ({ isOpen, onClose, onCreate }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tema, setTema] = useState("");

  const handleCreate = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/Mesa`, {
        nome,
        descricao,
        tema,
        mestre: {
          idmestre: idmestre,
        },
      });
      onCreate();
      onClose();
    } catch (error) {
      console.error("Erro ao criar mesa:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-300">Criar Nova Mesa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome da Mesa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <Input
            placeholder="Tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          />
          <Button onClick={handleCreate}>Criar Mesa</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function RPGLandingPage() {
  const [tables, setTables] = useState<RPGTable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(idmestre + "AAAAAAAAA")
  const fetchTables = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Mesa/mestre?idmestre=${idmestre}`);
      setTables(response.data);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <AnimatedBackground />
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 text-cyan-300 drop-shadow-lg">
            TABLES & FICHAS
          </h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center mb-8 bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <PlusCircle className="mr-2" /> Nova Mesa
          </Button>
          <div className="space-y-8">
            {tables.map((table) => (
              <RPGTableComponent key={table.idmesa} table={table} />
            ))}
          </div>
          <CreateTableModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={fetchTables}
          />
        </div>
      </div>
    </div>
  );
}
