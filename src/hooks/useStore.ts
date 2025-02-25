"use client";
import axios from "axios";
import { Store } from "@/types/store";
import { API_URL } from "@/utils/config";

export const useStore = () => {
    const fetchData = async (endpoint: string, payload: any = {}, useFormData: boolean = false) => {
        try {
            const method = "POST";
            const config: any = {
                method,
                url: `${API_URL}/store${endpoint}`,
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
        generateStoreID: (): Promise<string> => fetchData("/generateStoreID"),
        getStoreBy: (data?: any): Promise<Store[]> => fetchData("/getStoreBy", data),
        getStoreByID: (data: { store_id: string }): Promise<Store> => fetchData("/getStoreByID", data),
        updateStoreBy: (data: Store): Promise<Store> => fetchData("/updateStoreBy", data, true),
        insertStore: (data: Store): Promise<Store> => fetchData("/insertStore", data, true),
        deleteStoreBy: (data: { store_id: string }): Promise<{ store_id: string }> => fetchData("/deleteStoreBy", data, true),
    };
};
