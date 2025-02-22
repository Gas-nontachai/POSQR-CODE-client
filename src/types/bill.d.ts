export type Bill = {
    bill_id: string,
    table_id: string,
    table_number: string,
    amount_customer: string,
    bill_status: string,
    qr_code: string,
    start_time: Date | string,
    expired_time: Date | string,
    add_date: Date | string
}