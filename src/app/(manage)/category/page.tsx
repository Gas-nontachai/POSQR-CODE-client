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
        <div className="container mx-auto my-10 p-5 max-w-3xl bg-white shadow-lg rounded-lg">
            <h1 className=" border-gray-200 bg-slate-100 text-gray-900 text-center p-4 rounded-xl text-2xl font-bold flex items-center justify-center gap-2">
                <FastfoodIcon className="w-10 h-10" />
                จัดการหมวดหมู่อาหาร
            </h1>
            <div className="flex gap-3 mt-5">
                <input
                    type="text"
                    name="category_name"
                    value={newCategory.category_name}
                    onChange={onChangeInput}
                    placeholder="เพิ่มหมวดหมู่อาหารใหม่"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={onSubmit}
                    className="bg-green-500 flex text-white px-5 py-2 rounded-md hover:bg-green-600"
                >
                    <Add /> เพิ่ม
                </button>
            </div>
            <h3 className="text-lg flex gap-2 font-semibold mt-5 mb-2 text-blue-500">
                <FastfoodIcon />รายการหมวดหมู่อาหาร
            </h3>
            {loading ? (
                <div className="flex justify-center items-center my-10">
                    <CircularProgress />
                </div>
            ) : (
                <div className="bg-gray-100 p-3 rounded-md h-auto max-h-96 overflow-y-auto">
                    {FetchCate.length > 0 ? (
                        <ul>
                            {FetchCate.map((item) => (
                                <li
                                    key={item.category_id}
                                    className="flex justify-between items-center bg-white p-2 rounded-md mb-2 shadow"
                                >
                                    <span className="text-gray-700">{item.category_name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onUpdate(item.category_id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.category_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >ลบ
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">ไม่มีหมวดหมู่อาหาร</p>
                    )}
                </div>
            )}
        </div >
    );
};

export default ManageCategoryPage;