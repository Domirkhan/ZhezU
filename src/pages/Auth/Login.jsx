import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import logo from '../../../public/logo.png';
const Login = () => {
  const [formData, setFormData] = useState({
    login: '', // Can be email or phone
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('email'); // 'email' or 'phone'
  
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const detectLoginType = (value) => {
    if (value.includes('@')) {
      setLoginType('email');
    } else if (/^[+]?\d[\d\s\-()]+$/.test(value)) {
      setLoginType('phone');
    }
  };

  const handleLoginChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      login: value
    });
    detectLoginType(value);
    
    // Clear error when user starts typing
    if (errors.login) {
      setErrors({
        ...errors,
        login: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.login) {
      newErrors.login = 'Email или номер телефона обязателен';
    } else if (loginType === 'email' && !/\S+@\S+\.\S+/.test(formData.login)) {
      newErrors.login = 'Некорректный email';
    } else if (loginType === 'phone' && !/^[+]?([7-8])\d{10}$/.test(formData.login.replace(/[\s\-()]/g, ''))) {
      newErrors.login = 'Некорректный номер телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login(formData.login, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="logo" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('login')}</h2>
          <p className="mt-2 text-gray-600">
            {t('loginSubtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                {t('loginField')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginType === 'email' ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  id="login"
                  name="login"
                  type="text"
                  value={formData.login}
                  onChange={handleLoginChange}
                  className={`input-field pl-10 ${errors.login ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder={t('loginFieldPlaceholder')}
                />
              </div>
              {errors.login && (
                <p className="mt-1 text-sm text-red-600">{errors.login}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

         


          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : t('login')}
          </button>

          <div className="text-center">
            <span className="text-gray-600">{t('noAccount')}</span>{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              {t('register')}
            </Link>
          </div>

          
        </form>
      </div>
    </div>
  );
};

export default Login;