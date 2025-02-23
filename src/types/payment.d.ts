export type Payment = {
    payment_id: string,
    bill_id: string,
    table_id: string,
    amount_total: Number,
    payment_method: string,
    payment_status: string,
    payment_time: Date | string
}