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

let attendanceMap = {};

// GET - 社員リスト
app.get('/api/employees', (req, res) => {
    res.json(employees);
});

// POST - 社員リスト（登録）
app.post('/api/employees', (req, res) => {
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

// GET - 詳細データ
app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params;

    const employee = employees.find(emp => emp.id === id);

    if (employee) {
        res.json(employee);
    } else {
        res.status(404).json({ message: '社員情報が見つかりませんでした。' })
    }
});

// PUT - 詳細データ（編集）
app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, furigana, department, position, email, status } = req.body;

    const index = employees.findIndex(emp => emp.id === id);

    if(index !== -1) {
        employees[index] = { id, name, furigana, department, position, email, status };

        res.json({
            message: '変更を保存しました！',
            data: employees[index]
        });
    } else {
        res.status(404).json({
            message: '社員情報が見つかりませんでした。'
        });
    };
});

// GET - 出席データ
app.get('/api/attendance', (req, res) => {
    res.json(attendanceMap);
});

// POST - 出席データ（入退室）
app.post('/api/attendance/toggle', (req, res) => {
    const { id } = req.body;

    const current = attendanceMap[id] || { isIn: false };
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const nextIsIn = !current.isIn;

    attendanceMap[id] = {
        isIn: nextIsIn,
        arrivalTime: nextIsIn ? timeString : current.arrivalTime
    };

    res.json({
        isIn: nextIsIn,
        attendanceMap: attendanceMap
    });
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}でサーバー動作中`)
});