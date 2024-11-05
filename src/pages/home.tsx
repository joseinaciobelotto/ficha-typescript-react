import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ShoppingBag, User } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Definindo a interface para o tipo de restaurante
interface Restaurant {
    id: number;
    name: string;
    description: string;
    image: string;
    rating: number;
}

export default function Component() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get<Restaurant[]>('https://apifakedelivery.vercel.app/restaurants');
                setRestaurants(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-black shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <ShoppingBag className="h-8 w-8 text-primary mr-2 text-white" />
                            <span className="font-bold text-xl text-white">Cimarmitas</span>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-md">
                        <Link to={"/profile"}>
                            <User className="h-5 w-5" />
                        </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-gradient-to-r from-primary to-primary-foreground text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold mb-4 text-black">Bem vindo ao Cimarmitas</h1>
                    <p className="text-xl text-black">Seus restaurantes favoritos na porta da sua casa</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map(restaurant => (
                        <Card key={restaurant.id} className="overflow-hidden">
                            <div className="relative">
                                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
                            </div>
                            <CardHeader>
                                <CardTitle>{restaurant.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{restaurant.description}</p>
                                <div className="flex items-center mt-2">
                                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                    <span>{restaurant.rating}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between mt-6">
                                <span className="text-gray-600"></span>
                                <Link to={"/restaurant"}>
                                <Button>Ver restaurante</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
