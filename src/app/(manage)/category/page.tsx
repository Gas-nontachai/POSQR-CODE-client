"use client";

import React, { useState, useEffect } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/category";
import Swal from "sweetalert2";

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
        setLoading(true);
        const res = await getCategoryBy();

        setTimeout(() => {
            setLoading(false);
            setFetchCate(Array.isArray(res) ? res : [res]);
        }, 1000);
    };


    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory({ ...newCategory, category_name: e.target.value });
    };

    const onSubmit = async () => {
        if (!newCategory.category_name.trim()) {
            Swal.fire("Error", "กรุณากรอกชื่อ Category", "warning");
            return;
        }
        try {
            const category = { ...newCategory };
            await insertCategory(category);
            Swal.fire("สำเร็จ", "เพิ่มหมวดหมู่เรียบร้อย", "success");
            setNewCategory({ category_id: "", category_name: "" });
            await fetchData()
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async (category_id: string) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteCategoryBy({ category_id });
                Swal.fire("Deleted!", "ลบหมวดหมู่เรียบร้อยแล้ว", "success");
                await fetchData()
            }
        });
    };

    const onUpdate = async (category_id: string) => {
        const categoryToUpdate = FetchCate.find(category => category.category_id === category_id);
        if (categoryToUpdate) {
            const { value: newCategoryName } = await Swal.fire({
                title: 'แก้ไขหมวดหมู่',
                input: 'text',
                inputLabel: 'ชื่อหมวดหมู่ใหม่',
                inputValue: categoryToUpdate.category_name,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'กรุณากรอกชื่อหมวดหมู่';
                    }
                }
            });

            if (newCategoryName) {
                const updatedCategory = { ...categoryToUpdate, category_name: newCategoryName };
                await updateCategoryBy(updatedCategory);
                Swal.fire('สำเร็จ', 'แก้ไขหมวดหมู่เรียบร้อย', 'success');
                await fetchData();
            }
        }
    }

    return (
        <div className="container mx-auto my-10 p-5 max-w-3xl bg-white shadow-lg rounded-lg">
            <h1 className="bg-blue-600 text-white text-center p-4 rounded-md text-2xl font-bold">
                จัดการหมวดหมู่
            </h1>

            <div className="flex gap-3 mt-5">
                <input
                    type="text"
                    name="category_name"
                    value={newCategory.category_name}
                    onChange={onChangeInput}
                    placeholder="เพิ่มหมวดหมู่ใหม่"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={onSubmit}
                    className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600"
                >
                    ➕ เพิ่ม
                </button>
            </div>

            <div className="mt-5">
                <h2 className="text-lg font-semibold mb-2">รายการหมวดหมู่</h2>
                <div className="bg-gray-100 p-3 rounded-md">
                    {loading && <p>🔄 กำลังโหลดข้อมูล...</p>}
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
                                            onClick={() => onDelete(item.category_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >ลบ
                                        </button>
                                        <button
                                            onClick={() => onUpdate(item.category_id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                        >
                                            แก้ไข
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">ไม่มีหมวดหมู่</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCategoryPage;