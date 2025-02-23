"use client"
import { useState, useEffect, useRef } from "react";
import { AlignHorizontalLeft, Search, Restaurant, Add, Remove, ArrowBack, Fastfood, Grass, LocalDrink, Icecream, Kitchen, LocalBar, Anchor } from '@mui/icons-material';
import { Skeleton } from "@mui/material";
import { Category, Menu } from "@/types/types"
import { API_URL } from "@/utils/config"
import { useMenu } from "@/hooks/useMenu"
import { useCategory } from "@/hooks/useCategory"
const { getMenuBy } = useMenu()
const { getCategoryBy } = useCategory()

import ShowMenuDetail from "@/components/(Customer)/Menu/ShowMenuDetail";
import CheckBill from "@/components/(Customer)/Menu/CheckBill";

const CustomerHomePage = () => {
    const [showReset, setShowReset] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCheckBill, setIsCheckBill] = useState(false);
    const [isMenuDetail, setIsMenuDetail] = useState(false);
    const [menuItems, setMenuItems] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryItems, setCategoryItems] = useState<Category[]>([]);
    const menu_id = useRef('');


    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            setLoading(true);
            const menuData = await getMenuBy();
            setMenuItems(menuData);
            const cateData = await getCategoryBy();
            setCategoryItems(cateData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategory = async (categoryName: string) => {
        setLoading(true);
        setTimeout(async () => {
            const res = await getMenuBy();
            const filterMenu = res.filter((menu: Menu) => menu.category_name === categoryName);
            setMenuItems(filterMenu);
            setShowReset(true);
            setLoading(false);
        }, 200);
    };

    const resetFilter = async () => {
        setLoading(true);
        setTimeout(async () => {
            const res = await getMenuBy();
            setMenuItems(res);
            setShowReset(false);
            setLoading(false);
        }, 200);
    };


    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <AlignHorizontalLeft className="text-2xl cursor-pointer text-gray-950 hover:text-gray-700" onClick={toggleSidebar} />
                <div className="relative">
                    <Search className="text-2xl cursor-pointer text-gray-950 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        className="pl-10 py-2 rounded-md border border-gray-300"
                        placeholder="Search..."
                    />
                </div>
            </div>

            <div className="flex justify-start flex-col">
                <h1 className="text-xl font-sans">GGas Nonthachai</h1>
                <span className="font-extralight mt-2">เสิร์ฟความอร่อยทุกวัน</span>
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
                        <h3 className="text-lg font-semibold cursor-pointer">Categories</h3>
                        <ul className="mt-4">
                            {categoryItems.map((item, index) => (
                                <li key={index} className="my-2 hover:bg-gray-200 hover:rounded-xl hover:pl-3 p-2 cursor-pointer">
                                    <a onClick={() => handleCategory(item.category_name)}>
                                        <div className="flex items-center">
                                            <span className="ml-2">{item.category_name}</span>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <div className="flex justify-center my-4 cursor-pointer">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-8">
                    {categoryItems.map((item, index) => (
                        <a
                            key={index}
                            onClick={() => handleCategory(item.category_name)}
                            className="w-full sm:w-auto"
                        >
                            <div className="flex justify-center items-center bg-white p-4 h-16 border-4 rounded-2xl border-gray-400 hover:border-green-600 group shadow-lg transition-all duration-300 transform hover:scale-105 flex-col md:flex-row sm:items-center">
                                {item.category_name === 'เนื้อสัตว์' && <Restaurant className="text-2xl text-red-600 group-hover:text-red-800 transition-all duration-200" />}
                                {item.category_name === 'ผัก' && <Grass className="text-2xl text-green-600 group-hover:text-green-800 transition-all duration-200" />}
                                {item.category_name === 'เส้นและแป้ง' && <Kitchen className="text-2xl text-yellow-600 group-hover:text-yellow-800 transition-all duration-200" />}
                                {item.category_name === 'อาหารทานเล่น' && <Fastfood className="text-2xl text-orange-600 group-hover:text-orange-800 transition-all duration-200" />}
                                {item.category_name === 'น้ำจิ้ม' && <LocalDrink className="text-2xl text-blue-600 group-hover:text-blue-800 transition-all duration-200" />}
                                {item.category_name === 'เครื่องดื่ม' && <LocalBar className="text-2xl text-teal-600 group-hover:text-teal-800 transition-all duration-200" />}
                                {item.category_name === 'ของหวาน' && <Icecream className="text-2xl text-pink-600 group-hover:text-pink-800 transition-all duration-200" />}
                                {item.category_name === 'ซีฟู๊ด' && <Anchor className="text-2xl text-teal-600 group-hover:text-teal-800 transition-all duration-200" />}
                                <span className="ml-2 text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-all duration-200">{item.category_name}</span>
                            </div>

                        </a>
                    ))}
                </div>
            </div>


            {showReset && (
                <div className="mb-4">
                    <button
                        onClick={resetFilter}
                        className="mt-4 p-2 bg-gray-300 rounded-xl hover:bg-gray-400 text-gray-700"
                    >
                        <ArrowBack />
                    </button>
                </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="bg-white border-gray-300 border-2 p-4 rounded-lg shadow-lg">
                            <Skeleton variant="rectangular" width="100%" height={128} />
                            <Skeleton variant="text" width="80%" height={30} className="mt-2" />
                            <Skeleton variant="text" width="50%" height={24} />
                        </div>
                    ))
                ) : (
                    menuItems.length === 0 ? (
                        <p className="text-lg text-gray-600">ไม่พบรายการอาหาร</p>
                    ) : (
                        menuItems.map((item) => (
                            <a key={item.menu_id} onClick={(e) => {
                                menu_id.current = item.menu_id;
                                setIsMenuDetail(true);
                            }}>
                                <div className="bg-white border-gray-300 w-5/5 h-64 border-2 p-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-200 ease-in-out">
                                    <div className="relative">
                                        <img
                                            src={`${API_URL}${item.menu_img}`}
                                            alt={item.menu_name}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <span
                                            className={`absolute top-2 left-2 px-2 py-1 text-sm rounded 
                                                ${item.menu_status === 'available' ? 'bg-green-500' : ''}
                                                ${item.menu_status === 'out of stock' ? 'bg-red-500' : ''}
                                                ${item.menu_status === 'pre-order' ? 'bg-blue-500' : ''}
                                                text-white
                                            `}
                                        >
                                            {item.menu_status === 'available' ? 'มีสินค้า' : ''}
                                            {item.menu_status === 'out of stock' ? 'สินค้าหมด' : ''}
                                            {item.menu_status === 'pre-order' ? 'สั่งจอง' : ''}
                                        </span>
                                    </div>
                                    <h3 className="mt-2 w-full h-9 text-sm font-semibold">{item.menu_name}</h3>
                                    <div className="flex justify-between">
                                        <p className="text-green-600 font-bold">฿ {item.menu_price.toFixed(2)}</p>
                                        <div className="flex items-center gap-4 bg-slate-200 rounded-full">
                                            <button className="bg-[#bdbdbd] hover:bg-[#acabab] text-white px-1 py-1 font-bold rounded shadow-md transform hover:scale-105 transition duration-300">
                                                <Remove className='w-5 h-5' />
                                            </button>
                                            <span className="text-xl text-gray-700 font-semibold">1</span>
                                            <button className="bg-[#3fc979] hover:bg-[#3ac473] text-white px-1 py-1 font-bold rounded shadow-md transform hover:scale-105 transition duration-300">
                                                <Add className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    )
                )}
            </div>
            {!isMenuDetail && (
                <a onClick={() => setIsCheckBill(true)}>
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#3fc979] hover:bg-[#36bd6e] text-white px-3 py-5 rounded-b-3xl rounded-t-xl flex cursor-pointer justify-between w-4/6">
                        <span className='font-bold text-wrap'>
                            <Restaurant className="mr-2" />
                            สั่งอาหารทั้งหมด
                        </span>
                        <span className='font-semibold text-wrap'>3 รายการ</span>
                    </div>
                </a>
            )}

            {isMenuDetail && (
                <ShowMenuDetail menu_id={menu_id.current ?? ''} onClose={() => { setIsMenuDetail(false) }} />
            )}

            {isCheckBill && (
                <CheckBill onClose={() => { setIsCheckBill(false) }} />
            )}
        </div >
    );
};

export default CustomerHomePage;
