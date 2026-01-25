import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const navigate = useNavigate();

    const AUTH_CONFIG = {
        id: 'admin',
        password: 'pw1234'
    };

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        if (data.id === AUTH_CONFIG.id && data.password === AUTH_CONFIG.password) {
            localStorage.setItem('is-authenticated', 'true');
            toast.success('ログインしました');
            navigate('/employees');
        } else {
            toast.error('IDまたはパスワードが違います');
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-zinc-800 p-6'>
            <div className='mb-8 flex flex-col items-center'>
                <h1 className='text-xl font-bold text-white tracking-wider'>Company Admin</h1>
            </div>

            <div className='w-full max-w-[360px]'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-4'
                >
                    <div className='space-y-1'>
                        <input
                            {...register('id', { required: true })}
                            type='text'
                            placeholder='ID (admin)'
                            className={`w-full border rounded-xl p-3 bg-white outline-none transition-all focus:ring-2 focus:ring-white/20 ${errors.id ? 'border-red-500' : 'border-transparent'}`}
                        />
                    </div>

                    <div className='space-y-1'>
                        <input
                            {...register('password', { required: true })}
                            type='password'
                            placeholder='PW (pw1234)'
                            className={`w-full border rounded-xl p-3 bg-white outline-none transition-all focus:ring-2 focus:ring-white/20 ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                        />
                    </div>

                    <button
                        type="submit"
                        className='w-full mt-2 px-4 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-[0.98] shadow-xl'
                    >
                        ログイン
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;