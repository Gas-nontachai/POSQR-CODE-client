"use client";
import React, { useState, useEffect } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/category";
import Swal from "sweetalert2";
import { Add } from "@mui/icons-material"
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CircularProgress from '@mui/material/CircularProgress';

const ManageCategoryPage: React.FC = () => {

    const { getCategoryBy, insertCategory, deleteCategoryBy, updateCategoryBy } = useCategory();

    const [newCategory, setNewCategory] = useState<Category>({
        category_id: "",
        category_name: "",
    });
    const [FetchCate, setFetchCate] = useState<Category[]>([])
    const [loading, setLoading] = useState(Boolean)

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getCategoryBy();
            setFetchCate(Array.isArray(res) ? res : [res])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory({ ...newCategory, category_name: e.target.value });
    };

    const validateForm = (table_status_name: string) => {
        if (!table_status_name.trim()) {
            Swal.fire("Error", "กรุณากรอกชื่อหมวดหมู่อาหาร", "warning");
            return false;
        }
        return true;
    };
    const validateDuplicate = async (category_name: string) => {
        const res = await getCategoryBy();
        const isDuplicate = res.some((category: Category) =>
            category.category_name.trim().toLowerCase() === category_name.trim().toLowerCase()
        );
        if (isDuplicate) {
            Swal.fire("Error", "ชื่อหมวดหมู่นี้มีอยู่แล้ว", "warning");
            setNewCategory({ category_id: "", category_name: "" });
            return false;
        }
        return true;
    }
    const onSubmit = async () => {
        if (!await validateDuplicate(newCategory.category_name)) {
            return;
        }
        if (!await validateForm(newCategory.category_name)) {
            return;
        }
        try {
            setLoading(true);
            const category = { ...newCategory };
            await insertCategory(category);
            Swal.fire("สำเร็จ", "เพิ่มหมวดหมู่อาหารเรียบร้อย", "success");
            setNewCategory({ category_id: "", category_name: "" });
            await fetchData()
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (category_id: string) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่อาหารนี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteCategoryBy({ category_id });
                Swal.fire("Deleted!", "ลบหมวดหมู่อาหารเรียบร้อยแล้ว", "success");
                await fetchData()
            }
        });
    };

    const onUpdate = async (category_id: string) => {
        const categoryToUpdate = FetchCate.find(category => category.category_id === category_id);
        if (categoryToUpdate) {
            const { value: newCategoryName } = await Swal.fire({
                title: 'แก้ไขหมวดหมู่อาหาร',
                input: 'text',
                inputLabel: 'ชื่อหมวดหมู่อาหารใหม่',
                inputValue: categoryToUpdate.category_name,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'กรุณากรอกชื่อหมวดหมู่อาหาร';
                    }
                }
            });
            if (newCategoryName) {
                const updatedCategory = { ...categoryToUpdate, category_name: newCategoryName };
                await updateCategoryBy(updatedCategory);
                Swal.fire('สำเร็จ', 'แก้ไขหมวดหมู่อาหารเรียบร้อย', 'success');
                await fetchData();
            }
        }
    }

    return (
        <>
            <div className="container mx-auto p-6 w-3/4 bg-white shadow-lg rounded-lg">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold text-gray-700 flex items-center">
                        <FastfoodIcon className="w-10 h-10 mr-2" />
                        Category
                    </h1>
                </div>
                <div className="mt-5 flex">
                    <input
                        type="text"
                        value={newCategory.category_name}
                        onChange={onChangeInput}
                        placeholder="Enter new table status"
                        className="p-2 w-full border border-gray-300 rounded-l-md"
                    />
                    <button
                        onClick={onSubmit}
                        className="bg-green-500 flex items-center text-white font-bold px-5 py-2 rounded-r-md hover:bg-green-600"
                    >
                        Add
                    </button>
                </div>
                <div className="overflow-x-auto mt-5">
                    <table className="min-w-full table-auto border-collapse text-sm">
                        <thead className="bg-gray-600 text-white uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold">category_id</th>
                                <th className="px-6 py-3 text-left font-semibold">category_name</th>
                                <th className="px-6 py-3 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-10">
                                        <CircularProgress />
                                    </td>
                                </tr>
                            ) : FetchCate.length > 0 ? (
                                FetchCate.map((item) => (
                                    <tr key={item.category_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-800">{item.category_id}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.category_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onUpdate(item.category_id)}
                                                    className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.category_id)}
                                                    className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-gray-500 text-center py-4">ไม่มีหมวดหมู่อาหาร</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    );
};

export default ManageCategoryPage;