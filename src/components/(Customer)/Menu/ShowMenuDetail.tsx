import { Favorite, Close, Restaurant, Add, Remove } from '@mui/icons-material'
import { Skeleton, Dialog, AppBar, Toolbar, Button } from '@mui/material';
import { Menu, Cart } from "@/types/types"
import { useMenu, useCart } from '@/hooks/hooks';
import { useEffect, useState } from 'react';
import React from 'react'
import { API_URL } from "@/utils/config"
import Swal from 'sweetalert2';

interface ShowMenuDetailProps {
    onClose: () => void,
    menu_id: String
}

const { getMenuByID } = useMenu()
const { insertCart } = useCart()

const ShowMenuDetail: React.FC<ShowMenuDetailProps> = ({ onClose, menu_id }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [menuDetail, setMenuDetail] = useState<Menu>({
        menu_id: '',
        menu_name: '',
        menu_price: 0,
        menu_img: '',
        menu_status: '',
        menu_amount: 0,
        category_name: '',
    });
    const [cart, setCart] = useState<Cart>({
        cart_id: '',
        cart_status: 'active',
        cart_amount: 0,
        table_id: '',
        menu_id: '',
        add_date: ''
    })

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await getMenuByID({ menu_id: String(menu_id) });
            setLoading(false);
            setMenuDetail(res);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedCart = {
                ...cart,
                menu_id: menuDetail.menu_id
            };
            await insertCart(updatedCart);
            setCart({
                cart_id: '',
                cart_status: '',
                cart_amount: 0,
                table_id: '',
                menu_id: '',
                add_date: ''
            })
            await onClose()
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6" }}>
                <Toolbar className='flex gap-2 justify-between'>
                    <span className='text-bold text-black'>รายละเอียดเมนู</span>
                    <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-2 z-10 rounded-xl" onClick={onClose}>
                        <Close />
                    </button>
                </Toolbar>
            </AppBar>
            <form onSubmit={onSubmit}>
                <div className="container mx-auto bg-gray-100 rounded-b-xl h-full pb-3 p-6">
                    <div className="relative">
                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height={320} />
                        ) : (
                            <img
                                src={`${API_URL}${menuDetail.menu_img}`}
                                alt={menuDetail.menu_name}
                                className="w-full h-80 p-2 object-cover rounded-xl"
                            />
                        )}
                        <button className="absolute top-4 left-4 bg-white hover:bg-gray-200 p-2 rounded-full shadow-md">
                            <Favorite className="text-red-500" />
                        </button>
                    </div>
                    {loading ? (
                        <>
                            <Skeleton width="60%" height={30} />
                            <Skeleton width="30%" height={30} />
                            <Skeleton width="80%" height={20} />
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-gray-700">{menuDetail.menu_name}</h2>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-green-600 text-xl font-bold">฿ {menuDetail.menu_price}</p>
                                <div className="flex items-center gap-4 bg-slate-200 rounded-full">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (cart.cart_amount > 1) {
                                                setCart(prevCart => ({
                                                    ...prevCart,
                                                    cart_amount: prevCart.cart_amount - 1
                                                }));
                                            }
                                        }}
                                        className="bg-[#bdbdbd] hover:bg-[#acabab] text-white px-2 py-2 font-bold rounded shadow-md transform hover:scale-105 transition duration-300"
                                    >
                                        <Remove className="w-5 h-5" />
                                    </button>
                                    <input
                                        value={cart.cart_amount}
                                        readOnly
                                        className="text-xl text-gray-700 bg-slate-200 font-semibold w-8 text-center focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCart(prevCart => ({
                                                ...prevCart,
                                                cart_amount: prevCart.cart_amount + 1
                                            }));
                                        }}
                                        className="bg-[#3fc979] hover:bg-[#3ac473] text-white px-2 py-2 font-bold rounded shadow-md transform hover:scale-105 transition duration-300"
                                    >
                                        <Add className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex justify-center items-center w-full pb-6">
                    <Button variant="contained" type="submit" color="success" sx={{ width: "80%" }} startIcon={<Restaurant />}>
                        Add To Cart
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

export default ShowMenuDetail;
