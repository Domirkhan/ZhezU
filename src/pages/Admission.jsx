import { useTranslation } from 'react-i18next';
import { MapPin, Phone, User } from 'lucide-react';

const Admission = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // Тексты на разных языках
  const info = {
    ru: {
      title: 'Приёмная комиссия',
      addressLabel: 'Адрес приемной комиссии:',
      address: '100600  г. Жезказган, пр.Алашахана, 1б, Главный корпус, кабинет №108',
      phoneLabel: 'Тел. приемной комиссии:',
      phones: ['+7 (710 2) 410-461', '+7 777-218-93-25'],
      responsible: 'Ответственный секретарь приёмной комиссии — Сапарбек Жанерке Ахановна',
    },
    kk: {
      title: 'Қабылдау комиссиясы',
      addressLabel: 'Қабылдау комиссиясының мекенжайы:',
      address: '100600  Жезқазған қ., Алашахан даңғылы, 1б, Бас корпус, 108-кабинет',
      phoneLabel: 'Қабылдау комиссиясының телефоны:',
      phones: ['+7 (710 2) 410-461', '+7 777-218-93-25'],
      responsible: 'Қабылдау комиссиясының жауапты хатшысы — Сапарбек Жанерке Ахановна',
    },
    en: {
      title: 'Admission Office',
      addressLabel: 'Admission Office Address:',
      address: '100600 Zhezkazgan, Alashakhana Ave., 1b, Main building, office 108',
      phoneLabel: 'Admission Office Phone:',
      phones: ['+7 (710 2) 410-461', '+7 777-218-93-25'],
      responsible: 'Responsible Secretary of the Admission Office — Saparbek Zhanerke Akhanovna',
    },
  };
  const content = info[lang] || info['ru'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 card">
        <h1 className="text-3xl font-bold text-primary-700 mb-6 text-center">{content.title}</h1>
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="text-primary-500 mt-1" size={22} />
          <div>
            <div className="font-semibold text-gray-700">{content.addressLabel}</div>
            <div className="text-gray-900">{content.address}</div>
          </div>
        </div>
        <div className="flex items-start gap-3 mb-4">
          <Phone className="text-primary-500 mt-1" size={22} />
          <div>
            <div className="font-semibold text-gray-700">{content.phoneLabel}</div>
            {content.phones.map((phone, idx) => (
              <div key={idx} className="text-gray-900">{phone}</div>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-3 mb-2">
          <User className="text-primary-500 mt-1" size={22} />
          <div className="text-gray-900">{content.responsible}</div>
        </div>
      </div>
    </div>
  );
};

export default Admission; 