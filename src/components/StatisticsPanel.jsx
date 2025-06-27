import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar
} from 'lucide-react';
import axios from 'axios';

const StatisticsPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  useEffect(() => {
    fetchSpecialties();
    const fetchStats = async () => {
      try {
        // Основные метрики
        const res = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Дополнительные данные (пример, если реализовано на сервере)
        // const catRes = await axios.get('/api/admin/statistics/categories', { headers: ... });
        // const popRes = await axios.get('/api/admin/statistics/popular-specialties', { headers: ... });
        setStats({
          ...res.data,
          // categoryDistribution: catRes.data,
          // popularSpecialties: popRes.data
        });
      } catch (e) {
        setError('Ошибка загрузки статистики');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
const fetchSpecialties = async () => {
  try {
    const response = await axios.get('https://zhezu.onrender.com/api/specialities', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setSpecialties(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    setSpecialties([]);
    console.error('Ошибка при загрузке специальностей:', error);
  }
};
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return null;

  // Заглушки для дополнительных данных, если нет API
  const categoryDistribution = stats.categoryDistribution || [
    { name: 'Техническое', count: 0, percentage: 0 },
    { name: 'Социальное', count: 0, percentage: 0 },
    { name: 'Творческое', count: 0, percentage: 0 },
    { name: 'Аналитическое', count: 0, percentage: 0 },
  ];
  const popularSpecialties = stats.popularSpecialties || [];

  const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend = null }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
          {trend !== null && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% за месяц
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Статистика и аналитика</h2>
        <p className="text-sm text-gray-600 mt-1">Подробная статистика использования системы</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Пользователи"
          value={stats.totalUsers}
          icon={Users}
          color="green"
          trend={stats.usersTrend}
        />
        
        <StatCard
          title="Специальности"
          value={specialties.length}
          icon={BarChart3}
          color="purple"
        />
        <StatCard
          title="Новости"
          value={stats.totalNews}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Распределение по категориям
        </h3>
        <div className="space-y-4">
          {categoryDistribution.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  index === 0 ? 'bg-indigo-500' :
                  index === 1 ? 'bg-green-500' :
                  index === 2 ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.count} тестов</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{category.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Specialties */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Популярные специальности</h3>
        </div>
        <div className="space-y-4">
          {specialties.length === 0 && (
            <div className="text-gray-500 text-sm">Нет данных</div>
          )}
          {specialties.map((specialty, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{specialty.name}</p>
                  <p className="text-xs text-gray-500">{specialty.tests} прохождений</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  specialty.growth > 0 ? 'text-green-600' : 
                  specialty.growth < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {specialty.growth > 0 ? '+' : ''}{specialty.growth}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;