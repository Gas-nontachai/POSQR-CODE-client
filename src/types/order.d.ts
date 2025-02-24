export type Order = {
    order_id: string,
    table_id: string,
    bill_id: string,
    order_status: string,
    order_items: {
        cart_id: string,
    }[],
    order_time: Date | string
}
