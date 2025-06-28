import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Download,
  RotateCcw,
  Award,
  BookOpen,
  Users,
  Palette,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TestResults = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { categoryScores, totalQuestions, answeredQuestions, fullName } =
    location.state || {};

  if (!categoryScores) {
    navigate("/test");
    return null;
  }

  const categoryInfo = {
    IT: {
      name: t("catITName"),
      icon: BookOpen,
      color: "#3B82F6",
      description: t("catITDesc"),
      professions: [
        // Можно оставить или убрать
      ],
      programs: [
        {
          code: "6В01504",
          name: "Математика и информатика",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В07101",
          name: "Автоматизация и управление",
          department: "Электроэнергетика и охрана труда",
        },
        {
          code: "6В07104",
          name: "Электроэнергетика",
          department: "Электроэнергетика и охрана труда",
        },
      ],
    },
    Social: {
      name: t("catSocialName"),
      icon: Users,
      color: "#10B981",
      description: t("catSocialDesc"),
      professions: [
        // Можно оставить или убрать
      ],
      programs: [
        {
          code: "6В01301",
          name: "Педагогика и методика начального образования",
          department: "Педагогика, психология и филология",
        },
        {
          code: "6В01701",
          name: "Казахский язык и литература",
          department: "Педагогика, психология и филология",
        },
        {
          code: "6В01702",
          name: "Иностранные языки",
          department: "Педагогика, психология и филология",
        },
        {
          code: "6В01704",
          name: "Русский язык и литература",
          department: "Педагогика, психология и филология",
        },
        {
          code: "6В04101",
          name: "Экономика",
          department: "История Казахстана, экономика и право",
        },
      ],
    },
    Science: {
      name: t("catScienceName"),
      icon: Award,
      color: "#8B5CF6",
      description: t("catScienceDesc"),
      professions: [
        // Можно оставить или убрать
      ],
      programs: [
        {
          code: "6В01505",
          name: "Математика и физика",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В01507",
          name: "Биология и химия",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В07201",
          name: "Геология и разведка месторождений полезных ископаемых",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В07203",
          name: "Горное дело",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В07205",
          name: "Обогащение полезных ископаемых",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В07206",
          name: "Металлургия",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В07250",
          name: "Горная инженерия",
          department: "Горное дело, металлургия и естествознание",
        },
        {
          code: "6В11201",
          name: "Безопасность жизнедеятельности и защита окружающей среды",
          department: "Электроэнергетика и охрана труда",
        },
      ],
    },
    Creative: {
      name: t("catCreativeName"),
      icon: Palette,
      color: "#F59E0B",
      description: t("catCreativeDesc"),
      professions: [
        // Можно оставить или убрать
      ],
      programs: [
        {
          code: "6В01402",
          name: "Физическая культура и спорт",
          department: "Физическая культура и изобразительное искусство",
        },
        {
          code: "6В01401",
          name: "Изобразительное искусство и черчение",
          department: "Физическая культура и изобразительное искусство",
        },
        {
          code: "6В07103",
          name: "Технологические машины и оборудования",
          department: "Технологические машины и строительство",
        },
        {
          code: "6В07106",
          name: "Транспорт, транспортная техника и технологии",
          department: "Технологические машины и строительство",
        },
        {
          code: "6В07301",
          name: "Строительство",
          department: "Технологические машины и строительство",
        },
      ],
    },
  };

  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a)
    .map(([category, score]) => ({
      category,
      score,
      percentage: Math.round((score / answeredQuestions) * 100),
      ...categoryInfo[category],
    }));

  const topCategory = sortedCategories[0];

  const pieData = sortedCategories.map((cat) => ({
    name: cat.name,
    value: cat.score,
    color: cat.color,
    percentage: cat.percentage,
  }));

  const barData = sortedCategories.map((cat) => ({
    name: cat.name.split(" ")[0], // Short name for chart
    score: cat.score,
    percentage: cat.percentage,
  }));

  const handleDownloadPDF = async () => {
    const element = document.getElementById("test-results-pdf");
    if (!element) {
      alert("Ошибка: не найден блок для PDF");
      return;
    }
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let imgWidth = pageWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      // Если высота изображения больше высоты страницы, разбиваем на несколько страниц
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // Многостраничный PDF
        let remainingHeight = imgHeight;
        let pageNum = 0;
        while (remainingHeight > 0) {
          const sourceY = (pageHeight / imgHeight) * canvas.height * pageNum;
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(
            canvas.height - sourceY,
            (pageHeight / imgHeight) * canvas.height
          );
          const ctx = pageCanvas.getContext("2d");
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
          const pageImgData = pageCanvas.toDataURL("image/png");
          if (pageNum > 0) pdf.addPage();
          pdf.addImage(
            pageImgData,
            "PNG",
            0,
            0,
            imgWidth,
            Math.min(pageHeight, remainingHeight)
          );
          remainingHeight -= pageHeight;
          pageNum++;
        }
      }
      pdf.save("test-results.pdf");
    } catch (e) {
      alert("Ошибка при создании PDF");
    }
  };

  const handleRetakeTest = () => {
    navigate("/test");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="test-results-pdf">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("testResults")}
            </h1>
            <p className="text-xl text-gray-600">{t("testResultsDesc")}</p>
            {/* ФИО пользователя под заголовком — в закругленном синем блоке */}
            {fullName && (
              <div className="mt-6 flex justify-center">
                <div
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-4 flex flex-row items-center shadow-md"
                  style={{ lineHeight: "1.5" }}
                >
                  <span
                    className="text-white text-base font-medium mr-2"
                    style={{ lineHeight: "1.5" }}
                  >
                    {t("fullNameLabel")}
                  </span>
                  <span
                    className="text-white text-xl font-bold"
                    style={{ lineHeight: "1.5" }}
                  >
                    {fullName}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {answeredQuestions}/{totalQuestions}
              </div>
              <p className="text-gray-600">{t("answeredQuestions")}</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-secondary-600 mb-2">
                {Math.round((answeredQuestions / totalQuestions) * 100)}%
              </div>
              <p className="text-gray-600">{t("testCompletion")}</p>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">
                {topCategory.percentage}%
              </div>
              <p className="text-gray-600">{t("maxMatch")}</p>
            </div>
          </div>
          {/* Main Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Charts */}
            <div className="space-y-6">
              <div className="card w-full overflow-x-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("categoryDistribution")}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ percentage }) => `${percentage || 0}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Легенда под графиком */}
                <div className="flex flex-wrap gap-4 justify-center mt-4 w-full">
                  {pieData.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      <span
                        style={{
                          background: entry.color,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                      ></span>
                      <span className="text-gray-700 text-sm">
                        {entry.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {entry.percentage || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("scoreResults")}
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
                  style={{ backgroundColor: topCategory.color + "20" }}
                >
                  <topCategory.icon
                    className="text-white"
                    size={24}
                    style={{ color: topCategory.color }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("mainSpecialization")}
                  </h3>
                  <p className="text-gray-600">
                    {topCategory.percentage}% {t("match")}
                  </p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {topCategory.name}
              </h4>
              <p className="text-gray-600 mb-4">{topCategory.description}</p>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    {t("recommendedProfessionsTitle")}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {topCategory.professions
                      .slice(0, 3)
                      .map((profession, index) => (
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
                  <h5 className="font-medium text-gray-900 mb-2">
                    {t("programsTitle")}
                  </h5>
                  <div className="space-y-1">
                    {topCategory.programs.map((program, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-700 text-sm font-semibold">
                          {program.code}
                        </span>
                        <span className="text-gray-700 text-sm">
                          {program.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          ({program.department})
                        </span>
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
              {t("recommendedProfessionsTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.category}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color + "20" }}
                        >
                          <Icon size={20} style={{ color: category.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {category.percentage}% соответствие
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-lg font-bold"
                          style={{ color: category.color }}
                        >
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 mb-1">
                        Профессии:
                      </p>
                      {category.programs && category.programs.length > 0 ? (
                        <ul className="space-y-1">
                          {category.programs.map((program, idx) => (
                            <li key={idx}>
                              <span className="font-semibold">
                                {program.code}
                              </span>{" "}
                              — {program.name}{" "}
                              <span className="text-gray-500 text-xs">
                                ({program.department})
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">Нет данных</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Приемная комиссия */}
          <div
            className="mt-10 flex justify-center print:break-inside-avoid"
            style={{ pageBreakInside: "avoid" }}
          >
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md max-w-xl w-full text-center print:bg-yellow-200 print:border-yellow-700 print:text-black">
              <div className="text-lg font-bold text-yellow-800 mb-2 print:text-yellow-900">
                Приемная комиссия
              </div>
              <div className="text-gray-900 text-base font-medium print:text-black">
                Жанерке Аханқызы
              </div>
              <div className="text-gray-700 text-base print:text-black">
                +7 777 218 93 25
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          style={{ marginTop: "2rem" }}
        >
          <button
            onClick={handleDownloadPDF}
            className="btn-primary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>{t("downloadPDF")}</span>
          </button>
          <button
            onClick={handleRetakeTest}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={20} />
            <span>{t("retakeTest")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
