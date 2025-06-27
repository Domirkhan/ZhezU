import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Bot, User, Loader } from "lucide-react";

const PREDEFINED_ANSWERS = {
  ru: [
    {
      variants: ["Какие специальности есть в ZhezU?", "Какие специальности есть в ЖеЗУ?", "Какие специальности есть в Zhezu?"],
      answer: `В ZhezU представлены следующие специальности:\n\n<b>Кафедра «Педагогика, психология и филология»</b>\n• 6В01301 — Педагогика и методика начального образования\n• 6В01701 — Казахский язык и литература\n• 6В01702 — Иностранные языки\n• 6В01704 — Русский язык и литература\n\n<b>Кафедра «Физическая культура и изобразительное искусство»</b>\n• 6В01402 — Физическая культура и спорт\n• 6В01401 — Изобразительное искусство и черчение\n\n<b>Кафедра «Горное дело, металлургия и естествознание»</b>\n• 6В01504 — Математика и информатика\n• 6В01505 — Математика и физика\n• 6В01507 — Биология и химия\n• 6В07201 — Геология и разведка месторождений полезных ископаемых\n• 6В07203 — Горное дело\n• 6В07205 — Обогащение полезных ископаемых\n• 6В07206 — Металлургия\n• 6В07250 — Горная инженерия\n\n<b>Кафедра «История Казахстана, экономика и право»</b>\n• 6В04101 — Экономика\n\n<b>Кафедра «Электроэнергетика и охрана труда»</b>\n• 6В07104 — Электроэнергетика\n• 6В07101 — Автоматизация и управление\n• 6В11201 — Безопасность жизнедеятельности и защита окружающей среды\n\n<b>Кафедра «Технологические машины и строительство»</b>\n• 6В07103 — Технологические машины и оборудование\n• 6В07106 — Транспорт, транспортная техника и технологии\n• 6В07301 — Строительство`
    },
    {
      variants: ["Контакты приемной комиссии", "Контакты приемной комиссии?"],
      answer: `Приёмная комиссия ZhezU:\n\n<b>Адрес:</b> 100600, г. Жезказган, пр. Алашахана, 1б, Главный корпус, кабинет №108\n<b>Телефон:</b> +7 (7102) 410-461, +7 777 218 93 25\n<b>Ответственный секретарь:</b> Сапарбек Жанерке Ахановна`
    },
    {
      variants: ["Когда подавать документы?", "Когда подавать документы"],
      answer: `Подавать документы надо с 20 июня по 24 августа.\n\nДля поступления в ZhezU необходимы следующие документы:\n\n• Аттестат с приложением (школа) или диплом (колледж/университет)\n• Медицинская справка по форме №75-у\n• Копия удостоверения личности (3 шт.)\n• Сертификат ЕНТ\n• Скоросшиватель\n• Конверт\n• Файл\n\nПодача документов осуществляется в приёмную комиссию университета. Следите за сроками на официальном сайте.`
    }
  ],
  kk: [
    {
      variants: ["ZhezU-да қандай мамандықтар бар?", "ZhezU-да қандай мамандықтар бар"],
      answer: `ZhezU университетінде келесі мамандықтар бар:\n\n<b>«Педагогика, психология және филология» кафедрасы</b>\n• 6В01301 — Бастауышта оқытудың педагогикасы мен әдістемесі\n• 6В01701 — Қазақ тілі мен әдебиеті\n• 6В01702 — Шет тілдері\n• 6В01704 — Орыс тілі мен әдебиеті\n\n<b>«Дене шынықтыру және бейнелеу өнері» кафедрасы</b>\n• 6В01402 — Дене шынықтыру және спорт\n• 6В01401 — Бейнелеу өнері және сызу\n\n<b>«Тау-кен ісі, металлургия және жаратылыстану» кафедрасы</b>\n• 6В01504 — Математика және информатика\n• 6В01505 — Математика және физика\n• 6В01507 — Биология және химия\n• 6В07201 — Пайдалы қазбалар кен орындарын барлау және геология\n• 6В07203 — Тау-кен ісі\n• 6В07205 — Пайдалы қазбаларды байыту\n• 6В07206 — Металлургия\n• 6В07250 — Тау-кен инженериясы\n\n<b>«Қазақстан тарихы, экономика және құқық» кафедрасы</b>\n• 6В04101 — Экономика\n\n<b>«Электроэнергетика және еңбек қорғау» кафедрасы</b>\n• 6В07104 — Электроэнергетика\n• 6В07101 — Автоматтандыру және басқару\n• 6В11201 — Өмір тіршілігінің қауіпсіздігі және қоршаған ортаны қорғау\n\n<b>«Технологиялық машиналар және құрылыс» кафедрасы</b>\n• 6В07103 — Технологиялық машиналар мен жабдықтар\n• 6В07106 — Көлік, көлік техникасы және технологиялары\n• 6В07301 — Құрылыс`
    },
    {
      variants: ["Қабылдау комиссиясының контактілері", "Қабылдау комиссиясының контактілері?"],
      answer: `ZhezU қабылдау комиссиясы:\n\n<b>Мекенжайы:</b> 100600, Жезқазған қ., Алашахан даңғылы, 1б, Бас корпус, 108-кабинет\n<b>Телефон:</b> +7 (7102) 410-461, +7 777 218 93 25\n<b>Жауапты хатшы:</b> Сапарбек Жанерке Ахановна`
    },
    {
      variants: ["Құжаттарды қашан тапсыру керек?", "Құжаттарды қашан тапсыру керек"],
      answer: `Құжаттарды 20 маусымнан 24 тамызға дейін тапсыру керек.\n\nZhezU-ға түсу үшін келесі құжаттар қажет:\n\n• Аттестат пен қосымша (мектеп) немесе диплом (колледж/университет)\n• №75-у медициналық анықтама\n• Жеке куәліктің көшірмесі (3 дана)\n• ҰБТ сертификаты\n• Скоросшиватель\n• Конверт\n• Файл\n\nҚұжаттарды қабылдау комиссиясына тапсыру қажет. Мерзімдер туралы ресми сайттан қараңыз.`
    }
  ],
  en: [
    {
      variants: ["What specialties are available at ZhezU?", "What specialties are available at Zhezu?", "What specialties are there at ZhezU?"],
      answer: `ZhezU offers the following specialties:\n\n<b>Department of Pedagogy, Psychology and Philology</b>\n• 6B01301 — Pedagogy and Methods of Primary Education\n• 6B01701 — Kazakh Language and Literature\n• 6B01702 — Foreign Languages\n• 6B01704 — Russian Language and Literature\n\n<b>Department of Physical Education and Fine Arts</b>\n• 6B01402 — Physical Education and Sports\n• 6B01401 — Fine Arts and Drawing\n\n<b>Department of Mining, Metallurgy and Natural Sciences</b>\n• 6B01504 — Mathematics and Informatics\n• 6B01505 — Mathematics and Physics\n• 6B01507 — Biology and Chemistry\n• 6B07201 — Geology and Exploration of Mineral Deposits\n• 6B07203 — Mining\n• 6B07205 — Mineral Processing\n• 6B07206 — Metallurgy\n• 6B07250 — Mining Engineering\n\n<b>Department of History of Kazakhstan, Economics and Law</b>\n• 6B04101 — Economics\n\n<b>Department of Power Engineering and Labor Protection</b>\n• 6B07104 — Power Engineering\n• 6B07101 — Automation and Control\n• 6B11201 — Life Safety and Environmental Protection\n\n<b>Department of Technological Machines and Construction</b>\n• 6B07103 — Technological Machines and Equipment\n• 6B07106 — Transport, Transport Engineering and Technologies\n• 6B07301 — Construction`
    },
    {
      variants: ["Admission office contacts", "Admission office contacts?"],
      answer: `ZhezU Admission Office:\n\n<b>Address:</b> 100600, Zhezkazgan, Alashakhana Ave., 1b, Main building, office 108\n<b>Phone:</b> +7 (7102) 410-461, +7 777 218 93 25\n<b>Responsible secretary:</b> Saparbek Zhanerke Akhanovna`
    },
    {
      variants: ["When to submit documents?", "When to submit documents"],
      answer: `Documents must be submitted from June 20 to August 24.\n\nTo apply to ZhezU, you need the following documents:\n\n• Certificate with appendix (school) or diploma (college/university)\n• Medical certificate (form No. 75-u)\n• Copy of ID card (3 pcs)\n• UNT certificate\n• File folder\n• Envelope\n• File\n\nDocuments must be submitted to the admission office. Please check the official website for deadlines.`
    }
  ]
};

