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

    const [formData, setFormData] = useState<Menu>({
        menu_id: '',
        menu_name: '',
        menu_price: 0,
        menu_img: '',
        category_id: ''
    });

    useEffect(() => {
        fetchMenuData()
        fetchCategory()
    }, [])

    const fetchMenuData = async () => {
        const res = await getMenuByID({ menu_id })
        setFormData(res)
    }

    const fetchCategory = async () => {
        const res = await getCategoryBy();
        setCategory(Array.isArray(res) ? res : [res])
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMenuBy(formData);
            onClose()
            Swal.fire({
                title: "User updated successfully!",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "An error occurred!",
                icon: "error",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });
        }
    };

    return (
        <>
            <h2 className="text-xl mb-4">Update User</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label htmlFor="menu_name" className="block text-sm font-medium text-gray-700">
                        menu_name
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
                        menu_price
                    </label>
                    <input
                        type="number"
                        name="menu_price"
                        value={formData.menu_price || ''}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_img" className="block text-sm font-medium text-gray-700">
                        menu_img
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
                        onChange={(e) => setFormData({ ...formData, menu_img: (e.target as HTMLInputElement).files?.[0] || '' })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                        category_id
                    </label>
                    <select
                        name="category_id"
                        value={formData.category_id || ''}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {category.map((item) => (
                            <option key={item.category_id} value={item.category_id}>
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