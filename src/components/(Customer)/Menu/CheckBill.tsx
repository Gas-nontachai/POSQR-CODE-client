import { Close, Restaurant, Add, Remove, ShoppingCart, Delete } from '@mui/icons-material';
import { Skeleton, Dialog, AppBar, Grid, Toolbar, Button, ListItemText, ListItem, Divider, List, Typography, IconButton } from '@mui/material';
import { Cart } from "@/types/types";
import { useCart } from '@/hooks/hooks';
import { useEffect, useState } from 'react';
import React from 'react';

interface ShowMenuDetailProps {
    onClose: () => void;
}

const CheckBill: React.FC<ShowMenuDetailProps> = ({ onClose }) => {

    const { getCartBy, deleteCartBy } = useCart();
    const [cartItem, setCartItem] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const res = await getCartBy({ cart_status: 'active' });
            setCartItem(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }; 

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <Toolbar className="flex justify-between items-center p-4 text-lg font-[600] text-gray-800">
                    <div className="flex items-center">
                        <ShoppingCart />
                        <Typography variant="h6" className="ml-2">ตะกร้า</Typography>
                    </div>
                    <IconButton onClick={onClose} className="hover:text-gray-700 text-gray-500">
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <div className="container mx-auto bg-white rounded pb-3 p-6 h-5/6 overflow-auto">
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <Grid container spacing={3} className='mb-28'>
                        {cartItem.map((item) => (
                            <Grid item xs={12} key={item.cart_id}>
                                <List className="w-full h-auto">
                                    <ListItem alignItems="flex-start" className="flex justify-between">
                                        <img
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <ListItemText
                                            className='ml-5'
                                            primary="asdasd"
                                            secondary="asdasd" />
                                        <div className="flex items-center gap-4 rounded-full">
                                            <button
                                                type="button"
                                                className="border rounded-full border-gray-400 text-gray-600 px-2 py-2 font-bold shadow-md transform hover:scale-105 transition duration-300 hover:bg-gray-200"
                                            >
                                                <Remove className="w-5 h-5" />
                                            </button>
                                            <input
                                                readOnly
                                                className="text-xl text-gray-700 font-semibold w-4 text-center focus:outline-none"
                                                value={21}
                                            />
                                            <button
                                                type="button"
                                                className="border rounded-full border-[#36ce75] text-[#36ce75] hover:bg-[#d2ffe5] px-2 py-2 font-bold shadow-md transform hover:scale-105 transition duration-300"
                                            >
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

            <div className="bg-gray-100 w-full p-4 shadow-xl flex flex-col fixed bottom-16 md:bottom-0 items-center justify-center">
                <div className="flex justify-between w-full mb-4">
                    <Typography variant="body1" className="font-medium">รวมทั้งหมด</Typography>
                    <Typography variant="body1" className="font-medium text-[#36ce75]">฿120</Typography>
                </div>
                <Button
                    variant="contained"
                    color="success"
                    className="w-full max-w-[320px] rounded-xl py-2 mb-5 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    startIcon={<Restaurant />}
                >
                    สั่ง 2 รายการ
                </Button>
            </div>

        </Dialog>
    );
};

export default CheckBill;
