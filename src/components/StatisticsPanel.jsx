import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const StatisticsPanel = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('tests');

  // Mock data for charts
  const testStats = [
    { month: 'Янв', completed: 234, started: 345 },
    { month: 'Фев', completed: 187, started: 298 },
    { month: 'Мар', completed: 432, started: 521 },
    { month: 'Апр', completed: 345, started: 456 },
    { month: 'Май', completed: 567, started: 678 },
    { month: 'Июн', completed: 234, started: 321 },
  ];

  const categoryDistribution = [
    { name: 'Техническое', count: 2341, percentage: 35 },
    { name: 'Социальное', count: 1876, percentage: 28 },
    { name: 'Творческое', count: 1234, percentage: 19 },
    { name: 'Аналитическое', count: 1189, percentage: 18 },
  ];

  const popularSpecialties = [
    { name: 'Информационные технологии', tests: 892, growth: 12 },
    { name: 'Медицина', tests: 734, growth: 8 },
    { name: 'Инженерия', tests: 567, growth: -3 },
    { name: 'Экономика', tests: 445, growth: 15 },
    { name: 'Юриспруденция', tests: 321, growth: 5 },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color = 'indigo' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={16} className="mr-1" />
              {change > 0 ? '+' : ''}{change}% за период
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
    </div>
  );

  const ChartBar = ({ label, value, maxValue, color }) => (
    <div className="flex items-center space-x-3">
      <div className="w-20 text-sm text-gray-600">{label}</div>
      <div className="flex-1 flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-${color}-500`}
            style={{ width: `${(value / maxValue) * 100}%` }}
          ></div>
        </div>
        <div className="w-12 text-right text-sm font-medium text-gray-900">
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Статистика и аналитика</h2>
          <p className="text-sm text-gray-600 mt-1">Подробная статистика использования системы</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw size={16} />
            <span>Обновить</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download size={16} />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего тестов пройдено"
          value="8,924"
          change={12}
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Активных пользователей"
          value="1,245"
          change={8}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Завершенных тестов"
          value="7,123"
          change={-3}
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="Среднее время теста"
          value="18 мин"
          change={5}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Completion Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Прохождение тестов</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Завершено</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Начато</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {testStats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-gray-600">{stat.month}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="absolute top-0 left-0 h-4 bg-indigo-500 rounded-full"
                      style={{ width: `${(stat.completed / stat.started) * 100}%` }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 h-4 bg-gray-300 rounded-full"
                      style={{ width: `${(stat.started / 700) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.completed}/{stat.started}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      </div>

      {/* Popular Specialties */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Популярные специальности</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700">
            Показать все
          </button>
        </div>
        <div className="space-y-4">
          {popularSpecialties.map((specialty, index) => (
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

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Время прохождения</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Средний:</span>
              <span className="font-medium">18 мин</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Минимальный:</span>
              <span className="font-medium">7 мин</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Максимальный:</span>
              <span className="font-medium">45 мин</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Устройства</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Мобильные:</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Планшеты:</span>
              <span className="font-medium">17%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Десктоп:</span>
              <span className="font-medium">15%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Регионы</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Алматы:</span>
              <span className="font-medium">32%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Нур-Султан:</span>
              <span className="font-medium">28%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Шымкент:</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Другие:</span>
              <span className="font-medium">25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;