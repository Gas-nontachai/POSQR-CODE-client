"use client";

import React, { useState } from "react";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/category";

const HomePage: React.FC = () => {
    const {
        loading, error,
        generateCategoryID,
        getCategoryByID,
        insertCategory,
        deleteCategoryBy
    } = useCategory();

    const [catID, setCatID] = useState<string>("");
    const [categoryID, setCategoryID] = useState<string>("");
    const [newCategory, setNewCategory] = useState<Category>({
        category_id: '',
        category_name: ''
    });

    const genCatID = async () => {
        const res = await generateCategoryID();
        setCatID(res);
    }

    const onSubmit = async () => {
        setNewCategory({ category_id: catID, category_name: newCategory.category_name });
        await insertCategory(newCategory);
    }

    const onSearch = async () => {
        const res = await getCategoryByID(catID);
        console.log(res);

    }

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
            <h1>🏠 Home Page</h1>

            {loading && <p>⏳ กำลังโหลดข้อมูล...</p>}
            {error && <p style={{ color: "red" }}>❌ {error}</p>}
            {catID && <p>✅ ข้อมูลจาก API: <strong>{catID}</strong></p>}

            <button onClick={genCatID} style={buttonStyle}>🎫 สร้าง Category ID</button>

            <input
                type="text"
                placeholder="ใส่ Category ID"
                value={catID}
                onChange={(e) => setCategoryID(e.target.value)}
                style={inputStyle}
            />
            <button onClick={onSearch} style={buttonStyle}>🔍 ค้นหา Category</button>

            <input
                type="text"
                placeholder="ชื่อ Category ใหม่"
                value={newCategory.category_name}
                onChange={(e) => setNewCategory({ ...newCategory, category_name: e.target.value })}
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
    borderRadius: "5px"
};

const inputStyle = {
    padding: "8px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "60%"
};

export default HomePage;
