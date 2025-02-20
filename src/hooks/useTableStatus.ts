"use client";
import axios from "axios";
import { TableStatus } from "@/types/table-status";
import { API_URL } from "@/utils/config";

export const useTableStatus = () => {

    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const response = await axios.post(`${API_URL}/table-status${endpoint}`, payload);
            return response.data;
        } catch (err: any) {
            return null;
        } finally {
        }
    };

    return {
        generateTableStatusID: (): Promise<string> => fetchData("/generateTableStatusID"),
        getTableStatusBy: (): Promise<TableStatus[]> => fetchData("/getTableStatusBy"),
        getTableStatusByID: (data: { table_status_id: string }): Promise<TableStatus> => fetchData("/getTableStatusByID", data),
        updateTableStatusBy: (data: TableStatus): Promise<TableStatus> => fetchData("/updateTableStatusBy", data),
        insertTableStatus: (data: TableStatus): Promise<TableStatus> => fetchData("/insertTableStatus", data),
        deleteTableStatusBy: (data: { table_status_id: string }): Promise<{ table_status_id: string }> => fetchData("/deleteTableStatusBy", data),
    };
};
