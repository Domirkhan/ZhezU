import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  kk: {
    translation: {
      // Navigation
      home: 'Басты бет',
      test: 'Тест',
      chat: 'Чат',
      profile: 'Профиль',
      admin: 'Әкімші',
      login: 'Кіру',
      register: 'Тіркелу',
      logout: 'Шығу',

      // Home Page
      welcome: 'Қош келдіңіз!',
      heroTitle: 'Талапкер ЖеЗУ - Сіздің Академиялық Серіктесіңіз',
      heroSubtitle: 'ЖезУ-ға түсу үшін кәсіби бағдар алыңыз, тест тапсырыңыз және жеке кеңес алыңыз',
      startTest: 'Тестті бастау',
      chatWithAI: 'ИИ-мен сөйлесу',
      learnMore: 'Толығырақ',

      // Test
      testTitle: 'Кәсіби бағдар тесті',
      testDescription: 'Сізге ең қолайлы мамандықты табу үшін тестті тапсырыңыз',
      startTesting: 'Тестті бастау',
      question: 'Сұрақ',
      of: '/',
      next: 'Келесі',
      previous: 'Алдыңғы',
      finish: 'Аяқтау',

      // Results
      testResults: 'Тест нәтижелері',
      recommendedProfessions: 'Ұсынылған мамандықтар',
      downloadPDF: 'PDF жүктеу',
      retakeTest: 'Тестті қайта тапсыру',

      // Chat
      chatTitle: 'ИИ-консультант',
      chatPlaceholder: 'Сұрағыңызды жазыңыз...',
      send: 'Жіберу',

      // Profile
      myProfile: 'Менің профилім',
      testHistory: 'Тест тарихы',
      personalInfo: 'Жеке ақпарат',
      settings: 'Параметрлер',

      // Common
      loading: 'Жүктелуде...',
      error: 'Қате орын алды',
      success: 'Сәтті орындалды',
      save: 'Сақтау',
      cancel: 'Болдырмау',
      edit: 'Өңдеу',
      delete: 'Жою',
      
      // Auth
      email: 'Электрондық пошта',
      password: 'Құпия сөз',
      confirmPassword: 'Құпия сөзді растау',
      fullName: 'Толық аты-жөні',
      phoneNumber: 'Телефон нөмірі',
      createAccount: 'Аккаунт жасау',
      haveAccount: 'Аккаунтыңыз бар ма?',
      noAccount: 'Аккаунтыңыз жоқ па?',
      forgotPassword: 'Құпия сөзді ұмыттыңыз ба?',
    }
  },
  ru: {
    translation: {
      // Navigation
      home: 'Главная',
      test: 'Тест',
      chat: 'Чат',
      profile: 'Профиль',
      admin: 'Админ',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',

      // Home Page
      welcome: 'Добро пожаловать!',
      heroTitle: 'Талапкер ЖеЗУ - Ваш Академический Партнер',
      heroSubtitle: 'Получите профориентацию, пройдите тестирование и персональные консультации для поступления в ЖезУ',
      startTest: 'Начать тест',
      chatWithAI: 'Чат с ИИ',
      learnMore: 'Подробнее',

      // Test
      testTitle: 'Тест профориентации',
      testDescription: 'Пройдите тест, чтобы найти наиболее подходящую вам специальность',
      startTesting: 'Начать тестирование',
      question: 'Вопрос',
      of: 'из',
      next: 'Далее',
      previous: 'Назад',
      finish: 'Завершить',

      // Results
      testResults: 'Результаты теста',
      recommendedProfessions: 'Рекомендуемые профессии',
      downloadPDF: 'Скачать PDF',
      retakeTest: 'Пройти тест заново',

      // Chat
      chatTitle: 'ИИ-консультант',
      chatPlaceholder: 'Напишите ваш вопрос...',
      send: 'Отправить',

      // Profile
      myProfile: 'Мой профиль',
      testHistory: 'История тестов',
      personalInfo: 'Личная информация',
      settings: 'Настройки',

      // Common
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      success: 'Успешно выполнено',
      save: 'Сохранить',
      cancel: 'Отмена',
      edit: 'Редактировать',
      delete: 'Удалить',

      // Auth
      email: 'Электронная почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      fullName: 'Полное имя',
      phoneNumber: 'Номер телефона',
      createAccount: 'Создать аккаунт',
      haveAccount: 'Уже есть аккаунт?',
      noAccount: 'Нет аккаунта?',
      forgotPassword: 'Забыли пароль?',
    }
  },
  en: {
    translation: {
      // Navigation
      home: 'Home',
      test: 'Test',
      chat: 'Chat',
      profile: 'Profile',
      admin: 'Admin',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',

      // Home Page
      welcome: 'Welcome!',
      heroTitle: 'Talqapker ZheZU - Your Academic Partner',
      heroSubtitle: 'Get career guidance, take tests, and receive personalized consultations for ZheZU admission',
      startTest: 'Start Test',
      chatWithAI: 'Chat with AI',
      learnMore: 'Learn More',

      // Test
      testTitle: 'Career Orientation Test',
      testDescription: 'Take the test to find the most suitable profession for you',
      startTesting: 'Start Testing',
      question: 'Question',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',

      // Results
      testResults: 'Test Results',
      recommendedProfessions: 'Recommended Professions',
      downloadPDF: 'Download PDF',
      retakeTest: 'Retake Test',

      // Chat
      chatTitle: 'AI Consultant',
      chatPlaceholder: 'Type your question...',
      send: 'Send',

      // Profile
      myProfile: 'My Profile',
      testHistory: 'Test History',
      personalInfo: 'Personal Information',
      settings: 'Settings',

      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Successfully completed',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',

      // Auth
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      noAccount: 'Don\'t have an account?',
      forgotPassword: 'Forgot password?',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;