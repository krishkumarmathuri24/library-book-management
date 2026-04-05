import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Background3D from '../components/three/Background3D';
import { Lock, UserCircle, UserPlus, ShieldCheck, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', { username, password, role });
      // Auto-login after registration
      const { data } = await api.post('/auth/login', { username, password });
      login(data.token, data.user);
      toast.success('Account created successfully! 🎉');
      
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Background3D />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card glass className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-500/30">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white mb-1">Create Account</h1>
            <p className="text-gray-400 text-sm">Join LibQueue to start requesting books</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                role === 'STUDENT'
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                role === 'ADMIN'
                  ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                  : 'border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="register-username"
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              icon={<UserCircle className="w-5 h-5" />}
            />
            <Input
              id="register-password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />
            <Input
              id="register-confirm"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              <UserPlus className="w-5 h-5" />
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
