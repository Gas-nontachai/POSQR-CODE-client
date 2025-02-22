"use client"
import React, { useState, useEffect } from "react";
import { useTableStatus } from "@/hooks/useTableStatus";
import { TableStatus } from "@/types/table-status";
import { Add } from "@mui/icons-material";
import { DocumentCheckIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import { CircularProgress } from '@mui/material';

const ManageTableStatusPage: React.FC = () => {
    const { getTableStatusBy, insertTableStatus, deleteTableStatusBy, updateTableStatusBy } = useTableStatus();
    const [newTableStatus, setNewTableStatus] = useState<TableStatus>({
        table_status_id: "",
        table_status_name: "",
    });
    const [FetchCate, setFetchCate] = useState<TableStatus[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getTableStatusBy();
            setFetchCate(Array.isArray(res) ? res : [res]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTableStatus({ ...newTableStatus, table_status_name: e.target.value });
    };

    const validateForm = (table_status_name: string) => {
        if (!table_status_name.trim()) {
            Swal.fire("Error", "กรุณากรอกชื่อ TableStatus", "warning");
            return false;
        }
        return true;
    };
    const validateDuplicate = async (table_status_name: string) => {
        const res = await getTableStatusBy();
        const isDuplicate = res.some((status: TableStatus) =>
            status.table_status_name.trim().toLowerCase() === table_status_name.trim().toLowerCase()
        );
        if (isDuplicate) {
            Swal.fire("Error", "ชื่อสถานะนี้มีอยู่แล้ว", "warning");
            setNewTableStatus({ table_status_id: "", table_status_name: "" });
            return false;
        }
        return true;
    }

    const onSubmit = async () => {
        if (!await validateDuplicate(newTableStatus.table_status_name)) {
            return;
        }
        if (!await validateForm(newTableStatus.table_status_name)) {
            return;
        }
        try {
            const TableStatus = { ...newTableStatus };
            await insertTableStatus(TableStatus);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "เพิ่มสถานะเรียบร้อย",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            setNewTableStatus({ table_status_id: "", table_status_name: "" });
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async (table_status_id: string) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบสถานะนี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบเลย!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteTableStatusBy({ table_status_id });
                Swal.fire("Deleted!", "ลบสถานะเรียบร้อยแล้ว", "success");
                await fetchData();
            }
        });
    };

    const onUpdate = async (table_status_id: string) => {
        const TableStatusToUpdate = FetchCate.find(TableStatus => TableStatus.table_status_id === table_status_id);
        if (TableStatusToUpdate) {
            const { value: newTableStatusName } = await Swal.fire({
                title: 'แก้ไขสถานะ',
                input: 'text',
                inputLabel: 'ชื่อสถานะใหม่',
                inputValue: TableStatusToUpdate.table_status_name,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'กรุณากรอกชื่อสถานะ';
                    }
                }
            });

            if (newTableStatusName) {
                const updatedTableStatus = { ...TableStatusToUpdate, table_status_name: newTableStatusName };
                await updateTableStatusBy(updatedTableStatus);
                Swal.fire('สำเร็จ', 'แก้ไขสถานะเรียบร้อย', 'success');
                await fetchData();
            }
        }
    };

    return (
        <div className="container mx-auto my-10 p-5 max-w-3xl bg-white shadow-lg rounded-lg">
            <h1 className=" border-gray-200 bg-slate-100 text-gray-900 text-center p-4 rounded-xl text-2xl font-bold flex items-center justify-center gap-2">
                <DocumentCheckIcon className="w-10 h-10" />
                จัดการสถานะ
            </h1>
            <div className="flex gap-3 mt-5">
                <input
                    type="text"
                    name="table_status_name"
                    value={newTableStatus.table_status_name}
                    onChange={onChangeInput}
                    placeholder="เพิ่มสถานะใหม่"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={onSubmit}
                    className="bg-green-500 flex text-white px-5 py-2 rounded-md hover:bg-green-600"
                >
                    <Add />เพิ่ม
                </button>
            </div>
            <h3 className="text-lg flex gap-1 justify-start items-center font-semibold mt-5 mb-2 text-blue-500">
                <DocumentCheckIcon className="w-7 h-7" />รายการสถานะ
            </h3>
            {loading ? (
                <div className="flex justify-center items-center my-10">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {FetchCate.length > 0 ? (
                        <div className="bg-gray-100 p-3 rounded-md h-auto max-h-96 overflow-y-auto">
                            <ul>
                                {FetchCate.map((item) => (
                                    <li
                                        key={item.table_status_id}
                                        className="flex justify-between items-center bg-white p-2 rounded-md mb-2 shadow"
                                    >
                                        <span className="text-gray-700">{item.table_status_name}</span>
                                        <div className="flex gap-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                                onClick={() => onUpdate(item.table_status_id)}
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.table_status_id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                            >
                                                ลบ
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">ไม่มีสถานะ</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageTableStatusPage;
