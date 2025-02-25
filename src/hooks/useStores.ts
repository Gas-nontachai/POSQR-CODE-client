"use client";
import axios from "axios";
import { Stores } from "@/types/stores";
import { API_URL } from "@/utils/config";

export const useStores = () => {

    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const response = await axios.post(`${API_URL}/stores${endpoint}`, payload);
            return response.data;
        } catch (err: any) {
            return null;
        } finally {
        }
    };

    return {
        generateStoresID: (): Promise<string> => fetchData("/generateStoresID"),
        getStoresBy: (data?: any): Promise<Stores[]> => fetchData("/getStoresBy", data),
        getStoresByID: (data: { stores_id: string }): Promise<Stores> => fetchData("/getStoresByID", data),
        updateStoresBy: (data: Stores): Promise<Stores> => fetchData("/updateStoresBy", data),
        insertStores: (data: Stores): Promise<Stores> => fetchData("/insertStores", data),
        deleteStoresBy: (data: { stores_id: string }): Promise<{ stores_id: string }> => fetchData("/deleteStoresBy", data),
    };
};
