"use client";
import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { Menu } from "@/types/menu";
import { Category } from "@/types/category";
import { useMenu } from '@/hooks/useMenu';
import { useCategory } from '@/hooks/useCategory';
import { API_URL } from "@/utils/config";

const { getMenuByID, updateMenuBy } = useMenu()
const { getCategoryBy } = useCategory()

interface UpdateUserFormProps {
    onClose: () => void;
    menu_id: string;
}
const UpdateMenuForm: React.FC<UpdateUserFormProps> = ({ onClose, menu_id }) => {
    const [category, setCategory] = useState<Category[]>([]);
    const [menuStatus, setMenuStatus] = useState<{ menu_status: string }[]>([]);
    const [formData, setFormData] = useState<Menu>({
        menu_id: '',
        menu_name: '',
        menu_price: 0,
        menu_img: '',
        menu_status: '',
        menu_amount: 0,
        category_name: ''
    });

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getMenuByID({ menu_id })
        setFormData(res)
        const res2 = await getCategoryBy();
        setCategory(Array.isArray(res2) ? res2 : [res2])
        setMenuStatus([
            { menu_status: 'available' },
            { menu_status: 'out of stock' },
            { menu_status: 'pre-order' },
        ]);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prevFormData) => {
            const newFormData = {
                ...prevFormData,
                [e.target.name]: e.target.value || '',
            };
            return newFormData;
        });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMenuBy(formData);
            onClose(); 
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h2 className="text-xl mb-4">Update Menu</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label htmlFor="menu_name" className="block text-sm font-medium text-gray-700">
                        Menu Name
                    </label>
                    <input
                        type="text"
                        name="menu_name"
                        value={formData.menu_name || ''}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="menu_price" className="block text-sm font-medium text-gray-700">
                        Menu Price
                    </label>
                    <input
                        type="number"
                        name="menu_price"
                        value={formData.menu_price || 0}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="menu_amount" className="block text-sm font-medium text-gray-700">
                        Menu Amount
                    </label>
                    <input
                        type="number"
                        name="menu_amount"
                        value={formData.menu_amount || 0}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="menu_img" className="block text-sm font-medium text-gray-700">
                        Menu Image
                    </label>
                    {formData.menu_img && (
                        <div className="mb-2">
                            <img
                                src={`${API_URL}/${formData.menu_img}`}
                                alt="Current Menu"
                                className="w-32 h-32 object-cover"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        name="menu_img"
                        onChange={(e) => { 
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                                setFormData({ ...formData, menu_img: file });
                            }
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Menu Status</label>
                    <select
                        name="menu_status"
                        value={formData.menu_status || ''}
                        onChange={onChange}
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
                    <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
                        Category Name
                    </label>
                    <select
                        name="category_name"
                        value={formData.category_name || ''}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {category.map((item) => (
                            <option key={item.category_id} value={item.category_name}>
                                {item.category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        Update Menu
                    </button>
                </div>
            </form>
        </>
    )
}

export default UpdateMenuForm