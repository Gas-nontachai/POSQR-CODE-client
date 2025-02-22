import { Close, Restaurant, Add, Remove } from '@mui/icons-material';
import { Skeleton, Dialog, AppBar, Grid, Toolbar, Button, ListItemText, ListItem, Divider, List } from '@mui/material';
import { Menu } from "@/types/types";
import { useMenu } from '@/hooks/useMenu';
import { useEffect, useState } from 'react';
import React from 'react';
import { API_URL } from "@/utils/config";

interface ShowMenuDetailProps {
    onClose: () => void;
}

const CheckBill: React.FC<ShowMenuDetailProps> = ({ onClose }) => {
    const { getMenuBy } = useMenu();
    const [menuItems, setMenuItems] = useState<Menu[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const res = await getMenuBy();
            setMenuItems(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item: Menu) => {
        const existingItem = cart.find(cartItem => cartItem.menu_id === item.menu_id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (item: Menu) => {
        const existingItem = cart.find(cartItem => cartItem.menu_id === item.menu_id);
        if (existingItem && existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            setCart([...cart]);
        } else {
            setCart(cart.filter(cartItem => cartItem.menu_id !== item.menu_id));
        }
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.menu_price * item.quantity, 0);
    };

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6" }}>
                <Toolbar className='flex gap-2 justify-between'>
                    <span className='text-bold text-black'>สั่งอาหาร</span>
                    <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-2 z-10 rounded-xl" onClick={onClose}>
                        <Close />
                    </button>
                </Toolbar>
            </AppBar>
            <div className="container mx-auto bg-white rounded pb-3 p-6 h-5/6 overflow-auto">
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <Grid container spacing={3}>
                        {menuItems.map((item) => (
                            <Grid item xs={12} key={item.menu_id}>
                                <List className="w-full h-auto">
                                    <ListItem alignItems="flex-start" className="flex justify-between">
                                        <img
                                            src={`${API_URL}${item.menu_img}`}
                                            alt={item.menu_name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <ListItemText
                                            primary={item.menu_name}
                                            secondary={`฿ ${item.menu_price.toFixed(2)}`}
                                        />
                                        <div className="flex items-center gap-4 bg-slate-200 rounded-full">
                                            <button className="bg-[#bdbdbd] hover:bg-[#acabab] text-white px-1 py-1 font-bold rounded shadow-md transform hover:scale-105 transition duration-300">
                                                <Remove className="w-5 h-5" />
                                            </button>
                                            <span className="text-xl text-gray-700 font-semibold">1</span>
                                            <button className="bg-[#3fc979] hover:bg-[#3ac473] text-white px-1 py-1 font-bold rounded shadow-md transform hover:scale-105 transition duration-300">
                                                <Add className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </ListItem>
                                    <Divider />
                                </List>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>
            <div className="bg-gray-100 w-full p-4 shadow-xl flex flex-col items-center">
                <span className='font-normal mb-2'>ยอดรวม: {getTotal().toFixed(2)} ฿ </span>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ width: "80%" }}
                    startIcon={<Restaurant />}
                    onClick={() => { }}
                >
                    ยืนยันการสั่งซื้อ
                </Button>
            </div>
        </Dialog>
    );
};

export default CheckBill;
