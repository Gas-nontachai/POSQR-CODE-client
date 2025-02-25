'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Pagination, TextField } from '@mui/material';
import { PointOfSale, Refresh } from '@mui/icons-material';
import { formatDate } from '@/utils/date-func';
import { Order, Table } from '@/types/types';
import { useOrder, useTable } from '@/hooks/hooks';
import Loading from '@/app/loading';
import DetailOrderCart from '@/components/(History)/Orders/DetailOrderCart';

const { getOrderBy, updateOrderBy } = useOrder();
const { getTableBy } = useTable();

const HistoryOrderPage = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [isCartDetail, setIsCartDetail] = useState(false);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [status, setStatus] = useState('pending');
    const [orderData, setOrderData] = useState<Order[]>([]);
    const [tableData, setTableData] = useState<Table[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Order[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const current_order_id = useRef('');
    useEffect(() => {
        setFilterDefault();
        loadTableData();
        fetchData(searchOrderId);
    }, []);

    useEffect(() => {
        changePagination();
    }, [orderData, currentPage, itemsPerPage, status]);

    const loadTableData = async () => {
        const res = await getTableBy()
        setTableData(res)
    };

    const changePagination = () => {
        const filteredData = status
            ? orderData.filter((order) => order.order_status === status)
            : orderData;
        setPaginatedData(filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    };

    const setFilterDefault = () => {
        setSearchOrderId('');
    };
    const fetchData = async (search: string = searchOrderId) => {
        try {
            setLoadingState(true);
            let filter: any = {};
            if (search.trim() !== '') {
                filter.$or = [{ order_id: { $regex: search, $options: 'i' } }];
            }
            const order = await getOrderBy(filter);
            if (order.length > 0) {
                setOrderData(order);
            }
            setLoadingState(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoadingState(false);
        }
    };

    const updateOrder = async (order_id: string) => {
        const updateOrderData = {
            order_id,
            table_id: '',
            bill_id: '',
            order_status: 'served',
            order_items: [],
            order_time: '',
        };
        try {
            await updateOrderBy(updateOrderData);
            await setIsCartDetail(false);
            await fetchData('');
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md h-screen overflow-auto">
                    <h1 className="text-center text-2xl font-semibold mb-4">Order History</h1>

                    {/* Filters & Search */}
                    <div className="flex justify-between items-center mb-6">

                        {/* Pagination */}
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                                color="primary"
                            />
                            <TextField
                                size="small"
                                type="number"
                                value={itemsPerPage}
                                sx={{ width: "80px" }}
                                onChange={(e) => {
                                    const newValue = Math.max(1, parseInt(e.target.value) || 1);
                                    setItemsPerPage(newValue);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Search Input */}
                        <div className="flex space-x-2 items-center">
                            <div className="flex-1">
                                <label htmlFor="searchOrderId" className="block text-sm font-medium text-gray-700">Search Order ID</label>
                                <input
                                    type="text"
                                    id="searchOrderId"
                                    value={searchOrderId}
                                    placeholder="Search Order ID..."
                                    onChange={(e) => setSearchOrderId(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            fetchData(searchOrderId);
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                />
                            </div>
                            <button
                                onClick={() => fetchData(searchOrderId)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                ค้นหาบิล
                            </button>
                        </div>
                    </div>

                    {/* Refresh & Tabs */}
                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setFilterDefault()
                                fetchData(searchOrderId)
                            }}
                            className="bg-blue-500 text-white px-3 py-2 mb-2 rounded-lg hover:bg-blue-600"
                        >
                            <Refresh /> รีเฟรช
                        </button>
                        <Tabs
                            value={status}
                            onChange={(event, newValue) => setStatus(newValue)}
                            aria-label="order status tabs"
                        >
                            <Tab label="Pending" value="pending" />
                            <Tab label="Served" value="served" />
                        </Tabs>
                    </div>

                    {/* Order List */}
                    <div className="space-y-4">
                        {loadingState ? (
                            <div className="flex flex-col justify-center items-center">
                                <Loading />
                                <p className='mt-2'>กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : paginatedData.length === 0 ? (
                            <p>ไม่มีข้อมูล</p>
                        ) : (
                            paginatedData.map((order) => (
                                <div key={order.order_id} className="pb-4 flex justify-between items-center border-b">
                                    <div>
                                        <h2 className="font-medium">หมายเลขบิล #{order.order_id}</h2>
                                        <p>เวลารับออเดอร์ : {formatDate(order.order_time, 'HH:mm (dd/MM/yyyy)')}</p>
                                        <p>
                                            หมายเลขโต๊ะ : {
                                                tableData.find(table => table.table_id === order.table_id)?.table_number || "ไม่พบข้อมูล"
                                            }
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            current_order_id.current = order.order_id;
                                            setIsCartDetail(true);
                                        }}
                                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
                                    >
                                        <PointOfSale /> (ดูรายละเอียดออเดอร์)
                                    </button>
                                </div>

                            ))
                        )}
                    </div>

                    {isCartDetail && (
                        <DetailOrderCart order_id={current_order_id.current} onClose={() => setIsCartDetail(false)} onServed={updateOrder} />
                    )}
                </div>
            </div >
        </>
    );
};

export default HistoryOrderPage;
