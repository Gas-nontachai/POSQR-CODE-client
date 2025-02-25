import React from 'react';
import Link from 'next/link';

const CustomerHomePage = () => {
    return (
        <div className="bg-[#3fc979] h-screen flex flex-col items-center justify-center text-white">
            <img className="w-72 h-72 mb-6 rounded-full object-cover" src="https://transcode-v2.app.engoo.com/image/fetch/f_auto,c_lfill,w_300,dpr_3/https://assets.app.engoo.com/images/x7jPxj9YtJfv97hnC3mMmQog5VwuYojZ7tlrhczGXIV.jpeg" alt="description" />
            <h1 className="font-bold text-2xl mb-6">Food Ordering App</h1>
            {/* <Link href="/home">
                <button className="px-16 font-bold py-2 bg-[#DCC7C6] text-black rounded-3xl hover:bg-[#bdaaa9]">
                    Get a Meal
                </button>
            </Link> */}
        </div>
    );
}

export default CustomerHomePage;
