export type Store = {
    store_id: string,
    store_name: string,
    store_slogan: string,
    store_description: string,
    store_address: string,
    store_price: number,
    store_phone: string,
    store_img: string | File,
    store_logo: string | File,
    store_open: string,
    store_close: string,
    add_date: Date | string,
}
