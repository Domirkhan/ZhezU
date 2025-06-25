import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, RotateCcw, Award, BookOpen, Users, Palette } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';
const TestResults = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { categoryScores, totalQuestions, answeredQuestions } = location.state || {};

  if (!categoryScores) {
    navigate('/test');
    return null;
  }

  const categoryInfo = {
    IT: {
      name: t('catITName'),
      icon: BookOpen,
      color: '#3B82F6',
      description: t('catITDesc'),
      professions: [
        t('catITProf1'), t('catITProf2'), t('catITProf3'), t('catITProf4'), t('catITProf5')
      ],
      programs: [
        t('catITProg1'), t('catITProg2'), t('catITProg3'), t('catITProg4')
      ]
    },
    Social: {
      name: t('catSocialName'),
      icon: Users,
      color: '#10B981',
      description: t('catSocialDesc'),
      professions: [
        t('catSocialProf1'), t('catSocialProf2'), t('catSocialProf3'), t('catSocialProf4'), t('catSocialProf5')
      ],
      programs: [
        t('catSocialProg1'), t('catSocialProg2'), t('catSocialProg3'), t('catSocialProg4')
      ]
    },
    Science: {
      name: t('catScienceName'),
      icon: Award,
      color: '#8B5CF6',
      description: t('catScienceDesc'),
      professions: [
        t('catScienceProf1'), t('catScienceProf2'), t('catScienceProf3'), t('catScienceProf4'), t('catScienceProf5')
      ],
      programs: [
        t('catScienceProg1'), t('catScienceProg2'), t('catScienceProg3'), t('catScienceProg4'), t('catScienceProg5')
      ]
    },
    Creative: {
      name: t('catCreativeName'),
      icon: Palette,
      color: '#F59E0B',
      description: t('catCreativeDesc'),
      professions: [
        t('catCreativeProf1'), t('catCreativeProf2'), t('catCreativeProf3'), t('catCreativeProf4'), t('catCreativeProf5')
      ],
      programs: [
        t('catCreativeProg1'), t('catCreativeProg2'), t('catCreativeProg3'), t('catCreativeProg4')
      ]
    }
  };

  const sortedCategories = Object.entries(categoryScores)
    .sort(([,a], [,b]) => b - a)
    .map(([category, score]) => ({
      category,
      score,
      percentage: Math.round((score / answeredQuestions) * 100),
      ...categoryInfo[category]
    }));

  const topCategory = sortedCategories[0];

  const pieData = sortedCategories.map(cat => ({
    name: cat.name,
    value: cat.score,
    color: cat.color
  }));

  const barData = sortedCategories.map(cat => ({
    name: cat.name.split(' ')[0], // Short name for chart
    score: cat.score,
    percentage: cat.percentage
  }));

const handleDownloadPDF = async () => {
  try {
    const res = await axios.post(
      '/api/test/generate-pdf',
      {
        categoryScores,
        totalQuestions,
        answeredQuestions,
        // Можно добавить pieData/barData если нужно
      },
      { responseType: 'blob' }
    );
    // Скачать PDF
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'test-results.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (e) {
    alert('Ошибка при генерации PDF');
  }
};

  const handleRetakeTest = () => {
    navigate('/test');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('testResults')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('testResultsDesc')}
          </p>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {answeredQuestions}/{totalQuestions}
            </div>
            <p className="text-gray-600">{t('answeredQuestions')}</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-secondary-600 mb-2">
              {Math.round((answeredQuestions / totalQuestions) * 100)}%
            </div>
            <p className="text-gray-600">{t('testCompletion')}</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent-600 mb-2">
              {topCategory.percentage}%
            </div>
            <p className="text-gray-600">{t('maxMatch')}</p>
          </div>
        </div>

        {/* Main Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Charts */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('categoryDistribution')}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('scoreResults')}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Recommendation */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: topCategory.color + '20' }}
              >
                <topCategory.icon 
                  className="text-white" 
                  size={24}
                  style={{ color: topCategory.color }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('mainSpecialization')}
                </h3>
                <p className="text-gray-600">{topCategory.percentage}% {t('match')}</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {topCategory.name}
            </h4>
            <p className="text-gray-600 mb-4">
              {topCategory.description}
            </p>

            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">{t('recommendedProfessionsTitle')}</h5>
                <div className="flex flex-wrap gap-2">
                  {topCategory.professions.slice(0, 3).map((profession, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {profession}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">{t('programsTitle')}</h5>
                <div className="space-y-1">
                  {topCategory.programs.slice(0, 3).map((program, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{program}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Categories */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {t('recommendedProfessionsTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <Icon 
                          size={20}
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.percentage}% соответствие</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: category.color }}>
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Профессии:</p>
                    <p className="text-gray-600">{category.professions.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleDownloadPDF}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>{t('downloadPDF')}</span>
          </button>
          <button 
            onClick={handleRetakeTest}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>{t('retakeTest')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;