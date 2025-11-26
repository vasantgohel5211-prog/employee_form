import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default redirect to employees list */}
          <Route path="/" element={<Navigate to="/employees" replace />} />
          
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/new" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;