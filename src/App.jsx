// App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './Components/Login.jsx'
import Sidebar from './Components/Sidebar.jsx'
import TopBar from './Components/TopBar.jsx'
import Home from './Pages/Home.jsx'
import AssetManager from './Pages/AssetManager.jsx'
import Transfers from './Pages/Transfers.jsx'
import PurchasesPage from './Pages/PurchasesPage.jsx'
import Assignments from './Pages/AssignmentsPage.jsx'
import ExpendituresPage from './Pages/ExpendituresPage.jsx'
import UsersPage from './Pages/UsersPage.jsx'
import Settings from './Pages/Settings.jsx'
import Profile from './Pages/Profile.jsx'
import Loading from './Components/Loading.jsx'
import { bindApiToWindow } from './utils/apiWindowBindings'
import { FiMenu, FiX } from 'react-icons/fi'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
]

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === "/"
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    bindApiToWindow()
    setTimeout(() => setLoading(false), 1000)
  }, [])

  useEffect(() => {
    if (MAIN_PAGES.includes(location.pathname)) {
      setLoading(true)
      const timeout = setTimeout(() => setLoading(false), 500)
      return () => clearTimeout(timeout)
    } else {
      setLoading(false)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!isLoginPage) {
      setSidebarOpen(false)
    }
  }, [isLoginPage])

  const handleNavLinkClick = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex relative bg-gray-50">
      {!isLoginPage && (
        <>
          <div
            className={`fixed top-0 left-0 h-full bg-[#101726] z-40 w-64 
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            style={{ pointerEvents: sidebarOpen || window.innerWidth >= 768 ? 'auto' : 'none' }}
          >
            <Sidebar onNavLinkClick={handleNavLinkClick} />
          </div>
          <button
            className="fixed top-4 left-4 z-50 p-2 rounded-md text-black bg-transparent md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FiX size={24} color="white" /> : <FiMenu size={24} color="black" />}
          </button>
        </>
      )}
      <div className={`flex flex-col flex-1 ${!isLoginPage ? 'md:ml-64' : ''}`}>
        {!isLoginPage && (
          <div className="fixed top-0 left-0 md:left-64 right-0 z-30">
            <TopBar />
          </div>
        )}
        <main
          className={`overflow-auto w-full max-w-screen-2xl mx-auto 
            ${!isLoginPage ? 'pt-20 px-4 sm:px-6 md:px-8 lg:px-12' : ''}`}
        >
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable />

    </div>
  )
}

export default App
