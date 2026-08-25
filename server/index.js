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
app.post("/api/employees", async (req, res) => {
  const { ename, furigana, deptno, position, email, emp_status } = req.body;

  // const newEmployee = {
  //   id: crypto.randomUUID(),
  //   ename,
  //   furigana,
  //   dname,
  //   position,
  //   email,
  //   emp_status,
  // };

  // employees.push(newEmployee);

  // res.status(201).json({
  //   message: "登録完了しました",
  //   data: newEmployee,
  // });
  try {
    const currentYearStr = new Date().getFullYear().toString();
    const yearDigits = currentYearStr.slice(-2);

    const empnoPrefix = `${yearDigits}${deptno}`;

    const maxEmpnoResult = await db.query(
      `select empno from emp
      where cast(empno as text) like $1
      order by empno desc
      limit 1;
      `,
      [`${empnoPrefix}%`],
    );

    let nextSequence = 1;

    if (maxEmpnoResult.rows.length > 0) {
      const lastEmpnoStr = maxEmpnoResult.rows[0].empno.toString();
      const lastSeqStr = lastEmpnoStr.slice(empnoPrefix.length);
      nextSequence = parseInt(lastSeqStr, 10) + 1;
    }

    const sequenceStr = nextSequence.toString().padStart(2, "0");
    const newEmpno = parseInt(`${empnoPrefix}${sequenceStr}`, 10);

    await db.query(
      `insert into emp (empno, ename, furigana, deptno, position, email, emp_status, hiredate)
      values ($1, $2, $3, $4, $5, $6, $7, current_date)
      `,
      [newEmpno, ename, furigana, deptno, position, email, emp_status],
    );

    const result = await db.query(
      `select e.empno, e.ename, e.furigana, e.position, e.email, e.emp_status, to_char(e.hiredate, 'yyyy-mm-dd') as hiredate, d.dname
      from emp as e
      left join dept as d on e.deptno = d.deptno
      where e.empno = $1;
      `,
      [newEmpno],
    );

    const newEmployee = result.rows[0];

    res.status(201).json({
      message: "登録完了しました",
      data: newEmployee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "DB error" });
  }
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
      `select e.empno, e.ename, e.furigana, e.position, e.email, e.emp_status, TO_CHAR(e.hiredate, 'yyyy-mm-dd') as hiredate, e.deptno, d.dname
    from emp as e
    left join dept as d
    on e.deptno = d.deptno
    where e.empno = $1 limit 1;
    `,
      [id],
    );

    const employee = result.rows[0];
    res.json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "DB Error" });
  }
});

// PUT - 詳細データ（編集）
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { ename, furigana, deptno, position, email, emp_status } = req.body;

  // const index = employees.findIndex((emp) => emp.id === id);

  // if (index !== -1) {
  //   employees[index] = {
  //     id,
  //     name,
  //     furigana,
  //     department,
  //     position,
  //     email,
  //     status,
  //   };

  //   res.json({
  //     message: "変更を保存しました！",
  //     data: employees[index],
  //   });
  // } else {
  // res.status(404).json({
  //   message: "社員情報が見つかりませんでした。",
  // });
  // }

  try {
    const updateResult = await db.query(
      `update emp
      set ename = $1, furigana = $2, deptno = $3, position = $4, email = $5, emp_status = $6
      where empno = $7
      `,
      [ename, furigana, deptno, position, email, emp_status, id],
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        message: "社員情報が見つかりませんでした。",
      });
    }

    const result = await db.query(
      `select e.empno, e.ename, e.furigana, e.position, e.email, e.emp_status, to_char(e.hiredate, 'yyyy-mm-dd') as hiredate, e.deptno, d.dname
      from emp as e
      left join dept as d on e.deptno = d.deptno
      where e.empno = $1
      `,
      [id],
    );

    const updatedEmployee = result.rows[0];

    res.json({
      message: "変更を保存しました！",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("UPDATE error:", error);
    res.status(500).json({ message: "DB Error" });
  }
});

// GET - 出席データ
app.get("/api/attendance", async (req, res) => {
  // res.json(attendanceMap);
  try {
    const result = await db.query(
      `select distinct on (empno)
      empno,
      (leave is null) as "isIn",
      to_char(arrived, 'HH24:MI') as "arrivalTime"
      from att
      where att_date = current_date
      order by empno, attno desc;
      `,
    );

    const attendanceMap = {};
    result.rows.forEach((row) => {
      attendanceMap[row.empno] = {
        isIn: row.isIn,
        arrivalTime: row.arrivalTime,
      };
    });

    res.json(attendanceMap);
  } catch (error) {
    console.error("Attendance GET Error:", error);
    res.status(500).json({ message: "DB Error" });
  }
});

// POST - 出席データ（入退室）
app.post("/api/attendance/toggle", async (req, res) => {
  // const { id } = req.body;

  // const current = attendanceMap[id] || { isIn: false };
  // const now = new Date();
  // const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  // const nextIsIn = !current.isIn;

  // attendanceMap[id] = {
  //   isIn: nextIsIn,
  //   arrivalTime: nextIsIn ? timeString : current.arrivalTime,
  // };

  // res.json({
  //   isIn: nextIsIn,
  //   attendanceMap: attendanceMap,
  // });

  const { empno, deptno } = req.body;

  try {
    const todayAtt = await db.query(
      `select attno, arrived, leave
      from att
      where empno = $1 and att_date = current_date
      order by attno desc
      limit 1;
      `,
      [empno],
    );

    if (todayAtt.rows.length === 0) {
      const insertResult = await db.query(
        `insert into att (arrived, empno, deptno, att_date)
        values (current_timestamp, $1, $2, current_date)
        returning attno, to_char(arrived, 'HH24:MI') as arrival_time;
        `,
        [empno, deptno],
      );

      return res.json({
        isIn: true,
        arrivalTime: insertResult.rows[0].arrival_time,
        message: "入室しました",
      });
    } else if (todayAtt.rows[0].leave === null) {
      const currentAttNo = todayAtt.rows[0].attno;

      await db.query(
        `update att
        set leave = current_timestamp
        where attno = $1;
        `,
        [currentAttNo],
      );

      return res.json({
        isIn: false,
        message: "退室しました",
      });
    } else {
      const reInsertResult = await db.query(
        `insert into att (arrived, empno, deptno, att_date)
        values (current_timestamp, $1, $2, current_date)
        returning attno, to_char(arrived, 'HH24:MI') as arrival_time;
        `,
        [empno, deptno],
      );

      return res.json({
        isIn: true,
        arrivalTime: reInsertResult.rows[0].arrival_time,
        message: "再入室しました",
      });
    }
  } catch (error) {
    console.error("Attendance Toggle Error:", error);
    res.status(500).json({ message: "DB Error" });
  }
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
