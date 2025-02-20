export type Payment = {
    payment_id: string,
    order_id: string,
    amount: Number,
    payment_method: string,
    payment_status: string,
    payment_time: Date
}