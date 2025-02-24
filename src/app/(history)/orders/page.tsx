'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/date-func';

const HistoryOrdersPage = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [billId, setBillId] = useState('');
    const [status, setStatus] = useState('pending');
    const router = useRouter();

    useEffect(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        setEndDate(formatDate(today, 'yyyy-MM-dd'));
        setStartDate(formatDate(sevenDaysAgo, 'yyyy-MM-dd'));
    }, []);

    const handleFilter = () => {
        console.log('Filtering orders between', startDate, 'and', endDate, 'with bill ID', billId, 'and status', status);
    };

    const handleDetailClick = (orderId: string) => {
        router.push(`/order-details/${orderId}`);
    };

    return (
        <Container maxWidth="lg" className="py-8">
            <Box className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-center text-2xl font-semibold mb-4">
                    Order History
                </h1>

                {/* Date Filter */}
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

                    {/* Search Bill ID */}
                    <div className="flex space-x-4">
                        <TextField
                            label="Search Bill ID"
                            value={billId}
                            onChange={(e) => setBillId(e.target.value)}
                            className="w-40"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFilter}
                            className="ml-4"
                        >
                            Apply Filter
                        </Button>
                    </div>
                </div>

                <Tabs
                    value={status}
                    onChange={(event, newValue) => setStatus(newValue)}
                    aria-label="order status tabs"
                    className="mb-6"
                >
                    <Tab label="Pending" value="pending" />
                    <Tab label="Success" value="success" />
                </Tabs>

                <div className="space-y-4">
                    {status === 'pending' && (
                        <>
                            <div className="border-b pb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="font-medium">Order #12345</h2>
                                    <p>Date: January 25, 2025</p>
                                    <p>Total: $45.00</p>
                                </div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDetailClick('12345')} // Pass order ID
                                >
                                    View Details
                                </Button>
                            </div>

                            <div className="border-b pb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="font-medium">Order #12346</h2>
                                    <p>Date: February 15, 2025</p>
                                    <p>Total: $30.00</p>
                                </div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDetailClick('12346')} // Pass order ID
                                >
                                    View Details
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="border-b pb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="font-medium">Order #12347</h2>
                                    <p>Date: February 20, 2025</p>
                                    <p>Total: $55.00</p>
                                </div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDetailClick('12347')} // Pass order ID
                                >
                                    View Details
                                </Button>
                            </div>

                            <div className="border-b pb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="font-medium">Order #12348</h2>
                                    <p>Date: February 21, 2025</p>
                                    <p>Total: $60.00</p>
                                </div>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDetailClick('12348')} // Pass order ID
                                >
                                    View Details
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Box>
        </Container>
    );
};

export default HistoryOrdersPage;
