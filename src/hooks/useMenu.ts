"use client";
import axios from "axios";
import { Menu } from "@/types/menu";
import { API_URL } from "@/utils/config";

export const useMenu = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/menu${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generateMenuID: (): Promise<string> => fetchData("/generateMenuID"),
        getMenuBy: (): Promise<Menu[]> => fetchData("/getMenuBy"),
        getMenuByID: (data: { menu_id: string }): Promise<Menu> => fetchData("/getMenuByID", data),
        updateMenuBy: (data: Menu): Promise<Menu> => fetchData("/updateMenuBy", data),
        insertMenu: (data: Menu): Promise<Menu> => fetchData("/insertMenu", data),
        deleteMenuBy: (data: { menu_id: string }): Promise<{ menu_id: string }> => fetchData("/deleteMenuBy", data),
    };
};
