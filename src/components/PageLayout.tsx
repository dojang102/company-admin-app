import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PageLayoutProps {
    title: string;      // ページタイトル
    children: React.ReactNode;
}

const PageLayout = ({ title, children }: PageLayoutProps) => {
    return (
        <div className='h-screen flex flex-col p-8 overflow-hidden'>
            {/* ページタイトル */}
            <div className='mb-8'>
                <h1 className='text-2xl font-bold'>{title}</h1>
            </div>
            {/* コンテンツ内容 */}
            <div className='flex-1 flex flex-col min-h-0'>
                {children}
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default PageLayout;