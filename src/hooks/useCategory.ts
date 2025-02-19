"use client";

import { useState } from "react";
import { Category } from "@/types/category";
import axios from "axios";

const API_URL = "http://localhost:5120/category";

export const useCategory = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (endpoint: string, payload: any = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}${endpoint}`, payload);
            setData(response.data);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        generateCategoryID: (): Promise<string> => fetchData("/generateCategoryID"),
        getCategoryBy: (data: Category): Promise<any> => fetchData("/getCategoryBy", data),
        getCategoryByID: (category_id: string): Promise<any> => fetchData("/getCategoryByID", { category_id }),
        updateCategoryBy: (data: Category): Promise<any> => fetchData("/updateCategoryBy", data),
        insertCategory: (data: Category): Promise<Category> => fetchData("/insertCategory", data),
        deleteCategoryBy: (category_id: string): Promise<any> => fetchData("/deleteCategoryBy", { category_id }),
    };
};
