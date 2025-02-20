import React, { ChangeEvent, useEffect, useState } from "react";
import { User } from "@/types/user";
import { useUser } from "@/hooks/useUser";
import Swal from "sweetalert2";

interface UpdateUserFormProps {
    user: User[];
    onClose: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, onClose }) => {

    console.log(user);


    const [updatedUser, setUpdatedUser] = useState<User | null>(null);

    useEffect(() => {
        if (user.length > 0) {
            setUpdatedUser(user[0]);
        }
    }, [user]);

    const { getUserBy, updateUserBy } = useUser();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (updatedUser) {
            const { name, value } = e.target;
            setUpdatedUser({
                ...updatedUser,
                [name]: value
            });
        }
    };

    const onUpdate = async () => {
        if (updatedUser) {
            try {
                await updateUserBy(updatedUser);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'User updated successfully',
                    showConfirmButton: false,
                    timer: 1500,
                    toast: true
                });
                await getUserBy();
                onClose();
            } catch (error) {
                console.error("Error updating user:", error);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to update user',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm absolute top-3 right-3"
                >
                    X
                </button>
                <h2 className="text-xl font-semibold mb-4">Update User</h2>
                {updatedUser && (
                    <form onSubmit={(e) => { e.preventDefault(); onUpdate(); }}>
                        <div className="mb-4">
                            <label htmlFor="fullname" className="block text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                name="user_fullname"
                                value={updatedUser.user_fullname}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="user_email"
                                value={updatedUser.user_email}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="user_phone"
                                value={updatedUser.user_phone}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg text-sm">Save</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateUserForm;
