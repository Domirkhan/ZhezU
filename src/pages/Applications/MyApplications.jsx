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
        return t('myApplicationsStatusDraft');
      case 'submitted':
        return t('myApplicationsStatusSubmitted');
      case 'under_review':
        return t('myApplicationsStatusReview');
      case 'accepted':
        return t('myApplicationsStatusAccepted');
      case 'rejected':
        return t('myApplicationsStatusRejected');
      default:
        return t('myApplicationsStatusUnknown');
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
            <p className="text-gray-600 mt-4">{t('myApplicationsLoading')}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">{t('myApplicationsTitle')}</h1>
            <p className="text-gray-600 mt-2">
              {t('myApplicationsDesc')}
            </p>
          </div>
          <Link to="/applications/new" className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>{t('myApplicationsNew')}</span>
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('myApplicationsNo')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('myApplicationsNoDesc')}
            </p>
            <Link to="/applications/new" className="btn-primary">
              {t('myApplicationsCreate')}
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
                        {t('myApplicationsTitle')} #{application._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('myApplicationsCreated')}: {formatDate(application.createdAt)}
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
                      <p className="text-sm text-gray-600">{t('myApplicationsIIN')}</p>
                      <p className="font-medium">{application.personalInfo?.iin || t('notDefined')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{t('myApplicationsSpecialitiesCount')}</p>
                      <p className="font-medium">{application.specialities?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {application.status === 'submitted' ? t('myApplicationsStatusSubmitted') : 
                         application.status === 'under_review' ? t('myApplicationsStatusReview') :
                         application.status === 'accepted' ? t('myApplicationsStatusAccepted') :
                         application.status === 'rejected' ? t('myApplicationsStatusRejected') : t('myApplicationsUpdated')}
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
                      {t('myApplicationsSpecialities')}
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
                      {t('myApplicationsENT')}
                    </h4>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-primary-600">
                        {application.entResults.totalScore}
                      </span>
                      <span className="text-sm text-gray-600">{t('myApplicationsENTPoints')}</span>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {application.comments && application.comments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      {t('myApplicationsComments')}
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
                      {t('myApplicationsView')}
                    </Link>
                    
                    {application.status === 'draft' && (
                      <Link
                        to={`/applications/${application._id}/edit`}
                        className="btn-primary text-sm"
                      >
                        {t('myApplicationsEdit')}
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
                      {t('myApplicationsSubmit')}
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
              {t('myApplicationsStatuses')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{t('myApplicationsStatusDraft')}</p>
                  <p className="text-sm text-gray-600">{t('myApplicationsStatusLabelDraft')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{t('myApplicationsStatusSubmitted')}</p>
                  <p className="text-sm text-gray-600">{t('myApplicationsStatusLabelSubmitted')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-gray-900">{t('myApplicationsStatusReview')}</p>
                  <p className="text-sm text-gray-600">{t('myApplicationsStatusLabelReview')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">{t('myApplicationsStatusAccepted')}</p>
                  <p className="text-sm text-gray-600">{t('myApplicationsStatusLabelAccepted')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('myApplicationsInfo')}
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>{t('myApplicationsInfo1')}</p>
              <p>{t('myApplicationsInfo2')}</p>
              <p>{t('myApplicationsInfo3')}</p>
              <p>{t('myApplicationsInfo4')}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {t('myApplicationsContact')}
              </p>
              <p className="text-sm text-gray-600">
                {t('myApplicationsContactPhone')}<br />
                {t('myApplicationsContactEmail')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;