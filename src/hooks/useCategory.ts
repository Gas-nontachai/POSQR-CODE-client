"use client";
import axios from "axios";
import { useState } from "react";
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
        getCategoryBy: (): Promise<any> => fetchData("/getCategoryBy"),
        getCategoryByID: (category_id: string): Promise<any> => fetchData("/getCategoryByID", { category_id }),
        updateCategoryBy: (data: Category): Promise<any> => fetchData("/updateCategoryBy", data),
        insertCategory: (data: Category): Promise<Category> => fetchData("/insertCategory", data),
        deleteCategoryBy: (category_id: string): Promise<any> => fetchData("/deleteCategoryBy", { category_id }),
    };
};
