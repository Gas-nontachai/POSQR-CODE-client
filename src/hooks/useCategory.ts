"use client";
import axios from "axios";
import { Category } from "@/types/category";
import { API_URL } from "@/utils/config";

export const useCategory = () => {

    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const response = await axios.post(`${API_URL}/category${endpoint}`, payload);
            return response.data;
        } catch (err: any) {
            return null;
        } finally {
        }
    };

    return {
        generateCategoryID: (): Promise<string> => fetchData("/generateCategoryID"),
        getCategoryBy: (): Promise<Category[]> => fetchData("/getCategoryBy"),
        getCategoryByID: (data: { category_id: string }): Promise<{ category_id: string }> => fetchData("/getCategoryByID", data),
        updateCategoryBy: (data: Category): Promise<Category> => fetchData("/updateCategoryBy", data),
        insertCategory: (data: Category): Promise<Category> => fetchData("/insertCategory", data),
        deleteCategoryBy: (data: { category_id: string }): Promise<{ category_id: string }> => fetchData("/deleteCategoryBy", data),
    };
};
