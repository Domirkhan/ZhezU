import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, Eye, Tag, ArrowRight } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NewsList = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: "all", name: t("newsCatAll") },
    { id: "admission", name: t("newsCatAdmission") },
    { id: "academic", name: t("newsCatAcademic") },
    { id: "events", name: t("newsCatEvents") },
    { id: "announcements", name: t("newsCatAnnouncements") },
  ];

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [selectedCategory, currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
      };

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      // Важно: если фронт и бэк на разных портах, пропишите baseURL в axios или используйте полный путь
      const response = await axios.get("https://zhezu.onrender.com/api/news", {
        params,
      });
      // Проверяем, что получили именно объект с массивом новостей
      if (response.data && Array.isArray(response.data.news)) {
        setNews(response.data.news);
        setTotalPages(Number(response.data.totalPages) || 1);
      } else {
        setNews([]);
        setTotalPages(1);
      }
    } catch (error) {
      setNews([]);
      setTotalPages(1);
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryName = (category) => {
    switch (category) {
      case "all":
        return t("newsCatAll");
      case "admission":
        return t("newsCatAdmission");
      case "academic":
        return t("newsCatAcademic");
      case "events":
        return t("newsCatEvents");
      case "announcements":
        return t("newsCatAnnouncements");
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "admission":
        return "bg-blue-100 text-blue-800";
      case "academic":
        return "bg-green-100 text-green-800";
      case "events":
        return "bg-purple-100 text-purple-800";
      case "announcements":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("newsPageTitle")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("newsPageDesc")}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">{t("newsLoading")}</p>
          </div>
        ) : !Array.isArray(news) || news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{t("newsNotFound")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {news.map((article) => (
                <article
                  key={article._id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  {article.image && (
                    <div className="bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={`https://zhezu.onrender.com/uploads/documents/${article.image.filename}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=600";
                        }}
                      />
                    </div>
                  )}

                  {/* Category */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {getCategoryName(article.category)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {(() => {
                      const lang = i18n.language;
                      if (lang === "kk")
                        return article.titleKk || article.title;
                      if (lang === "en")
                        return article.titleEn || article.title;
                      return article.title;
                    })()}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-gray-600 mb-4"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                    }}
                  >
                    {(() => {
                      const lang = i18n.language;
                      let text = "";
                      if (lang === "kk")
                        text = article.contentKk || article.content;
                      else if (lang === "en")
                        text = article.contentEn || article.content;
                      else text = article.content;
                      return text
                        ? text.substring(0, 150) +
                            (text.length > 150 ? "..." : "")
                        : "";
                    })()}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More */}
                  <Link
                    to={`/news/${article._id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t("newsReadMore")}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("newsPrev")}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md border ${
                          currentPage === page
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("newsNext")}
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsList;
