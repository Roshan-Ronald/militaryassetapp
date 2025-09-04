import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Login from './Components/Login.jsx';
import Home from './Pages/Home.jsx';
import Sidebar from './Components/Sidebar.jsx';
import TopBar from './Components/TopBar.jsx';
import AssetManager from './Pages/AssetManager.jsx';
import Transfers from './Pages/Transfers.jsx';
import PurchasesPage from './Pages/PurchasesPage.jsx';
import Assignments from './Pages/AssignmentsPage.jsx';
import ExpendituresPage from './Pages/ExpendituresPage.jsx';
import UsersPage from './Pages/UsersPage.jsx';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen flex">
      {!isLoginPage && (
        <div className="fixed inset-y-0 left-0 w-64 bg-[#101726] z-40">
          <Sidebar />
        </div>
      )}

      <div className={`flex flex-col flex-1 ${!isLoginPage ? "ml-64" : ""}`}>
        {!isLoginPage && (
          <div className="fixed top-0 left-64 right-0 z-30">
            <TopBar />
          </div>
        )}

        <main className={`pt-16 px-6 overflow-auto ${isLoginPage ? "pt-0" : ""}`}>
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
            <Route path="/assets" element={isAuthenticated ? <AssetManager /> : <Navigate to="/" />} />
            <Route path="/transfers" element={isAuthenticated ? <Transfers /> : <Navigate to="/" />} />
            <Route path="/purchases" element={isAuthenticated ? <PurchasesPage /> : <Navigate to="/" />} />
            <Route path="/assignments" element={isAuthenticated ? <Assignments /> : <Navigate to="/" />} />
            <Route path="/expenditures" element={isAuthenticated ? <ExpendituresPage /> : <Navigate to="/" />} />
            <Route path="/users" element={isAuthenticated ? <UsersPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
