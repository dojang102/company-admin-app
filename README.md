# Company Admin System

社員情報の管理および出席状況を管理するための管理者向けWebアプリケーションです。

## 実装済み機能

### 1. 認証・セキュリティ
* **ログイン機能**: 任意の ID/PW (`admin` / `pw1234`) による認証。
* **認証ガード**: `LocalStorage`を確認し、未ログインユーザーを自動的にログイン画面へリダイレクト。
* **ログアウト機能**: セッション情報を破棄し、安全にシステムを終了。

### 2. 社員管理
* **社員リスト**: 五十音順および部署順での自動整列。
* **社員登録**: バリデーションを利用した新しい社員追加。
* **詳細編集**: 各社員の情報更新機能。

### 3. 出席管理
* **入退室記録**: 入室ボタン押下時の時刻（HH:mm）を自動記録。
* **部署別フィルタリング**: セレクトボックスによる動的な表示切り替え。
* **リアルタイムステータス**: 入室中の社員をバッジとアニメーションで強調表示。

## 技術スタック
* **Frontend**: React (TypeScript)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Navigation**: React Router
* **Notifications**: React-Toastify
* **Form Management**: React Hook Form
* **Data Storage**: LocalStorage

## データ構造 (LocalStorage)

本システムは、ブラウザの `LocalStorage` を利用してデータの永続化を行っています。

| キー | 用途 |
| :--- | :--- |
| `is-authenticated` | 認証状態 (`'true'` / `'false'`) |
| `employee-data` | 社員名簿のマスターデータ |
| `attendance-status` | 入室状況および打刻時刻の記録オブジェクト |