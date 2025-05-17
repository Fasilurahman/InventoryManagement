import React, { useState } from 'react';
import { Layers, Loader2, Github, Twitter } from 'lucide-react';
import { loginUser } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';



const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional()
});


const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
  
    try {
      // Validate with Zod
      const validatedData = await loginSchema.parseAsync(formData);
      
      setIsSubmitting(true);
      const data = await loginUser(validatedData);
      console.log("Login successful:", data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard/inventory");
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const newErrors = err.flatten().fieldErrors;
        setErrors(Object.fromEntries(
          Object.entries(newErrors).map(([key, value]) => [key, value?.[0] ?? ""])
        ));
      } else {
        // Handle API errors with proper type checking
        const error = err as Error & { 
          response?: { 
            data?: { 
              message?: string 
            } 
          } 
        };
        console.error("Login failed:", error);
        toast.error(error.response?.data?.message || "Login failed");
        setError(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-800 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-indigo-400 to-cyan-400 p-4 rounded-2xl shadow-lg">
            <Layers className="text-white h-8 w-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome to <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Horizon</span></h1>
          <p className="mt-2 text-white/70">Sign in to continue your journey</p>
        </div>

        <div className="bg-purple-900/40 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/10">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.email ? 'border-red-400' : 'border-purple-400/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all duration-300`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border ${errors.password ? 'border-red-400' : 'border-purple-400/30'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-white/50 transition-all duration-300`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-white/30 bg-purple-900/50 text-purple-500 focus:ring-purple-500/50"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-white/90">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-purple-300 hover:text-purple-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:from-indigo-600 hover:to-purple-600 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-white/50 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="flex items-center justify-center py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <Github className="h-5 w-5 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('Twitter')}
                className="flex items-center justify-center py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <Twitter className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            Don't have an account?{' '}
            <a href="/register" className="text-purple-300 hover:text-purple-200 font-medium">
              Sign in
            </a>
          </p>
        </div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full [filter:blur(120px)] [animation:blob_7s_infinite]" />
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full [filter:blur(120px)] [animation:blob_7s_infinite_2s]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full [filter:blur(120px)] [animation:blob_7s_infinite_4s]" />
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;