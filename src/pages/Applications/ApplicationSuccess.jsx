import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

const ApplicationSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-start bg-gray-50 px-4 pt-12 pb-8">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Заявка успешно отправлена!</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6">Ваша заявка принята и будет рассмотрена в ближайшее время.</p>
        <Link to="/applications" className="btn-primary mt-2">
          {t('myApplicationsTitle') || 'Мои заявки'}
        </Link>
      </div>
    </div>
  );
};

export default ApplicationSuccess;