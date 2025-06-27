import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  X,
  Check,
  User,
  GraduationCap,
  Star,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const ApplicationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    personalInfo: {
      iin: "",
      birthDate: "",
      gender: "",
      nationality: "",
      address: "",
      parentName: "",
      parentPhone: "",
    },
    specialities: [],
    entResults: {
      totalScore: "",
      subjects: [
        { name: t("entSubjectLang"), score: "" },
        { name: t("entSubjectHistory"), score: "" },
        { name: t("entSubjectMath"), score: "" },
        { name: t("entSubjectProfile1"), score: "" },
        { name: t("entSubjectProfile2"), score: "" },
      ],
    },
  });

  useEffect(() => {
    fetchSpecialities();
    // eslint-disable-next-line
  }, []);

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get(
        "https://zhezu.onrender.com/api/specialities"
      );
      setSpecialities(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setSpecialities([]);
    }
  };

  const steps = [
    { id: 1, name: t("applicationStepPersonal"), icon: User },
    { id: 2, name: t("applicationStepSpecialities"), icon: GraduationCap },
    { id: 3, name: t("applicationStepEnt"), icon: Star },
  ];

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSpecialitySelect = (speciality) => {
    if (formData.specialities.find((s) => s.specialityId === speciality._id)) {
      setFormData((prev) => ({
        ...prev,
        specialities: prev.specialities.filter(
          (s) => s.specialityId !== speciality._id
        ),
      }));
    } else if (formData.specialities.length < 3) {
      setFormData((prev) => ({
        ...prev,
        specialities: [
          ...prev.specialities,
          {
            specialityId: speciality._id,
            priority: prev.specialities.length + 1,
            name: speciality.name,
          },
        ],
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.personalInfo.iin) newErrors.iin = t("iinRequired");
        if (!formData.personalInfo.birthDate)
          newErrors.birthDate = t("birthDateRequired");
        if (!formData.personalInfo.gender)
          newErrors.gender = t("genderRequired");
        if (!formData.personalInfo.nationality)
          newErrors.nationality = t("nationalityRequired");
        if (!formData.personalInfo.address)
          newErrors.address = t("addressRequired");
        if (!formData.personalInfo.parentName)
          newErrors.parentName = t("parentNameRequired");
        if (!formData.personalInfo.parentPhone)
          newErrors.parentPhone = t("parentPhoneRequired");
        break;

      case 2:
        if (formData.specialities.length === 0) {
          newErrors.specialities = t("specialityRequired");
        }
        break;

      case 3:
        if (!formData.entResults.totalScore) {
          newErrors.totalScore = t("entTotalScoreRequired");
        }
        formData.entResults.subjects.forEach((subject, index) => {
          if (!subject.score) {
            newErrors[`subject_${index}`] = t("entSubjectScoreRequired", {
              subject: subject.name,
            });
          }
        });
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);

    try {
      const submitData = {
        personalInfo: formData.personalInfo,
        specialities: formData.specialities,
        entResults: formData.entResults,
      };

      // Отправляем как FormData, чтобы сервер корректно принял (и с токеном)
      const formDataToSend = new FormData();
      formDataToSend.append("applicationData", JSON.stringify(submitData));

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://zhezu.onrender.com/api/applications",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.applicationId) {
        navigate("/applications/success", {
          state: { applicationId: response.data.applicationId },
        });
      }
    } catch (error) {
      alert("Ошибка при подаче заявки. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t("applicationTitle")}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {t("applicationSubtitle")}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-2 sm:gap-0 min-w-[340px] sm:min-w-0">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex-1 min-w-[80px] flex flex-col items-center justify-center relative"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full mb-1 ${
                      isCompleted
                        ? "bg-green-500"
                        : isActive
                        ? "bg-primary-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium text-center ${
                      isActive
                        ? "text-primary-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="card scroll-mt-20 p-2 sm:p-4 md:p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
                {t("personalInfo")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("iin")} *
                  </label>
                  <input
                    type="text"
                    maxLength="12"
                    value={formData.personalInfo.iin}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "iin", e.target.value)
                    }
                    className={`input-field ${
                      errors.iin ? "border-red-300" : ""
                    }`}
                    placeholder={t("iinPlaceholder")}
                  />
                  {errors.iin && (
                    <p className="text-red-600 text-sm mt-1">{errors.iin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("birthDate")} *
                  </label>
                  <input
                    type="date"
                    value={formData.personalInfo.birthDate}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "birthDate",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.birthDate ? "border-red-300" : ""
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.birthDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("gender")} *
                  </label>
                  <select
                    value={formData.personalInfo.gender}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "gender",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.gender ? "border-red-300" : ""
                    }`}
                  >
                    <option value="">{t("genderSelect")}</option>
                    <option value="male">{t("male")}</option>
                    <option value="female">{t("female")}</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("nationality")} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.nationality}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "nationality",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.nationality ? "border-red-300" : ""
                    }`}
                    placeholder={t("nationalityPlaceholder")}
                  />
                  {errors.nationality && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.nationality}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("address")} *
                  </label>
                  <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "address",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.address ? "border-red-300" : ""
                    }`}
                    rows="3"
                    placeholder={t("addressPlaceholder")}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("parentName")} *
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.parentName}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "parentName",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.parentName ? "border-red-300" : ""
                    }`}
                    placeholder={t("parentNamePlaceholder")}
                  />
                  {errors.parentName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.parentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("parentPhone")} *
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInfo.parentPhone}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "parentPhone",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.parentPhone ? "border-red-300" : ""
                    }`}
                    placeholder={t("parentPhonePlaceholder")}
                  />
                  {errors.parentPhone && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.parentPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specialities Selection */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {t("specialitiesSelection")}
                </h2>
                <span className="text-xs sm:text-sm text-gray-600">
                  {t("specialitiesSelected", {
                    count: formData.specialities.length,
                  })}
                </span>
              </div>

              {errors.specialities && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        {errors.specialities}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {(Array.isArray(specialities) ? specialities : []).map(
                  (speciality) => {
                    const isSelected = formData.specialities.find(
                      (s) => s.specialityId === speciality._id
                    );
                    const priority = isSelected ? isSelected.priority : null;

                    return (
                      <div
                        key={speciality._id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleSpecialitySelect(speciality)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">
                            {speciality.name}
                          </h3>
                          {isSelected && (
                            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                              {t("priorityNumber", { number: priority })}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {speciality.faculty}
                        </p>

                        <div className="space-y-1 text-xs text-gray-500">
                          <div>
                            {t("degree")}: {speciality.degree}
                          </div>
                          <div>
                            {t("duration")}: {speciality.duration} {t("years")}
                          </div>
                          <div>
                            {t("grants")}: {speciality.grantPlaces}
                          </div>
                          <div>
                            {t("paidPlaces")}: {speciality.paidPlaces}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {formData.specialities.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {t("selectedSpecialities")}
                  </h4>
                  <div className="space-y-2">
                    {formData.specialities
                      .sort((a, b) => a.priority - b.priority)
                      .map((item) => (
                        <div
                          key={item.specialityId}
                          className="flex items-center justify-between"
                        >
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
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
                {t("entResults")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("entTotalScore")} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="140"
                    value={formData.entResults.totalScore}
                    onChange={(e) =>
                      handleInputChange(
                        "entResults",
                        "totalScore",
                        e.target.value
                      )
                    }
                    className={`input-field ${
                      errors.totalScore ? "border-red-300" : ""
                    }`}
                    placeholder={t("entTotalScorePlaceholder")}
                  />
                  {errors.totalScore && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.totalScore}
                    </p>
                  )}
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
                        setFormData((prev) => ({
                          ...prev,
                          entResults: {
                            ...prev.entResults,
                            subjects: newSubjects,
                          },
                        }));
                      }}
                      className={`input-field ${
                        errors[`subject_${index}`] ? "border-red-300" : ""
                      }`}
                      placeholder={t("entSubjectScorePlaceholder")}
                    />
                    {errors[`subject_${index}`] && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors[`subject_${index}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {t("importantInfo")}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>{t("entMinScoreInfo")}</li>
                        <li>{t("entMaxSubjectScoreInfo")}</li>
                        <li>{t("entMaxTotalScoreInfo")}</li>
                        <li>{t("entCheckDataInfo")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between pt-4 md:pt-6 border-t mt-4 md:mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {t("back")}
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="btn-primary w-full md:w-auto"
              >
                {t("next")}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("sending") : t("submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;