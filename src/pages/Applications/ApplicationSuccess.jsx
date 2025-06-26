import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

const ApplicationSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
      <h1 className="text-3xl font-bold mb-4">{ 'Заявка успешно отправлена!'}</h1>
      <p className="text-lg text-gray-700 mb-8">
        {'Ваша заявка принята и будет рассмотрена в ближайшее время.'}
      </p>
      <Link to="/applications" className="btn-primary">
        {t('myApplicationsTitle') || 'Мои заявки'}
      </Link>
    </div>
  );
};

export default ApplicationSuccess;