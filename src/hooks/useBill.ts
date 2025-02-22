"use client";
import axios from "axios";
import { Bill } from "@/types/bill";
import { API_URL } from "@/utils/config";

export const useBill = () => {

    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const response = await axios.post(`${API_URL}/bill${endpoint}`, payload);
            return response.data;
        } catch (err: any) {
            return null;
        } finally {
        }
    };

    return {
        generateBillID: (): Promise<string> => fetchData("/generateBillID"),
        getBillBy: (data?: any): Promise<Bill[]> => fetchData("/getBillBy", data),
        getBillByID: (data: { bill_id: string }): Promise<Bill> => fetchData("/getBillByID", data),
        updateBillBy: (data: Bill): Promise<Bill> => fetchData("/updateBillBy", data),
        insertBill: (data: Bill): Promise<Bill> => fetchData("/insertBill", data),
        deleteBillBy: (data: { bill_id: string }): Promise<{ bill_id: string }> => fetchData("/deleteBillBy", data),
    };
};
