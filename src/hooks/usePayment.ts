"use client";
import axios from "axios";
import { Payment } from "@/types/payment";
import { API_URL } from "@/utils/config";

export const usePayment = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/payment${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generatePaymentID: (): Promise<string> => fetchData("/generatePaymentID"),
        getPaymentBy: (data?: any): Promise<Payment[]> => fetchData("/getPaymentBy", data),
        getPaymentByID: (data: { payment_id: string }): Promise<Payment> => fetchData("/getPaymentByID", data),
        updatePaymentBy: (data: Payment): Promise<Payment> => fetchData("/updatePaymentBy", data),
        insertPayment: (data: Payment): Promise<Payment> => fetchData("/insertPayment", data),
        deletePaymentBy: (data: { payment_id: string }): Promise<{ payment_id: string }> => fetchData("/deletePaymentBy", data),
    };
};
