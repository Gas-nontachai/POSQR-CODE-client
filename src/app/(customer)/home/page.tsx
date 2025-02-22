"use client"
import { useState, useEffect } from "react";
import { Home, Favorite, AlignHorizontalLeft, Search, AddShoppingCartOutlined } from '@mui/icons-material';
import Link from "next/link";
import { Menu } from "@/types/menu"
import { useMenu } from "@/hooks/useMenu"
const { getMenuBy } = useMenu()

const CustomerHomePage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [menuData, setMenuData] = useState<Menu[]>([])

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        const res = await getMenuBy()
        setMenuData(res)
    }

    const categoryItems = [
        { icon: Home, href: "/home", name: "Home" },
        { icon: Favorite, href: "/favorite", name: "Favorite" },
        { icon: AlignHorizontalLeft, href: "/align", name: "Align" },
        { icon: Search, href: "/search", name: "Search" }
    ];

    const foodItems = [
        { id: 1, name: "Ramen", price: 12.00, discount: "5%", img: "https://recipe.ajinomoto.co.th/_next/image?url=https%3A%2F%2Fwww.ajinomoto.co.th%2Fstorage%2Fphotos%2Fshares%2FRecipe%2FMenu%2F11somtomthai%2F614b1af40aff8.jpg&w=3840&q=75" },
        { id: 2, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        { id: 3, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        { id: 4, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        { id: 5, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        { id: 6, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        { id: 7, name: "Spaghetti", price: 10.00, discount: "12%", img: "https://images.deliveryhero.io/image/fd-th/LH/k9bv-listing.jpg" },
        // ... เพิ่มอาหารอื่น ๆ
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-4">
                <AlignHorizontalLeft className="text-2xl cursor-pointer text-gray-950 hover:text-gray-700" onClick={toggleSidebar} />
                <div className="relative">
                    <Search className="text-2xl cursor-pointer text-gray-950 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        className="pl-10 py-2 rounded-md border border-gray-300"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-start flex-col">
                <h1 className="text-xl font-sans">GGas Nonthachai</h1>
                <span className="font-extralight mt-2">choose your delicious meal</span>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-start"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div
                        className="bg-white w-64 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold">Categories</h3>
                        <ul className="mt-4">
                            {categoryItems.map((item, index) => (
                                <li key={index} className="my-2 hover:bg-gray-200 hover:rounded-xl hover:pl-3 p-2">
                                    <Link href={item.href}>
                                        <div className="flex items-center">
                                            <item.icon className="text-gray-600" />
                                            <span className="ml-2">{item.name}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
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
                    <Link key={item.id} href="/menu-detail">
                        <div className="bg-white border-gray-300 border-2 p-4 rounded-lg shadow-lg">
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
                    </Link>

                ))}
            </div>

            <Link href="">
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#3fc979] hover:bg-[#36bd6e] text-white py-5 rounded-b-3xl rounded-t-xl flex cursor-pointer justify-center w-4/6">
                    <span className='font-bold text-wrap'><AddShoppingCartOutlined />&nbsp;&nbsp;Add to Cart</span>
                </div>
            </Link>
        </div>
    );
};

export default CustomerHomePage;
