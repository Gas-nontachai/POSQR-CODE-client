"use client";

import { useState } from "react";
import { Menu } from "@/types/menu";
import axios from "axios";

const API_URL = "http://localhost:5120/Menu";

export const useMenu = () => {
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
        generateMenuID: (): Promise<string> => fetchData("/generateMenuID"),
        getMenuBy: (): Promise<any> => fetchData("/getMenuBy"),
        getMenuByID: (menu_id: string): Promise<any> => fetchData("/getMenuByID", { menu_id }),
        updateMenuBy: (data: Menu): Promise<any> => fetchData("/updateMenuBy", data),
        insertMenu: (data: Menu): Promise<Menu> => fetchData("/insertMenu", data),
        deleteMenuBy: (menu_id: string): Promise<any> => fetchData("/deleteMenuBy", { menu_id }),
    };
};
