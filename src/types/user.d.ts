export type User = {
    user_id: string,
    user_fullname: string,
    user_email: string,
    user_phone: string,
    user_password: string,
    user_img?: string | File,
    user_role_id: string,
    add_date?: Date | string
}
