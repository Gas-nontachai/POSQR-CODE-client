import React, { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { User } from "@/types/user"
import { UserRole } from "@/types/user-role"
import Swal from "sweetalert2";
import { useUserRole } from "@/hooks/useUserRole";

interface UpdateUserFormProps {
    onClose: () => void,
    user_id: string
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ onClose, user_id }) => {
    const { getUserByID, updateUserBy } = useUser()
    const { getUserRoleBy } = useUserRole()
    const [showPassword, setShowPassword] = useState(false);
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
        fetchUser()
        fetchUserRole()
    }, [])

    const fetchUser = async () => {
        const res = await getUserByID({ user_id });
        setFormData(res);
    }

    const fetchUserRole = async () => {
        const res = await getUserRoleBy();
        setUserRole(Array.isArray(res) ? res : [res])
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserBy(formData);
            Swal.fire({
                title: "User updated successfully!",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });
            onClose()
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "An error occurred!",
                icon: "error",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
            });
        }
    };

    return (
        <>
            <h2 className="text-xl mb-4">Update User</h2>
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="user_password"
                            value={formData.user_password}
                            onChange={onChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-2 text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="user_img" className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        type="file"
                        name="user_img"
                        onChange={onChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="user_role_id" className="block text-sm font-medium text-gray-700">
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
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                        Update User
                    </button>
                </div>
            </form>
        </>
    )
}

export default UpdateUserForm
