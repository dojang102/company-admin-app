import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { employees, DEPARTMENTS, POSITIONS, employeeValidation } from './EmployeeListPage';
import type { Employee } from './EmployeeListPage';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

type EmployeeFormData = z.infer<typeof employeeValidation>;

const EmployeeDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeValidation),
    });

    useEffect(() => {
        const saved = localStorage.getItem('employee-data');
        const data: Employee[] = saved ? JSON.parse(saved) : employees;
        const target = data.find(emp => emp.id === id);

        if (target) {
            reset(target);
        } else {
            navigate('/employees');
        }
    }, [id, navigate, reset]);

    const onSubmit = (formData: EmployeeFormData) => {
        const saved = localStorage.getItem('employee-data');
        const allData: Employee[] = saved ? JSON.parse(saved) : [];

        const updatedData = allData.map(emp =>
            emp.id === id ? { ...formData, id } : emp
        );

        localStorage.setItem('employee-data', JSON.stringify(updatedData));

        reset(formData);

        toast.success('変更を保存しました！', {
            position: 'bottom-right',
            autoClose: 3000,
            style: {
                backgroundColor: '#18181b', // Tailwindのzinc-900相当
                color: '#ffffff',
                borderRadius: '12px'
            },
        })
    }

    return (
        <PageLayout
            title='社員詳細'
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex justify-between items-center py-4'>
                    <button
                        onClick={() => navigate('/employees')}
                        className='flex items-center text-zinc-600'
                    >
                        <ArrowLeft size={16} className='mr-1' />
                        <span>リストに戻る</span>
                    </button>
                    <button
                        type='submit'
                        disabled={!isDirty}
                        className='flex px-6 py-2 items-center bg-zinc-800 rounded-lg text-white'
                    >
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
                                        {...register('name')}
                                        className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                </div>
                            </div>
                            <div className='flex-1 space-y-2'>
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>フリガナ</label>
                                    <input
                                        type='text'
                                        {...register('furigana')}
                                        className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                    />
                                    {errors.furigana && <p className="text-red-500 text-xs">{errors.furigana.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-12'>
                            <div className='flex-1 space-y-2'>
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>部署</label>
                                    <select
                                        {...register('department')}
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
                                        {...register('position')}
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
                                        {...register('email')}
                                        className='w-full border border-zinc-200 rounded-xl p-2 focus:outline-none focus:border-zinc-800 text-lg'
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>
                            <div className='flex-1 space-y-2'>
                                <div>
                                    <label className='block text-sm font-semibold mb-1'>ステータス</label>
                                    <select
                                        {...register('status')}
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
            </form>
        </PageLayout>
    )
}

export default EmployeeDetailPage;