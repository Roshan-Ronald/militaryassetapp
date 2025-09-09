import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login.jsx';
import Sidebar from './Components/Sidebar.jsx';
import TopBar from './Components/TopBar.jsx';
import Home from './Pages/Home.jsx';
import AssetManager from './Pages/AssetManager.jsx';
import Transfers from './Pages/Transfers.jsx';
import PurchasesPage from './Pages/PurchasesPage.jsx';
import Assignments from './Pages/AssignmentsPage.jsx';
import ExpendituresPage from './Pages/ExpendituresPage.jsx';
import UsersPage from './Pages/UsersPage.jsx';
import Settings from './Pages/Settings.jsx';
import Profile from './Pages/Profile.jsx';
import Loading from './Components/Loading.jsx';
import { bindApiToWindow } from './utils/apiWindowBindings';

const MAIN_PAGES = [
  "/home",
  "/assets",
  "/transfers",
  "/purchases",
  "/assignments",
  "/expenditures",
  "/users",
  "/settings",
  "/profile"
];

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bindApiToWindow();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (MAIN_PAGES.includes(location.pathname)) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

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
        <main className={`overflow-auto ${!isLoginPage ? "pt-16 px-6" : ""}`}>
          {MAIN_PAGES.includes(location.pathname) && loading ? (
            <Loading />
          ) : (
            <Routes>
              <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
              <Route path="/assets" element={isAuthenticated ? <AssetManager /> : <Navigate to="/" />} />
              <Route path="/transfers" element={isAuthenticated ? <Transfers /> : <Navigate to="/" />} />
              <Route path="/purchases" element={isAuthenticated ? <PurchasesPage /> : <Navigate to="/" />} />
              <Route path="/assignments" element={isAuthenticated ? <Assignments /> : <Navigate to="/" />} />
              <Route path="/expenditures" element={isAuthenticated ? <ExpendituresPage /> : <Navigate to="/" />} />
              <Route path="/users" element={isAuthenticated ? <UsersPage /> : <Navigate to="/" />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
