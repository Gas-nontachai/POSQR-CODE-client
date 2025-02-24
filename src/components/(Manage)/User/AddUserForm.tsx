import { useUser } from "@/hooks/useUser";
import { useUserRole } from "@/hooks/useUserRole";
import { UserRole } from "@/types/user-role"
import { User } from "@/types/user"
import React, { useEffect, useState, useRef } from "react";

interface AddUserFormProps {
    onClose: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose }) => {
    const { insertUser } = useUser()
    const { getUserRoleBy } = useUserRole()
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState<User>({
        user_id: "",
        user_fullname: "",
        user_email: "",
        user_phone: "",
        user_password: "",
        user_img: "",
        user_role_id: "",
        add_date: ""
    });
    const [userRole, setUserRole] = useState<UserRole[]>([]);

    useEffect(() => {
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const res = await getUserRoleBy();
            setUserRole(Array.isArray(res) ? res : [res])
        } catch (error) {
            console.error(error);
        }
    };

    const onChange = (e: any) => {
        const { name, value, files } = e.target;
        if (name === "user_img" && files && files[0]) {
            setFormData((prevMenu) => ({
                ...prevMenu,
                [name]: files[0],
            }));
        } else {
            setFormData((prevMenu) => ({
                ...prevMenu,
                [name]: value,
            }));
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await insertUser(formData);
            // Swal.fire({
            //     title: "User added successfully!",
            //     icon: "success",
            //     toast: true,
            //     position: "top-end",
            //     timer: 3000,
            //     showConfirmButton: false
            // });
            // if (fileInputRef.current) {
            //     fileInputRef.current.value = '';
            // }
            // onClose()
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h2 className="text-xl mb-4">Add New User</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label htmlFor="user_fullname" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="user_fullname"
                        value={formData.user_fullname}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="user_email"
                        value={formData.user_email}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="user_phone"
                        value={formData.user_phone}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="text"
                        name="user_password"
                        value={formData.user_password}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_img" className="block text-sm font-medium text-gray-700">
                        Image URL
                    </label>
                    <input
                        type="file"
                        name="user_img"
                        ref={fileInputRef}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_role" className="block text-sm font-medium text-gray-700">
                        User Role
                    </label>
                    <select
                        name="user_role_id"
                        value={formData.user_role_id}
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        required
                    >
                        {userRole.map((role) => (
                            <option key={role.user_role_id} value={role.user_role_id}>
                                {role.user_role_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddUserForm;
