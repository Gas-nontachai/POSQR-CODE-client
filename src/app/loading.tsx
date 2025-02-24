import React from 'react';
import { CircularProgress } from '@mui/material';

const Loading = () => {
    return (
        <div className="container mx-auto flex justify-center items-center mt-10">
            <CircularProgress />
        </div>
    );
};

export default Loading;
