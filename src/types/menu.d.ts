export type Menu = {
    menu_id: string,
    menu_name: string,
    menu_price: number,
    menu_img: string | File,
    menu_status: string,
    menu_amount: number,
    category_name: string,
    add_date?: string | Date
}