const express = require("express");
const cors = require("cors");
const { success } = require("zod");
const db = require("./db");

const app = express();
const PORT = process.env.PORT;

// express port 接近設定
app.use(cors());

// jsonデータ
app.use(express.json());

let attendanceMap = {};

let AUTH_CONFIG = {
  id: "admin",
  password: "pw1234",
};

// GET - 社員リスト
// app.get('/api/employees', (req, res) => {
//     res.json(employees);
// });
app.get("/api/employees", async (req, res) => {
  try {
    const result = await db.query(
      `select e.empno, e.ename, e.furigana, e.position, e.email, e.emp_status, TO_CHAR(e.hiredate, 'yyyy-mm-dd') as hiredate, d.dname
      from emp as e
      left join dept as d
      on e.deptno = d.deptno
      order by empno;`,
    );

    const employees = result.rows;
    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "DB Error" });
  }
});

// POST - 社員リスト（登録）
app.post("/api/employees", (req, res) => {
  const { id, name, furigana, department, position, email, status } = req.body;

  const newEmployee = {
    id: crypto.randomUUID(),
    name,
    furigana,
    department,
    position,
    email,
    status,
  };

  employees.push(newEmployee);

  res.status(201).json({
    message: "登録完了しました",
    data: newEmployee,
  });
});

// GET - 詳細データ
app.get("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  // const employee = employees.find((emp) => emp.empno === id);

  // if (employee) {
  //   res.json(employee);
  // } else {
  //   res.status(404).json({ message: "社員情報が見つかりませんでした。" });
  // }
  try {
    const result = await db.query(
      `select e.empno, e.ename, e.furigana, e.position, e.email, e.emp_status, TO_CHAR(e.hiredate, 'yyyy-mm-dd') as hiredate, d.dname
    from emp as e
    left join dept as d
    on e.deptno = d.deptno
    where e.empno = ${id} limit 1;
    `,
    );
    
    const employee = result.rows[0]
    res.json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "DB Error" });
  }
});

// PUT - 詳細データ（編集）
app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, furigana, department, position, email, status } = req.body;

  const index = employees.findIndex((emp) => emp.id === id);

  if (index !== -1) {
    employees[index] = {
      id,
      name,
      furigana,
      department,
      position,
      email,
      status,
    };

    res.json({
      message: "変更を保存しました！",
      data: employees[index],
    });
  } else {
    res.status(404).json({
      message: "社員情報が見つかりませんでした。",
    });
  }
});

// GET - 出席データ
app.get("/api/attendance", (req, res) => {
  res.json(attendanceMap);
});

// POST - 出席データ（入退室）
app.post("/api/attendance/toggle", (req, res) => {
  const { id } = req.body;

  const current = attendanceMap[id] || { isIn: false };
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const nextIsIn = !current.isIn;

  attendanceMap[id] = {
    isIn: nextIsIn,
    arrivalTime: nextIsIn ? timeString : current.arrivalTime,
  };

  res.json({
    isIn: nextIsIn,
    attendanceMap: attendanceMap,
  });
});

// POST - ログイン
app.post("/api/auth/login", (req, res) => {
  const { id, password } = req.body;

  if (id === AUTH_CONFIG.id && password === AUTH_CONFIG.password) {
    return res.json({
      success: true,
    });
  } else {
    return res.status(401).json({
      success: false,
    });
  }
});

// POST - ログアウト
app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}でサーバー動作中`);
});
