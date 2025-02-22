import React, { useState, useEffect, useRef } from 'react';
import Swal from "sweetalert2";
import { Menu } from "@/types/menu";
import { useMenu } from '@/hooks/useMenu';
import { Category } from "@/types/category";
import { useCategory } from '@/hooks/useCategory';

const { insertMenu } = useMenu();
const { getCategoryBy } = useCategory();

interface AddMenuFormProps {
    onClose: () => void;
}

const AddMenuForm: React.FC<AddMenuFormProps> = ({ onClose }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [menu, setMenu] = useState<Menu>({
        menu_id: '',
        menu_name: '',
        menu_price: 0,
        menu_img: '',
        menu_status: '',
        menu_amount: 0,
        category_name: ''
    });

    const [category, setCategory] = useState<Category[]>([]);
    const [menuStatus, setMenuStatus] = useState<{ menu_status: string }[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setCategory(await getCategoryBy());
        setMenuStatus([
            { menu_status: 'available' },
            { menu_status: 'out of stock' },
            { menu_status: 'pre-order' },
        ]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await insertMenu(menu);
            Swal.fire("Success", "Menu inserted successfully", "success");
            setMenu({
                menu_id: '',
                menu_name: '',
                menu_price: 0,
                menu_img: '',
                menu_status: '',
                menu_amount: 0,
                category_name: ''
            });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to insert menu", "error");
        }
    };

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
        if (name === "menu_img" && files && files[0]) {
            setMenu((prevMenu) => ({
                ...prevMenu,
                [name]: files[0],
            }));
        } else {
            setMenu((prevMenu) => ({
                ...prevMenu,
                [name]: value,
            }));
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg w-4/5 max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded absolute top-5 right-5"
                >
                    X
                </button>
                <form onSubmit={handleSubmit} className="mb-4 mt-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Menu Name</label>
                        <input
                            type="text"
                            name="menu_name"
                            value={menu.menu_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Menu Price</label>
                        <input
                            type="number"
                            name="menu_price"
                            value={menu.menu_price}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Menu Image</label>
                        <input
                            type="file"
                            name="menu_img"
                            ref={fileInputRef}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Menu Status</label>
                        <select
                            name="menu_status"
                            value={menu.menu_status}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a Menu Status</option>
                            {menuStatus.map((item) => (
                                <option key={item.menu_status} value={item.menu_status}>
                                    {item.menu_status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category_name"
                            value={menu.category_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a category</option>
                            {category.map((cat) => (
                                <option key={cat.category_id} value={cat.category_name}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <button type='submit' className='px-3 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md'>
                            Add Menu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMenuForm;
