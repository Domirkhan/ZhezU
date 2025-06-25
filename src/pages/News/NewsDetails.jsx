import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        setNews(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (!news) return <div className="text-center py-12">Новость не найдена</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
        {news.image && (
        <div className="mb-6 rounded-xl overflow-hidden">
            <img
            src={`/uploads/documents/${news.image.filename}`}
            alt={news.title}
            className="w-full object-cover max-h-96"
            />
        </div>
        )}
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
      <div className="text-gray-500 mb-2">
        {news.author?.fullName || 'Админ'} | {new Date(news.publishedAt || news.createdAt).toLocaleDateString('ru-RU')}
      </div>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
    </div>
  );
};

export default NewsDetails;