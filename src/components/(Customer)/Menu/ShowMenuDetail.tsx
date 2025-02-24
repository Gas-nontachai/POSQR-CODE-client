import { Favorite, Close, AddLocation, Add, Remove } from '@mui/icons-material'
import { Skeleton, Dialog, Divider, Toolbar, AppBar } from '@mui/material';
import { Menu, Cart } from "@/types/types"
import { useMenu, useCart } from '@/hooks/hooks';
import { useEffect, useState } from 'react';
import React from 'react'
import { API_URL } from "@/utils/config"
import Swal from 'sweetalert2';

interface ShowMenuDetailProps {
    table_id: string
    table_number: string,
    bill_id: string,
    menu_id: String
    onClose: () => void,
}

const { getMenuByID } = useMenu()
const { insertCart, updateCartBy } = useCart()

const ShowMenuDetail: React.FC<ShowMenuDetailProps> = ({ table_id, table_number, bill_id, menu_id, onClose }) => {
    const { getCartBy } = useCart();
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

    const [cartDetail, setCartDetail] = useState<Cart[]>([])

    const [cart, setCart] = useState<Cart>({
        cart_id: '',
        cart_status: 'active',
        cart_amount: 1,
        table_id: '',
        menu_id: '',
        add_date: ''
    })

    useEffect(() => {
        fetchMenu();
        fetchCart()
    }, []);

    useEffect(() => {
    }, [menuDetail,]);

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
    const fetchCart = async () => {
        try {
            const cartData = await getCartBy({
                $and: [{ cart_status: "active" }, { table_id }],
            });
            setCartDetail(cartData);
            console.log(cartDetail);

        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("!!!!onSubmit!!!!");
            let updatedCart
            const check_menu = cartDetail.map(item => item.menu_id);
            const foundMenu = check_menu.find(id => id === menuDetail.menu_id);

            if (foundMenu) {
                const find_cart = cartDetail.find((value) => ({ cart_id: value.cart_id, cart_amount: value.cart_amount }));
                updatedCart = {
                    ...cart,
                    cart_id: find_cart?.cart_id ? find_cart?.cart_id : '',
                    cart_amount: find_cart?.cart_amount ? find_cart?.cart_amount + cart.cart_amount : 0,
                    table_id,
                    menu_id: menuDetail.menu_id
                };
                await updateCartBy(updatedCart);
            } else {
                updatedCart = {
                    ...cart,
                    table_id: table_id,
                    menu_id: menuDetail.menu_id
                };
                await insertCart(updatedCart);
            }
            setCart({
                cart_id: '',
                cart_status: '',
                cart_amount: 1,
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
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <Toolbar className="flex justify-center p-4">
                    <span className="text-lg font-[400] text-gray-800">{menuDetail.menu_name}</span>
                </Toolbar>
                <button className="hover:text-gray-700 text-gray-500 p-2 rounded-full absolute left-2 top-2" onClick={onClose}>
                    <Close />
                </button>
            </AppBar>
            <form onSubmit={onSubmit}>
                <div className="container mx-auto w-full rounded-b-xl pb-3 p-4">
                    <div className="relative">
                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height={320} />
                        ) : (
                            <img
                                src={`${API_URL}${menuDetail.menu_img}`}
                                alt={menuDetail.menu_name}
                                className="w-full h-80 object-cover rounded-xl"
                            />

                        )}
                    </div>
                    {loading ? (
                        <>
                            <Skeleton width="60%" height={30} />
                            <Skeleton width="30%" height={30} />
                            <Skeleton width="80%" height={20} />
                        </>
                    ) : (
                        <>
                            <h2 className="text-[25px] mt-10 font-[500] text-gray-600">{menuDetail.menu_name}</h2>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex flex-col">
                                    <label className="block text-gray-700 font-[400]">
                                        จ่ายแบบ (อะลาคาร์ต)
                                    </label>

                                    <p className="text-gray-600 text-[18px] font-[500]">฿{menuDetail.menu_price}</p>
                                </div>
                                <div className="flex items-center gap-4 rounded-full">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (cart.cart_amount > 0) {
                                                setCart(prevCart => ({
                                                    ...prevCart,
                                                    cart_amount: prevCart.cart_amount - 1
                                                }));
                                            }
                                        }}
                                        className="border rounded-full border-gray-400 text-gray-600 px-2 py-2 font-bold shadow-md transform hover:scale-105 transition duration-300 hover:bg-gray-200"
                                    >
                                        <Remove className="w-5 h-5" />
                                    </button>

                                    <input
                                        value={cart.cart_amount}
                                        readOnly
                                        className="text-xl text-gray-700 font-semibold w-5 text-center focus:outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCart(prevCart => ({
                                                ...prevCart,
                                                cart_amount: prevCart.cart_amount + 1
                                            }));
                                        }}
                                        className="border rounded-full border-[#36ce75] text-[#36ce75] hover:bg-[#d2ffe5] px-2 py-2 font-bold shadow-md transform hover:scale-105 transition duration-300"
                                    >
                                        <Add className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <Divider className='mt-5' />
                            <div className="mt-4">
                                <label htmlFor="message" className="block text-gray-700 font-[400] mb-2">
                                    ข้อความเพิ่มเติม (ถ้ามี)
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="ระบุข้อความ..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-300 focus:outline-none transition shadow-sm"
                                    rows={4}
                                ></textarea>
                            </div>

                        </>
                    )}
                    <div className="fixed bottom-16 md:bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center bg-gray-100 pb-5 pt-7 items-center w-full shadow-lg shadow-gray-800">
                        <button className="bg-[#3fc979] hover:bg-[#36ce75] rounded-xl py-2 font-medium w-80 text-white text-base shadow-md hover:shadow-lg transition-all duration-200">
                            เพิ่มลงตะกร้า ฿{menuDetail.menu_price}
                        </button>
                    </div>
                </div>
            </form>
        </Dialog >
    );
};

export default ShowMenuDetail;
