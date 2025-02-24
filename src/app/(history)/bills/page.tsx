'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, TextField, Button, Tabs, Tab, Pagination } from '@mui/material';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/date-func';
import { Bill, Payment } from '@/types/types';
import { useBill, usePayment } from '@/hooks/hooks';
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
    const [paymentData, setPaymentData] = useState<Payment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

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
            console.log(bill);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setloadingState(false);
        }
    };

    const handlePageChange = (event: any, value: any) => {
        setCurrentPage(value);
    };
    return (
        <>
            {loadingState && (
                <Loading />
            )}
            <Container maxWidth="lg" className="py-8">
                <Box className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-center text-2xl font-semibold mb-4">
                        Bill History
                    </h1>

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <TextField
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                className="w-40"
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                className="w-40"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <TextField
                                label="Search Bill ID"
                                value={searchBillId}
                                onChange={(e) => { setSearchBillId(e.target.value) }
                                }
                                className="w-40"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => fetchData(startDate, endDate, searchBillId)}
                                className="ml-4"
                            >
                                ค้นหาบิล
                            </Button>
                        </div>
                    </div>

                    <Tabs
                        value={status}
                        onChange={(e, newValue) => setStatus(newValue)}
                        aria-label="bill status tabs"
                        className="mb-6"
                    >
                        <Tab label="Pending" value="un-paid" />
                        <Tab label="Success" value="paid" />
                    </Tabs>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        className="mt-4"
                    />
                    <div className="space-y-4">
                        {paginatedData.length === 0 ? (
                            <p>ไม่มีข้อมูล</p>
                        ) : (
                            paginatedData.map((bill) => (
                                <div key={bill.bill_id} className="bbill-b pb-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="font-medium">หมายเลขบิล #{bill.bill_id}</h2>
                                        <p>วันที่ใช้บริการ : {formatDate(bill.add_date, 'dd/MM/yyyy HH:mm')}</p>
                                        <p>ผู้ใช้ : {parseFloat(bill.amount_customer)} คน </p>
                                        <p>หมายเลขโต๊ะ : {bill.table_number}</p>
                                    </div>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={async () => {
                                            current_bill_id.current = bill.bill_id;
                                            setIsPaymentDetail(true);
                                        }}
                                    >
                                        ดูรายละเอียดการชำระเงิน
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </Box>

                {isPaymentDetail && (
                    <DetailBillPayment bill_id={current_bill_id.current} onClose={() => setIsPaymentDetail(false)}></DetailBillPayment>
                )}
            </Container >
        </>
    );
};

export default HistoryBillsPage;
