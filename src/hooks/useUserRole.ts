"use client";
import axios from "axios";
import { UserRole } from "@/types/user-role";
import { API_URL } from "@/utils/config";

export const useUserRole = () => {
    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/userrole${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };
    return {
        generateUserRoleID: (): Promise<string> => fetchData("/generateUserRoleID"),
        getUserRoleBy: (): Promise<UserRole> => fetchData("/getUserRoleBy"),
        getUserRoleByID: (data: { userrole_id: string }): Promise<{ userrole_id: string }> => fetchData("/getUserRoleByID", data),
        updateUserRoleBy: (data: UserRole): Promise<UserRole> => fetchData("/updateUserRoleBy", data),
        insertUserRole: (data: UserRole): Promise<UserRole> => fetchData("/insertUserRole", data),
        deleteUserRoleBy: (data: { userrole_id: string }): Promise<{ userrole_id: string }> => fetchData("/deleteUserRoleBy", data),
    };
};
