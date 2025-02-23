"use client";
import axios from "axios";
import { Menu } from "@/types/menu";
import { API_URL } from "@/utils/config";

export const useMenu = () => {
    const fetchData = async (endpoint: string, payload: any = {}, useFormData: boolean = false) => {
        try {
            const method = "POST";
            const config: any = {
                method,
                url: `${API_URL}/menu${endpoint}`,
                headers: {},
            };
            if (useFormData) {
                const formData = new FormData();
                Object.keys(payload).forEach((key) => {
                    if (payload[key] instanceof File) {
                        formData.append(key, payload[key]);
                    } else {
                        formData.append(key, String(payload[key]));
                    }
                });
                config.data = formData;
                config.headers["Content-Type"] = "multipart/form-data";
            } else {
                config.data = payload;
            }
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            console.error("Error:", err);
            return null;
        }
    };

    return {
        generateMenuID: (): Promise<string> => fetchData("/generateMenuID"),
        getMenuBy: (data?: any): Promise<Menu[]> => fetchData("/getMenuBy", data),
        getMenuByID: (data: { menu_id: string }): Promise<Menu> => fetchData("/getMenuByID", data),
        updateMenuBy: (data: Menu): Promise<Menu> => fetchData("/updateMenuBy", data, true),
        insertMenu: (data: Menu): Promise<Menu> => fetchData("/insertMenu", data, true),
        deleteMenuBy: (data: { menu_id: string }): Promise<{ menu_id: string }> => fetchData("/deleteMenuBy", data),
    };
};
