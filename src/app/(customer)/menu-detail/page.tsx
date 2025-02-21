import { Favorite, AddShoppingCartOutlined } from '@mui/icons-material'
import Link from 'next/link';

export default function ProductDetail() {
    return (
        <div className="container mx-auto bg-gray-100 min-h-screen rounded-xl">
            <div className="relative">
                <img
                    src="https://www.allrecipes.com/thmb/0xH8n2D4cC97t7mcC7eT2SDZ0aE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6776_Pizza-Dough_ddmfs_2x1_1725-fdaa76496da045b3bdaadcec6d4c5398.jpg" // เปลี่ยนเป็น URL รูปจริง
                    alt="Ramen"
                    className="w-full h-80 object-cover rounded-xl"
                />
                <a href="/home" className="absolute top-4 left-4 bg-white hover:bg-gray-200 p-2 rounded-full shadow-md">
                    ←
                </a>
                <button className="absolute top-4 right-4 bg-white  hover:bg-gray-200 p-2 rounded-full shadow-md">
                    <Favorite className='text-red-500' />
                </button>
            </div>

            <div className="p-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold">Ramen</h2>
                    <div className="flex items-center gap-2">
                        <button className="bg-gray-300 hover:bg-gray-500 hover:text-white text-gray-700 px-3 py-2 rounded">-</button>
                        <span className="text-xl">2</span>
                        <button className="bg-green-500 hover:bg-green-400 text-white px-3 py-2 rounded">+</button>
                    </div>
                </div>
                <p className="text-green-500 text-xl font-bold">$12.00</p>
                <h3 className="font-bold">Recipe</h3>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel.{" "}
                    <span className="text-green-500">more...</span>
                </p>

                {/* <div className="mt-4">
                    <div className="flex items-center gap-2 bg-gray-200 p-3 rounded-lg">
                        <span className="bg-gray-400 p-2 rounded-full">📍</span>
                        <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-gray-600 text-sm">At facilisis posuere.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-200 p-3 mt-2 rounded-lg">
                        <span className="bg-gray-400 p-2 rounded-full">⏳</span>
                        <div>
                            <p className="font-semibold">Delivery Time</p>
                            <p className="text-gray-600 text-sm">30 Minutes</p>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* แถบสรุปคำสั่งซื้อ */}
            <Link href="">
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#3fc979] hover:bg-[#36bd6e]
                        text-white py-5 rounded-b-3xl rounded-t-xl flex cursor-pointer justify-center w-4/6">
                    <span className='font-bold text-xl'><AddShoppingCartOutlined />&nbsp;&nbsp;Add to Cart</span>
                </div>
            </Link>
        </div>
    );
}
