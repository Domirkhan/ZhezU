import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Calendar, Award, FileText, Settings } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchTestHistory();
  }, []);

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get('/api/test/history');
      setTestHistory(response.data);
    } catch (error) {
      console.error('Error fetching test history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopCategory = (categoryScores) => {
    if (!categoryScores || typeof categoryScores !== 'object') return t('notDefined');
    
    const entries = Object.entries(categoryScores);
    if (entries.length === 0) return t('notDefined');
    
    const topEntry = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    
    const categoryNames = {
      IT: t('catITName'),
      Social: t('catSocialName'),
      Science: t('catScienceName'),
      Creative: t('catCreativeName')
    };
    
    return categoryNames[topEntry[0]] || topEntry[0];
  };

  const tabs = [
    { id: 'info', name: t('personalInfo'), icon: User },
    { id: 'tests', name: t('testHistory'), icon: FileText },
    { id: 'settings', name: t('settings'), icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.fullName || 'Пользователь'}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 justify-center">
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
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('mainInfo')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">{t('fullName')}</p>
                    <p className="font-medium text-gray-900">{user?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">{t('email')}</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">{t('phoneNumber')}</p>
                    <p className="font-medium text-gray-900">{user?.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">{t('registerDate')}</p>
                    <p className="font-medium text-gray-900">
                      {user?.createdAt ? formatDate(user.createdAt) : 'Не указано'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('statistics')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="text-primary-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-900">{t('testsPassed')}</p>
                      <p className="text-sm text-gray-600">{t('totalTests')}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {testHistory.length}
                  </span>
                </div>
                
                {testHistory.length > 0 && (
                  <div className="p-4 bg-secondary-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">{t('lastResult')}</p>
                    <p className="text-sm text-gray-600">
                      {getTopCategory(testHistory[0]?.categoryScores)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(testHistory[0]?.completedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {t('testHistoryTitle')}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">{t('loading')}</p>
              </div>
            ) : testHistory.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">{t('noTestsYet')}</p>
                <button 
                  onClick={() => window.location.href = '/test'}
                  className="btn-primary mt-4"
                >
                  {t('takeFirstTest')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {testHistory.map((test, index) => (
                  <div key={test._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Тестирование #{testHistory.length - index}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(test.completedAt)}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Завершен
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Вопросов</p>
                        <p className="font-medium">{test.totalQuestions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Отвечено</p>
                        <p className="font-medium">{test.answeredQuestions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Завершенность</p>
                        <p className="font-medium">
                          {Math.round((test.answeredQuestions / test.totalQuestions) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Результат</p>
                        <p className="font-medium text-primary-600">
                          {getTopCategory(test.categoryScores)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('accountSettings')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('interfaceLanguage')}
                  </label>
                  <select className="input-field">
                    <option value="ru">{t('langRu')}</option>
                    <option value="kk">{t('langKk')}</option>
                    <option value="en">{t('langEn')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('notifications')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">{t('emailNotifications')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">{t('testReminders')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('security')}
              </h3>
              <div className="space-y-4">
                <button className="w-full btn-secondary text-left">
                  {t('changePassword')}
                </button>
                <button className="w-full btn-secondary text-left">
                  {t('twoFactorAuth')}
                </button>
                <button className="w-full text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 py-2 px-4 rounded-lg transition-colors">
                  {t('deleteAccount')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;