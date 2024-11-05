import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, ArrowLeft, Clock, Truck, Minus, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FoodItem {
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

export default function Food() {
    const [quantity, setQuantity] = useState(1);
    const [foodItem, setFoodItem] = useState<FoodItem | null>(null);

    useEffect(() => {
        const fetchFoodItem = async () => {
            try {
                const response = await fetch('https://apifakedelivery.vercel.app/foods/1');
                const data: FoodItem = await response.json();
                setFoodItem(data);
            } catch (error) {
                console.error("Error fetching food item:", error);
            }
        };

        fetchFoodItem();
    }, []);

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    if (!foodItem) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-black shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center">
                        <Button variant="ghost" className="mr-4" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-6 w-6 text-white" />
                        </Button>
                        <h1 className="text-2xl font-bold text-white">{foodItem.name}</h1>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black shadow-md ml-auto">
                        <Link to={"/profile"}>
                            <User className="h-5 w-5" />
                        </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card>
                    <CardContent className="p-6">
                        <img src={foodItem.image} alt={foodItem.name} className="w-full h-64 object-cover rounded-lg mb-6" />
                        <h2 className="text-3xl font-bold mb-2">{foodItem.name}</h2>
                        <p className="text-gray-600 mb-4">{foodItem.description}</p>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold">R$ {foodItem.price.toFixed(2)}</span>
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                <span className="font-bold">{foodItem.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="mr-4">{foodItem.time}</span>
                            <Truck className="h-4 w-4 mr-1" />
                            <span>Delivery: R$ {foodItem.delivery.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Button variant="outline" size="icon" onClick={decrementQuantity}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 mx-2 text-center"
                                />
                                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button className="ml-4">
                                Adicionar ao carrinho - R$ {(foodItem.price * quantity).toFixed(2)}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
