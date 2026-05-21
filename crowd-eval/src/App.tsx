import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import TaskList from './pages/TaskList';
import TaskCreate from './pages/TaskCreate';
import TaskDetail from './pages/TaskDetail';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/experts" replace />} />
          <Route path="experts" element={<ExpertList />} />
          <Route path="experts/:id" element={<ExpertDetail />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="tasks/create" element={<TaskCreate />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
