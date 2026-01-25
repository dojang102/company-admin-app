// src/App.tsx
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Navigate to='/employees' replace />} />
          <Route path='/employees' element={<EmployeeListPage />} />
          <Route path='/employees/:id' element={<EmployeeDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;