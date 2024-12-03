import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

// Types
interface Character {
  id: string;
  name: string;
  class: string;
  description: string;
  abilities: string[];
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    charisma: number;
    wisdom: number;
    intelligence: number;
  };
}

interface Mestre {
  idmestre: number;
  nome: string;
  senha: string; // Ajuste conforme necessário
}

interface RPGTable {
  idmesa: number;
  nome: string;
  descricao: string;
  tema: string;
  mestre: Mestre;
  characters?: Character[]; // Adicionei a interrogação para refletir que pode não vir na resposta
}

// Components
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
  idmesa: number | null;
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
        idmesa,
        nome,
        classe,
        descricao,
        atributos,
        habilidades,
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
  onCharacterClick: (character: Character) => void;
}> = ({ table, onCharacterClick }) => {
  const [isFichaModalOpen, setIsFichaModalOpen] = useState(false);

  const handleCreateFicha = () => {
    setIsFichaModalOpen(false);
    // Aqui você pode implementar lógica adicional, como refazer a busca por mesas e fichas
  };

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
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {table.characters?.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={() => onCharacterClick(character)}
          />
        )) || <p className="text-gray-400">Sem personagens nesta mesa.</p>}
      </CardContent>
      <CreateFichaModal
        isOpen={isFichaModalOpen}
        onClose={() => setIsFichaModalOpen(false)}
        idmesa={table.idmesa}
        onCreate={handleCreateFicha}
      />
    </Card>
  );
};


const CharacterCard: React.FC<{ character: Character; onClick: () => void }> = ({
  character,
  onClick,
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-opacity-80 backdrop-blur-sm bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 text-cyan-300">{character.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{character.class}</p>
        <p className="text-xs text-gray-400 truncate">{character.description}</p>
      </CardContent>
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
  const [idmestre, setMestre] = useState<number | "">("");

  const handleCreate = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/Mesa`, {
        idmestre,
        nome,
        descricao,
        tema,
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

// Main Component
export default function RPGLandingPage() {
  const [tables, setTables] = useState<RPGTable[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchTablesAndCharacters = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Mesa/mestre?idmestre=1`);
      setTables(response.data);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
    }
  };

  useEffect(() => {
    fetchTablesAndCharacters();
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
              <RPGTableComponent
                key={table.idmesa}
                table={table}
                onCharacterClick={setSelectedCharacter}
              />
            ))}
          </div>
          <CreateTableModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={fetchTablesAndCharacters}
          />
        </div>
      </div>
    </div>
  );
}
