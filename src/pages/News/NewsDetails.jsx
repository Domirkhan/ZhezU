import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `https://zhezu.onrender.com/api/news/${id}`
        );
        setNews(response.data);
      } catch {
        setNews(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  // Получаем последние 3 новости (кроме текущей)
  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const response = await axios.get(
          "https://zhezu.onrender.com/api/news",
          { params: { limit: 3 } }
        );
        if (response.data && Array.isArray(response.data.news)) {
          setRecentNews(
            response.data.news.filter((item) => item._id !== id)
          );
        } else {
          setRecentNews([]);
        }
      } catch {
        setRecentNews([]);
      }
    };
    fetchRecentNews();
  }, [id]);

  // Функция для преобразования текста с переносами строк в HTML-абзацы
  const formatTextToParagraphs = (text) => {
    if (!text) return "";
    return text
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "")
      .map((line) => `<p>${line}</p>`)
      .join("");
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (!news) return <div className="text-center py-12">Новость не найдена</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {news.image && (
        <div className="mb-6 rounded-xl overflow-hidden">
          <img
            src={`https://zhezu.onrender.com/uploads/documents/${news.image.filename}`}
            alt={(() => {
              const lang = i18n.language;
              if (lang === "kk") return news.titleKk || news.title;
              if (lang === "en") return news.titleEn || news.title;
              return news.title;
            })()}
            className="mx-auto w-full max-w-sm sm:max-w-md sm:max-h-80 md:max-w-lg md:max-h-[500px] object-contain bg-white"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">
        {(() => {
          const lang = i18n.language;
          if (lang === "kk") return news.titleKk || news.title;
          if (lang === "en") return news.titleEn || news.title;
          return news.title;
        })()}
      </h1>
      <div className="text-gray-500 mb-2">
        {news.author?.fullName || "Админ"} |{" "}
        {new Date(news.publishedAt || news.createdAt).toLocaleDateString(
          "ru-RU"
        )}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: (() => {
            const lang = i18n.language;
            if (lang === "kk")
              return formatTextToParagraphs(news.contentKk || news.content);
            if (lang === "en")
              return formatTextToParagraphs(news.contentEn || news.content);
            return formatTextToParagraphs(news.content);
          })(),
        }}
      />
      {/* Схожие новости */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-semibold mb-4 mt-12">Схожие новости</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentNews.map((item) => (
            <Link
              to={`/news/${item._id}`}
              key={item._id}
              className="block rounded-xl border bg-white hover:shadow-lg transition overflow-hidden"
            >
              {item.image && (
                <img
                  src={`https://zhezu.onrender.com/uploads/documents/${item.image.filename}`}
                  alt={(() => {
                    const lang = i18n.language;
                    if (lang === "kk") return item.titleKk || item.title;
                    if (lang === "en") return item.titleEn || item.title;
                    return item.title;
                  })()}
                  className="w-full h-40 object-contain bg-gray-100"
                />
              )}
              <div className="p-4">
                <div className="font-bold text-lg mb-2 line-clamp-2">
                  {(() => {
                    const lang = i18n.language;
                    if (lang === "kk") return item.titleKk || item.title;
                    if (lang === "en") return item.titleEn || item.title;
                    return item.title;
                  })()}
                </div>
                <div className="text-gray-500 text-sm line-clamp-2">
                  {(() => {
                    const lang = i18n.language;
                    if (lang === "kk") return item.excerptKk || item.contentKk || item.excerpt || item.content;
                    if (lang === "en") return item.excerptEn || item.contentEn || item.excerpt || item.content;
                    return item.excerpt || item.content;
                  })()}
                </div>
              </div>
            </Link>
          ))}
          {recentNews.length === 0 && (
            <div className="text-gray-400 col-span-full">Нет других новостей</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
