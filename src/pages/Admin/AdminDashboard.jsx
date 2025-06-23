import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  TrendingUp,
  Calendar,
  Award,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalMessages: 0,
    todayRegistrations: 0
  });
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // В реальном приложении здесь были бы отдельные API endpoints для админа
      const [usersResponse, testsResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/tests')
      ]);
      
      setUsers(usersResponse.data || []);
      setTests(testsResponse.data || []);
      
      // Подсчет статистики
      setStats({
        totalUsers: usersResponse.data?.length || 0,
        totalTests: testsResponse.data?.length || 0,
        totalMessages: 0, // Будет реализовано позже
        todayRegistrations: 0 // Будет реализовано позже
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Устанавливаем пустые данные в случае ошибки
      setUsers([]);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: TrendingUp },
    { id: 'users', name: 'Пользователи', icon: Users },
    { id: 'tests', name: 'Тесты', icon: FileText },
    { id: 'messages', name: 'Сообщения', icon: MessageSquare },
    { id: 'settings', name: 'Настройки', icon: Settings }
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Панель администратора
          </h1>
          <p className="text-gray-600">
            Управление системой Талапкер ЖеЗУ
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Всего пользователей"
                value={stats.totalUsers}
                icon={Users}
                color="primary"
              />
              <StatCard
                title="Пройдено тестов"
                value={stats.totalTests}
                icon={FileText}
                color="secondary"
              />
              <StatCard
                title="Сообщений в чате"
                value={stats.totalMessages}
                icon={MessageSquare}
                color="accent"
              />
              <StatCard
                title="Регистраций сегодня"
                value={stats.todayRegistrations}
                icon={Calendar}
                color="success"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Последние регистрации
                </h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Нет данных</p>
                ) : (
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user._id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Последние тесты
                </h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </div>
                ) : tests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Нет данных</p>
                ) : (
                  <div className="space-y-3">
                    {tests.slice(0, 5).map((test) => (
                      <div key={test._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Award className="text-secondary-600" size={16} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Тест завершен
                            </p>
                            <p className="text-xs text-gray-500">
                              {test.answeredQuestions}/{test.totalQuestions} вопросов
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(test.completedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Управление пользователями
              </h3>
              <button className="btn-primary flex items-center space-x-2">
                <Plus size={16} />
                <span>Добавить пользователя</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата регистрации
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.fullName?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">
                              <Eye size={16} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit size={16} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Управление тестами
              </h3>
              <button className="btn-primary flex items-center space-x-2">
                <Plus size={16} />
                <span>Создать тест</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Профориентационный тест
                    </h4>
                    <p className="text-sm text-gray-600">
                      Основной тест для определения профессиональных склонностей
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Активен
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Вопросов</p>
                    <p className="font-medium">15</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Категорий</p>
                    <p className="font-medium">4</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Прохождений</p>
                    <p className="font-medium">{tests.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Время</p>
                    <p className="font-medium">30 мин</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">
                    Редактировать
                  </button>
                  <button className="btn-secondary text-sm">
                    Статистика
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Деактивировать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Сообщения чата
            </h3>
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Функция в разработке</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Общие настройки
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название системы
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    defaultValue="Талапкер ЖеЗУ"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email для уведомлений
                  </label>
                  <input 
                    type="email" 
                    className="input-field" 
                    defaultValue="admin@zhezu.edu.kz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Максимальное время теста (минуты)
                  </label>
                  <input 
                    type="number" 
                    className="input-field" 
                    defaultValue="30"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Интеграции
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="sk-..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL сайта ЖеЗУ
                  </label>
                  <input 
                    type="url" 
                    className="input-field" 
                    defaultValue="https://zhezu.edu.kz"
                  />
                </div>

                <button className="btn-primary">
                  Сохранить настройки
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;