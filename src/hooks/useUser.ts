"use client";
import axios from "axios";
import { User } from "@/types/user";
import { API_URL } from "@/utils/config";

export const useUser = () => {
    const fetchData = async (endpoint: string, payload: any = {}, useFormData: boolean = false) => {
        try {
            const method = "POST";
            const config: any = {
                method,
                url: `${API_URL}/user${endpoint}`,
                headers: {},
            };
            if (useFormData) {
                const formData = new FormData();
                Object.keys(payload).forEach((key) => {
                    if (payload[key] instanceof File) {
                        formData.append(key, payload[key]);
                    } else {
                        formData.append(key, String(payload[key]));
                    }
                });
                config.data = formData;
                config.headers["Content-Type"] = "multipart/form-data";
            } else {
                config.data = payload;
            }
            const response = await axios(config);
            return response.data;
        } catch (err: any) {
            console.error("Error:", err);
            return null;
        }
    };

    return {
        generateUserID: (): Promise<string> => fetchData("/generateUserID"),
        getUserBy:(data?: any): Promise<User[]> => fetchData("/getUserBy",data),
        getUserByID: (data: { user_id: string }): Promise<User> => fetchData("/getUserByID", data),
        updateUserBy: (data: User): Promise<User> => fetchData("/updateUserBy", data, true),
        insertUser: (data: User): Promise<User> => fetchData("/insertUser", data, true),
        deleteUserBy: (data: { user_id: string }): Promise<{ user_id: string }> => fetchData("/deleteUserBy", data),
    };
};
