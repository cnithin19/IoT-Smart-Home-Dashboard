import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await dispatch(loginUser(credentials)).unwrap();
      localStorage.setItem('token', response); // save token
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        
        {/* Brand Title */}
        <h1 className="text-3xl font-extrabold text-center text-white tracking-wide mb-2">
          IoT Smart Home
        </h1>
        <p className="text-center text-slate-300 text-sm mb-6">
          Securely manage your smart devices
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100/80 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-slate-200 text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your username"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-slate-200 text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your password"
          />
        </div>

        {/* Buttons */}
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition duration-200 shadow-lg"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="w-full mt-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 transition duration-200"
        >
          Register
        </button>
      </div>
    </div>
  );
};





// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { loginUser } from '../redux/slices/authSlice';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Button, Box, Typography, Alert } from '@mui/material';


// export const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState(null);

//   const handleLogin = async () => {
//     try {
//       const response = await dispatch(loginUser(credentials)).unwrap();
//       localStorage.setItem('token', response); // response is the token string
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err || 'Login failed');
//     }
//   };

//   return (
//     <Box sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
//       <Typography variant="h4">Login</Typography>
//       {error && <Alert severity="error">{error}</Alert>}
//       <TextField
//         label="Username"
//         value={credentials.username}
//         onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//         fullWidth
//         sx={{ my: 1 }}
//       />
//       <TextField
//         label="Password"
//         type="password"
//         value={credentials.password}
//         onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//         fullWidth
//         sx={{ my: 1 }}
//       />
//       <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
//         Login
//       </Button>
//       <Button onClick={() => navigate('/register')} sx={{ mt: 1 }}>
//         Register
//       </Button>
//     </Box>
//   );
// };