import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, DollarSign } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  saldo: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://apifakedelivery.vercel.app/users/${userId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar os dados do usuário');
        }
        const data: User = await response.json(); // Tipando a resposta
        setUser(data);
      } catch (error: any) { // Capturando o erro como qualquer tipo
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="text-center py-6">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center py-6 text-gray-600">Nenhum usuário encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Perfil do Usuário</h1>
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center mb-4 mt-6">
              <User className="h-10 w-10 text-primary mr-3" />
              <h2 className="text-2xl font-bold">{user.name}</h2>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-lg">{user.email}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-lg">Saldo: R$ {user.saldo}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" className="mr-2">Editar</Button>
            <Button variant="destructive">Excluir Conta</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
