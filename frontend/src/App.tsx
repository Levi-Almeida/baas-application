import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Transactions from './pages/Transactions';
import Withdrawals from './pages/Withdrawals';
import Webhooks from './pages/Webhooks';

import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/payments"
              element={<Payments />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/withdrawals"
              element={<Withdrawals />}
            />

            <Route
              path="/webhooks"
              element={<Webhooks />}
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;