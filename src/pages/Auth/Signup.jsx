import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fefdfb] flex flex-col justify-center items-center p-6 bg-texture">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-orange-900/5 border border-orange-50/50"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-50 p-4 rounded-2xl mb-4 text-orange-500">
            <Plane size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-500 mt-2 text-center">Start planning your dream vacations beautifully.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            type="text" 
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-orange-600 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
