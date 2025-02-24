import { Close, Restaurant, Add, Remove, ShoppingCart, DeleteForever } from '@mui/icons-material';
import { Skeleton, Dialog, AppBar, Toolbar, ListItemText, ListItem, Divider, List, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Cart, Menu, Order } from "@/types/types";
import { useCart, useMenu, useOrder } from '@/hooks/hooks';
import { useEffect, useState } from 'react';
import React from 'react';
import { API_URL } from "@/utils/config";

interface ShowMenuDetailProps {
    table_id: string
    table_number: string,
    bill_id: string,
    onClose: () => void;
}

const CartOrder: React.FC<ShowMenuDetailProps> = ({ table_id, table_number, bill_id, onClose }) => {
    const { getCartBy, deleteCartBy } = useCart();
    const { getMenuBy } = useMenu();
    const { insertOrder } = useOrder();

    const [cartItem, setCartItem] = useState<Cart[]>([]);
    const [menuItem, setMenuItem] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchMenu();
    }, []);

    useEffect(() => {
        if (cartItem.length > 0 && menuItem.length > 0) {
            calculateTotalPrice(cartItem, menuItem);
        }
    }, [cartItem, menuItem]);


    const fetchMenu = async () => {
        try {
            setLoading(true);
            const cartData = await getCartBy({
                $and: [{ cart_status: "active" }, { table_id }],
            });
            const menu_id = cartData.map(item => item.menu_id);
            const menuData = await getMenuBy({ menu_id: { $in: menu_id } });

            setCartItem(cartData);
            setMenuItem(menuData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalPrice = (cartData: Cart[], menuData: Menu[]) => {
        let total = 0;
        cartData.forEach(cartItem => {
            const menu = menuData.find(item => item.menu_id === cartItem.menu_id);
            if (menu) {
                total += menu.menu_price * cartItem.cart_amount;
            }
        });
        setTotalPrice(total);
    };

    const handleIncrease = (menu_id: string) => {
        setCartItem(prevItems =>
            prevItems.map(item =>
                item.menu_id === menu_id ? { ...item, cart_amount: item.cart_amount + 1 } : item
            )
        );
    };

    const handleDecrease = (menu_id: string) => {
        setCartItem(prevItems =>
            prevItems.map(item =>
                item.menu_id === menu_id && item.cart_amount > 0
                    ? { ...item, cart_amount: item.cart_amount - 1 }
                    : item
            )
        );
    };

    const submitOrder = async () => {
        try {
            const orderData = {
                order_id: "",
                table_id: table_id,
                bill_id: bill_id,
                order_status: 'pending',
                order_items: cartItem.map(item => ({
                    cart_id: item.cart_id,
                })),
                order_time: '',
            };
            await insertOrder(orderData);
            await fetchMenu()
            await onClose()
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const removeCart = async (e: React.MouseEvent, cart_id: string) => {
        e.preventDefault()
        try {
            await deleteCartBy({ cart_id: cart_id })
            await fetchMenu()
        } catch (error) {
            console.error("Error:", error)
        }
    }


    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <Toolbar className="flex justify-center p-4 text-lg text-gray-800">
                    <ShoppingCart /><span className='ml-1 font-[600]'>ตะกร้า</span>
                </Toolbar>
                <button className="hover:text-gray-700 text-gray-500 p-2 rounded-full absolute right-2 top-2" onClick={onClose}>
                    <Close />
                </button>
            </AppBar>
            <div className="container mx-auto bg-white rounded pb-3 p-6 h-5/6 overflow-auto relative">
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <Grid container spacing={3} className='mb-28'>
                        {cartItem.map((cart_item) => {
                            const menu = menuItem.find((menu_item: any) => menu_item.menu_id === cart_item.menu_id);
                            if (!menu) return null;
                            return (
                                <Grid size={12} key={cart_item.add_date}>
                                    <List className="w-full h-auto">
                                        <ListItem alignItems="flex-start" className="flex justify-between relative mt-5">
                                            <button
                                                onClick={(e) => removeCart(e, cart_item.cart_id)}
                                                className="absolute top-0 right-0 -mt-11 p-2  rounded-full  hover:bg-red-100 transition duration-300 ease-in-out transform hover:scale-110"
                                            >
                                                <DeleteForever className="text-red-600 hover:text-red-800 w-6 h-6" />
                                            </button>
                                            <img
                                                src={`${API_URL}${menu.menu_img}`}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                            <ListItemText
                                                className='ml-5'
                                                primary={menu.menu_name}
                                                secondary={`฿${menu.menu_price}`}
                                            />
                                            <div className="flex items-center gap-4 rounded-full">
                                                <button
                                                    type="button"
                                                    className="border rounded-full border-gray-400 text-gray-600 px-2 py-2 font-bold shadow-md transform hover:scale-105 transition duration-300 hover:bg-gray-200"
                                                    onClick={() => handleDecrease(cart_item.menu_id)}
                                                >
                                                    <Remove className="w-5 h-5" />
                                                </button>
                                                <input
                                                    readOnly
                                                    className="text-xl text-gray-700 font-semibold w-5 text-center focus:outline-none"
                                                    value={cart_item.cart_amount}
                                                />
                                                <button
                                                    type="button"
                                                    className="border rounded-full border-[#36ce75] text-[#36ce75] hover:bg-[#d2ffe5] px-2 py-2 font-bold shadow-md transform hover:scale-105 transition duration-300"
                                                    onClick={() => handleIncrease(cart_item.menu_id)}
                                                >
                                                    <Add className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </ListItem>
                                        <Divider />
                                    </List>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </div>
            <div className="bg-gray-100 w-full p-4 shadow-xl flex flex-col fixed bottom-16 md:bottom-0 items-center justify-center">
                <div className="flex justify-between w-full">
                    <span className='text-[18px] font-[500] mb-2'>รวมทั้งหมด  </span>
                    <span className='text-[18px] font-[500] mb-2'>฿{totalPrice}</span>
                </div>
                <Button
                    variant="contained"
                    color="success"
                    onClick={submitOrder}
                    className="rounded-xl py-2 mb-5 font-medium text-white text-base shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[320px]"
                >
                    <Restaurant className='mr-2' />สั่ง {cartItem.length} รายการ
                </Button>
            </div>
        </Dialog>
    );
};

export default CartOrder;
