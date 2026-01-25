import React from 'react';
import { Users, CalendarCheck, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/employees') {
            return location.pathname.startsWith('/employees');
        }
        return location.pathname === path
    };

    const getNavStyle = (path: string) => {
        const isCurrent = isActive(path);
        const baseStyle = 'flex items-center w-full gap-3 px-3 py-2 rounded-sm hover:bg-zinc-700';
        const activeStyle = 'bg-zinc-700 text-white shadow-sm ring-1 ring-white/10';
        const inactiveStyle = 'text-zinc-400 hover:bg-zinc-700 hover:text-white';

        return `${baseStyle} ${isCurrent ? activeStyle : inactiveStyle}`;
    };

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
                            <button
                                onClick={() => navigate('/employees')}
                                className={getNavStyle('/employees')}
                            >
                                <Users size={18} />
                                <span>社員リスト</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate('/attendance')}
                                className={getNavStyle('/attendance')}
                            >
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