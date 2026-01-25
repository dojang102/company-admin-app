import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Search, Plus, ChevronUp, ChevronDown, X } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export interface Employee {
    id: string;
    name: string;
    furigana: string;
    department: string;
    position: string;
    email: string;
    status: '在籍' | '休職中';
}

export const employees: Employee[] = [
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

export const DEPARTMENTS = ['開発部', '営業部', '人事部', '総務部', 'マーケティング部'] as const;
export const POSITIONS = ['部長', '課長', '係長', '主任', '社員'] as const;

const employeeValidation = z.object({
    name: z.string().min(1, '名前は必須です'),
    furigana: z.string().min(1, 'フリガナは必須です').regex(/^[ァ-ヶー\s]+$/, '全角カタカナで入力してください'),
    department: z.string().min(1, '部署を選択してください'),
    position: z.string().min(1, '役職を選択してください'),
    email: z.string().min(1, 'メールアドレス必須です').email('正しいメール形式で入力してください'),
    status: z.enum(['在籍', '休職中']),
});

type EmployeeFormData = z.infer<typeof employeeValidation>;

// メイン
const EmployeeListPage = () => {
    const [inputSearch, setInputSearch] = useState('');         // input value
    // const [tableItems, setTableItems] = useState(employees);    // 社員データー
    const [tableItems, setTableItems] = useState<Employee[]>(() => {
        const saved = localStorage.getItem('employee-data');

        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return employees;
            }
        }
        localStorage.setItem('employee-data', JSON.stringify(employees));
        return employees;
    });    // 社員データー

    const tableHeaders: { key: keyof Employee; label: string; }[] = [
        { key: 'name', label: '名前' },
        { key: 'furigana', label: 'フリガナ' },
        { key: 'department', label: '部署' },
        { key: 'position', label: '役職' },
        { key: 'email', label: 'メールアドレス' },
        { key: 'status', label: 'ステータス' },
    ];

    type SortOrder = 'asc' | 'desc' | null;

    const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; order: SortOrder }>({
        key: 'id',
        order: null,
    });

    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const navigate = useNavigate();

    // ソートアイコンcss制御
    const SortIcon = ({ columnKey }: { columnKey: keyof Employee }) => {
        const isCorrectColumn = sortConfig.key === columnKey;
        const isAsc = isCorrectColumn && sortConfig.order === 'asc';
        const isDesc = isCorrectColumn && sortConfig.order === 'desc';

        return (
            <div className="flex flex-col ml-1">
                <ChevronUp
                    size={12}
                    className={isAsc ? 'text-zinc-900' : 'text-zinc-400'}
                />
                <ChevronDown
                    size={12}
                    className={isDesc ? 'text-zinc-900' : 'text-zinc-400'}
                />
            </div>
        )
    }

    // ソート機能
    const handleSort = (key: keyof Employee) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                if (prev.order === 'asc') {
                    return { key, order: 'desc' };
                }
                if (prev.order === 'desc') {
                    return { key, order: null };
                }
            }
            return { key, order: 'asc' };
        });
    };

    const searchedEmployees = tableItems
        // 検索結果
        .filter(item => {
            // ひらがなカタカナどっちでも検索可能
            const hiraToKana = (str: string) =>
                str.replace(/[\u3041-\u3096]/g, m => String.fromCharCode(m.charCodeAt(0) + 0x60));

            // 空白無視
            const noSpace = (str: string) =>
                hiraToKana(str.replace(/\s+/g, ""));

            // input valueの空白無視
            const query = noSpace(inputSearch);
            if (!query) return true;

            // employeesの各項目の空白無視
            const queryName = noSpace(item.name);
            const queryFurigana = noSpace(item.furigana);

            // 名前 || ふりがな
            return (
                queryName.includes(query) ||
                queryFurigana.includes(query)
            );
        })
        // ソート結果
        .sort((a, b) => {
            if (!sortConfig.order) return 0;

            const aValue = String(a[sortConfig.key]);
            const bValue = String(b[sortConfig.key]);

            if (sortConfig.order === 'asc') {
                return aValue.localeCompare(bValue, 'ja');
            } else {
                return bValue.localeCompare(aValue, 'ja');
            }
        });

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeValidation),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            furigana: '',
            department: '',
            position: '',
            email: '',
            status: '在籍',
        },
    });

    const watchedValues = watch();

    // 登録保存機能
    const onSubmit = (data: EmployeeFormData) => {
        const newEmployee: Employee = {
            ...data,
            id: crypto.randomUUID(),
        };

        const updatedItems = [newEmployee, ...tableItems];

        setTableItems(updatedItems);

        localStorage.setItem('employee-data', JSON.stringify(updatedItems));

        setIsOpenDrawer(false);
        reset();
    };

    const handleCancel = () => {
        reset();
        setIsOpenDrawer(false);
    }

    return (
        <PageLayout
            title='社員リスト'
        >
            {/* 検索と追加ボタン */}
            <div className='flex justify-between items-center py-4'>
                <div className='relative w-80'>
                    <div className='absolute inset-y-0 left-2 flex items-center'>
                        <Search size={18} className='text-zinc-400' />
                    </div>
                    <input
                        type='text'
                        placeholder='社員名、フリガナを入力…'
                        className='block w-96 pl-10 pr-3 py-2 bg-white rounded-xl border border-zinc-200 focus:outline-none'
                        onChange={(e) => setInputSearch(e.target.value)}
                    />
                </div>
                <button
                    className='flex px-4 py-2 items-center justify-center bg-zinc-800 rounded-lg text-white'
                    onClick={() => setIsOpenDrawer(true)}
                >
                    <Plus size={18} />
                    <span className='pl-2'>社員を追加</span>
                </button>
            </div>

            {/* 社員テーブル */}
            <div className='flex-1 relative overflow-x-auto overflow-y-auto bg-white rounded-xl border-zinc-200 shadow-sm'>
                <table className='w-full border-collapse text-left'>
                    <thead>
                        <tr className='sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]'>
                            {tableHeaders.map((tableHeader) => (
                                <th
                                    className='px-6 py-4 text-sm font-semibold cursor-pointer'
                                    onClick={() => handleSort(tableHeader.key)}
                                >
                                    <div className='flex items-center'>
                                        <span>{tableHeader.label}</span>
                                        <SortIcon columnKey={tableHeader.key} />
                                    </div>
                                </th>
                            ))}

                        </tr>
                    </thead>
                    <tbody className='divide-y divide-zinc-100'>
                        {tableItems.length === 0 ? (
                            <tr>
                                <td colSpan={tableHeaders.length} className='px-6 py-20 text-center'>
                                    <div className='flex flex-col items-center justify-center text-zinc-500'>
                                        <p>登録されている社員がいません</p>
                                        <p>右上の「社員を追加」ボタンから登録を開始しましょう</p>
                                    </div>
                                </td>
                            </tr>
                        ) : searchedEmployees.length === 0 ? (
                            <tr>
                                <td colSpan={tableHeaders.length} className='px-6 py-20 text-center'>
                                    <div className='flex flex-col items-center justify-center text-zinc-500'>
                                        <p>一致する社員が見つかりませんでした</p>
                                        <p>検索キーワードを変えて再度お試しください</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            searchedEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className='hover:bg-zinc-200 transition-colors cursor-default'
                                    onClick={() => navigate(`/employees/${employee.id}`)}
                                >
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* 社員追加ドロワー */}
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpenDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpenDrawer(false)}
            />
            <div className={`fixed inset-y-0 right-0 w-[400px] z-50 m-4 transform transition-transform duration-300 ease-in-out ${isOpenDrawer ? 'translate-x-0' : 'translate-x-[calc(100%+32px)]'
                }`}>
                <div className='h-full flex flex-col p-6 bg-white rounded-md'>
                    <div className='sticky top-0 flex items-center justify-between'>
                        <h2 className='text-l font-bold'>
                            社員を追加
                        </h2>
                        <X
                            size={20}
                            className='text-zinc-500'
                            onClick={() => setIsOpenDrawer(false)}
                        />
                    </div>
                    <form
                        id='employee-form'
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex-1 overflow-y-auto p-6 space-y-6'
                    >
                        {tableHeaders.map((header) => {
                            const hasError = !!errors[header.key as keyof EmployeeFormData];
                            const currentValue = watchedValues[header.key as keyof EmployeeFormData];
                            const isPlaceholder = currentValue === "";
                            return (
                                <div key={header.key}>
                                    <label className='block text-sm font-semibold text-zinc-700 mb-1'>
                                        {header.label}
                                    </label>
                                    {['department', 'position', 'status'].includes(header.key) ? (
                                        <select
                                            {...register(header.key as any)}
                                            className={`w-full border rounded-xl p-2 focus:outline-none transition-all
                                            ${hasError ? 'border-red-500' : 'border-zinc-200'}
                                            ${isPlaceholder ? 'text-zinc-400' : 'text-zinc-900'}
                                        `}>
                                            {header.key !== 'status' &&
                                                <option value=''>
                                                    {header.label}を選択してください
                                                </option>
                                            }
                                            {(header.key === 'department' ? DEPARTMENTS :
                                                header.key === 'position' ? POSITIONS :
                                                    ['在籍', '休職中']).map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                        </select>
                                    ) : (
                                        <input
                                            {...register(header.key as any)}
                                            type='text'
                                            placeholder={`${header.label}を入力してください`}
                                            className={`w-full border rounded-xl p-2 focus:outline-none transition-all
                                            ${hasError ? 'border-red-500' : 'border-zinc-200 focus:ring-2 focus:ring-zinc-800'}
                                            `}
                                        />
                                    )}

                                    {errors[header.key as keyof EmployeeFormData] && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors[header.key as keyof EmployeeFormData]?.message}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </form>
                    <div className='flex items-center justify-end gap-2'>
                        <button
                            className='flex px-4 py-2 items-center justify-center border border-zinc-200 rounded-lg'
                            onClick={handleCancel}
                        >
                            キャンセル
                        </button>
                        <button
                            type='submit'
                            form='employee-form'
                            className='flex px-4 py-2 items-center justify-center bg-zinc-800 rounded-lg text-white'
                        >
                            保存する
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default EmployeeListPage;