import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Search, Plus } from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    furigana: string;
    department: string;
    position: string;
    email: string;
    status: '在籍' | '休職中';
}

const employees: Employee[] = [
    { id: '1', name: '田中 太郎', furigana: 'タナカ タロウ', department: '開発部', position: '部長', email: 'tanaka@example.com', status: '在籍' },
    { id: '2', name: '佐藤 花子', furigana: 'サトウ ハナコ', department: '人事部', position: '社員', email: 'sato@example.com', status: '在籍' },
    { id: '3', name: '鈴木 一郎', furigana: 'スズキ イチロウ', department: '営業部', position: '係長', email: 'suzuki@example.com', status: '休職中' },
    { id: '4', name: '高橋 健二', furigana: 'タカハシ ケンジ', department: '開発部', position: '課長', email: 'takahashi.k@example.com', status: '在籍' },
    { id: '5', name: '伊藤 恵子', furigana: 'イトウ ケイコ', department: '総務部', position: '社員', email: 'ito.k@example.com', status: '在籍' },
    { id: '6', name: '渡辺 誠', furigana: 'ワタナベ マコト', department: '開発部', position: '社員', email: 'watanabe.m@example.com', status: '在籍' },
    { id: '7', name: '山本 裕子', furigana: 'ヤマモト ユウコ', department: '営業部', position: '課長', email: 'yamamoto.y@example.com', status: '在籍' },
    { id: '8', name: '中村 俊介', furigana: 'ナカムラ シュンスケ', department: 'マーケティング部', position: '社員', email: 'nakamura.s@example.com', status: '在籍' },
    { id: '9', name: '小林 直樹', furigana: 'コバヤシ ナオキ', department: '開発部', position: '係長', email: 'kobayashi.n@example.com', status: '休職中' },
    { id: '10', name: '加藤 真由美', furigana: 'カトウ マユミ', department: '人事部', position: '課長', email: 'kato.m@example.com', status: '在籍' },
    { id: '11', name: '吉田 拓也', furigana: 'ヨシダ タクヤ', department: '営業部', position: '社員', email: 'yoshida.t@example.com', status: '在籍' },
    { id: '12', name: '山田 杏奈', furigana: 'ヤマダ アンナ', department: '総務部', position: '社員', email: 'yamada.a@example.com', status: '在籍' },
    { id: '13', name: '佐々木 亮', furigana: 'ササキ リョウ', department: '開発部', position: '社員', email: 'sasaki.r@example.com', status: '在籍' },
    { id: '14', name: '山口 祥子', furigana: 'ヤマグチ ショウコ', department: 'マーケティング部', position: '部長', email: 'yamaguchi.s@example.com', status: '在籍' },
    { id: '15', name: '松本 潤', furigana: 'マツモト ジュン', department: '営業部', position: '社員', email: 'matsumoto.j@example.com', status: '在籍' },
    { id: '16', name: '井上 舞', furigana: 'イノウエ マイ', department: '人事部', position: '社員', email: 'inoue.m@example.com', status: '在籍' },
    { id: '17', name: '木村 浩一', furigana: 'キムラ コウイチ', department: '開発部', position: '社員', email: 'kimura.k@example.com', status: '休職中' },
    { id: '18', name: '林 結衣', furigana: 'ハヤシ ユイ', department: '総務部', position: '係長', email: 'hayashi.y@example.com', status: '在籍' },
    { id: '19', name: '斎藤 隆', furigana: 'サイトウ タカシ', department: '営業部', position: '社員', email: 'saito.t@example.com', status: '在籍' },
    { id: '20', name: '清水 健太', furigana: 'シミズ ケンタ', department: '開発部', position: '社員', email: 'shimizu.k@example.com', status: '在籍' },
    { id: '21', name: '佐藤 健太', furigana: 'サトウ ケンタ', department: '開発部', position: '社員', email: 'sato.k@example.com', status: '在籍' },
    { id: '22', name: '佐藤 翔太', furigana: 'サトウ ショウタ', department: '営業部', position: '社員', email: 'sato.s@example.com', status: '在籍' },
    { id: '23', name: '田中 志保', furigana: 'タナカ シホ', department: 'マーケティング部', position: '係長', email: 'tanaka.s@example.com', status: '在籍' },
];

const EmployeeListPage = () => {
    const [inputSearch, setInputSearch] = useState('');
    const [tableItems, setTableItems] = useState(employees);

    const searchedEmployees = tableItems.filter(item =>
        item.name.includes(inputSearch) ||
        item.furigana.includes(inputSearch)
    )

    useEffect(() => {
        console.log(inputSearch);
    })
    return (
        <PageLayout
            title='社員リスト'
        >
            <div className='flex justify-between items-center py-4'>
                <div className='relative w-80'>
                    <div className='absolute inset-y-0 left-2 flex items-center'>
                        <Search size={18} className='text-zinc-400' />
                    </div>
                    <input
                        type='text'
                        className='block w-96 pl-10 pr-3 py-2 bg-white rounded-xl border border-zinc-200 focus:outline-none'
                        onChange={(e) => setInputSearch(e.target.value)}
                    />
                </div>
                <button className='flex px-4 py-2 items-center justify-center bg-zinc-800 rounded-lg text-white'>
                    <Plus size={18} />
                    <span className='pl-2'>社員を追加</span>
                </button>
            </div>
            <div className='flex-1 relative overflow-x-auto overflow-y-auto bg-white rounded-xl border-zinc-200 shadow-sm'>
                <table className='w-full border-collapse text-left'>
                    <thead>
                        <tr className='sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]'>
                            <th className='px-6 py-4 text-sm font-semibold'>名前</th>
                            <th className='px-6 py-4 text-sm font-semibold'>フリガナ</th>
                            <th className='px-6 py-4 text-sm font-semibold'>部署</th>
                            <th className='px-6 py-4 text-sm font-semibold'>役職</th>
                            <th className='px-6 py-4 text-sm font-semibold'>メールアドレス</th>
                            <th className='px-6 py-4 text-sm font-semibold'>ステータス</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-zinc-100'>
                        {searchedEmployees.map((employee) => (
                            <tr key={employee.id} className='hover:bg-zinc-200 transition-colors'>
                                <td className='px-6 py-4 text-sm'>{employee.name}</td>
                                <td className='px-6 py-4 text-sm'>{employee.furigana}</td>
                                <td className='px-6 py-4 text-sm'>{employee.department}</td>
                                <td className='px-6 py-4 text-sm'>{employee.position}</td>
                                <td className='px-6 py-4 text-sm'>{employee.email}</td>
                                <td className='px-6 py-4 text-sm'>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${employee.status === '在籍' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'
                                        }`}>
                                        {employee.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    )
}

export default EmployeeListPage;