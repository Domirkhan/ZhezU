import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  FileText,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit
} from 'lucide-react';

const ApplicationModal = ({ isOpen, onClose, application, statusConfig, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(application.status);

  if (!isOpen || !application) return null;

  const handleStatusUpdate = () => {
    if (selectedStatus !== application.status) {
      onStatusChange(application._id, selectedStatus);
      onClose();
    }
  };

  const StatusIcon = statusConfig[application.status].icon;
  const documentsComplete = Object.values(application.documents).every(doc => doc);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-lg">
                {application.userId?.fullName?.charAt(0) || ''}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Заявка: {application.userId?.fullName}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <StatusIcon 
                  size={16} 
                  className={`text-${statusConfig[application.status].color}-600`} 
                />
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig[application.status].color}-100 text-${statusConfig[application.status].color}-800`}>
                  {statusConfig[application.status].label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Status Management */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Управление статусом</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Изменить статус заявки
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label} - {config.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleStatusUpdate}
                  disabled={selectedStatus === application.status}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Обновить статус
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              При изменении статуса студент получит уведомление на email
            </p>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Личная информация</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Полное имя</p>
                      <p className="font-medium text-gray-900"> {application.userId?.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{application.userId?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Телефон</p>
                      <p className="font-medium text-gray-900">{application.userId?.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Дата рождения</p>
                      <p className="font-medium text-gray-900">
                        {new Date(application.personalInfo.birthDate).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Адрес</p>
                      <p className="font-medium text-gray-900">{application.personalInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о родителях</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Имя родителя</p>
                      <p className="font-medium text-gray-900">{application.personalInfo.parentName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Телефон родителя</p>
                      <p className="font-medium text-gray-900">{application.personalInfo.parentPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Академическая информация</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Выбранная специальность</p>
                      <p className="font-medium text-gray-900">{application.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Результат теста</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{application.testScore}/100</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              application.testScore >= 80 ? 'bg-green-500' :
                              application.testScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${application.testScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Дата подачи</p>
                      <p className="font-medium text-gray-900">
                        {new Date(application.submittedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Документы</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-700">Паспорт</span>
                    </div>
                    {application.documents.passport ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-700">Аттестат</span>
                    </div>
                    {application.documents.certificate ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-700">Фотографии</span>
                    </div>
                    {application.documents.photos ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-700">Медицинская справка</span>
                    </div>
                    {application.documents.medicalCert ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <XCircle className="text-red-600" size={16} />
                    )}
                  </div>
                </div>
                
                <div className="mt-4 p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    {documentsComplete ? (
                      <>
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-800">
                          Все документы предоставлены
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-yellow-600" size={16} />
                        <span className="text-sm font-medium text-yellow-800">
                          Не все документы предоставлены
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">История статусов</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Edit size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Заявка создана</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.submittedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                {application.status !== 'draft' && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Заявка подана</p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.submittedAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Закрыть
          </button>
          <button
            onClick={handleStatusUpdate}
            disabled={selectedStatus === application.status}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;