'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Pagination, TextField } from '@mui/material';
import { PointOfSale, Refresh } from '@mui/icons-material';
import { formatDate } from '@/utils/date-func';
import { Bill } from '@/types/types';
import { useBill } from '@/hooks/hooks';
import Loading from '@/app/loading';
import DetailBillPayment from '@/components/(History)/Bills/DetailBillPayment';

const { getBillBy } = useBill();

const HistoryBillsPage = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [isPaymentDetail, setIsPaymentDetail] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchBillId, setSearchBillId] = useState('');
    const [status, setStatus] = useState('paid');
    const [billData, setBillData] = useState<Bill[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<Bill[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const current_bill_id = useRef('');

    useEffect(() => {
        setFilterDefault();
        changePagination();
    }, []);

    useEffect(() => {
        fetchData(startDate, endDate, searchBillId);
    }, [startDate, endDate]);

    useEffect(() => {
        changePagination();
    }, [billData, currentPage, itemsPerPage, status]);

    const changePagination = () => {
        const filteredData = billData.filter((bill) => bill.bill_status === status);
        setPaginatedData(filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    };

    const setFilterDefault = () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const newStartDate = formatDate(sevenDaysAgo, 'yyyy-MM-dd');
        const newEndDate = formatDate(today, 'yyyy-MM-dd');

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setSearchBillId('');

        fetchData(newStartDate, newEndDate, searchBillId);
    };

    const fetchData = async (startdate: string, enddate: string, search: string) => {
        try {
            setLoadingState(true);
            let filter: any = {
                add_date: {
                    $gte: new Date(startdate),
                    $lte: new Date(enddate),
                }
            };
            if (search.trim() !== '') {
                filter.$or = [
                    { bill_id: { $regex: search, $options: 'i' } },
                ];
            }
            const bill = await getBillBy(filter);
            setBillData(bill);
            setLoadingState(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoadingState(false);
        }
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md h-screen overflow-auto">
                    <h1 className="text-center text-2xl font-semibold mb-4">Bill History</h1>

                    {/* Filters & Search */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <div className="w-40">
                                <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="w-40">
                                <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>

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
                                <label htmlFor="searchBillId" className="block text-sm font-medium text-gray-700">Search Bill ID</label>
                                <input
                                    type="text"
                                    id="searchBillId"
                                    value={searchBillId}
                                    placeholder="Search Bill ID..."
                                    onChange={(e) => setSearchBillId(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            fetchData(startDate, endDate, searchBillId);
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                />
                            </div>
                            <button
                                onClick={() => fetchData(startDate, endDate, searchBillId)}
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
                                fetchData(startDate, endDate, searchBillId)
                            }}
                            className="bg-blue-500 text-white px-3 py-2 mb-2 rounded-lg hover:bg-blue-600"
                        >
                            <Refresh /> รีเฟรช
                        </button>
                        <Tabs
                            value={status}
                            onChange={(event, newValue) => setStatus(newValue)}
                            aria-label="bill status tabs"
                        >
                            <Tab label="Pending" value="un-paid" />
                            <Tab label="Success" value="paid" />
                        </Tabs>
                    </div>

                    {/* Bill List */}
                    <div className="space-y-4">
                        {loadingState ? (
                            <div className="flex flex-col justify-center items-center">
                                <Loading />
                                <p className='mt-2'>กำลังโหลดข้อมูล...</p>
                            </div>
                        ) : paginatedData.length === 0 ? (
                            <p>ไม่มีข้อมูล</p>
                        ) : (
                            paginatedData.map((bill) => (
                                <div key={bill.bill_id} className="pb-4 flex justify-between items-center border-b">
                                    <div>
                                        <h2 className="font-medium">หมายเลขบิล #{bill.bill_id}</h2>
                                        <p>วันที่ใช้บริการ : {formatDate(bill.add_date, 'dd/MM/yyyy HH:mm')}</p>
                                        <p>ผู้ใช้ : {bill.amount_customer} คน</p>
                                        <p>หมายเลขโต๊ะ : {bill.table_number}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            current_bill_id.current = bill.bill_id;
                                            setIsPaymentDetail(true);
                                        }}
                                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg"
                                    >
                                        <PointOfSale /> (ดูรายละเอียดการชำระเงิน)
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Payment Details Modal */}
                    {isPaymentDetail && (
                        <DetailBillPayment bill_id={current_bill_id.current} onClose={() => setIsPaymentDetail(false)} />
                    )}
                </div>
            </div>
        </>
    );
};

export default HistoryBillsPage;
