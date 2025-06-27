import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Test = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1000); // 30 minutes
  const [isStarted, setIsStarted] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [fullNameError, setFullNameError] = useState('');

  // Sample questions - in real app, these would come from API
  const questions = [
    {
      id: 1,
      question: t('q1'),
      options: [
        { id: 'a', text: t('q1a'), category: 'IT' },
        { id: 'b', text: t('q1b'), category: 'Social' },
        { id: 'c', text: t('q1c'), category: 'Science' },
        { id: 'd', text: t('q1d'), category: 'Creative' }
      ]
    },
    {
      id: 2,
      question: t('q2'),
      options: [
        { id: 'a', text: t('q2a'), category: 'IT' },
        { id: 'b', text: t('q2b'), category: 'Social' },
        { id: 'c', text: t('q2c'), category: 'Science' },
        { id: 'd', text: t('q2d'), category: 'Creative' }
      ]
    },
    {
      id: 3,
      question: t('q3'),
      options: [
        { id: 'a', text: t('q3a'), category: 'IT' },
        { id: 'b', text: t('q3b'), category: 'Social' },
        { id: 'c', text: t('q3c'), category: 'Science' },
        { id: 'd', text: t('q3d'), category: 'Creative' }
      ]
    },
    {
      id: 4,
      question: t('q4'),
      options: [
        { id: 'a', text: t('q4a'), category: 'IT' },
        { id: 'b', text: t('q4b'), category: 'Social' },
        { id: 'c', text: t('q4c'), category: 'Science' },
        { id: 'd', text: t('q4d'), category: 'Creative' }
      ]
    },
    {
      id: 5,
      question: t('q5'),
      options: [
        { id: 'a', text: t('q5a'), category: 'IT' },
        { id: 'b', text: t('q5b'), category: 'Social' },
        { id: 'c', text: t('q5c'), category: 'Science' },
        { id: 'd', text: t('q5d'), category: 'Creative' }
      ]
    },
    {
      id: 6,
      question: t('q6'),
      options: [
        { id: 'a', text: t('q6a'), category: 'IT' },
        { id: 'b', text: t('q6b'), category: 'Social' },
        { id: 'c', text: t('q6c'), category: 'Science' },
        { id: 'd', text: t('q6d'), category: 'Creative' }
      ]
    },
    {
      id: 7,
      question: t('q7'),
      options: [
        { id: 'a', text: t('q7a'), category: 'IT' },
        { id: 'b', text: t('q7b'), category: 'Social' },
        { id: 'c', text: t('q7c'), category: 'Science' },
        { id: 'd', text: t('q7d'), category: 'Creative' }
      ]
    },
    {
      id: 8,
      question: t('q8'),
      options: [
        { id: 'a', text: t('q8a'), category: 'IT' },
        { id: 'b', text: t('q8b'), category: 'Social' },
        { id: 'c', text: t('q8c'), category: 'Science' },
        { id: 'd', text: t('q8d'), category: 'Creative' }
      ]
    },
    {
      id: 9,
      question: t('q9'),
      options: [
        { id: 'a', text: t('q9a'), category: 'IT' },
        { id: 'b', text: t('q9b'), category: 'Social' },
        { id: 'c', text: t('q9c'), category: 'Science' },
        { id: 'd', text: t('q9d'), category: 'Creative' }
      ]
    },
    {
      id: 10,
      question: t('q10'),
      options: [
        { id: 'a', text: t('q10a'), category: 'IT' },
        { id: 'b', text: t('q10b'), category: 'Social' },
        { id: 'c', text: t('q10c'), category: 'Science' },
        { id: 'd', text: t('q10d'), category: 'Creative' }
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
        answeredQuestions: Object.keys(answers).length,
        fullName
      }
    });
  };

  const startTest = () => {
    if (!fullName.trim()) {
      setFullNameError('Пожалуйста, введите полное ФИО');
      return;
    }
    setFullNameError('');
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
                {t('testBeforeTitle')}
              </h2>
              <div className="mb-6">
                <label className="block text-left text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                  {t('fullName')} *
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={`input-field w-full text-center ${fullNameError ? 'border-red-300' : ''}`}
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Введите ваше полное ФИО"
                  autoComplete="name"
                />
                {fullNameError && <p className="text-red-600 text-sm mt-1">{fullNameError}</p>}
              </div>
              <div className="space-y-4 text-left mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">1</span>
                  </div>
                  <p className="text-gray-700">
                    {t('testBefore1', { count: questions.length })}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">2</span>
                  </div>
                  <p className="text-gray-700">
                    {t('testBefore2')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">3</span>
                  </div>
                  <p className="text-gray-700">
                    {t('testBefore3')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary-600 text-sm font-semibold">4</span>
                  </div>
                  <p className="text-gray-700">
                    {t('testBefore4')}
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
            <span>{t('testProgress', { percent: Math.round(progress) })}</span>
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