const getPredefinedAnswer = (question, lang) => {
  const answers = PREDEFINED_ANSWERS[lang] || PREDEFINED_ANSWERS['ru'];
  for (const item of answers) {
    if (item.variants.some((q) => q.toLowerCase() === question.toLowerCase())) {
      return item.answer;
    }
  }
  return null;
};

const Chat = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: t("chatWelcome"),
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    // Проверяем на заготовленный вопрос
    const lang = i18n.language || 'ru';
    const predefined = getPredefinedAnswer(userMessage.content, lang);
    if (predefined) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "bot",
            content: <span dangerouslySetInnerHTML={{__html: predefined}} />,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }
    try {
      // Отправляем историю сообщений на сервер
      const response = await fetch("https://zhezu.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Добавьте Authorization, если используете защищённый маршрут
        },
        body: JSON.stringify({
          messages: [
            // Можно отправлять только последние 10 сообщений для контекста
            ...messages.map((m) => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.content,
            })),
            { role: "user", content: inputMessage },
          ],
        }),
      });

      const data = await response.json();
      const botContent =
        data.choices?.[0]?.message?.content || "Ошибка ответа от GPT";

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: botContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          type: "bot",
          content: "Ошибка соединения с сервером",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickQuestions = [
    t("chatQuick1"),
    t("chatQuick3"),
    t("chatQuick4"),
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
            {t("chatTitle")}
          </h1>
          <p className="text-gray-600">{t("chatSubtitle")}</p>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">{t("chatPopular")}</p>
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
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-xs md:max-w-md lg:max-w-lg ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 ${
                      message.type === "user" ? "ml-3" : "mr-3"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-primary-600"
                          : "bg-secondary-600"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="text-white" size={16} />
                      ) : (
                        <Bot className="text-white" size={16} />
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.type === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm md:text-base">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-primary-100"
                          : "text-gray-500"
                      }`}
                    >
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
                      <Loader
                        className="animate-spin text-gray-500"
                        size={16}
                      />
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
                placeholder={t("chatPlaceholder")}
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
          <p className="text-sm text-gray-500">{t("chatFooter")}</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
