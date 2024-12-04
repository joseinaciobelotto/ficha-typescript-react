import React, { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
let idmestre = localStorage.getItem("userId")

interface RPGTable { 
  idmesa: number
  nome: string
  descricao: string
  tema: string
  mestre: {
    idmestre: number
  }
}

interface FichaJogador {
  idficha: string
  nome: string
  classe: string
  descricao: string
  atributo: number[]
  mesa: {
    idmesa: number
  }
}

const AnimatedBackground: React.FC<{ background: string }> = ({ background }) => (
  <div
    className={`fixed inset-0 -z-10 overflow-hidden ${
      background === "black" ? "bg-black" : ""
    }`}
    style={{
      backgroundImage:
        background !== "black" ? `url(${background})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {background === "black" && (
      <div className="absolute inset-0 opacity-30">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animation: `twinkle ${Math.random() * 5 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    )}
  </div>
);


const CreateFichaModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  idmesa: number | null
  onCreate: () => void
}> = ({ isOpen, onClose, idmesa, onCreate }) => {
  const [nome, setNome] = useState("")
  const [classe, setClasse] = useState("")
  const [descricao, setDescricao] = useState("")
  const [atributos, setAtributos] = useState<number[]>([10, 10, 10, 10, 10, 10])

  const handleCreateFicha = async () => {
    const personagem = { nome, classe, descricao, atributo: atributos, mesa: { idmesa } }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/Ficha`, personagem)
      onCreate()
      onClose()
    } catch (error) {
      console.error("Erro ao criar ficha:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Nova Ficha</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome da Ficha"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
          />
          <Input
            placeholder="Classe"
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
          />
          {['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'].map((attr, index) => (
            <div key={attr} className="flex items-center">
              <span className="w-24 text-gray-300">{attr}:</span>
              <Input
                type="number"
                value={atributos[index]}
                onChange={(e) => {
                  const newAtributos = [...atributos]
                  newAtributos[index] = parseInt(e.target.value)
                  setAtributos(newAtributos)
                }}
                className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
              />
            </div>
          ))}
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
          />
          <Button onClick={handleCreateFicha} className="bg-white text-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
            Criar Ficha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FichaModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  ficha: FichaJogador | null
  onFichaDeleted: () => void
}> = ({ isOpen, onClose, ficha, onFichaDeleted }) => {
  if (!ficha) return null

  const [nome, setNome] = useState(ficha.nome)
  const [classe, setClasse] = useState(ficha.classe)
  const [descricao, setDescricao] = useState(ficha.descricao)
  const [atributos, setAtributos] = useState<number[]>(ficha.atributo)
  console.log(atributos);
  console.log(ficha);
  const editarFicha = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Ficha`, {
        idficha: ficha.idficha,
        nome,
        classe,
        descricao,
        atributo: atributos,
        mesa: {
          idmesa: ficha.mesa.idmesa
        }
      })
      console.log(response)
      alert("Editado com sucesso!");
      onClose();
      onFichaDeleted();
    } catch (error) {
      console.error("Erro ao editar ficha", error)
    }
  }

  const deletar = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/Ficha?id=${ficha.idficha}`)
      onClose();
      alert(response.data);
      onFichaDeleted();
    } catch (error) {
      console.error("Erro ao deletar fichas", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Editar Ficha: {ficha.nome}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <strong className="text-gray-300">Nome:</strong>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded-lg shadow w-full mt-2"
            />
          </div>
          <div>
            <strong className="text-gray-300">Classe:</strong>
            <input
              type="text"
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded-lg shadow w-full mt-2"
            />
          </div>
          <div>
            <strong className="text-gray-300">Descrição:</strong>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="bg-gray-800 text-white p-2 rounded-lg shadow w-full mt-2"
            />
          </div>
          <div>
            <strong className="text-gray-300">Atributos:</strong>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'].map((attr, index) => (
                <div key={attr} className="bg-gray-800 p-2 rounded-lg shadow">
                  <span className="text-gray-300">{attr}:</span>
                  <input
                    type="number"
                    value={atributos[index]}
                    onChange={(e) => {
                      const newAtributos = [...atributos]
                      newAtributos[index] = parseInt(e.target.value, 10)
                      setAtributos(newAtributos)
                    }}
                    className="font-bold text-white w-full mt-1 bg-gray-700 p-1 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="bg-blue-500 p-2 rounded-lg shadow"
              onClick={editarFicha}
            >
              Salvar Alterações
            </button>
            <button
              className="bg-red-500 p-2 rounded-lg shadow"
              onClick={deletar}
            >
              Excluir Ficha
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const RPGTableComponent: React.FC<{ table: RPGTable; onEditComplete: () => void }> = ({ table, onEditComplete }) => {
  const [isFichaModalOpen, setIsFichaModalOpen] = useState(false)
  const [fichas, setFichas] = useState<FichaJogador[]>([])
  const [selectedFicha, setSelectedFicha] = useState<FichaJogador | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newTableName, setNewTableName] = useState(table.nome)
  const [newTableDescription, setNewTableDescription] = useState(table.descricao)

  const fetchFichas = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/Ficha/mesa?idmesa=${table.idmesa}`)
      setFichas(response.data)
    } catch (error) {
      console.error("Erro ao buscar fichas", error)
    }
  }

  const editarMesa = async () => {
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Mesa`, {
        idmesa: table.idmesa,
        nome: newTableName,
        descricao: newTableDescription,
        mestre: {
          idmestre: table.mestre.idmestre,
        },
      })
      console.log(response);
      alert("Edição da mesa realizada com sucesso!")
      setIsEditModalOpen(false)
      onEditComplete()
    } catch (error) {
      console.error("Erro ao editar mesa", error)
    }
  }

  const excluirMesa = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/Mesa?id=${table.idmesa}`)
      console.log(response)
      alert("Mesa excluída! ")
      setIsEditModalOpen(false)
      onEditComplete()
    } catch (error) {
      console.error("Erro ao excluir mesa", error)
    }
  }

  useEffect(() => {
    fetchFichas()
  }, [table.idmesa])

  return (
    <Card className="mb-14 bg-gray-900 border-gray-800 text-white overflow rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
      <CardHeader className="border-b border-gray-800 flex flex-row items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800">
        <CardTitle className="text-2xl font-bold text-white">{table.nome}</CardTitle>
        <div className="flex gap-4">
          <Button
            className="bg-white text-black hover:bg-gray-200 transition-all duration-300"
            onClick={() => setIsFichaModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Ficha
          </Button>
          <Button
            className="bg-blue-500 text-black hover:bg-green-400 transition-all duration-300"
            onClick={() => setIsEditModalOpen(true)}
          >
            Editar Mesa
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-gray-300 mb-4">{table.descricao}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {fichas.map((ficha) => (
            <Button
              key={ficha.idficha}
              variant="outline"
              className="text-left h-auto py-2 px-4 bg-gray-800 hover:bg-gray-700 border-gray-700 rounded-lg shadow transition-all duration-300 transform hover:scale-105"
              onClick={() => setSelectedFicha(ficha)}
            >
              <div>
                <p className="font-semibold text-white">{ficha.nome}</p>
                <p className="text-sm text-gray-300">{ficha.classe}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>

      <CreateFichaModal
        isOpen={isFichaModalOpen}
        onClose={() => setIsFichaModalOpen(false)}
        idmesa={table.idmesa}
        onCreate={() => {
          setIsFichaModalOpen(false)
          fetchFichas()
        }}
      />

      <FichaModal
        isOpen={!!selectedFicha}
        onClose={() => setSelectedFicha(null)}
        ficha={selectedFicha}
        onFichaDeleted={fetchFichas}
      />

      {isEditModalOpen && (
        <Dialog>
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-80 z-50 ">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 z-50">
              <h2 className="text-2xl font-bold mb-4">Editar Mesa</h2>
              <div className="mb-4">
                <label htmlFor="mesaNome" className="text-gray-300">Nome da Mesa</label>
                <input
                  id="mesaNome"
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg mt-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mesaDescricao" className="text-gray-300">Descrição</label>
                <textarea
                  id="mesaDescricao"
                  value={newTableDescription}
                  onChange={(e) => setNewTableDescription(e.target.value)}
                  className="w-full bg-gray-800 text-white p-2 rounded-lg mt-2"
                />
              </div>
              <div className="flex justify-between">
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-400"
                  onClick={editarMesa}
                >
                  Salvar Alterações
                </Button>
                <Button
                  className="bg-red-500 text-white hover:bg-red-400"
                  onClick={excluirMesa}
                >
                  Excluir Mesa
                </Button>
              </div>
              <Button
                className="bg-gray-700 text-white mt-4 w-full"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </Card>
  )
}


const CreateTableModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
}> = ({ isOpen, onClose, onCreate }) => {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tema, setTema] = useState("")

  const handleCreate = async () => {
    try {
      console.log(idmestre, nome, descricao, tema)
      await axios.post(`${import.meta.env.VITE_API_URL}/Mesa`, {
        nome,
        descricao,
        tema,
        mestre: {
          idmestre: idmestre,
        },
      })
      onCreate()
      onClose()
    } catch (error) {
      console.error("Erro ao criar mesa:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Nova Mesa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome da Mesa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
          />
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
          />
          <Input
            placeholder="Tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 focus:ring-white focus:border-white"
          />
          <Button onClick={handleCreate} className="bg-white text-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
            Criar Mesa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RPGLandingPage() {
  idmestre = localStorage.getItem("userId")
  const idmestre = localStorage.getItem("userId")
  const [tables, setTables] = useState<RPGTable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [background, setBackground] = useState("black");
  const [selectedBackground, setSelectedBackground] = useState("black"); // Novo estado
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const fetchTables = async () => {
    try {
      const response = await axios.get(`${apiUrl}/Mesa/mestre?idmestre=${idmestre}`);
      setTables(response.data);
    } catch (error) {
      console.error("Erro ao buscar mesas:", error);
    }
  };

  const exitAccount = async () => {
    localStorage.removeItem("userId");
    navigate("/");
  }

  const excluirUser = async () => {
    try {
      const confirmacao = window.confirm(
        "Você tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita."
      );
      if (!confirmacao) {
        return;
      }
      console.log("Excluindo conta...");
      const response = await axios.delete(`${apiUrl}/Mestre?id=${idmestre}`);
      console.log(response)
      alert("Conta excluída com sucesso.");
      localStorage.removeItem("userId");
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Ocorreu um erro ao tentar excluir sua conta. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleBackgroundChange = (bg: string) => {
    setBackground(bg);
    setSelectedBackground(bg);
  };

  return (
    <div className="min-h-screen text-white">
      <Button
        onClick={() => excluirUser()}
        className=" bgtext-white hover:bg-red-700 px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Excluir Conta
      </Button>
      <Button
        onClick={() => exitAccount()}
        className=" bgtext-white hover:bg-yellow-700 px-6 py-3 shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Sair da Conta
      </Button>
      <AnimatedBackground background={background} />
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-extrabold text-center mb-12 text-white animate-pulse">
            TABLES & FICHAS
          </h1>
          <div className="flex justify-center items-center mb-8 space-x-4">
            <Button
              onClick={() => handleBackgroundChange("black")}
              className={`px-4 py-2 rounded shadow transition-all ${
                selectedBackground === "black" 
                ? "bg-gray-900 text-white" 
                : "bg-gray-1000 text-gray-300"
              }`}
            >
              Preto
            </Button>
            <Button
              onClick={() => handleBackgroundChange("/public/sci-fi-fantasy-landscape.jpg")}
              className={`px-4 py-2 rounded shadow transition-all ${
                selectedBackground === "/public/sci-fi-fantasy-landscape.jpg"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-1000 text-gray-300"
              }`}
            >
              Sci-Fi Landscape
            </Button>
            <Button
              onClick={() =>
                handleBackgroundChange("/public/challenger-stands-front-spooky-castle-illustration.jpg")
              }
              className={`px-4 py-2 rounded shadow transition-all ${
                selectedBackground === "/public/challenger-stands-front-spooky-castle-illustration.jpg"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-1000 text-gray-300"
              }`}
            >
              Castelo Assustador
            </Button>
          </div>
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Nova Mesa
            </Button>
          </div>
          <div className="space-y-8">
            {tables.map((table) => (
              <RPGTableComponent
                key={table.idmesa}
                table={table}
                onEditComplete={fetchTables}
              />
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
