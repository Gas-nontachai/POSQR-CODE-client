import { TextField, Button } from "@mui/material";
import { People } from '@mui/icons-material';
import React, { useState, useEffect } from "react";
import { Bill, Payment } from '@/types/types'
import { useBill, usePayment } from "@/hooks/hooks";
import { formatDate } from "@/utils/date-func";
import Grid from '@mui/material/Grid2';

interface OpenTableProps {
    billData: Bill;
    currentTableNumber: string;
    currentTableID: string;
    changeTableStatus: (table_id: string, table_status: string) => void;
}

const OpenTable: React.FC<OpenTableProps> = ({ billData, currentTableNumber, currentTableID, changeTableStatus }) => {
    const { insertBill, generateBillID } = useBill();
    const { insertPayment } = usePayment();

    const price = 199

    const [newBill, setNewBill] = useState<Bill>({
        bill_id: '',
        table_id: '',
        table_number: '',
        amount_customer: '',
        bill_status: '',
        qr_code: '',
        start_time: '',
        expired_time: '',
        add_date: ''
    });

    const [newPayment, setNewPayment] = useState<Payment>({
        payment_id: '',
        bill_id: '',
        table_id: '',
        amount_total: 0,
        payment_method: '',
        payment_status: '',
        payment_time: ''
    });

    useEffect(() => {
        setNewBill(billData);
    }, [billData]);

    const handleChangeTableStatus = async (table_id: string, table_status: string) => {
        await changeTableStatus(table_id, table_status);
    };

    const handleOpenTable = async () => {
        if (newBill.amount_customer.trim() === "") {
            alert("กรุณากรอกจำนวนลูกค้า");
            return;
        }
        const bill_id = await generateBillID()
        const updatedBill = {
            ...newBill,
            bill_id: bill_id,
            table_id: currentTableID,
            table_number: currentTableNumber,
            qr_code: `http://localhost:3000/home?table_id=${currentTableID}&table_number=${currentTableNumber}&bill_id=${bill_id}`,
            bill_status: "un-paid",
            start_time: formatDate(new Date(), 'yyyy-MM-dd HH:mm'),
            expired_time: formatDate(new Date(new Date().getTime() + 90 * 60000), 'yyyy-MM-dd HH:mm'),
            add_date: formatDate(new Date(), 'yyyy-MM-dd HH:mm'),
        };
        const res = await insertBill(updatedBill);
        const updatedPayment = {
            ...newPayment,
            bill_id: res.bill_id,
            table_id: currentTableID,
            amount_total: Number(res.amount_customer) * price,
            payment_status: "un-paid"
        };
        setNewPayment(updatedPayment);
        await insertPayment(updatedPayment)
        await handleChangeTableStatus(currentTableID, "กำลังใช้งาน");
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <span>เปิดใช้งานโต๊ะ: {currentTableNumber}</span>
                </Grid>
                <Grid size={6}>
                    <span>เวลาเปิดบิล: {formatDate(new Date(), 'dd/MM/yyyy HH:mm')}</span>
                </Grid>
                <Grid size={6}>
                    <span>เวลาเริ่มทาน: {formatDate(new Date(), 'HH:mm (dd/MM/yyyy)')}</span>
                </Grid>
                <Grid size={6}>
                    <span>เวลาหมดอายุ: {formatDate(new Date(new Date().getTime() + 90 * 60000), 'HH:mm (dd/MM/yyyy)')}</span>
                </Grid>
                <Grid size={6}>
                    <TextField
                        onChange={(event) =>
                            setNewBill((prevState) => ({
                                ...prevState,
                                amount_customer: event.target.value,
                            }))
                        }
                        value={newBill.amount_customer}
                        id="outlined-basic"
                        label="จำนวนลูกค้า"
                        variant="outlined"
                        type="number"
                        fullWidth
                    />
                </Grid>
                <Grid size={12}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleOpenTable}
                        fullWidth
                    >
                        <People /> <span className="ml-3">เปิดโต๊ะ</span>
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default OpenTable;
