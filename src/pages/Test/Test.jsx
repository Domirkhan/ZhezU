import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1000); // 30 minutes
  const [isStarted, setIsStarted] = useState(false);

  // Sample questions - in real app, these would come from API
  const questions = [
    {
      id: 1,
      question: "Какой из следующих видов деятельности вам наиболее интересен?",
      options: [
        { id: 'a', text: 'Работа с компьютером и программированием', category: 'IT' },
        { id: 'b', text: 'Общение с людьми и консультирование', category: 'Social' },
        { id: 'c', text: 'Исследование и эксперименты', category: 'Science' },
        { id: 'd', text: 'Создание и дизайн', category: 'Creative' }
      ]
    },
    {
      id: 2,
      question: "В какой среде вы предпочитаете работать?",
      options: [
        { id: 'a', text: 'В тихом офисе за компьютером', category: 'IT' },
        { id: 'b', text: 'В команде с активным общением', category: 'Social' },
        { id: 'c', text: 'В лаборатории или исследовательском центре', category: 'Science' },
        { id: 'd', text: 'В творческой студии или мастерской', category: 'Creative' }
      ]
    },
    {
      id: 3,
      question: "Какие навыки вы считаете своими сильными сторонами?",
      options: [
        { id: 'a', text: 'Логическое мышление и решение технических задач', category: 'IT' },
        { id: 'b', text: 'Коммуникативные навыки и эмпатия', category: 'Social' },
        { id: 'c', text: 'Аналитическое мышление и внимание к деталям', category: 'Science' },
        { id: 'd', text: 'Креативность и художественное видение', category: 'Creative' }
      ]
    },
    {
      id: 4,
      question: "Что мотивирует вас больше всего в работе?",
      options: [
        { id: 'a', text: 'Создание инновационных технологических решений', category: 'IT' },
        { id: 'b', text: 'Помощь людям и решение их проблем', category: 'Social' },
        { id: 'c', text: 'Открытие новых знаний и фактов', category: 'Science' },
        { id: 'd', text: 'Выражение идей через творчество', category: 'Creative' }
      ]
    },
    {
      id: 5,
      question: "Какой тип проектов вас больше привлекает?",
      options: [
        { id: 'a', text: 'Разработка мобильных приложений или веб-сайтов', category: 'IT' },
        { id: 'b', text: 'Организация мероприятий и работа с клиентами', category: 'Social' },
        { id: 'c', text: 'Исследовательские проекты и анализ данных', category: 'Science' },
        { id: 'd', text: 'Создание визуального контента и дизайна', category: 'Creative' }
      ]
    }
  ];

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleFinishTest();
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = () => {
    // Calculate results
    const categoryScores = {};
    
    Object.entries(answers).forEach(([questionId, answerId]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      const selectedOption = question?.options.find(opt => opt.id === answerId);
      
      if (selectedOption) {
        categoryScores[selectedOption.category] = (categoryScores[selectedOption.category] || 0) + 1;
      }
    });

    // Navigate to results with the scores
    navigate('/test/results', { 
      state: { 
        categoryScores,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length
      }
    });
  };

  const startTest = () => {
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('testTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('testDescription')}
            </p>
          </div>

          <div className="card max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Перед началом тестирования
              </h2>
              
              <div className="space-y-4 text-left mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">1</span>
                  </div>
                  <p className="text-gray-700">
                    Тест состоит из <strong>{questions.length} вопросов</strong> по профориентации
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">2</span>
                  </div>
                  <p className="text-gray-700">
                    На прохождение теста отводится <strong>10 минут</strong>
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">3</span>
                  </div>
                  <p className="text-gray-700">
                    Отвечайте честно, основываясь на своих предпочтениях
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">4</span>
                  </div>
                  <p className="text-gray-700">
                    После завершения вы получите персональные рекомендации
                  </p>
                </div>
              </div>

              <button 
                onClick={startTest}
                className="btn-primary text-lg px-8 py-3"
              >
                {t('startTesting')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('testTitle')}
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock size={20} />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="gradient-bg h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{t('question')} {currentQuestion + 1} {t('of')} {questions.length}</span>
            <span>{Math.round(progress)}% завершено</span>
          </div>
        </div>

        {/* Question */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <label
                key={option.id}
                className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-300 ${
                  answers[currentQ.id] === option.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={option.id}
                  checked={answers[currentQ.id] === option.id}
                  onChange={() => handleAnswerSelect(currentQ.id, option.id)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQ.id] === option.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id] === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{option.text}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>{t('previous')}</span>
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleFinishTest}
              disabled={!answers[currentQ.id]}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
            >
              {t('finish')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{t('next')}</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;