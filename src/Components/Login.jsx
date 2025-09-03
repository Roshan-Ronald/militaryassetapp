import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (username === 'roshanronald' && password === 'roshan@17') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsAuthenticated(true); 
        navigate('/home');
      }, 1800);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-4xl font-bold text-gray-900 mb-2 mt-2">Military Asset Management</div>
      <div className="text-gray-600 mb-8 text-center">Sign in to your account</div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <label className="block text-gray-700 font-medium mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-6 text-right">
          <a href="#" className="text-blue-600 hover:underline text-sm">Forgot your password?</a>
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white font-medium rounded-md py-2 text-lg hover:bg-blue-700 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  );
}
