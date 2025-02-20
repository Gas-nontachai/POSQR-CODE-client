"use client";
import axios from "axios";
import { OrderDetail } from "@/types/order-detail";
import { API_URL } from "@/utils/config";

export const useOrderDetail = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/orderdetail${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generateOrderDetailID: (): Promise<string> => fetchData("/generateOrderDetailID"),
        getOrderDetailBy: (): Promise<OrderDetail> => fetchData("/getOrderDetailBy"),
        getOrderDetailByID: (data: { orderdetail_id: string }): Promise<{ orderdetail_id: string }> => fetchData("/getOrderDetailByID", data),
        updateOrderDetailBy: (data: OrderDetail): Promise<OrderDetail> => fetchData("/updateOrderDetailBy", data),
        insertOrderDetail: (data: OrderDetail): Promise<OrderDetail> => fetchData("/insertOrderDetail", data),
        deleteOrderDetailBy: (data: { orderdetail_id: string }): Promise<{ orderdetail_id: string }> => fetchData("/deleteOrderDetailBy", data),
    };
};
