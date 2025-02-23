"use client";
import axios from "axios";
import { Cart } from "@/types/types";
import { API_URL } from "@/utils/config";

export const useCart = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/cart${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generateCartID: (): Promise<string> => fetchData("/generateCartID"),
        getCartBy: (data?: any): Promise<Cart[]> => fetchData("/getCartBy", data),
        getCartByID: (data: { cart_id: string }): Promise<Cart> => fetchData("/getCartByID", data),
        updateCartBy: (data: Cart): Promise<Cart> => fetchData("/updateCartBy", data),
        insertCart: (data: Cart): Promise<Cart> => fetchData("/insertCart", data),
        deleteCartBy: (data: { cart_id: string }): Promise<{ cart_id: string }> => fetchData("/deleteCartBy", data),
    };
};
