"use client"
import { useState } from "react";
import { Home, Favorite, AlignHorizontalLeft, Search } from '@mui/icons-material';


const CustomerHomePage = () => {

    const categoryItems = [
        { icon: Home, href: "/home" },
        { icon: Favorite, href: "/favorite" },
        { icon: AlignHorizontalLeft, href: "/align" },
        { icon: Search, href: "/search" }
    ];


    const foodItems = [
        { id: 1, name: "Ramen", price: 12.00, discount: "5%", img: "https://recipe.ajinomoto.co.th/_next/image?url=https%3A%2F%2Fwww.ajinomoto.co.th%2Fstorage%2Fphotos%2Fshares%2FRecipe%2FMenu%2F11somtomthai%2F614b1af40aff8.jpg&w=3840&q=75" },
        { id: 2, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        { id: 3, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 4, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 5, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 6, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 7, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 8, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 9, name: "Healthy Pancakes", price: 10.00, discount: "10%", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDwTlNpNchvkyyfNTVNyZRihXjEjigud78uQ&s" },
        { id: 10, name: "Pizza 3 Fromage", price: 15.00, discount: "5%", img: "https://www.allrecipes.com/thmb/0xH8n2D4cC97t7mcC7eT2SDZ0aE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6776_Pizza-Dough_ddmfs_2x1_1725-fdaa76496da045b3bdaadcec6d4c5398.jpg" },
    ];

    const [cart, setCart] = useState([]);

    // const addToCart = (item: any) => {
    //     setCart([...cart, item]);
    // };

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-4">
                <AlignHorizontalLeft className="text-2xl cursor-pointer" />
                <Search className="text-2xl cursor-pointer" />
            </div>

            <div className="flex justify-start flex-col">
                <h1 className="text-xl font-sans">Work Place ▼</h1>
                <span className="font-extralight mt-2">choose your delecios meal</span>
            </div>

            {/* Filter Buttons */}

            <div className="flex justify-center my-4">
                <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                    {categoryItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <a key={index} href={item.href} className="flex justify-center items-center bg-gray-100 w-14 h-14 border-4 rounded-2xl border-gray-400 hover:border-green-600 group">
                                <IconComponent className="text-gray-400 group-hover:text-green-600" />
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Food Cards */}
            <div className="grid grid-cols-2 gap-4">
                {foodItems.map((item) => (
                    <div key={item.id} className="bg-white border-gray-300 border-2 p-4 rounded-lg shadow-lg">
                        <div className="relative">
                            <img src={item.img} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
                            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded">{item.discount} OFF</span>
                            <Favorite className="absolute top-2 right-2 text-red-500 cursor-pointer" />
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
                        <div className="flex justify-between">
                            <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
                            <button
                                className=" bg-[#3fc979] text-white px-3 py-1 rounded-full"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#3fc979] text-white px-6 py-7 rounded-b-full rounded-t-2xl flex justify-between w-4/6">
                <span> items</span>
                <span></span>
            </div>
        </div>
    );
};

export default CustomerHomePage;
