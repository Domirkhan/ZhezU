import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  FileText,
  GraduationCap,
  Newspaper,
  Settings,
  TrendingUp,
  Calendar,
  Award,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut,
  BarChart3,
  Search,
  Filter,
  X,
  Clock,
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import PropTypes from 'prop-types';
import StatisticsPanel from '../../components/StatisticsPanel';
import Modal from '../../components/Modal';
import ApplicationModal from '../Applications/ApplicationModal';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [news, setNews] = useState([]);
  
  // Mock data - in real app, this would come from API
  const [stats, setStats] = useState({
    totalUsers: 1245,
    totalTests: 8923,
    totalNews: 45,
    totalSpecialties: 28,
    todayRegistrations: 12,
    activeTests: 156
  });
// Конфиг для статусов
const statusConfig = {
  submitted: { label: 'Подана', color: 'blue', icon: Clock },
  under_review: { label: 'На рассмотрении', color: 'yellow', icon: Eye },
  accepted: { label: 'Принята', color: 'green', icon: CheckCircle },
  rejected: { label: 'Отклонена', color: 'red', icon: XCircle }
};
useEffect(() => {
  if (activeTab === 'applications') fetchApplications();
}, [activeTab]);

const fetchApplications = async () => {
  try {
    const response = await axios.get('https://zhezu.onrender.com/api/admin/applications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('admin applications:', response.data);
    setApplications(Array.isArray(response.data.applications) ? response.data.applications : []);
  } catch (error) {
    setApplications([]);
  }
};
const filteredApplications = () => {
  let filtered = applications;
  if (statusFilter !== 'all') {
    filtered = filtered.filter(app => app.status === statusFilter);
  }
  if (searchTerm) {
    filtered = filtered.filter(app =>
      (app.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  return filtered;
};
const handleStatusChange = async (applicationId, newStatus) => {
  try {
    // Отправляем запрос на сервер для смены статуса и отправки email
    await axios.put(
      `https://zhezu.onrender.com/api/admin/applications/${applicationId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    // Обновляем локально
    setApplications(applications =>
      applications.map(app =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );
    alert(`Статус заявки изменен на "${statusConfig[newStatus].label}". Уведомление отправлено.`);
  } catch (error) {
    alert('Ошибка при смене статуса');
    console.error(error);
  }
};
const handleViewApplication = (application) => {
  setSelectedApplication(application);
  setShowApplicationModal(true);
};

useEffect(() => {
  fetchSpecialties();
  fetchNews();
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
const fetchNews = async () => {
  try {
    const response = await axios.get('https://zhezu.onrender.com/api/news', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // API возвращает объект { news: [...], ... }
    setNews(Array.isArray(response.data.news) ? response.data.news : []);
  } catch (error) {
    setNews([]);
    console.error('Ошибка при загрузке новостей:', error);
  }
};
  const [testQuestions, setTestQuestions] = useState([
    {
      id: 1,
      question: 'Какой тип деятельности вас больше привлекает?',
      options: [
        { id: 1, text: 'Работа с людьми', category: 'social' },
        { id: 2, text: 'Работа с техникой', category: 'technical' },
        { id: 3, text: 'Творческая деятельность', category: 'creative' },
        { id: 4, text: 'Аналитическая работа', category: 'analytical' }
      ]
    },
    {
      id: 2,
      question: 'В какой среде вам комфортнее работать?',
      options: [
        { id: 1, text: 'В команде', category: 'social' },
        { id: 2, text: 'Индивидуально', category: 'technical' },
        { id: 3, text: 'В творческой студии', category: 'creative' },
        { id: 4, text: 'В исследовательской лаборатории', category: 'analytical' }
      ]
    }
  ]);

const [users, setUsers] = useState([]);
useEffect(() => {
  if (activeTab === 'users') {
    fetchUsers();
  }
}, [activeTab]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('https://zhezu.onrender.com/api/admin/users', {
     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // Ожидается, что сервер вернет массив пользователей
    setUsers(Array.isArray(response.data.users) ? response.data.users : []);
  } catch (error) {
    setUsers([]);
    console.error('Ошибка при загрузке пользователей:', error);
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
    
    { id: 'applications', name: 'Заявки', icon: FileText },
    { id: 'specialties', name: 'Специальности', icon: GraduationCap },
    { id: 'news', name: 'Новости', icon: Newspaper },
   
    { id: 'users', name: 'Пользователи', icon: Users },
    { id: 'statistics', name: 'Статистика', icon: BarChart3 },
    
  ];

  const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend = null }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              +{trend}% за месяц
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`text-${color}-600`} size={24} />
        </div>
      </div>
    </div>
  );

  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string,
    trend: PropTypes.number
  };

  const handleAddItem = (type) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = (type, id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      switch (type) {
        case 'specialty':
          setSpecialties(specialties.filter(s => s.id !== id));
          break;
        case 'news':
          setNews(news.filter(n => n.id !== id));
          break;
        case 'question':
          setTestQuestions(testQuestions.filter(q => q.id !== id));
          break;
        case 'user':
          setUsers(users.filter(u => u.id !== id));
          break;
        default:
          break;
      }
    }
  };

const handleSaveItem = async (type, data) => {
  try {
    switch (type) {
     case 'specialty':
  if (editingItem) {
    // Редактирование специальности
    const response = await axios.put(
      `https://zhezu.onrender.com/api/admin/specialities/${editingItem._id || editingItem.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setSpecialties(specialties.map(s =>
      (s._id === editingItem._id || s.id === editingItem.id)
        ? response.data.speciality
        : s
    ));
  } else {
    // Создание специальности
    const response = await axios.post(
      'https://zhezu.onrender.com/api/admin/specialities',
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setSpecialties([...specialties, response.data.speciality]);
  }
  break;

case 'news':
  if (editingItem) {
    if (data.image && typeof data.image !== 'string') {
      // Если фото меняется, отправляем FormData
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('titleKk', data.titleKk || data.title);
      formDataToSend.append('titleEn', data.titleEn || data.title);
      formDataToSend.append('content', data.content);
      formDataToSend.append('contentKk', data.contentKk || data.content);
      formDataToSend.append('contentEn', data.contentEn || data.content);
      formDataToSend.append('excerpt', data.excerpt || data.content?.substring(0, 150) || '');
      formDataToSend.append('category', data.category || 'admission');
      // Принудительно публикуем новость
      formDataToSend.append('status', 'published');
      formDataToSend.append('isPublished', 'true');
      formDataToSend.append('image', data.image);

      const response = await axios.put(
        `https://zhezu.onrender.com/api/admin/news/${editingItem._id || editingItem.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      setNews(news.map(n => (n._id === editingItem._id ? response.data.news : n)));
    } else {
      // Без смены фото — обычный JSON
      const response = await axios.put(
        `https://zhezu.onrender.com/api/admin/news/${editingItem._id || editingItem.id}`,
        {
          title: data.title,
          titleKk: data.titleKk || data.title,
          titleEn: data.titleEn || data.title,
          content: data.content,
          contentKk: data.contentKk || data.content,
          contentEn: data.contentEn || data.content,
          excerpt: data.excerpt || data.content?.substring(0, 150) || '',
          category: data.category || 'admission',
          // Принудительно публикуем новость
          status: 'published',
          isPublished: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNews(news.map(n => (n._id === editingItem._id ? response.data.news : n)));
    }
  } else {
    // Создание новости с поддержкой фото
    const formDataToSend = new FormData();
    formDataToSend.append('title', data.title);
    formDataToSend.append('titleKk', data.titleKk || data.title);
    formDataToSend.append('titleEn', data.titleEn || data.title);
    formDataToSend.append('content', data.content);
    formDataToSend.append('contentKk', data.contentKk || data.content);
    formDataToSend.append('contentEn', data.contentEn || data.content);
    formDataToSend.append('excerpt', data.excerpt || data.content?.substring(0, 150) || '');
    formDataToSend.append('category', data.category || 'admission');
    // Принудительно публикуем новость
    formDataToSend.append('status', 'published');
    formDataToSend.append('isPublished', 'true');
    if (data.image) {
      formDataToSend.append('image', data.image);
    }

    const response = await axios.post(
      'https://zhezu.onrender.com/api/admin/news',
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
      }
    );
    setNews([...news, response.data.news]);
  }
  break;
 

      case 'question':
        if (editingItem) {
          setTestQuestions(testQuestions.map(q => q.id === editingItem.id ? { ...q, ...data } : q));
        } else {
          const newQuestion = {
            id: Date.now(),
            ...data
          };
          setTestQuestions([...testQuestions, newQuestion]);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    alert('Ошибка при сохранении данных');
    console.error(error);
  }
  setShowModal(false);
  setEditingItem(null);
};

  const filteredData = (data, searchFields) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  AdminDashboard.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      fullName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      role: PropTypes.string,
      createdAt: PropTypes.string,
      lastLogin: PropTypes.string,
    })
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
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

      
{activeTab === 'applications' && (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Управление заявками</h2>
        <p className="text-sm text-gray-600">Просматривайте и управляйте заявками студентов</p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск заявок..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">Все статусы</option>
        <option value="submitted">Подана</option>
        <option value="under_review">На рассмотрении</option>
        <option value="accepted">Принята</option>
        <option value="rejected">Отклонена</option>
      </select>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Студент</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата подачи</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications().map((application) => {
              const StatusIcon = statusConfig[application.status]?.icon || Clock;
              return (
                <tr key={application._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {application.studentName?.charAt(0) || ''}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.userId?.fullName}

                        </div>
                        <div className="text-sm text-gray-500">
                          {application.userId?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={application.status}
                      onChange={e => handleStatusChange(application._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="submitted">Подана</option>
                      <option value="under_review">На рассмотрении</option>
                      <option value="accepted">Принята</option>
                      <option value="rejected">Отклонена</option>
                    </select>
                  </td>
                 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.submittedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                     <button 
                      onClick={() => handleViewApplication(application)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      title="Просмотреть заявку"
                    >
                      
                      <Eye size={16} />
                    </button>
                      <button 
                        onClick={() => handleDeleteItem('application', application._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Удалить заявку"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    {/* Модальное окно для просмотра заявки можно реализовать отдельно */}
  </div>
)}
        {activeTab === 'specialties' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Управление специальностями</h2>
                <p className="text-sm text-gray-600">Добавляйте, редактируйте и удаляйте специальности</p>
              </div>
              <button
                onClick={() => handleAddItem('specialty')}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                <span>Добавить специальность</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Поиск специальностей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                <span>Фильтры</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData(specialties, ['name', 'description']).map((specialty) => (
                <div key={specialty._id || specialty.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="text-purple-600" size={20} />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        specialty.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {specialty.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem('specialty', specialty)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('specialty', specialty.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {specialty.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {specialty.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Студентов:</span>
                    <span className="font-medium text-indigo-600">{specialty.studentsCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Управление новостями</h2>
                <p className="text-sm text-gray-600">Создавайте и редактируйте новости для студентов</p>
              </div>
              <button
                onClick={() => handleAddItem('news')}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                <span>Добавить новость</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Поиск новостей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredData(news, ['title', 'content', 'author']).map((article) => (
                <div key={article._id || article.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Newspaper className="text-orange-600" size={20} />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem('news', article)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('news', article.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                   <span>Автор: {article.author?.fullName || 'Админ'}</span>
                    <span>{formatDate(article.publishedAt || article.createdAt) || 'Дата не указана'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Управление тестами</h2>
                <p className="text-sm text-gray-600">Создавайте и редактируйте вопросы для профориентационного теста</p>
              </div>
              <button
                onClick={() => handleAddItem('question')}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                <span>Добавить вопрос</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика теста</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{testQuestions.length}</p>
                  <p className="text-sm text-gray-600">Всего вопросов</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-sm text-gray-600">Категории</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">8923</p>
                  <p className="text-sm text-gray-600">Прохождений</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">10</p>
                  <p className="text-sm text-gray-600">Мин. на тест</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {testQuestions.map((question, index) => (
                <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {question.question}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem('question', question)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('question', question.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          option.category === 'social' ? 'bg-blue-500' :
                          option.category === 'technical' ? 'bg-green-500' :
                          option.category === 'creative' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}></div>
                        <span className="text-sm text-gray-700">{option.text}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {option.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Управление пользователями</h2>
                <p className="text-sm text-gray-600">Просматривайте и управляйте учетными записями пользователей</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Поиск пользователей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Пользователь
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Контакты
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Роль
                      </th>
                      
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData(users, ['fullName', 'email', 'phoneNumber']).map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.fullName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phoneNumber}</div>
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
                        
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <StatisticsPanel />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Настройки системы</h2>
              <p className="text-sm text-gray-600">Управляйте основными параметрами системы</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      defaultValue="Талапкер ЖеЗУ"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email для уведомлений
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      defaultValue="admin@zhezu.edu.kz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Максимальное время теста (минуты)
                    </label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      defaultValue="30"
                    />
                  </div>
                  
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Сохранить настройки
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="sk-..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL сайта ЖеЗУ
                    </label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      defaultValue="https://zhezu.edu.kz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email SMTP сервер
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Сохранить интеграции
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={
            modalType === 'specialty' ? (editingItem ? 'Редактировать специальность' : 'Добавить специальность') :
            modalType === 'news' ? (editingItem ? 'Редактировать новость' : 'Добавить новость') :
            modalType === 'question' ? (editingItem ? 'Редактировать вопрос' : 'Добавить вопрос') :
            'Модальное окно'
          }
          type={modalType}
          data={editingItem}
          onSave={handleSaveItem}
        />
      )}
     {showApplicationModal && selectedApplication && (
  <ApplicationModal
    isOpen={showApplicationModal}
    onClose={() => setShowApplicationModal(false)}
    application={selectedApplication}
    statusConfig={statusConfig} // ← добавить!
    onStatusChange={handleStatusChange} // если нужно
  />
)}
    </div>
  );
};

export default AdminDashboard;