"use client";

import React, { useState, useEffect } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/category";
import Swal from "sweetalert2";

const ManageCategory: React.FC = () => {
    const {
        generateCategoryID,
        getCategoryByID,
        insertCategory,
        deleteCategoryBy,
    } = useCategory();

    const [newCategory, setNewCategory] = useState<Category>({
        category_id: "",
        category_name: "",
    });

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        const res = await getCategoryByID(newCategory.category_id)

        console.log(res);

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory({ ...newCategory, category_name: e.target.value });
    };

    const handleAddCategory = async () => {
        if (!newCategory.category_name.trim()) {
            Swal.fire("Error", "กรุณากรอกชื่อ Category", "warning");
            return;
        }

        const categoryID = await generateCategoryID();
        const category = { ...newCategory, category_id: categoryID };

        await insertCategory(category);
        setNewCategory({ category_id: "", category_name: "" });
        Swal.fire("สำเร็จ", "เพิ่มหมวดหมู่เรียบร้อย", "success");
    };

    const handleDeleteCategory = async (category_id: string) => {
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
                await deleteCategoryBy(category_id);
                Swal.fire("Deleted!", "ลบหมวดหมู่เรียบร้อยแล้ว", "success");
            }
        });
    };

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
                    onChange={handleInputChange}
                    placeholder="เพิ่มหมวดหมู่ใหม่"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600"
                >
                    ➕ เพิ่ม
                </button>
            </div>

            <div className="mt-5">
                <h2 className="text-lg font-semibold mb-2">รายการหมวดหมู่</h2>
                {/* <div className="bg-gray-100 p-3 rounded-md">
                    {categories.length > 0 ? (
                        <ul>
                            {categories.map((category) => (
                                <li
                                    key={category.category_id}
                                    className="flex justify-between items-center bg-white p-2 rounded-md mb-2 shadow"
                                >
                                    <span className="text-gray-700">{category.category_name}</span>
                                    <button
                                        onClick={() => handleDeleteCategory(category.category_id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    >
                                        ❌ ลบ
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">ไม่มีหมวดหมู่</p>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default ManageCategory;