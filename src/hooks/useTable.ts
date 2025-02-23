"use client";
import axios from "axios";
import { Table } from "@/types/table";
import { API_URL } from "@/utils/config";

export const useTable = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/table${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generateTableID: (): Promise<string> => fetchData("/generateTableID"),
        getTableBy:(data?: any): Promise<Table[]> => fetchData("/getTableBy",data),
        getTableByID: (data: { table_id: string }): Promise<Table> => fetchData("/getTableByID", data),
        updateTableBy: (data: Table): Promise<Table> => fetchData("/updateTableBy", data),
        insertTable: (data: Table): Promise<Table> => fetchData("/insertTable", data),
        deleteTableBy: (data: { table_id: string }): Promise<any> => fetchData("/deleteTableBy", data),
    };
};
