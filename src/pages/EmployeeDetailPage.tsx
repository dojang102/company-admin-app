import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { employees, DEPARTMENTS, POSITIONS } from './EmployeeListPage';
import type { Employee } from './EmployeeListPage';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const EmployeeDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('employee-data');
        const data: Employee[] = saved ? JSON.parse(saved) : employees;

        const target = data.find(emp => emp.id === id);
        if (target) {
            setEmployee(target);
        } else {
            navigate('/employees');
        }
    }, [id, navigate]);

    if (!employee) return null;

    return (
        <PageLayout
            title='社員詳細'
        >
            <div className='flex justify-between items-center py-4'>
                <button
                    onClick={() => navigate('/employees')}
                    className='flex items-center text-zinc-600'
                >
                    <ArrowLeft size={16} className='mr-1' />
                    <span>リストに戻る</span>
                </button>
                <button className='flex px-6 py-2 items-center bg-zinc-800 rounded-lg text-white'>
                    <Save size={16} className='mr-1' />
                    <span>保存する</span>
                </button>
            </div>
            <div className='flex-1 relative overflow-x-auto overflow-y-auto bg-white rounded-xl border-zinc-200 shadow-sm p-8'>
                <div className='space-y-12'>
                    <div className='flex gap-12'>
                        <div className='flex-1 space-y-2'>
                            <div>
                                <label className='block text-sm font-semibold mb-1'>名前</label>
                                <input
                                    type='text'
                                    value={employee.name}
                                    onChange={(e) => setEmployee({ ...employee, name: e.target.value})}
                                    className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                />
                            </div>
                        </div>
                        <div className='flex-1 space-y-2'>
                            <div>
                                <label className='block text-sm font-semibold mb-1'>フリガナ</label>
                                <input
                                    type='text'
                                    value={employee.furigana}
                                    onChange={(e) => setEmployee({ ...employee, furigana: e.target.value})}
                                    className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-12'>
                        <div className='flex-1 space-y-2'>
                            <div>
                                <label className='block text-sm font-semibold mb-1'>部署</label>
                                <select
                                    value={employee.department}
                                    onChange={(e) => setEmployee({ ...employee, department: e.target.value})}
                                    className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                >
                                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className='flex-1 space-y-2'>
                            <div>
                                <label className='block text-sm font-semibold mb-1'>役職</label>
                                <select
                                    value={employee.position}
                                    onChange={(e) => setEmployee({ ...employee, position: e.target.value})}
                                    className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                >
                                    {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-12'>
                        <div className='flex-1 space-y-2'>
                            <div>
                                <label className='block text-sm font-semibold mb-1'>メールアドレス</label>
                                <input
                                    type='text'
                                    value={employee.email}
                                    onChange={(e) => setEmployee({ ...employee, email: e.target.value})}
                                    className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                />
                            </div>
                        </div>
                        <div className='flex-1 space-y-2'>
                            <div>
                                <label className='block text-sm font-semibold mb-1'>ステータス</label>
                                <select
                                    value={employee.status}
                                    onChange={(e) => setEmployee({ ...employee, status: e.target.value as '在籍' | '休職中'})}
                                    className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                >
                                    <option value='在籍'>在籍</option>
                                    <option value='休職中'>休職中</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default EmployeeDetailPage;