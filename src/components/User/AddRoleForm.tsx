import { useState } from 'react';

interface AddRoleFormProps {
    onClose: () => void;
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ onClose }) => {
    const [roleName, setRoleName] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Role Name:', roleName);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm absolute top-3 right-3"
                >
                    X
                </button>
                <h2 className="text-xl font-semibold mb-4">Add Role</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">Role Name</label>
                        <input
                            type="text"
                            id="roleName"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter role name"
                            required
                        />
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            type="submit"
                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                        >
                            Add Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoleForm;

