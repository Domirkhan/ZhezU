import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, type, data, onSave }) => {
  const [formData, setFormData] = useState({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (data) {
      setFormData(data);
      if (data.options) {
        setOptions(data.options);
      }
    } else {
      // Reset form
      setFormData({});
      setOptions([]);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData };
     if (type === 'specialty') {
    submitData.requirements = (formData.requirements || '').split(',').map(s => s.trim()).filter(Boolean);
    submitData.subjects = (formData.subjects || '').split(',').map(s => s.trim()).filter(Boolean);
    submitData.duration = Number(formData.duration);
    submitData.tuitionFee = Number(formData.tuitionFee);
    submitData.grantPlaces = Number(formData.grantPlaces);
    submitData.paidPlaces = Number(formData.paidPlaces);
  }
    if (type === 'question') {
      submitData.options = options;
    }
    onSave(type, submitData);
  };

  const addOption = () => {
    setOptions([...options, { id: Date.now(), text: '', category: 'social' }]);
  };

  const updateOption = (id, field, value) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    ));
  };

  const removeOption = (id) => {
    setOptions(options.filter(opt => opt.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {type === 'specialty' && (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Название специальности
      </label>
      <input
        type="text"
        required
        value={formData.name || ''}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Например: Информационные технологии"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Название на казахском
      </label>
      <input
        type="text"
        required
        value={formData.nameKk || ''}
        onChange={e => setFormData({ ...formData, nameKk: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="Мамандық атауы (қаз)"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Название на английском
      </label>
      <input
        type="text"
        required
        value={formData.nameEn || ''}
        onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="Specialty name (en)"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Код специальности
      </label>
      <input
        type="text"
        required
        value={formData.code || ''}
        onChange={e => setFormData({ ...formData, code: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="B123"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Факультет
      </label>
      <input
        type="text"
        required
        value={formData.faculty || ''}
        onChange={e => setFormData({ ...formData, faculty: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="Факультет"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Степень
      </label>
      <select
        required
        value={formData.degree || ''}
        onChange={e => setFormData({ ...formData, degree: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      >
        <option value="">Выберите степень</option>
        <option value="bachelor">Бакалавр</option>
        <option value="master">Магистр</option>
        <option value="phd">PhD</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Срок обучения (лет)
      </label>
      <input
        type="number"
        required
        value={formData.duration || ''}
        onChange={e => setFormData({ ...formData, duration: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="4"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Языки обучения
      </label>
      <select
        multiple
        required
        value={formData.language || []}
        onChange={e => setFormData({ ...formData, language: Array.from(e.target.selectedOptions, o => o.value) })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      >
        <option value="kk">Казахский</option>
        <option value="ru">Русский</option>
        <option value="en">Английский</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Стоимость обучения
      </label>
      <input
        type="number"
        required
        value={formData.tuitionFee || ''}
        onChange={e => setFormData({ ...formData, tuitionFee: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="500000"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Грантовых мест
      </label>
      <input
        type="number"
        required
        value={formData.grantPlaces || ''}
        onChange={e => setFormData({ ...formData, grantPlaces: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="20"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Платных мест
      </label>
      <input
        type="number"
        required
        value={formData.paidPlaces || ''}
        onChange={e => setFormData({ ...formData, paidPlaces: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="30"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Требования (через запятую)
      </label>
      <textarea
        required
        value={formData.requirements || ''}
        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="Требования через запятую"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Профильные предметы (через запятую)
      </label>
      <textarea
        required
        value={formData.subjects || ''}
        onChange={e => setFormData({ ...formData, subjects: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        placeholder="Профильные предметы через запятую"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Описание
      </label>
      <textarea
        required
        rows={3}
        value={formData.description || ''}
        onChange={e => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Краткое описание специальности"
      />
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        id="isActive"
        checked={formData.isActive !== false}
        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
        Активная специальность
      </label>
    </div>
  </>
)}

          {type === 'news' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок новости
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Введите заголовок новости"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фото новости
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Содержание
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Полный текст новости"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <select
                  value={formData.category || 'admission'}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="admission">Поступление</option>
                  <option value="academic">Учёба</option>
                  <option value="events">События</option>
                  <option value="announcements">Объявления</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="draft">Черновик</option>
                  <option value="published">Опубликовано</option>
                </select>
              </div>
            </>
          )}

          {type === 'question' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст вопроса
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Введите текст вопроса"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Варианты ответов
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    <Plus size={16} />
                    <span>Добавить вариант</span>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Текст варианта ответа"
                      />
                      <select
                        value={option.category}
                        onChange={(e) => updateOption(option.id, 'category', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="social">Социальное</option>
                        <option value="technical">Техническое</option>
                        <option value="creative">Творческое</option>
                        <option value="analytical">Аналитическое</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {options.length < 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Рекомендуется добавить минимум 4 варианта ответа
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {data ? 'Обновить' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;