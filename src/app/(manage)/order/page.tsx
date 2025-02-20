"use client";

import React, { useState } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/category";
import Swal from "sweetalert2";

const OrderPage: React.FC = () => {
    const {
        generateCategoryID,
        getCategoryByID,
        insertCategory,
        deleteCategoryBy,
    } = useCategory();

    const [catID, setCatID] = useState<string>("");
    const [categoryID, setCategoryID] = useState<string>("");
    const [newCategory, setNewCategory] = useState<Category>({
        category_id: "",
        category_name: "",
    });

    const [searchResult, setSearchResult] = useState<Category | null>(null);

    const genCatID = async () => {
        const res = await generateCategoryID();
        setCatID(res);
    };

    const onChangeInsert = (e: any) => {
        const { name, value } = e.target;
        setNewCategory((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!newCategory.category_name.trim()) {
            alert("กรุณาใส่ชื่อ Category");
            return;
        }
        try {
            await insertCategory(newCategory);
            Swal.fire({
                title: "Insert Successfully.",
                icon: "success",
                draggable: true,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onSearch = async () => {
        const res = await getCategoryByID(catID);
        setSearchResult(res);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
            <h1>🏠 Home Page</h1>

            {loading && <p>⏳ กำลังโหลดข้อมูล...</p>}
            {error && <p style={{ color: "red" }}>❌ {error}</p>}

            <button onClick={genCatID} style={buttonStyle}>🎫 สร้าง Category ID</button>

            <input
                type="text"
                placeholder="ใส่ Category ID"
                value={catID}
                onChange={(e) => setCategoryID(e.target.value)}
                style={inputStyle}
            />
            <button onClick={onSearch} style={buttonStyle}>🔍 ค้นหา Category</button>

            {searchResult && (
                <div style={resultStyle}>
                    <h3>🔍 ผลลัพธ์การค้นหา</h3>
                    <p><strong>ID:</strong> {searchResult.category_id}</p>
                    <p><strong>ชื่อ:</strong> {searchResult.category_name}</p>
                </div>
            )}

            <input
                type="text"
                placeholder="ชื่อ Category ใหม่"
                name="category_name"
                value={newCategory.category_name}
                onChange={onChangeInsert}
                style={inputStyle}
            />
            <button onClick={onSubmit} style={buttonStyle}>➕ เพิ่ม Category</button>
            <button onClick={() => deleteCategoryBy(categoryID)} style={buttonStyle}>🗑 ลบ Category</button>
        </div>
    );
};

const buttonStyle = {
    padding: "10px",
    margin: "10px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
};

const inputStyle = {
    padding: "8px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "60%",
};

const resultStyle = {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    textAlign: "left" as const,
};

export default OrderPage;
