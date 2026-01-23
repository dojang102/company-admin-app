import React from 'react';
import { Users, CalendarCheck, LogOut } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className='flex min-h-screen'>

            <aside className='fixed inset-y-0 left-0 min-h-screen w-64 bg-zinc-800 text-white z-20'>
                {/* ロゴ部分 */}
                <div className='p-8 items-center'>
                    <strong>Company Admin</strong>
                </div>

                {/* ナビゲーションメニュー */}
                <nav className='p-4 flex-1'>
                    <ul className='space-y-2'>
                        <li>
                            <button className='flex items-center w-full gap-3 px-3 py-2 rounded-sm hover:bg-zinc-700'>
                                <Users size={18} />
                                <span>社員リスト</span>
                            </button>
                        </li>
                        <li>
                            <button className='flex items-center w-full gap-3 px-3 py-2 rounded-sm hover:bg-zinc-700'>
                                <CalendarCheck size={18} />
                                <span>出席・休職管理</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* 下部のボタン */}
                <div className='absolute bottom-0 w-full p-4'>
                    {/* <div className='flex items-center'>
                        <div className='w-10 h-10 bg-sky-500 rounded-full'>写真</div>
                        <div>プロフィール</div>
                    </div> */}
                    <button className='flex items-center w-full gap-3 px-3 py-2 rounded-sm hover:bg-zinc-700'>
                        <LogOut size={18} />
                        <span>ログアウト</span>
                    </button>
                </div>
            </aside>

            <main className='flex-1 ml-64 min-h-screen bg-slate-50'>
                {/* ページ内容 */}
                {children}
            </main>

        </div>
    );
};

export default Layout;