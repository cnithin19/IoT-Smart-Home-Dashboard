import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/slices/authSlice';

export const Register = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-white tracking-wide mb-2">
          IoT Smart Home
        </h1>
        <p className="text-center text-slate-300 text-sm mb-6">
          Create your account
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100/80 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-slate-200 text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-200 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter a secure password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 transition duration-200 shadow-lg"
          >
            Register
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 transition duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};



// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { registerUser } from '../redux/slices/authSlice';
// import { AuthForm } from '../components/AuthForm';

// export const Register = () => {
//   const dispatch = useDispatch();
//   const { error } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const handleRegister = (data) => {
//     dispatch(registerUser(data)).then((result) => {
//       if (result.meta.requestStatus === 'fulfilled') {
//         navigate('/login');
//       }
//     });
//   };

//   return <AuthForm title="Register" onSubmit={handleRegister} error={error} showRegister={false} />;
// };