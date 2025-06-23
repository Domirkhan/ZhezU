import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Upload, 
  X, 
  Check, 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  GraduationCap,
  Star,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const ApplicationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Personal Information
    personalInfo: {
      iin: '',
      birthDate: '',
      gender: '',
      nationality: '',
      address: '',
      parentName: '',
      parentPhone: ''
    },
    // Selected Specialities (up to 3)
    specialities: [],
    // ENT Results
    entResults: {
      totalScore: '',
      subjects: [
        { name: 'Казахский/Русский язык', score: '' },
        { name: 'История Казахстана', score: '' },
        { name: 'Математическая грамотность', score: '' },
        { name: 'Профильный предмет 1', score: '' },
        { name: 'Профильный предмет 2', score: '' }
      ]
    },
    // Documents
    documents: {
      passport: null,
      diploma: null,
      photo: null,
      medical: null,
      additional: []
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get('/api/specialities');
      setSpecialities(response.data);
    } catch (error) {
      console.error('Error fetching specialities:', error);
    }
  };

  const steps = [
    { id: 1, name: 'Личные данные', icon: User },
    { id: 2, name: 'Специальности', icon: GraduationCap },
    { id: 3, name: 'Результаты ЕНТ', icon: Star },
    { id: 4, name: 'Документы', icon: FileText }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSpecialitySelect = (speciality) => {
    if (formData.specialities.find(s => s.specialityId === speciality._id)) {
      // Remove if already selected
      setFormData(prev => ({
        ...prev,
        specialities: prev.specialities.filter(s => s.specialityId !== speciality._id)
      }));
    } else if (formData.specialities.length < 3) {
      // Add with priority
      setFormData(prev => ({
        ...prev,
        specialities: [
          ...prev.specialities,
          {
            specialityId: speciality._id,
            priority: prev.specialities.length + 1,
            name: speciality.name
          }
        ]
      }));
    }
  };

  const handleFileUpload = (documentType, file) => {
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: file
      }));
      
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: file
        }
      }));
    } else {
      alert('Файл слишком большой. Максимальный размер: 10MB');
    }
  };

  const removeFile = (documentType) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[documentType];
      return newFiles;
    });
    
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: null
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.personalInfo.iin) newErrors.iin = 'ИИН обязателен';
        if (!formData.personalInfo.birthDate) newErrors.birthDate = 'Дата рождения обязательна';
        if (!formData.personalInfo.gender) newErrors.gender = 'Пол обязателен';
        if (!formData.personalInfo.nationality) newErrors.nationality = 'Национальность обязательна';
        if (!formData.personalInfo.address) newErrors.address = 'Адрес обязателен';
        if (!formData.personalInfo.parentName) newErrors.parentName = 'ФИО родителя обязательно';
        if (!formData.personalInfo.parentPhone) newErrors.parentPhone = 'Телефон родителя обязателен';
        break;
      
      case 2:
        if (formData.specialities.length === 0) {
          newErrors.specialities = 'Выберите хотя бы одну специальность';
        }
        break;
      
      case 3:
        if (!formData.entResults.totalScore) {
          newErrors.totalScore = 'Общий балл ЕНТ обязателен';
        }
        formData.entResults.subjects.forEach((subject, index) => {
          if (!subject.score) {
            newErrors[`subject_${index}`] = `Балл по предмету "${subject.name}" обязателен`;
          }
        });
        break;
      
      case 4:
        if (!uploadedFiles.passport) newErrors.passport = 'Скан паспорта обязателен';
        if (!uploadedFiles.diploma) newErrors.diploma = 'Скан аттестата обязателен';
        if (!uploadedFiles.photo) newErrors.photo = 'Фотография обязательна';
        if (!uploadedFiles.medical) newErrors.medical = 'Медицинская справка обязательна';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Add application data
      submitData.append('applicationData', JSON.stringify({
        personalInfo: formData.personalInfo,
        specialities: formData.specialities,
        entResults: formData.entResults
      }));
      
      // Add files
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file);
        }
      });

      const response = await axios.post('/api/applications', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.applicationId) {
        navigate('/applications/success', { 
          state: { applicationId: response.data.applicationId }
        });
      }
    } catch (error) {
      console.error('Submit application error:', error);
      alert('Ошибка при подаче заявки. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadComponent = ({ documentType, title, required = true, accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx" }) => {
    const file = uploadedFiles[documentType];
    
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor={documentType} className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {title} {required && <span className="text-red-500">*</span>}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                PDF, JPG, PNG, DOC, DOCX до 10MB
              </span>
            </label>
            <input
              id={documentType}
              name={documentType}
              type="file"
              className="sr-only"
              accept={accept}
              onChange={(e) => handleFileUpload(documentType, e.target.files[0])}
            />
          </div>
          
          {file ? (
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(documentType)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="mt-4 btn-primary"
              onClick={() => document.getElementById(documentType).click()}
            >
              Выбрать файл
            </button>
          )}
        </div>
        
        {errors[documentType] && (
          <p className="mt-2 text-sm text-red-600">{errors[documentType]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Заявка на поступление в ЖеЗУ
          </h1>
          <p className="text-gray-600">
            Заполните все необходимые данные для подачи заявки
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted ? 'bg-green-500' : isActive ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="card">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Личная информация
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ИИН *
                  </label>
                  <input
                    type="text"
                    maxLength="12"
                    value={formData.personalInfo.iin}
                    onChange={(e) => handleInputChange('personalInfo', 'iin', e.target.value)}
                    className={`input-field ${errors.iin ? 'border-red-300' : ''}`}
                    placeholder="123456789012"
                  />
                  {errors.iin && <p className="text-red-600 text-sm mt-1">{errors.iin}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата рождения *
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.birthDate}
                    onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                    className={`input-field ${errors.birthDate ? 'border-red-300' : ''}`}
                  />
                  {errors.birthDate && <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пол *
                  </label>
                  <select
                    value={formData.personalInfo.gender}
                    onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                    className={`input-field ${errors.gender ? 'border-red-300' : ''}`}
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                  {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Национальность *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.nationality}
                    onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                    className={`input-field ${errors.nationality ? 'border-red-300' : ''}`}
                    placeholder="Казах"
                  />
                  {errors.nationality && <p className="text-red-600 text-sm mt-1">{errors.nationality}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Адрес проживания *
                  </label>
                  <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    className={`input-field ${errors.address ? 'border-red-300' : ''}`}
                    rows="3"
                    placeholder="Полный адрес проживания"
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ФИО родителя/опекуна *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.parentName}
                    onChange={(e) => handleInputChange('personalInfo', 'parentName', e.target.value)}
                    className={`input-field ${errors.parentName ? 'border-red-300' : ''}`}
                    placeholder="Иванов Иван Иванович"
                  />
                  {errors.parentName && <p className="text-red-600 text-sm mt-1">{errors.parentName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон родителя/опекуна *
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.parentPhone}
                    onChange={(e) => handleInputChange('personalInfo', 'parentPhone', e.target.value)}
                    className={`input-field ${errors.parentPhone ? 'border-red-300' : ''}`}
                    placeholder="+7 777 123 4567"
                  />
                  {errors.parentPhone && <p className="text-red-600 text-sm mt-1">{errors.parentPhone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specialities Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Выбор специальностей
                </h2>
                <span className="text-sm text-gray-600">
                  Выбрано: {formData.specialities.length}/3
                </span>
              </div>

              {errors.specialities && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{errors.specialities}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialities.map((speciality) => {
                  const isSelected = formData.specialities.find(s => s.specialityId === speciality._id);
                  const priority = isSelected ? isSelected.priority : null;
                  
                  return (
                    <div
                      key={speciality._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSpecialitySelect(speciality)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{speciality.name}</h3>
                        {isSelected && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                            #{priority}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{speciality.faculty}</p>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        <div>Степень: {speciality.degree}</div>
                        <div>Срок: {speciality.duration} лет</div>
                        <div>Гранты: {speciality.grantPlaces}</div>
                        <div>Платные: {speciality.paidPlaces}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.specialities.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Выбранные специальности:</h4>
                  <div className="space-y-2">
                    {formData.specialities
                      .sort((a, b) => a.priority - b.priority)
                      .map((item) => (
                        <div key={item.specialityId} className="flex items-center justify-between">
                          <span className="text-blue-800">
                            {item.priority}. {item.name}
                          </span>
                          <button
                            onClick={() => {
                              const speciality = { _id: item.specialityId };
                              handleSpecialitySelect(speciality);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: ENT Results */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Результаты ЕНТ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Общий балл ЕНТ *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="140"
                    value={formData.entResults.totalScore}
                    onChange={(e) => handleInputChange('entResults', 'totalScore', e.target.value)}
                    className={`input-field ${errors.totalScore ? 'border-red-300' : ''}`}
                    placeholder="120"
                  />
                  {errors.totalScore && <p className="text-red-600 text-sm mt-1">{errors.totalScore}</p>}
                </div>

                {formData.entResults.subjects.map((subject, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {subject.name} *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={subject.score}
                      onChange={(e) => {
                        const newSubjects = [...formData.entResults.subjects];
                        newSubjects[index].score = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          entResults: {
                            ...prev.entResults,
                            subjects: newSubjects
                          }
                        }));
                      }}
                      className={`input-field ${errors[`subject_${index}`] ? 'border-red-300' : ''}`}
                      placeholder="20"
                    />
                    {errors[`subject_${index}`] && (
                      <p className="text-red-600 text-sm mt-1">{errors[`subject_${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Важная информация
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Минимальный порог для поступления: 50 баллов</li>
                        <li>Максимальный балл по каждому предмету: 25</li>
                        <li>Общий максимальный балл: 140</li>
                        <li>Убедитесь в правильности введенных данных</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Загрузка документов
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadComponent
                  documentType="passport"
                  title="Скан паспорта"
                  required={true}
                />

                <FileUploadComponent
                  documentType="diploma"
                  title="Скан аттестата"
                  required={true}
                />

                <FileUploadComponent
                  documentType="photo"
                  title="Фотография 3x4"
                  required={true}
                  accept=".jpg,.jpeg,.png"
                />

                <FileUploadComponent
                  documentType="medical"
                  title="Медицинская справка"
                  required={true}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Дополнительные документы (необязательно)
                </h3>
                
                <FileUploadComponent
                  documentType="additional"
                  title="Дополнительные документы"
                  required={false}
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Требования к документам
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Все документы должны быть четкими и читаемыми</li>
                        <li>Поддерживаемые форматы: PDF, JPG, PNG, DOC, DOCX</li>
                        <li>Максимальный размер файла: 10MB</li>
                        <li>Фотография должна соответствовать требованиям для документов</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>

            {currentStep < 4 ? (
              <button onClick={handleNext} className="btn-primary">
                Далее
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправка...' : 'Подать заявку'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;