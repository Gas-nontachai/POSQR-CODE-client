"use client";
import axios from "axios";
import { Order } from "@/types/order";
import { API_URL } from "@/utils/config";

export const useOrder = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/order${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generateOrderID: (): Promise<string> => fetchData("/generateOrderID"),
        getOrderBy: (): Promise<Order[]> => fetchData("/getOrderBy"),
        getOrderByID: (data: { order_id: string }): Promise<{ order_id: string }> => fetchData("/getOrderByID", data),
        updateOrderBy: (data: Order): Promise<Order> => fetchData("/updateOrderBy", data),
        insertOrder: (data: Order): Promise<Order> => fetchData("/insertOrder", data),
        deleteOrderBy: (data: { order_id: string }): Promise<{ order_id: string }> => fetchData("/deleteOrderBy", data),
    };
};
