"use client"
import { useState, useEffect, useRef } from "react";
import { formatDate } from '@/utils/date-func';
import { useSearchParams, useRouter } from "next/navigation";
import {
    AlignHorizontalLeft, Search, Restaurant, RefreshOutlined, ShoppingCart, AddLocation, History
} from '@mui/icons-material';
import { Skeleton, List, ListItem, ListItemText, Drawer, Box, Tab, Tabs, Divider } from "@mui/material";
import { Category, Menu, Bill } from "@/types/types"
import { API_URL } from "@/utils/config"
import { useMenu, useBill } from "@/hooks/hooks"
import { useCategory } from "@/hooks/useCategory"
const { getMenuBy } = useMenu()
const { getBillByID } = useBill()
const { getCategoryBy } = useCategory()

import ShowMenuDetail from "@/components/(Customer)/Menu/ShowMenuDetail";
import CartOrder from "@/components/(Customer)/Menu/CartOrder";
import HistoryOrder from "@/components/(Customer)/Menu/HistoryOrder";

const CustomerHomePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const table_id = searchParams.get("table_id") || '';
    const table_number = searchParams.get("table_number") || '';
    const bill_id = searchParams.get("bill_id") || '';

    const [searchMenu, setSearchMenu] = useState('');
    const [showReset, setShowReset] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCart, setIsCart] = useState(false);
    const [isHistoryOrder, setIsHistoryOrder] = useState(false);
    const [isMenuDetail, setIsMenuDetail] = useState(false);
    const [menuItems, setMenuItems] = useState<Menu[]>([]);
    const [billItems, setBillItems] = useState<Bill>();
    const [loading, setLoading] = useState(true);
    const [categoryItems, setCategoryItems] = useState<Category[]>([]);
    const menu_id = useRef('');
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!table_id && !table_number && !bill_id) {
            router.push("/screen");
        }
    }, [table_id, table_number, bill_id, router]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const menuData = await getMenuBy();
            setMenuItems(menuData);
            const cateData = await getCategoryBy();
            setCategoryItems(cateData);
            const billData = await getBillByID({ bill_id: bill_id || '' });
            setBillItems(billData);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (!searchMenu.trim()) return;
            await delay(200)
            const res = await getMenuBy();
            const filterMenu = res.filter((menu: Menu) =>
                menu.menu_name.toLowerCase().includes(searchMenu.toLowerCase())
            );
            setMenuItems(filterMenu);
            setShowReset(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategory = async (categoryName: string) => {
        setLoading(true);
        try {
            await delay(200)
            const res = await getMenuBy();
            const filterMenu = res.filter((menu: Menu) => menu.category_name === categoryName);
            setMenuItems(filterMenu);
            setShowReset(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetMenuSearch = async () => {
        setLoading(true);
        try {
            await delay(200)
            const res = await getMenuBy();
            setMenuItems(res);
            setShowReset(false);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event: any, newValue: any) => {
        setSelectedTab(newValue);
    };

    return (
        <>
            <div className="relative z-10 container mx-auto">
                <img className="w-full object-cover h-56 md:h-96 rounded-b-md" src="https://www.ryoiireview.com/upload/article/202306/1687261453_24a425f3fc949e538c713d38f7b42107.jpg" />
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center absolute -bottom-10 border-2 border-gray-200 shadow-sm shadow-gray-200 left-1/2 transform -translate-x-1/2">
                    logo
                </div>
                <AlignHorizontalLeft className="text-2xl cursor-pointer text-white hover:text-gray-00 absolute top-3 left-4" onClick={toggleSidebar} />
            </div>
            <div className="container mx-auto bg-gray-100 min-h-screen relative p-4 py-16">
                <div className="fixed top-7 right-7 z-20">
                    <a onClick={() => setIsCart(true)} className="relative bg-white shadow-lg rounded-full p-2 border border-gray-300 hover:bg-gray-100 hover:shadow-xl transition duration-300">
                        <ShoppingCart className="w-7 h-7 text-gray-700 hover:text-gray-900" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                            <span className="text-xs font-bold">0</span>
                        </div>
                    </a>
                </div>

                <div className="fixed top-7 right-20 z-20">
                    <a
                        onClick={() => setIsHistoryOrder(true)}
                        className="bg-white shadow-lg rounded-full p-2 border border-gray-300 hover:bg-gray-100 hover:shadow-xl transition duration-300"
                    >
                        <History className="w-7 h-7 text-gray-700 hover:text-gray-900" />
                    </a>
                </div>
                <div className="flex flex-col items-start bg-white rounded-2xl shadow-md p-4 mb-4">
                    <div className="flex items-start  mb-4 flex-col">
                        <div className="flex">
                            <AddLocation className="w-7 h-7 text-red-500 mr-3" />
                            <span className="text-2xl font-semibold text-gray-800">
                                สุขุมวิท ถ.อะไรไม่รู้ (โต๊ะ : {table_number})&nbsp;
                            </span>
                        </div>
                        <span className="text-gray-500 font-light mt-2">เสิร์ฟความอร่อยทุกวัน</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            <strong>เวลาเริ่มทาน:</strong> {formatDate(billItems?.start_time, 'HH:mm (dd/MM/yyyy)')}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>เวลาหมดอายุ:</strong> {formatDate(billItems?.expired_time, 'HH:mm (dd/MM/yyyy)')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="relative w-full">
                        <Search className="text-2xl cursor-pointer text-gray-950 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            className="pl-12 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-2 focus:border-gray-500"
                            placeholder="ค้นหาเมนูอาหาร..."
                            onChange={(e) => setSearchMenu(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch()
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-center my-4 cursor-pointer overflow-x-auto">
                    <Box sx={{ width: '100%' }}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            centered
                            sx={{
                                display: 'flex',
                                flexWrap: 'nowrap',
                                width: 'max-content',
                                '& .Mui-selected': {
                                    color: '#007bff',
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'gray',
                                },
                            }}
                        >
                            {categoryItems.map((item, index) => (
                                <Tab
                                    key={index}
                                    label={
                                        <div className="flex items-center">
                                            <span className="ml-2 font-[400] text-[14px] text-gray-500">{item.category_name}</span>
                                        </div>
                                    }
                                    onClick={() => handleCategory(item.category_name)}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>
                </div>
                {showReset && (
                    <div className="mb-4">
                        <button
                            onClick={resetMenuSearch}
                            className="p-2 bg-gray-500 rounded-xl hover:bg-gray-600 text-white flex items-center space-x-1"
                        >
                            <RefreshOutlined /><span>ค้นหารายการอาหารทั้งหมด</span>
                        </button>
                    </div>
                )}
                <div className="bg-white -m-2">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="bg-white border-gray-300 border-2 p-2 my-2 rounded-lg shadow-lg flex flex-col justify-between">
                                <Skeleton variant="rectangular" width="30%" height={50} className="rounded-md" />
                                <div className="flex flex-col">
                                    <Skeleton variant="text" width="100%" height={24} className="rounded-md" />
                                    <Skeleton variant="text" width="50%" height={24} className="rounded-md" />
                                </div>
                            </div>
                        ))
                    ) : (
                        menuItems.length === 0 ? (
                            <div className="bg-gray-100">
                                <p className="text-[15px] text-gray-500 ml-4">ไม่มีข้อมูลที่คุณค้นหา ลองค้นหาด้วยคำอื่น ๆ ดูสิ</p>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-16">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.menu_id}
                                        onClick={(e) => {
                                            menu_id.current = item.menu_id;
                                            setIsMenuDetail(true);
                                        }}
                                    >
                                        <div className="w-full h-28 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200 ease-in-out">
                                            <div className="relative flex flex-row py-3">
                                                <div className="w-1/3">
                                                    <img
                                                        src={item.menu_img ? `${API_URL}${item.menu_img}` : '/images/home/no-img.png'}
                                                        className="w-20 h-20 object-cover rounded-lg ml-3"
                                                    />
                                                    <span
                                                        className={`absolute top-2 left-2 px-1 py-0.5 text-xs rounded 
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
                                                <div className="flex -ml-10 flex-col">
                                                    <span className="text-gray-700 font-[400] text-[15px]">{item.menu_name}</span>
                                                    <span className="text-gray-700 font-[300] text-[14px]">฿{item.menu_price}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Divider />
                                    </a>
                                ))}
                            </div>
                        )
                    )}
                    {!isMenuDetail && (
                        <a onClick={() => setIsCart(true)}>
                            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center bg-[#f3f4f5] pb-5 pt-7 items-center w-full shadow-lg shadow-gray-800">
                                <button className="bg-[#3fc979] hover:bg-[#36ce75] rounded-xl py-2 px-3 font-medium w-80 text-white text-base shadow-md flex justify-between items-center" type="submit">
                                    <div className="flex items-center font-medium">
                                        <Restaurant className="mr-2" />
                                        ดูตะกร้า
                                    </div>
                                    <span>฿0.00</span>
                                </button>
                            </div>
                        </a>
                    )}
                </div>

                {isSidebarOpen && (
                    <Drawer
                        anchor="left"
                        open={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    >
                        <div className="w-64 p-4">
                            <h3 className="text-lg font-semibold">หมวดหมู่ทั้งหมด</h3>
                            <List className="mt-4">
                                {categoryItems.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        className="my-2 hover:bg-gray-200 hover:rounded-xl cursor-pointer"
                                        onClick={() => handleCategory(item.category_name)}
                                    >
                                        <ListItemText primary={item.category_name} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Drawer>
                )}

                {isMenuDetail && (
                    <ShowMenuDetail table_id={table_id} table_number={table_number} bill_id={bill_id} menu_id={menu_id.current ?? ''} onClose={() => { setIsMenuDetail(false) }} />
                )}

                {isCart && (
                    <CartOrder table_id={table_id} table_number={table_number} bill_id={bill_id} onClose={() => { setIsCart(false) }} />
                )}

                {isHistoryOrder && (
                    <HistoryOrder table_id={table_id} table_number={table_number} bill_id={bill_id} onClose={() => { setIsHistoryOrder(false) }} />
                )}
            </div >
        </>
    );
};

export default CustomerHomePage;
