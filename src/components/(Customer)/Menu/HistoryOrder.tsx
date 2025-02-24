import { Home, Close } from '@mui/icons-material';
import { Dialog, AppBar, Toolbar, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { API_URL } from "@/utils/config";
import { useMenu, useCart, useOrder } from '@/hooks/hooks';

const { getOrderBy } = useOrder();
const { getCartBy } = useCart();
const { getMenuBy } = useMenu();

interface HistoryOrderProps {
    table_id: string
    table_number: string,
    bill_id: string,
    onClose: () => void,
}

const HistoryOrder: React.FC<HistoryOrderProps> = ({ onClose, table_id, table_number, bill_id }) => {

    const [orderItems, setOrderItems] = useState<{
        menu_name: string,
        cart_amount: number,
        menu_price: number,
        order_status: string,
        menu_image: string | File
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await delay(300)
            const resOrder = await getOrderBy({ bill_id });
            const cart_ids = resOrder.flatMap((order) =>
                order.order_items.map((item) => item.cart_id)
            );

            const resCart = await getCartBy({ cart_id: { $in: cart_ids } });
            const cartItems = resCart.map((item) => ({
                menu_id: item.menu_id,
                cart_amount: item.cart_amount
            }));

            const menu_ids = cartItems.map((cartItem) => cartItem.menu_id);
            const resMenu = await getMenuBy({ menu_id: { $in: menu_ids } });
            const updatedOrderItems = cartItems.map((cartItem) => {
                const menu = resMenu.find((menuItem) => menuItem.menu_id === cartItem.menu_id);
                return {
                    menu_name: menu ? menu.menu_name : '',
                    cart_amount: cartItem.cart_amount,
                    menu_price: menu ? menu.menu_price : 0,
                    menu_image: menu?.menu_img || ''
                };
            });

            const orderStatus = resOrder[0]?.order_status || '';
            const updatedOrderItemsWithStatus = updatedOrderItems.map(item => ({
                ...item,
                order_status: orderStatus
            }));
            setOrderItems(updatedOrderItemsWithStatus);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog fullScreen open={true} onClose={onClose}>
            <AppBar sx={{ position: "relative", backgroundColor: "#f3f4f6", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" }}>
                <Toolbar className="flex justify-center p-4">
                    <span className="text-lg font-[400] text-gray-800">ประวัติคำสั่งซื้อ</span>
                </Toolbar>
                <button className="hover:text-gray-700 text-gray-500 p-2 rounded-full absolute right-2 top-2" onClick={onClose}>
                    <Close />
                </button>
            </AppBar>
            <div className="pl-2 mt-5 h-screen overflow-auto">
                <ul>
                    {loading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <li key={index} className="py-2 flex items-center justify-between border-b border-gray-300">
                                <div className="flex items-center">
                                    <Skeleton variant="circular" width={50} height={50} className="mr-2" />
                                    <div>
                                        <Skeleton variant="text" width={120} height={20} className="mb-1" />
                                        <Skeleton variant="text" width={100} height={18} />
                                    </div>
                                </div>
                                <div className="text-sm text-right">
                                    <Skeleton variant="text" width={80} height={18} />
                                </div>
                            </li>
                        ))
                    ) : (
                        orderItems.map((item, index) => (
                            <li key={index} className="py-2 flex items-center justify-between border-b border-gray-300">
                                <div className="flex items-center">
                                    {item.menu_image ? (
                                        <img
                                            src={`${API_URL}${item.menu_image}`}
                                            alt={item.menu_name}
                                            className="w-12 h-12 object-cover mr-2"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse mr-2" />
                                    )}
                                    <div>
                                        <div className="font-medium">{item.menu_name}</div>
                                        <div className="text-sm text-gray-500">
                                            จำนวน: {item.cart_amount} x ราคา: ฿{item.menu_price}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="text-sm text-right py-2 px-1 -mb-1 rounded-l-xl font-semibold shadow-lg"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        backgroundColor:
                                            item.order_status === 'pending'
                                                ? '#fcd34d'
                                                : item.order_status === 'served'
                                                    ? '#34d399'
                                                    : '#9ca3af',
                                        color:
                                            item.order_status === 'pending'
                                                ? '#374151'
                                                : item.order_status === 'served'
                                                    ? '#fff'
                                                    : '#9ca3af',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    <>
                                        {item.order_status === 'pending' ? 'รอเสิร์ฟ' : item.order_status === 'served' ? 'เสิร์ฟแล้ว' : ''}
                                    </>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
            <div className="fixed bottom-0 bg-gray-100 shadow-lg py-5 px-2 w-full flex justify-around rounded-lg">
                <a href="#" className="bg-blue-500 text-white py-2 px-6 rounded-lg flex items-center space-x-2 shadow-md hover:bg-blue-400">
                    <span>เรียกพนักงาน</span>
                </a>
                <a href={`/home?table_id=${table_id}&table_number=${table_number}&bill_id=${bill_id}`} className="bg-gray-500 text-white py-2 px-6 rounded-lg flex items-center space-x-2 shadow-md hover:bg-gray-600">
                    <span>กลับหน้าหลัก</span>
                </a>
            </div>

        </Dialog >
    );
};

export default HistoryOrder;
