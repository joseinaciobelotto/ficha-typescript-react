import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'

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

interface RPGTable {
  id: string;
  name: string;
  characters: Character[];
}

type AddTableFunction = (name: string) => void;
type AddCharacterFunction = (tableId: string, character: Character) => void;

// Mock Data
const mockTables: RPGTable[] = [
  {
    id: '1',
    name: 'Aventura na Floresta Encantada',
    characters: [
      {
        id: '1',
        name: 'Elara Moonwhisper',
        class: 'Druida',
        description: 'Uma elfa druida com profunda conexão com a natureza.',
        abilities: ['Forma Selvagem', 'Conjurar Plantas'],
        attributes: {
          strength: 10,
          dexterity: 14,
          constitution: 12,
          charisma: 13,
          wisdom: 16,
          intelligence: 11
        }
      },
      {
        id: '2',
        name: 'Thorgar Stonebeard',
        class: 'Guerreiro',
        description: 'Um anão guerreiro com força incomparável.',
        abilities: ['Surto de Ação', 'Segunda Chance'],
        attributes: {
          strength: 18,
          dexterity: 12,
          constitution: 16,
          charisma: 10,
          wisdom: 11,
          intelligence: 9
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Mistérios da Cidade Perdida',
    characters: [
      {
        id: '3',
        name: 'Zephyr Nightshade',
        class: 'Ladino',
        description: 'Um humano ladino especialista em furtividade.',
        abilities: ['Ataque Furtivo', 'Evasão'],
        attributes: {
          strength: 11,
          dexterity: 18,
          constitution: 13,
          charisma: 14,
          wisdom: 12,
          intelligence: 15
        }
      }
    ]
  }
];

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

const CharacterCard: React.FC<{ character: Character; onClick: () => void }> = ({ character, onClick }) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-opacity-80 backdrop-blur-sm bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700" onClick={onClick}>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 text-cyan-300">{character.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{character.class}</p>
        <p className="text-xs text-gray-400 truncate">{character.description}</p>
        <div className="mt-3 flex justify-between text-xs text-gray-400">
          <span>Nível: {Math.floor(Math.random() * 10) + 1}</span>
          <span>XP: {Math.floor(Math.random() * 1000)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const RPGTable: React.FC<{ table: RPGTable; onCharacterClick: (character: Character) => void; onAddCharacter: AddCharacterFunction }> = ({ table, onCharacterClick, onAddCharacter }) => {
  return (
    <Card className="mb-6 bg-opacity-80 backdrop-blur-sm bg-gray-800 border-gray-700 text-white">
      <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-cyan-300">{table.name}</CardTitle>
        <Button variant="secondary" size="sm" onClick={() => onAddCharacter(table.id, {
          id: `new-${Date.now()}`,
          name: "Novo Personagem",
          class: "Classe",
          description: "Descrição do personagem",
          abilities: ["Habilidade 1", "Habilidade 2"],
          attributes: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            charisma: 10,
            wisdom: 10,
            intelligence: 10
          }
        })}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Personagem
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {table.characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={() => onCharacterClick(character)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const CharacterModal: React.FC<{ character: Character | null; isOpen: boolean; onClose: () => void }> = ({ character, isOpen, onClose }) => {
  if (!character) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-300">{character.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h3 className="font-semibold text-gray-300">Classe</h3>
            <p className="text-gray-400">{character.class}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-300">Descrição</h3>
            <p className="text-gray-400">{character.description}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-300">Habilidades</h3>
            <ul className="list-disc list-inside text-gray-400">
              {character.abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-300">Atributos</h3>
            <div className="grid grid-cols-2 gap-2 text-gray-400">
              <p>Força: <span className="text-cyan-300">{character.attributes.strength}</span></p>
              <p>Destreza: <span className="text-cyan-300">{character.attributes.dexterity}</span></p>
              <p>Constituição: <span className="text-cyan-300">{character.attributes.constitution}</span></p>
              <p>Carisma: <span className="text-cyan-300">{character.attributes.charisma}</span></p>
              <p>Sabedoria: <span className="text-cyan-300">{character.attributes.wisdom}</span></p>
              <p>Inteligência: <span className="text-cyan-300">{character.attributes.intelligence}</span></p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function RPGLandingPage() {
  const [tables, setTables] = useState<RPGTable[]>(mockTables);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const addTable: AddTableFunction = (name) => {
    const newTable: RPGTable = {
      id: `table-${Date.now()}`,
      name,
      characters: []
    };
    setTables([...tables, newTable]);
  };

  const addCharacter: AddCharacterFunction = (tableId, character) => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, characters: [...table.characters, character] }
        : table
    ));
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <AnimatedBackground />
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-12 text-cyan-300 drop-shadow-lg">
            RPG Aventuras Épicas
          </h1>
          <p className="text-center text-xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Embarque em jornadas fantásticas, forje alianças lendárias e torne-se um herói em nosso mundo de RPG imersivo.
          </p>
          <div className="flex justify-center mb-8">
            <Button variant="secondary" size="lg" onClick={() => addTable(`Nova Mesa ${tables.length + 1}`)}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Criar Nova Mesa
            </Button>
          </div>
          <div className="space-y-8">
            {tables.map((table) => (
              <RPGTable
                key={table.id}
                table={table}
                onCharacterClick={handleCharacterClick}
                onAddCharacter={addCharacter}
              />
            ))}
          </div>
          <CharacterModal
            character={selectedCharacter}
            isOpen={!!selectedCharacter}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </div>
  );
}

