import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { Search, Plus, ChevronUp, ChevronDown, X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export interface Employee {
  empno: number;
  ename: string;
  furigana: string;
  dname: string;
  position: string;
  email: string;
  hiredate: string;
  emp_status: string;
}
export const employees: Employee[] = [];
export const DEPARTMENTS = [
  { id: 100, value: "営業部" },
  { id: 200, value: "開発部" },
  { id: 300, value: "人事部" },
  { id: 400, value: "総務部" },
  { id: 500, value: "マーケティング部" },
] as const;
export const POSITIONS = [
  { id: 10, value: "部長" },
  { id: 20, value: "課長" },
  { id: 30, value: "係長" },
  { id: 40, value: "主任" },
  { id: 50, value: "社員" },
] as const;

export const employeeValidation = z.object({
  ename: z.string().min(1, "名前は必須です"),
  furigana: z
    .string()
    .min(1, "フリガナは必須です")
    .regex(/^[ァ-ヶー\s]+$/, "全角カタカナで入力してください"),
  dname: z.string().min(1, "部署を選択してください"),
  position: z.string().min(1, "役職を選択してください"),
  email: z
    .string()
    .min(1, "メールアドレス必須です")
    .email("正しいメール形式で入力してください"),
  emp_status: z.enum(["在籍", "休職"]),
});

type EmployeeFormData = z.infer<typeof employeeValidation>;

// メイン
const EmployeeListPage = () => {
  const [inputSearch, setInputSearch] = useState(""); // input value
  // const [tableItems, setTableItems] = useState(employees);    // 社員データー

  // localstorage利用
  /* const [tableItems, setTableItems] = useState<Employee[]>(() => {
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
    });    // 社員データー */

  const [tableItems, setTableItems] = useState<Employee[]>([]);

  const tableHeaders: { key: keyof Employee; label: string }[] = [
    { key: "ename", label: "名前" },
    { key: "furigana", label: "フリガナ" },
    { key: "dname", label: "部署" },
    { key: "position", label: "役職" },
    { key: "email", label: "メールアドレス" },
    { key: "hiredate", label: "入社日時" },
    { key: "emp_status", label: "ステータス" },
  ];

  type SortOrder = "asc" | "desc" | null;

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    order: SortOrder;
  }>({
    key: "empno",
    order: null,
  });

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const navigate = useNavigate();

  // ソートアイコンcss制御
  const SortIcon = ({ columnKey }: { columnKey: keyof Employee }) => {
    const isCorrectColumn = sortConfig.key === columnKey;
    const isAsc = isCorrectColumn && sortConfig.order === "asc";
    const isDesc = isCorrectColumn && sortConfig.order === "desc";

    return (
      <div className="flex flex-col ml-1">
        <ChevronUp
          size={12}
          className={isAsc ? "text-zinc-900" : "text-zinc-400"}
        />
        <ChevronDown
          size={12}
          className={isDesc ? "text-zinc-900" : "text-zinc-400"}
        />
      </div>
    );
  };

  // ソート機能
  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.order === "asc") {
          return { key, order: "desc" };
        }
        if (prev.order === "desc") {
          return { key, order: null };
        }
      }
      return { key, order: "asc" };
    });
  };

  const searchedEmployees = tableItems
    // 検索結果
    .filter((item) => {
      // ひらがなカタカナどっちでも検索可能
      const hiraToKana = (str: string) =>
        str.replace(/[\u3041-\u3096]/g, (m) =>
          String.fromCharCode(m.charCodeAt(0) + 0x60),
        );

      // 空白無視
      const noSpace = (str: string) => hiraToKana(str.replace(/\s+/g, ""));

      // input valueの空白無視
      const query = noSpace(inputSearch);
      if (!query) return true;

      // employeesの各項目の空白無視
      const queryName = noSpace(item.ename);
      const queryFurigana = noSpace(item.furigana);

      // 名前 || ふりがな
      return queryName.includes(query) || queryFurigana.includes(query);
    })
    // ソート結果
    .sort((a, b) => {
      if (!sortConfig.order) return 0;

      const aValue = String(a[sortConfig.key]);
      const bValue = String(b[sortConfig.key]);

      if (sortConfig.order === "asc") {
        return aValue.localeCompare(bValue, "ja");
      } else {
        return bValue.localeCompare(aValue, "ja");
      }
    });

  // 社員リスト取得 useEffect
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employees")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTableItems(res.data);
        } else {
          setTableItems([]);
        }
      })
      .catch((error) => {
        console.error("データの取得に失敗しました。：", error);
        toast.error("サーバーとの通信中エラーが発生しました。", {
          position: "bottom-right",
          autoClose: 1500,
          style: {
            backgroundColor: "#18181b",
            color: "#ffffff",
            borderRadius: "12px",
          },
        });
      });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeValidation),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      furigana: "",
      department: "",
      position: "",
      email: "",
      emp_status: "在籍",
    },
  });

  const watchedValues = watch();

  // 登録保存機能 - localstorage
  /* const onSubmit = (data: EmployeeFormData) => {
        const newEmployee: Employee = {
            ...data,
            id: crypto.randomUUID(),
        };

        const updatedItems = [newEmployee, ...tableItems];

        setTableItems(updatedItems);

        localStorage.setItem('employee-data', JSON.stringify(updatedItems));

        setIsOpenDrawer(false);
        reset();
    }; */

  // 登録保存機能 - axios
  const onSubmit = (data: EmployeeFormData) => {
    const newEmployee = {
      ...data,
    };

    axios
      .post("http://localhost:5000/api/employees", newEmployee)
      .then((res) => {
        setTableItems((prev) => [res.data.data, ...prev]);

        toast.success(res.data.message, {
          position: "bottom-right",
          autoClose: 1500,
          style: {
            backgroundColor: "#18181b",
            color: "#ffffff",
            borderRadius: "12px",
          },
        });
        setIsOpenDrawer(false);
        reset();
      })
      .catch((error) => {
        console.error("登録保存に失敗しました。", error);
        toast.error("登録中にエラーが発生しました。", {
          position: "bottom-right",
          autoClose: 1500,
          style: {
            backgroundColor: "#18181b",
            color: "#ffffff",
            borderRadius: "12px",
          },
        });
      });
  };

  const handleCancel = () => {
    reset();
    setIsOpenDrawer(false);
  };

  return (
    <PageLayout title="社員リスト">
      {/* 検索と追加ボタン */}
      <div className="flex justify-between items-center py-4">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-2 flex items-center">
            <Search size={18} className="text-zinc-400" />
          </div>
          <input
            type="text"
            placeholder="社員名、フリガナを入力…"
            className="block w-96 pl-10 pr-3 py-2 bg-white rounded-xl border border-zinc-200 focus:outline-none"
            onChange={(e) => setInputSearch(e.target.value)}
          />
        </div>
        <button
          className="flex px-4 py-2 items-center justify-center bg-zinc-800 rounded-lg text-white hover:bg-black"
          onClick={() => setIsOpenDrawer(true)}
        >
          <Plus size={18} />
          <span className="pl-2">社員を追加</span>
        </button>
      </div>

      {/* 社員テーブル */}
      <div className="flex-1 relative overflow-x-auto overflow-y-auto bg-white rounded-xl border-zinc-200 shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
              {tableHeaders.map((tableHeader) => (
                <th
                  className="px-6 py-4 text-sm font-semibold cursor-pointer"
                  onClick={() => handleSort(tableHeader.key)}
                >
                  <div className="flex items-center">
                    <span>{tableHeader.label}</span>
                    <SortIcon columnKey={tableHeader.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {tableItems.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-6 py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <p>登録されている社員がいません</p>
                    <p>右上の「社員を追加」ボタンから登録を開始しましょう</p>
                  </div>
                </td>
              </tr>
            ) : searchedEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-6 py-20 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <p>一致する社員が見つかりませんでした</p>
                    <p>検索キーワードを変えて再度お試しください</p>
                  </div>
                </td>
              </tr>
            ) : (
              searchedEmployees.map((employee) => (
                <tr
                  key={employee.empno}
                  className="hover:bg-zinc-200 transition-colors cursor-default"
                  onClick={() => navigate(`/employees/${employee.empno}`)}
                >
                  <td className="px-6 py-4 text-sm">{employee.ename}</td>
                  <td className="px-6 py-4 text-sm">{employee.furigana}</td>
                  <td className="px-6 py-4 text-sm">{employee.dname}</td>
                  <td className="px-6 py-4 text-sm">{employee.position}</td>
                  <td className="px-6 py-4 text-sm">{employee.email}</td>
                  <td className="px-6 py-4 text-sm">{employee.hiredate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.emp_status === "在籍"
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {employee.emp_status}
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
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpenDrawer ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpenDrawer(false)}
      />
      <div
        className={`fixed inset-y-0 right-0 w-[400px] z-50 m-4 transform transition-transform duration-300 ease-in-out ${
          isOpenDrawer ? "translate-x-0" : "translate-x-[calc(100%+32px)]"
        }`}
      >
        <div className="h-full flex flex-col p-6 bg-white rounded-md">
          <div className="sticky top-0 flex items-center justify-between">
            <h2 className="text-l font-bold">社員を追加</h2>
            <X
              size={20}
              className="text-zinc-500"
              onClick={() => setIsOpenDrawer(false)}
            />
          </div>
          <form
            id="employee-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {tableHeaders.map((header) => {
              const hasError = !!errors[header.key as keyof EmployeeFormData];
              const currentValue =
                watchedValues[header.key as keyof EmployeeFormData];
              const isPlaceholder = currentValue === "";
              return (
                <div key={header.key}>
                  <label
                    className={`block text-sm font-semibold text-zinc-700 mb-1 ${header.key === "hiredate" ? "hidden" : " "}`}
                  >
                    {header.label}
                  </label>
                  {["department", "position", "emp_status"].includes(
                    header.key,
                  ) ? (
                    <select
                      {...register(header.key as any)}
                      className={`w-full border rounded-xl p-2 focus:outline-none transition-all
                                            ${hasError ? "border-red-500" : "border-zinc-200"}
                                            ${isPlaceholder ? "text-zinc-400" : "text-zinc-900"}
                                        `}
                    >
                      {header.key !== "emp_status" && (
                        <option value="">
                          {header.label}を選択してください
                        </option>
                      )}
                      {(header.key === "dname"
                        ? DEPARTMENTS
                        : header.key === "position"
                          ? POSITIONS
                          : [
                              { id: 1, value: "在籍" },
                              { id: 2, value: "休職" },
                            ]
                      ).map((opt) => (
                        <option key={opt.id} value={opt.value}>
                          {opt.value}
                        </option>
                      ))}
                    </select>
                  ) : header.key === "hiredate" ? (
                    <div className="hidden"></div>
                  ) : (
                    <input
                      {...register(header.key as any)}
                      type="text"
                      placeholder={`${header.label}を入力してください`}
                      className={`w-full border rounded-xl p-2 focus:outline-none transition-all
                                            ${hasError ? "border-red-500" : "border-zinc-200 focus:ring-2 focus:ring-zinc-800"}
                                            `}
                    />
                  )}

                  {errors[header.key as keyof EmployeeFormData] && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors[header.key as keyof EmployeeFormData]?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </form>
          <div className="flex items-center justify-end gap-2">
            <button
              className="flex px-4 py-2 items-center justify-center border border-zinc-200 rounded-lg hover:bg-zinc-200"
              onClick={handleCancel}
            >
              キャンセル
            </button>
            <button
              type="submit"
              form="employee-form"
              className="flex px-4 py-2 items-center justify-center bg-zinc-800 rounded-lg text-white hover:bg-black"
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EmployeeListPage;
