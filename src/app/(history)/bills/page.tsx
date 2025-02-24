'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Pagination } from '@mui/material';
import {
    PointOfSale, Refresh
} from '@mui/icons-material';
import { formatDate } from '@/utils/date-func';
import { Bill } from '@/types/types';
import { useBill } from '@/hooks/hooks';
import Loading from '@/app/loading';
import DetailBillPayment from '@/components/(History)/Bills/DetailBillPayment'

const { getBillBy, } = useBill();

const HistoryBillsPage = () => {
    const [loadingState, setloadingState] = useState(false);
    const [isPaymentDetail, setIsPaymentDetail] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchBillId, setSearchBillId] = useState('');
    const [status, setStatus] = useState('paid');
    const [billData, setBillData] = useState<Bill[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const current_bill_id = useRef('')

    const paginatedData = billData
        .filter((bill) => bill.bill_status === status)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalPages = Math.ceil(billData.filter((bill) => bill.bill_status === status).length / itemsPerPage);

    useEffect(() => {
        setFilterDefault()
    }, []);

    useEffect(() => {
        fetchData(startDate, endDate, searchBillId);
    }, [startDate, endDate]);

    const setFilterDefault = () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        setEndDate(formatDate(today, 'yyyy-MM-dd'));
        setStartDate(formatDate(sevenDaysAgo, 'yyyy-MM-dd'));
    }

    const fetchData = async (startdate: string, enddate: string, search: string) => {
        try {
            setloadingState(true);
            let filter: any = {
                add_date: {
                    $gte: new Date(startdate),
                    $lte: new Date(enddate),
                }
            };
            if (search.trim() !== '') {
                filter.$or = [
                    { bill_id: search },
                ];
            }
            const bill = await getBillBy(filter);
            setBillData(bill); 
            setTimeout(() => {
                setloadingState(false);
            }, 500);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handlePageChange = (value: any) => {
        setCurrentPage(value);
    };
    return (
        <>
            <div className="container mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md h-screen overflow-auto">
                    <h1 className="text-center text-2xl font-semibold mb-4">Bill History</h1>
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

                        <div className="mt-4 flex justify-center">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                                color="primary"
                                className="flex items-center space-x-2"
                            />
                        </div>

                        <div className="flex space-x-2 items-center">
                            <div className="flex-1">
                                <label htmlFor="searchBillId" className="block text-sm font-medium text-gray-700">Search Bill ID</label>
                                <input
                                    type="text"
                                    id="searchBillId"
                                    value={searchBillId}
                                    placeholder='Search Bill ID....'
                                    onChange={(e) => setSearchBillId(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => fetchData(startDate, endDate, searchBillId)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                ค้นหาบิล
                            </button>
                        </div>

                    </div>

                    <div className="mb-6">
                        <button
                            onClick={setFilterDefault}
                            className="bg-blue-500 text-white px-3 py-2 mb-2 rounded-lg hover:bg-blue-600 transition-all"
                        >
                            <Refresh /> รีเฟรช
                        </button>
                        <div className="mb-6">
                            <Tabs
                                value={status}
                                onChange={(event, newValue) => setStatus(newValue)}
                                aria-label="bill status tabs"
                                className="space-x-4"
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab
                                    label="Pending"
                                    value="un-paid"
                                    className="text-lg font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 focus:outline-none"
                                />
                                <Tab
                                    label="Success"
                                    value="paid"
                                    className="text-lg font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100 focus:outline-none"
                                />
                            </Tabs>
                        </div>
                    </div>


                    <div className="space-y-4">
                        {loadingState ? (
                            <>
                                <div className="flex flex-col justify-start items-center">
                                    {loadingState && <Loading />}
                                    <p className='mt-2'>กำลังโหลดข้อมูล...</p>
                                </div>
                            </>
                        ) : paginatedData.length === 0 ? (
                            <p>ไม่มีข้อมูล</p>
                        ) : (
                            paginatedData.map((bill) => (
                                <div key={bill.bill_id} className="pb-4 flex justify-between items-center border-b">
                                    <div>
                                        <h2 className="font-medium">หมายเลขบิล #{bill.bill_id}</h2>
                                        <p>วันที่ใช้บริการ : {formatDate(bill.add_date, 'dd/MM/yyyy HH:mm')}</p>
                                        <p>ผู้ใช้ : {parseFloat(bill.amount_customer)} คน</p>
                                        <p>หมายเลขโต๊ะ : {bill.table_number}</p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            current_bill_id.current = bill.bill_id;
                                            setIsPaymentDetail(true);
                                        }}
                                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                    >
                                        <PointOfSale />
                                        <span>(ดูรายละเอียดการชำระเงิน)</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                </div>

                {isPaymentDetail && (
                    <DetailBillPayment bill_id={current_bill_id.current} onClose={() => setIsPaymentDetail(false)} />
                )}
            </div>
        </>
    );
};

export default HistoryBillsPage;