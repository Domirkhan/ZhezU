import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import logo from '../../../public/logo.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logo} alt="logo" />
              </div>
              <span className="text-xl font-bold">{t('footerBrand')}</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footerDesc')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://zhezu.edu.kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                <ExternalLink size={16} />
                <span>zhezu.edu.kz</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footerContacts')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} />
                <span className="text-sm">{t('footerAddress')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} />
                <a href={`tel:${t('footerPhone').replace(/[^\d+]/g, '')}`} className="text-sm hover:underline text-gray-300">{t('footerPhone')}</a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <span className="text-sm">{t('footerEmail')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footerQuickLinks')}</h3>
            <div className="space-y-2">
              <a href="/programs" className="block text-gray-300 hover:text-white transition-colors text-sm">
                {t('footerLinkPrograms')}
              </a>
              <a href="/admission" className="block text-gray-300 hover:text-white transition-colors text-sm">
                {t('footerLinkAdmission')}
              </a>
              <a href="/news" className="block text-gray-300 hover:text-white transition-colors text-sm">
                {t('footerLinkNews')}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('footerCopyright')}
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            {t('footerMadeFor')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;