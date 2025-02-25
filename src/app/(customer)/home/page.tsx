"use client"
import { useState, useEffect, useRef } from "react";
import { formatDate } from '@/utils/date-func';
import { useSearchParams, useRouter } from "next/navigation";
import {
    AlignHorizontalLeft, Search, Timer, TimerOff, RefreshOutlined, ShoppingCart, AddLocation, History, LocationOn, AccessTime,
} from '@mui/icons-material';
import { Skeleton, List, ListItem, ListItemText, Drawer, Box, Tab, Tabs, Divider, Button, Card, CardContent, Typography } from "@mui/material";

import { Category, Menu, Bill, Store } from "@/types/types"
import { useMenu, useBill, useCart, useCategory, useStore } from "@/hooks/hooks"
const { getMenuBy } = useMenu()
const { getCartBy } = useCart()
const { getBillByID } = useBill()
const { getCategoryBy } = useCategory()
const { getStoreBy } = useStore()

import ShowMenuDetail from "@/components/(Customer)/Menu/ShowMenuDetail";
import CartOrder from "@/components/(Customer)/Menu/CartOrder";
import HistoryOrder from "@/components/(Customer)/Menu/HistoryOrder";
import MenuList from "@/components/(Customer)/Menu/MenuList";

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
    const [storeItems, setStoreItems] = useState<Store[]>([]);
    const [billItems, setBillItems] = useState<Bill>();
    const [categoryItems, setCategoryItems] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const menu_id = useRef('');
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        fetchCart();
    }, [getCartBy]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchCart = async () => {
        const cartData = await getCartBy({ $and: [{ cart_status: "active" }] });
        setCartItemCount(cartData.length);
    };

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
            const storeData = await getStoreBy()
            setStoreItems(storeData)
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
                    <a
                        onClick={() => setIsHistoryOrder(true)}
                        className="bg-white shadow-lg rounded-full p-2 border border-gray-300 hover:bg-gray-100 hover:shadow-xl transition duration-300"
                    >
                        <History className="w-7 h-7 text-gray-700 hover:text-gray-900" />
                    </a>
                </div>
                <Card elevation={1} className="mb-3">
                    {storeItems.map((item) => (
                        <CardContent key={item.store_id}>
                            <Box display="flex" flexDirection="column" alignItems="start" mb={2}>
                                <Box display="flex" alignItems="center">
                                    <LocationOn sx={{ fontSize: 32, color: "error.main", mr: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                                        {item.store_name}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="text.secondary" mt={1}>
                                    {item.store_slogan}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.store_description}
                                </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight="semibold" color="text.primary">
                                (โต๊ะ : {table_number})
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={1} mt={2}>
                                {/* Start Time */}
                                <Box display="flex" alignItems="center">
                                    <Timer sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                                    <Typography variant="body2" color="text.primary">
                                        <strong>เวลาเริ่มทาน:</strong> {formatDate(billItems?.start_time, "HH:mm (dd/MM/yyyy)")}
                                    </Typography>
                                </Box>

                                {/* Expiry Time */}
                                <Box display="flex" alignItems="center">
                                    <TimerOff sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                                    <Typography variant="body2" color="text.primary">
                                        <strong>เวลาหมดอายุ:</strong> {formatDate(billItems?.expired_time, "HH:mm (dd/MM/yyyy)")}
                                    </Typography>
                                </Box> 
                            </Box>
                        </CardContent>
                    ))}
                </Card>
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
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<RefreshOutlined />}
                            onClick={resetMenuSearch}
                            color="info"
                        >
                            ค้นหารายการอาหารทั้งหมด
                        </Button>

                    </div>
                )}
                <MenuList
                    loading={loading}
                    menuItems={menuItems}
                    setIsMenuDetail={setIsMenuDetail}
                    menu_id={menu_id}
                    cartItemCount={cartItemCount}
                    setIsCart={setIsCart}
                />

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
                    <ShowMenuDetail table_id={table_id} table_number={table_number} bill_id={bill_id} menu_id={menu_id.current ?? ''} onClose={() => { setIsMenuDetail(false); }} />
                )}

                {isCart && (
                    <CartOrder table_id={table_id} table_number={table_number} bill_id={bill_id} cart_count={cartItemCount} onClose={() => { setIsCart(false); fetchCart(); }}
                        onHistory={() => { setIsHistoryOrder(true) }}
                    />
                )}

                {isHistoryOrder && (
                    <HistoryOrder table_id={table_id} table_number={table_number} bill_id={bill_id} onClose={() => { setIsHistoryOrder(false) }} />
                )}
            </div >
        </>
    );
};

export default CustomerHomePage;
