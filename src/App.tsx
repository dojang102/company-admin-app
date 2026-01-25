// src/App.tsx
import { BrowserRouter, Navigate, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import AttendancePage from './pages/AttendancePage';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path='/' element={<Navigate to='/employees' replace />} />
            <Route path='/employees' element={<EmployeeListPage />} />
            <Route path='/employees/:id' element={<EmployeeDetailPage />} />
            <Route path='/attendance' element={<AttendancePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;