import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';

const programs = [
  // Кафедра «Педагогика, психология и филология»
  {
    code: '6В01301',
    name: {
      kk: 'Бастауышта оқытудың педагогикасы мен әдістемесі',
      ru: 'Педагогика и методика начального образования',
      en: 'Pedagogy and Methods of Primary Education',
    },
    department: {
      kk: 'Педагогика, психология және филология',
      ru: 'Педагогика, психология и филология',
      en: 'Pedagogy, Psychology and Philology',
    },
  },
  {
    code: '6В01701',
    name: {
      kk: 'Қазақ тілі мен әдебиеті',
      ru: 'Казахский язык и литература',
      en: 'Kazakh Language and Literature',
    },
    department: {
      kk: 'Педагогика, психология және филология',
      ru: 'Педагогика, психология и филология',
      en: 'Pedagogy, Psychology and Philology',
    },
  },
  {
    code: '6В01702',
    name: {
      kk: 'Шет тілдері',
      ru: 'Иностранные языки',
      en: 'Foreign Languages',
    },
    department: {
      kk: 'Педагогика, психология және филология',
      ru: 'Педагогика, психология и филология',
      en: 'Pedagogy, Psychology and Philology',
    },
  },
  {
    code: '6В01704',
    name: {
      kk: 'Орыс тілі мен әдебиеті',
      ru: 'Русский язык и литература',
      en: 'Russian Language and Literature',
    },
    department: {
      kk: 'Педагогика, психология және филология',
      ru: 'Педагогика, психология и филология',
      en: 'Pedagogy, Psychology and Philology',
    },
  },
  // Кафедра «Физическая культура и изобразительное искусство»
  {
    code: '6В01402',
    name: {
      kk: 'Дене шынықтыру және спорт',
      ru: 'Физическая культура и спорт',
      en: 'Physical Culture and Sports',
    },
    department: {
      kk: 'Дене шынықтыру және бейнелеу өнері',
      ru: 'Физическая культура и изобразительное искусство',
      en: 'Physical Culture and Fine Arts',
    },
  },
  {
    code: '6В01401',
    name: {
      kk: 'Бейнелеу өнері және сызу',
      ru: 'Изобразительное искусство и черчение',
      en: 'Fine Arts and Drawing',
    },
    department: {
      kk: 'Дене шынықтыру және бейнелеу өнері',
      ru: 'Физическая культура и изобразительное искусство',
      en: 'Physical Culture and Fine Arts',
    },
  },
  // Кафедра «Горное дело, металлургия и естествознание»
  {
    code: '6В01504',
    name: {
      kk: 'Математика және информатика',
      ru: 'Математика и информатика',
      en: 'Mathematics and Informatics',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В01505',
    name: {
      kk: 'Математика және физика',
      ru: 'Математика и физика',
      en: 'Mathematics and Physics',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В01507',
    name: {
      kk: 'Биология және химия',
      ru: 'Биология и химия',
      en: 'Biology and Chemistry',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В07201',
    name: {
      kk: 'Пайдалы қазбалар кен орындарын барлау және іздеу',
      ru: 'Геология и разведка месторождений полезных ископаемых',
      en: 'Geology and Exploration of Mineral Deposits',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В07203',
    name: {
      kk: 'Тау-кен ісі',
      ru: 'Горное дело',
      en: 'Mining Engineering',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В07205',
    name: {
      kk: 'Пайдалы қазбаларды байыту',
      ru: 'Обогащение полезных ископаемых',
      en: 'Mineral Processing',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В07206',
    name: {
      kk: 'Металлургия',
      ru: 'Металлургия',
      en: 'Metallurgy',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  {
    code: '6В07250',
    name: {
      kk: 'Тау-кен инженериясы',
      ru: 'Горная инженерия',
      en: 'Mining Engineering',
    },
    department: {
      kk: 'Тау-кен ісі, металлургия және жаратылыстану',
      ru: 'Горное дело, металлургия и естествознание',
      en: 'Mining, Metallurgy and Natural Sciences',
    },
  },
  // Кафедра «История Казахстана, экономика и право»
  {
    code: '6В04101',
    name: {
      kk: 'Экономика',
      ru: 'Экономика',
      en: 'Economics',
    },
    department: {
      kk: 'Қазақстан тарихы, экономика және құқық',
      ru: 'История Казахстана, экономика и право',
      en: 'History of Kazakhstan, Economics and Law',
    },
  },
  // Кафедра «Электроэнергетика и охрана труда»
  {
    code: '6В07104',
    name: {
      kk: 'Электроэнергетика',
      ru: 'Электроэнергетика',
      en: 'Power Engineering',
    },
    department: {
      kk: 'Электроэнергетика және еңбек қорғау',
      ru: 'Электроэнергетика и охрана труда',
      en: 'Power Engineering and Labor Protection',
    },
  },
  {
    code: '6В07101',
    name: {
      kk: 'Автоматтандыру және басқару',
      ru: 'Автоматизация и управление',
      en: 'Automation and Control',
    },
    department: {
      kk: 'Электроэнергетика және еңбек қорғау',
      ru: 'Электроэнергетика и охрана труда',
      en: 'Power Engineering and Labor Protection',
    },
  },
  {
    code: '6В11201',
    name: {
      kk: 'Тіршілік қауіпсіздігі және қоршаған ортаны қорғау',
      ru: 'Безопасность жизнедеятельности и защита окружающей среды',
      en: 'Life Safety and Environmental Protection',
    },
    department: {
      kk: 'Электроэнергетика және еңбек қорғау',
      ru: 'Электроэнергетика и охрана труда',
      en: 'Power Engineering and Labor Protection',
    },
  },
  // Кафедра «Технологические машины и строительство»
  {
    code: '6В07103',
    name: {
      kk: 'Технологиялық машиналар мен жабдықтар',
      ru: 'Технологические машины и оборудования',
      en: 'Technological Machines and Equipment',
    },
    department: {
      kk: 'Технологиялық машиналар және құрылыс',
      ru: 'Технологические машины и строительство',
      en: 'Technological Machines and Construction',
    },
  },
  {
    code: '6В07106',
    name: {
      kk: 'Көлік, көлік техникасы және технологиялары',
      ru: 'Транспорт, транспортная техника и технологии',
      en: 'Transport, Transport Engineering and Technologies',
    },
    department: {
      kk: 'Технологиялық машиналар және құрылыс',
      ru: 'Технологические машины и строительство',
      en: 'Technological Machines and Construction',
    },
  },
  {
    code: '6В07301',
    name: {
      kk: 'Құрылыс',
      ru: 'Строительство',
      en: 'Construction',
    },
    department: {
      kk: 'Технологиялық машиналар және құрылыс',
      ru: 'Технологические машины и строительство',
      en: 'Technological Machines and Construction',
    },
  },
];

const Programs = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            {t('footerLinkPrograms')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('homeFeaturesDesc')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program) => (
            <div key={program.code} className="card flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="text-primary-500" size={28} />
                <span className="text-lg font-semibold text-gray-900">{program.code}</span>
              </div>
              <div className="text-xl font-bold text-primary-700 mb-1">
                {program.name[lang] || program.name['ru']}
              </div>
              <div className="text-gray-600 text-sm">
                {program.department[lang] || program.department['ru']}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programs; 