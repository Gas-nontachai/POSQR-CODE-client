"use client";
import axios from "axios";
import { User } from "@/types/user";
import { API_URL } from "@/utils/config";

export const useUser = () => {

    const fetchData = async (endpoint: string, payload: any = {}) => {
        try {
            const method = 'POST'
            const config = {
                method,
                url: `${API_URL}/user${endpoint}`,
                data: method === 'POST' ? payload : undefined,
            };

            console.log("payload", method, payload);

            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            return null;
        }
    };

    return {
        generateUserID: (): Promise<string> => fetchData("/generateUserID"),
        getUserBy: (): Promise<any> => fetchData("/getUserBy"),
        getUserByID: (data: { user_id: string }): Promise<any> => fetchData("/getUserByID", data),
        updateUserBy: (data: User): Promise<any> => fetchData("/updateUserBy", data),
        insertUser: (data: User): Promise<User> => fetchData("/insertUser", data),
        deleteUserBy: (data: { user_id: string }): Promise<any> => fetchData("/deleteUserBy", data),
    };
};
