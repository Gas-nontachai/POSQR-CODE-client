import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import { API_URL } from "@/utils/config"

type MenuItem = {
    menu_id: string;
    menu_img: string | File;
    menu_status: string;
    menu_name: string;
    menu_price: number;
};

interface MenuListProps {
    loading: boolean;
    menuItems: MenuItem[];
    setIsMenuDetail: React.Dispatch<React.SetStateAction<boolean>>;
    menu_id: React.RefObject<string>;
    cartItemCount: number;
    setIsCart: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MenuItemProps {
    item: MenuItem;
    setIsMenuDetail: React.Dispatch<React.SetStateAction<boolean>>;
    menu_id: React.RefObject<string>;
}

interface CartButtonProps {
    setIsCart: React.Dispatch<React.SetStateAction<boolean>>;
    cartItemCount: number;
}

const LoadingSkeleton: React.FC = () => (
    Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white border-gray-300 border-2 p-2 my-2 rounded-lg shadow-lg flex flex-col justify-between">
            <Skeleton variant="rectangular" width="30%" height={50} className="rounded-md" />
            <div className="flex flex-col">
                <Skeleton variant="text" width="100%" height={24} className="rounded-md" />
                <Skeleton variant="text" width="50%" height={24} className="rounded-md" />
            </div>
        </div>
    ))
);

const NoResults: React.FC = () => (
    <div className="bg-gray-100">
        <p className="text-[15px] text-gray-500 ml-4">ไม่มีข้อมูลที่คุณค้นหา ลองค้นหาด้วยคำอื่น ๆ ดูสิ</p>
    </div>
);

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, setIsMenuDetail, menu_id }) => (
    <a
        key={item.menu_id}
        onClick={() => {
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
);

const CartButton: React.FC<CartButtonProps> = ({ setIsCart, cartItemCount }) => (
    <a onClick={() => setIsCart(true)}>
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center bg-[#f3f4f5] pb-5 pt-7 items-center w-full shadow-lg shadow-gray-800">
            <button className="bg-[#3fc979] hover:bg-[#36ce75] rounded-xl py-2 px-3 font-medium w-80 text-white text-base shadow-md flex justify-between items-center" type="submit">
                <div className="flex items-center font-medium">
                    🛒
                    ดูตะกร้า({cartItemCount})
                </div>
                <span>฿0.00</span>
            </button>
        </div>
    </a>
);

const MenuList: React.FC<MenuListProps> = ({ loading, menuItems, setIsMenuDetail, menu_id, cartItemCount, setIsCart }) => (
    <div className="bg-white rounded-lg -m-2">
        {loading ? (
            <LoadingSkeleton />
        ) : menuItems.length === 0 ? (
            <NoResults />
        ) : (
            <div className="mb-7">
                {menuItems.map((item) => (
                    <MenuItemComponent key={item.menu_id} item={item} setIsMenuDetail={setIsMenuDetail} menu_id={menu_id} />
                ))}
            </div>
        )}
        <CartButton setIsCart={setIsCart} cartItemCount={cartItemCount} />
    </div>
);

export default MenuList;
