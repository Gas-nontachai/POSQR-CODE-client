import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import Swal from "sweetalert2";

import { useStore } from "@/hooks/hooks";
import { Store } from "@/types/types";

const { getStoreByID, updateStoreBy } = useStore();

interface UpdateStoreFormProps {
    store_id: string;
    onClose: () => void;
}

const UpdateStoreForm: React.FC<UpdateStoreFormProps> = ({ store_id, onClose }) => {
    const [data, setData] = useState<Store>({
        store_id: '',
        store_name: '',
        store_slogan: '',
        store_description: '',
        store_address: '',
        store_price: 0,
        store_phone: '',
        store_img: '',
        store_logo: '',
        store_open: '',
        store_close: '',
        add_date: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await getStoreByID({ store_id });
        setData(res);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log(data); 
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'The store information has been updated successfully.',
                showConfirmButton: true
            });
            await updateStoreBy(data);
            onClose();
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Update Store</DialogTitle>
            <DialogContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="store_name" className="block">Store Name</label>
                        <TextField
                            fullWidth
                            id="store_name"
                            name="store_name"
                            value={data.store_name}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_slogan" className="block">Slogan</label>
                        <TextField
                            fullWidth
                            id="store_slogan"
                            name="store_slogan"
                            value={data.store_slogan}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_description" className="block">Description</label>
                        <TextField
                            fullWidth
                            id="store_description"
                            name="store_description"
                            value={data.store_description}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_address" className="block">Address</label>
                        <TextField
                            fullWidth
                            id="store_address"
                            name="store_address"
                            value={data.store_address}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_price" className="block">Price</label>
                        <TextField
                            fullWidth
                            type="number"
                            id="store_price"
                            name="store_price"
                            value={data.store_price}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_phone" className="block">Phone</label>
                        <TextField
                            fullWidth
                            id="store_phone"
                            name="store_phone"
                            value={data.store_phone}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_img" className="block">Image</label>
                        <TextField
                            fullWidth
                            type="file"
                            id="store_img"
                            name="store_img"
                            onChange={(e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                    setData({ ...data, store_img: file });
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_logo" className="block">Logo</label>
                        <TextField
                            fullWidth
                            type="file"
                            id="store_logo"
                            name="store_logo"
                            onChange={(e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                    setData({ ...data, store_logo: file });
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_open" className="block">Open Time</label>
                        <TextField
                            fullWidth
                            type="time"
                            id="store_open"
                            name="store_open"
                            value={data.store_open}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="store_close" className="block">Close Time</label>
                        <TextField
                            fullWidth
                            type="time"
                            id="store_close"
                            name="store_close"
                            value={data.store_close}
                            onChange={onChange}
                        />
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained" onClick={onSubmit}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateStoreForm;
