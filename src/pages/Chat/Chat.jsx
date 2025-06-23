import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Loader } from 'lucide-react';

const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Привет! Я ИИ-консультант Талапкер ЖеЗУ. Я помогу вам с вопросами о поступлении, специальностях, грантах и стипендиях. Что вас интересует?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const handleSendMessage = async (e) => {
  e.preventDefault();

  if (!inputMessage.trim() || isLoading) return;

  const userMessage = {
    id: messages.length + 1,
    type: 'user',
    content: inputMessage,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

  try {
    // Отправляем историю сообщений на сервер
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Добавьте Authorization, если используете защищённый маршрут
      },
      body: JSON.stringify({
        messages: [
          // Можно отправлять только последние 10 сообщений для контекста
          ...messages.map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          { role: 'user', content: inputMessage }
        ]
      })
    });

    const data = await response.json();
    const botContent = data.choices?.[0]?.message?.content || 'Ошибка ответа от GPT';

    const botMessage = {
      id: messages.length + 2,
      type: 'bot',
      content: botContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (err) {
    setMessages(prev => [
      ...prev,
      {
        id: messages.length + 2,
        type: 'bot',
        content: 'Ошибка соединения с сервером',
        timestamp: new Date()
      }
    ]);
  } finally {
    setIsLoading(false);
  }
};

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('специальность') || input.includes('программа')) {
      return `В ЖеЗУ представлены различные образовательные программы:

🎓 **Информационные технологии:**
- Информационные системы
- Программная инженерия
- Кибербезопасность

👥 **Гуманитарные науки:**
- Психология
- Педагогика
- Филология

🔬 **Естественные науки:**
- Биология
- Химия
- Экология

Какая область вас больше интересует? Я могу рассказать подробнее о любой специальности.`;
    }
    
    if (input.includes('грант') || input.includes('стипендия')) {
      return `Информация о грантах и стипендиях в ЖеЗУ:

💰 **Государственный образовательный грант:**
- Покрывает 100% стоимости обучения
- Выдается по результатам ЕНТ
- Количество грантов ограничено по специальностям

🏆 **Стипендии:**
- Академическая стипендия (для отличников)
- Социальная стипендия (для льготных категорий)
- Именные стипендии

📅 **Важные даты подачи документов:**
- Подача документов: июнь-июль
- Зачисление: август

Нужна информация по конкретной специальности?`;
    }
    
    if (input.includes('ент') || input.includes('поступление') || input.includes('экзамен')) {
      return `Информация о поступлении в ЖеЗУ:

📝 **ЕНТ (Единое национальное тестирование):**
- Обязательные предметы: Казахский/Русский язык, История Казахстана, Математическая грамотность
- Профильные предметы зависят от специальности
- Минимальный порог: 50 баллов

📋 **Необходимые документы:**
- Заявление
- Документ об образовании
- Удостоверение личности
- Медицинская справка
- Фотографии

📞 **Контакты приемной комиссии:**
- Телефон: +7 (7282) 23-88-49
- Email: info@zhezu.edu.kz
- Адрес: г. Талдыкорган, ул. Жансугурова, 187А

Есть вопросы по конкретной специальности?`;
    }
    
    if (input.includes('контакт') || input.includes('телефон') || input.includes('адрес')) {
      return `Контактная информация ЖеЗУ:

🏢 **Адрес:**
Республика Казахстан, г. Талдыкорган
ул. Жансугурова, 187А

📞 **Телефоны:**
- Приемная комиссия: +7 (7282) 23-88-49
- Деканат: +7 (7282) 23-88-50
- Общий: +7 (7282) 23-88-48

📧 **Email:**
- info@zhezu.edu.kz
- admission@zhezu.edu.kz

🌐 **Веб-сайт:**
https://zhezu.edu.kz

⏰ **Время работы:**
Пн-Пт: 9:00-18:00
Сб: 9:00-13:00`;
    }
    
    if (input.includes('тест') || input.includes('профориентация')) {
      return `Отлично! Профориентационное тестирование поможет вам определить подходящую специальность.

🎯 **Наш тест включает:**
- 15 вопросов по интересам и склонностям
- Анализ личностных качеств
- Рекомендации по специальностям ЖеЗУ
- Персональный PDF-отчет

Рекомендую пройти тест на нашей платформе - он займет всего 10-15 минут и даст вам четкое понимание, какие специальности вам подходят больше всего.

Хотите начать тестирование прямо сейчас? Просто перейдите в раздел "Тест".`;
    }
    
    // Default response
    return `Спасибо за ваш вопрос! Я специализируюсь на консультациях по поступлению в ЖеЗУ.

Я могу помочь вам с:
• 📚 Выбором специальности и образовательных программ
• 💰 Информацией о грантах и стипендиях
• 📝 Процедурой поступления и ЕНТ
• 📞 Контактами и документами
• 🎯 Профориентационным тестированием

Задайте мне конкретный вопрос, и я постараюсь дать вам максимально полную информацию!`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickQuestions = [
    'Какие специальности есть в ЖеЗУ?',
    'Как получить грант?',
    'Когда подавать документы?',
    'Контакты приемной комиссии'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('chatTitle')}
          </h1>
          <p className="text-gray-600">
            Задайте любые вопросы о поступлении в ЖеЗУ
          </p>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Популярные вопросы:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96 md:h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary-600' 
                        : 'bg-secondary-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="text-white" size={16} />
                      ) : (
                        <Bot className="text-white" size={16} />
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm md:text-base">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex mr-3">
                  <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center mr-3">
                    <Bot className="text-white" size={16} />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-1">
                      <Loader className="animate-spin text-gray-500" size={16} />
                      <span className="text-gray-600 text-sm">Печатает...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-100 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('chatPlaceholder')}
                className="flex-1 input-field"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ИИ-консультант работает 24/7 и готов ответить на любые вопросы о поступлении в ЖеЗУ
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;