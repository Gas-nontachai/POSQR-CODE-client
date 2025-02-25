"use client";
import React, { useState, useEffect } from "react";
import { useStores } from "@/hooks/hooks";
import { Stores } from "@/types/types";
import Swal from "sweetalert2";

const { getStoresBy } = useStores()


const ManageStoresPage = () => {

    const [data, setData] = useState<Stores[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getStoresBy()
        setData(res)
    }
    return (
        <>
            {data.map((item) => (
                <ul key={item.store_id}>
                    <li>{item.store_name}</li>
                    <li>{item.store_description}</li>
                </ul>
            ))}
        </>
    )
}
export default ManageStoresPage