import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Plus,
  AlertCircle,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import axios from 'axios';

const MyApplications = () => {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'submitted':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'under_review':
        return <Eye className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft':
        return 'Черновик';
      case 'submitted':
        return 'Подана';
      case 'under_review':
        return 'На рассмотрении';
      case 'accepted':
        return 'Принята';
      case 'rejected':
        return 'Отклонена';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Загрузка заявок...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мои заявки</h1>
            <p className="text-gray-600 mt-2">
              Управляйте своими заявками на поступление в ЖеЗУ
            </p>
          </div>
          <Link to="/applications/new" className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Новая заявка</span>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              У вас пока нет заявок
            </h3>
            <p className="text-gray-600 mb-6">
              Создайте свою первую заявку на поступление в ЖеЗУ
            </p>
            <Link to="/applications/new" className="btn-primary">
              Создать заявку
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(application.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Заявка #{application._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Создана: {formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">ИИН</p>
                      <p className="font-medium">{application.personalInfo?.iin || 'Не указан'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Специальностей</p>
                      <p className="font-medium">{application.specialities?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {application.status === 'submitted' ? 'Подана' : 
                         application.status === 'under_review' ? 'На рассмотрении с' :
                         application.status === 'accepted' ? 'Принята' :
                         application.status === 'rejected' ? 'Отклонена' : 'Обновлена'}
                      </p>
                      <p className="font-medium">
                        {application.submittedAt ? formatDate(application.submittedAt) :
                         application.reviewedAt ? formatDate(application.reviewedAt) :
                         formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Specialities */}
                {application.specialities && application.specialities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Выбранные специальности:
                    </h4>
                    <div className="space-y-1">
                      {application.specialities
                        .sort((a, b) => a.priority - b.priority)
                        .map((spec, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {spec.priority}
                            </span>
                            <span className="text-sm text-gray-700">
                              {spec.specialityId?.name || 'Специальность не найдена'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* ENT Results */}
                {application.entResults?.totalScore && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Результаты ЕНТ:
                    </h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {application.entResults.totalScore}
                      </span>
                      <span className="text-sm text-gray-600">баллов из 140</span>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {application.comments && application.comments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Комментарии:
                    </h4>
                    <div className="space-y-2">
                      {application.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{comment.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-3">
                    <Link
                      to={`/applications/${application._id}`}
                      className="btn-secondary text-sm"
                    >
                      Просмотр
                    </Link>
                    
                    {application.status === 'draft' && (
                      <Link
                        to={`/applications/${application._id}/edit`}
                        className="btn-primary text-sm"
                      >
                        Редактировать
                      </Link>
                    )}
                  </div>

                  {application.status === 'draft' && (
                    <button
                      onClick={async () => {
                        try {
                          await axios.put(`/api/applications/${application._id}/submit`);
                          fetchMyApplications(); // Refresh the list
                        } catch (error) {
                          console.error('Error submitting application:', error);
                          alert('Ошибка при подаче заявки');
                        }
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Подать заявку
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Статусы заявок
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Черновик</p>
                  <p className="text-sm text-gray-600">Заявка не подана, можно редактировать</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Подана</p>
                  <p className="text-sm text-gray-600">Заявка отправлена на рассмотрение</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-gray-900">На рассмотрении</p>
                  <p className="text-sm text-gray-600">Заявка проверяется приемной комиссией</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Принята</p>
                  <p className="text-sm text-gray-600">Заявка одобрена, ожидайте зачисления</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Важная информация
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                • Заявки рассматриваются в течение 5-7 рабочих дней
              </p>
              <p>
                • После подачи заявки редактирование невозможно
              </p>
              <p>
                • Уведомления о статусе отправляются на email и SMS
              </p>
              <p>
                • При возникновении вопросов обращайтесь в приемную комиссию
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Контакты приемной комиссии:
              </p>
              <p className="text-sm text-gray-600">
                Телефон: +7 (7282) 23-88-49<br />
                Email: admission@zhezu.edu.kz
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;