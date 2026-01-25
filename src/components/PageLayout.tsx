import React from "react";

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
            </div>
        </div>
    );
};

export default PageLayout;