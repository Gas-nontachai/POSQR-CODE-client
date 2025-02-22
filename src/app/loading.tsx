import React from 'react'
import { CircularProgress } from '@mui/material';

const loading = () => {
    return (
        <>
            <div className="container mx-auto flex justify-center items-center mt-10">
                <CircularProgress />
            </div>
        </>
    )
}

export default loading