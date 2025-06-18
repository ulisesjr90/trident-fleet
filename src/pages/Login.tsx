import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from '../config/firebase';
import { Input, Button } from '../components/common';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetPasswordMessage, setResetPasswordMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetPasswordMessage(null);

    try {
      await firebaseAuth.signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // Use the error message from Firebase auth
      setError(err.message || 'An error occurred during login');
      console.error(err);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      setResetPasswordMessage('Password reset email sent. Check your inbox.');
      setError(null);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError('Failed to send password reset email. Please try again later.');
      }
      console.error(err);
    }
  };

  return (
    <div className="
      min-h-screen 
      flex 
      items-center 
      justify-center 
      bg-gray-50 
      py-12 
      px-4 
      sm:px-6 
      lg:px-8
    ">
      <div className="
        max-w-md 
        w-full 
        space-y-8 
        bg-white 
        p-8 
        rounded-component 
        shadow-component
      ">
        <div className="flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="Trident Fleet Management Logo" 
            className="w-full max-w-[300px] h-auto mb-4 object-contain mx-auto"
          />
          <h2 className="
            text-3xl 
            font-semibold 
            text-trident-blue-500 
            text-center
          ">
            Trident Fleet
          </h2>
          <p className="
            text-gray-600 
            text-center 
            mt-2
          ">
            Fleet Management System
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error || undefined}
            />
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-1 mb-2">
                <span 
                  onClick={handleForgotPassword}
                  className="
                    text-xs 
                    text-trident-blue-500 
                    hover:text-trident-blue-600 
                    cursor-pointer
                    transition-colors
                    duration-200
                  "
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          </div>

          {resetPasswordMessage && (
            <div className="
              bg-status-success-light 
              text-status-success 
              text-center 
              p-2 
              rounded-badge
            ">
              {resetPasswordMessage}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            size="md" 
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 