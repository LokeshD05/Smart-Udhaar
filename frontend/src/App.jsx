import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customers from "./pages/Customers";
import Transactions from "./pages/Transactions";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout"
function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/customers" element={<Customers />} />
         <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>

    </Routes>
  );
}

export default App;
