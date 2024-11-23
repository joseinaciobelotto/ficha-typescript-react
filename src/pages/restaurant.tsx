import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ArrowLeft, Clock, Truck, User } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  rating: string;
  image: string;
  description: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  time: string;
  delivery: number;
  rating: number;
  image: string;
  restaurantId: string;
  description: string;
}

export default function Restaurant() {
  const { id } = useParams<{ id: string }>(); // Captura o ID da URL
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`https://apifakedelivery.vercel.app/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`https://apifakedelivery.vercel.app/foods`);
        setMenuItems(response.data.filter((item: { restaurantId: string | undefined; }) => item.restaurantId === id));
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchRestaurantData();
    fetchMenuItems();
  }, [id]); // Reexecuta o efeito quando o ID muda

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-4" onClick={() => window.history.back()}>
              <ArrowLeft className="h-6 w-6 text-white" />
            </Button>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-md ml-auto">
              <Link to={"/profile"}>
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row">
              <img src={restaurant.image} alt={restaurant.name} className="w-full md:w-1/3 h-64 object-cover rounded-lg mb-4 md:mb-0 md:mr-6" />
              <div>
                <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-bold">{restaurant.rating}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-bold mb-4">Menu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">R$ {item.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="mr-4">{item.time}</span>
                  <Truck className="h-4 w-4 mr-1" />
                  <span>Delivery: R$ {item.delivery.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/food/${item.id}`}>
                  <Button className="w-full">Pedir</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
