import React, { useState, useEffect } from "react";
import { Close, PointOfSale } from '@mui/icons-material';
import { Dialog, AppBar, Toolbar } from '@mui/material';
import { useOrder, useCart, useMenu } from '@/hooks/hooks';
import { Order, Cart, Menu } from '@/types/types';

const { getCartBy } = useCart();
const { getOrderBy } = useOrder();
const { getMenuBy } = useMenu();

interface DetailOrderCartProps {
    order_id: string;
    onClose: () => void;
    onServed: (bill_id: string) => void;
}

const DetailOrderCart: React.FC<DetailOrderCartProps> = ({ order_id, onClose, onServed }) => {
    const [orderData, setNewOrder] = useState<Order>({
        order_id: '',
        table_id: '',
        bill_id: '',
        order_status: '',
        order_items: [{ cart_id: '' }],
        order_time: ''
    });

    const [menuData, setMenuData] = useState<Menu[]>([
        {
            menu_id: '',
            menu_name: '',
            menu_price: 0,
            menu_img: '',
            menu_status: '',
            menu_amount: 0,
            category_name: '',
        }
    ]);

    const [cartData, setCartData] = useState<Cart[]>([]);
    const [menuIdArr, setMenuIdArr] = useState<string[]>([]);

    useEffect(() => {
        fetchOrder();
        fetchMenu();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await getOrderBy({ order_id });
            setNewOrder(res[0]);
            const cartArr = res[0].order_items.map(item => item.cart_id);
            await fetchCart(cartArr);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    const fetchCart = async (cartArr: string[]) => {
        try {
            const res = await getCartBy({ cart_id: { $in: cartArr } });
            setCartData(res);
            const menuIds = res.map(item => item.menu_id);
            setMenuIdArr(menuIds);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await getMenuBy();
            setMenuData(res);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const filteredMenuData = menuData.filter(menu => menuIdArr.includes(menu.menu_id));

    const handleServe = (order_id: string) => {
        onServed(order_id)
    };

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <Toolbar className="flex justify-center p-4 text-lg text-gray-800">
                    <PointOfSale />
                    <span className="ml-1 font-[600]">รายละเอียดออเดอร์</span>
                </Toolbar>
                <button className="hover:text-gray-700 text-gray-500 p-2 rounded-full absolute right-2 top-2" onClick={onClose}>
                    <Close />
                </button>
            </AppBar>
            <div className="container mx-auto bg-white rounded pb-3 p-6 h-5/6 overflow-auto relative">
                {filteredMenuData.map(menu => {
                    // หา cart item ที่ตรงกับเมนูนี้
                    const cartItem = cartData.find(cart => cart.menu_id === menu.menu_id);
                    return (
                        <div key={menu.menu_id} className="flex justify-between items-center border-b pb-4">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={typeof menu.menu_img === "string" ? menu.menu_img : URL.createObjectURL(menu.menu_img)}
                                    alt={menu.menu_name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h2 className="font-medium text-lg">{menu.menu_name}</h2>
                                    <p className="text-gray-600">ราคา: {menu.menu_price} บาท</p>
                                    <p className="text-gray-600">หมวดหมู่: {menu.category_name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                {/* แสดงจำนวนที่สั่ง (cart_amount) ถ้ามี */}
                                <p className="text-gray-600">จำนวน: {cartItem ? cartItem.cart_amount : 0}</p>
                                <p className={`text-sm ${menu.menu_status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                                    {menu.menu_status}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* ปุ่ม "เสิร์ฟสินค้า" อยู่ด้านล่าง */}
            <div className="w-full flex justify-center mt-4 pb-4">
                <button
                    onClick={() => handleServe(order_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full"
                >
                    เสิร์ฟสินค้า
                </button>
            </div>
        </Dialog>
    );
};

export default DetailOrderCart;
