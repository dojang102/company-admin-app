const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// express port 接近設定
app.use(cors());

// jsonデータ
app.use(express.json());

// 任意データ
let employees = [
    { id: '1', name: '田中 太郎', furigana: 'タナカ タロウ', department: '開発部', position: '部長', email: 'tanaka@example.com', status: '在籍' },
    { id: '2', name: '佐藤 花子', furigana: 'サトウ ハナコ', department: '人事部', position: '社員', email: 'sato@example.com', status: '在籍' },
];

// GET
app.get('api/employees', (req, res) => {
    res.json(employees);
});

// POST
app.post('api/employees', (req, res) => {
    const { id, name, furigana, department, position, email, status } = req.body;

    const newEmployee = {
        id : crypto.randomUUID(),
        name,
        furigana,
        department,
        position,
        email,
        status
    };

    employees.push(newEmployee);

    res.status(201).json({
        message: '登録完了しました',
        data: newEmployee
    });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}でサーバー動作中`)
})