import { Close, Restaurant, Add, Remove, ShoppingCartCheckoutOutlined } from '@mui/icons-material';
import { Skeleton, Dialog, AppBar, Grid, Toolbar, ListItemText, ListItem, Divider, List } from '@mui/material';
import { Cart } from "@/types/types";
import { useCart } from '@/hooks/hooks';
import { useEffect, useState } from 'react';
import React from 'react';
import { API_URL } from "@/utils/config";

interface ShowMenuDetailProps {
    onClose: () => void;
}

const CheckBill: React.FC<ShowMenuDetailProps> = ({ onClose }) => {

    const { getCartBy } = useCart();
    const [cartItem, setCartItem] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const res = await getCartBy({ cart_status: 'active' });
            console.log(res);

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
                <Toolbar className="flex justify-center p-4 text-lg text-gray-800">
                    <ShoppingCartCheckoutOutlined /><span className='ml-1 font-[600]'>ตะกร้า</span>
                </Toolbar>
                <button className="hover:text-gray-700 text-gray-500 p-2 rounded-full absolute left-2 top-2" onClick={onClose}>
                    <Close />
                </button>
            </AppBar>
            <div className="container mx-auto bg-white rounded pb-3 p-6 h-5/6 overflow-auto relative">
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
                                            secondary="฿220"
                                        />
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
                <div className="absolute">
                    asd
                </div>
            </div>
            <div className="bg-gray-100 w-full p-4 shadow-xl flex flex-col fixed bottom-16 md:bottom-0 items-center justify-center">
                <div className="flex justify-between w-full">
                    <span className='text-[18px] font-[500] mb-2'>รวมทั้งหมด  </span>
                    <span className='text-[18px] font-[500] mb-2'>฿120</span>
                </div>
                <button className="bg-[#3fc979] hover:bg-[#36ce75] rounded-xl py-2 mb-5 font-medium text-white text-base shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[320px]">
                    <Restaurant className='mr-2' />สั่ง 2 รายการ
                </button>
            </div>
        </Dialog>
    );
};
export default CheckBill;
