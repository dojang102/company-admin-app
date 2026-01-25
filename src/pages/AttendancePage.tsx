import { useState, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import { toast } from 'react-toastify';
import { Clock, Filter } from 'lucide-react';
import { employees, DEPARTMENTS } from './EmployeeListPage';
import type { Employee } from './EmployeeListPage';

interface AttendanceRecord {
    isIn: boolean;
    arrivalTime?: string;
}

const AttendancePage = () => {
    const [selectedDept, setSelectedDept] = useState<string>('すべて');

    const [employeeList] = useState<Employee[]>(() => {
        const saved = localStorage.getItem('employee-data');
        return saved ? JSON.parse(saved) : employees;
    });

    const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>(() => {
        const saved = localStorage.getItem('attendance-status');
        return saved ? JSON.parse(saved) : {};
    });

    const filteredAndSortedEmployees = useMemo(() => {
        return employeeList
            .filter(emp => selectedDept === 'すべて' || emp.department === selectedDept)
            .sort((a, b) => {
                const deptCompare = a.department.localeCompare(b.department, 'ja');
                if (deptCompare !== 0) return deptCompare;
                return a.furigana.localeCompare(b.furigana, 'ja');
            });
    }, [employeeList, selectedDept]);

    const toggleAttendance = (id: string, name: string) => {
        const current = attendanceMap[id] || { isIn: false };
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMap = {
            ...attendanceMap,
            [id]: { isIn: !current.isIn, arrivalTime: !current.isIn ? timeString : current.arrivalTime }
        };

        setAttendanceMap(newMap);
        localStorage.setItem('attendance-status', JSON.stringify(newMap));

        if (!current.isIn) toast.success(`${name}さんが入室しました`);
        else toast.info(`${name}さんが退室しました`);
    };

    return (
        <PageLayout title="出席管理">
            {/* 部署フィルターエリア */}
            <div className="flex items-center gap-4 mb-8 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <div className="flex items-center text-zinc-500 font-bold text-sm">
                    <Filter size={16} className="mr-2" />
                    部署で絞り込む
                </div>
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="bg-white border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-zinc-500 focus:border-zinc-500 block p-2.5 outline-none transition-all w-64"
                >
                    <option value="すべて">すべての部署</option>
                    {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <div className="ml-auto text-xs text-zinc-400 font-medium">
                    該当者: {filteredAndSortedEmployees.length} 名
                </div>
            </div>

            {/* カードリスト */}
            <div className="grid grid-cols-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedEmployees.map((emp) => {
                    const record = attendanceMap[emp.id] || { isIn: false };
                    return (
                        <div key={emp.id} className={`p-6 m-1 bg-white rounded-2xl border transition-all ${record.isIn ? 'border-zinc-800 shadow-md ring-1 ring-zinc-800' : 'border-zinc-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{emp.name}</h3>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{emp.department}</p>
                                </div>
                                {record.isIn && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                            </div>

                            <div className="h-10 flex items-center mb-4">
                                {record.isIn ? (
                                    <div className="flex items-center text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                                        <Clock size={14} className="mr-2" />
                                        <span className="text-xs font-bold">入室 {record.arrivalTime}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-300 font-medium ml-1">未入室</span>
                                )}
                            </div>

                            <button
                                onClick={() => toggleAttendance(emp.id, emp.name)}
                                className={`w-full py-3 rounded-xl font-bold text-xs transition-all active:scale-95 ${record.isIn ? 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200' : 'bg-zinc-800 text-white hover:bg-black'}`}
                            >
                                {record.isIn ? '退室処理' : '入室処理'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </PageLayout>
    );
};

export default AttendancePage;