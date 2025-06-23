import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">Талапкер ЖеЗУ</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Интеллектуальный ИИ-агент для профориентации и консультаций абитуриентов 
              Жетысуского университета имени И. Жансугурова.
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
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} />
                <span className="text-sm">г. Талдыкорган, ул. Жансугурова, 187А</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} />
                <span className="text-sm">+7 (7282) 23-88-49</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <span className="text-sm">info@zhezu.edu.kz</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Образовательные программы
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Приемная комиссия
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Гранты и стипендии
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Новости университета
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Талапкер ЖеЗУ. Все права защищены.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            Создано для абитуриентов ЖеЗУ
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;