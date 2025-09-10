import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "roshanronald" && password === "roshan@17") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsAuthenticated(true);
        toast.success("Login successful!", { autoClose: 2000 });
        navigate("/home");
      }, 1500);
    } else {
      toast.error("Invalid username or password", { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <div
        className="w-full md:w-1/2 flex flex-col justify-center items-center bg-cover bg-center text-white relative h-64 md:h-auto"
        style={{ backgroundImage: "url('/back.jpg')" }}
      >
        <div className="bg-opacity-50 p-6 md:p-8 rounded-lg text-center max-w-xs">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 font-serif">
            Military Asset
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold font-sans">
            Management
          </h2>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50 px-4 py-8 md:px-0">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 md:p-8 w-full max-w-md"
        >
          <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 mt-2 text-center">
            Sign in to your account
          </div>

          <label className="block text-gray-700 font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mb-6 text-right">
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white font-medium rounded-md py-2 text-lg hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white rounded-full animate-spin mr-2"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
