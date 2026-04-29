import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Send, CheckCircle, Briefcase, Palette, Layers, FolderOpen, Calendar, Loader2 } from 'lucide-react';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export default function App() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1
    companyName: '',
    serviceDesc: '',
    target: '',
    purpose: '',
    purposeOther: '',
    // Step 2
    ref1: '',
    ref2: '',
    brandColor: '',
    avoidStyle: '',
    // Step 3
    menus: '',
    features: [],
    featureOther: '',
    adminNeed: '',
    // Step 4
    logoAsset: '',
    imageAsset: '',
    textAsset: '',
    // Step 5
    deadline: '',
    budget: '',
    budgetOther: '',
  });

  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (checked) {
        setFormData({ ...formData, [name]: [...formData[name], value] });
      } else {
        if (value === '기타') {
          setFormData({ ...formData, [name]: formData[name].filter(item => item !== value), featureOther: '' });
        } else {
          setFormData({ ...formData, [name]: formData[name].filter(item => item !== value) });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const submitForm = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      ...formData,
      features: formData.features.join(', '),
      submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: '비즈니스 정보', icon: <Briefcase size={18} /> },
    { id: 2, title: '디자인 및 무드', icon: <Palette size={18} /> },
    { id: 3, title: '구조 및 기능', icon: <Layers size={18} /> },
    { id: 4, title: '준비된 자료', icon: <FolderOpen size={18} /> },
    { id: 5, title: '일정 및 예산', icon: <Calendar size={18} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Pretendard']">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="text-blue-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">의뢰서가 성공적으로 접수되었습니다.</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            남겨주신 소중한 정보를 바탕으로 꼼꼼하게 검토한 후,<br />빠른 시일 내에 담당자가 연락드리겠습니다.
          </p>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-medium">웹사이트 제작 에이전시</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css");
          .font-pretendard {
            font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
          }
        `}
      </style>
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center font-pretendard tracking-tight">

        {/* 헤더 영역 */}
        <div className="max-w-3xl w-full text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tighter">웹사이트 제작 사전 질문지</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            성공적인 프로젝트를 위해 비즈니스를 먼저 이해하고자 합니다.<br className="hidden sm:block" />
            편하게 작성해 주시면, 부족한 부분은 저희가 컨설팅으로 채워드리겠습니다.
          </p>
        </div>

        {/* 메인 폼 컨테이너 */}
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* 진행 상태 바 (데스크톱) */}
          <div className="bg-slate-900 p-4 sm:p-6 text-white hidden sm:block">
            <div className="flex justify-between items-center">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex flex-col items-center w-1/5 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    {s.icon}
                  </div>
                  <span className={`text-xs mt-3 font-semibold ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>{s.title}</span>
                  {idx < steps.length - 1 && (
                    <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${step > s.id ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 진행 상태 바 (모바일) */}
          <div className="bg-slate-900 p-4 text-white sm:hidden flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-blue-400">{steps[step - 1].icon}</span>
              <span className="font-semibold text-sm">{steps[step - 1].title}</span>
            </div>
            <div className="text-sm font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
              {step} / {totalSteps}
            </div>
          </div>

          {/* 폼 내용 영역 */}
          <div className="p-6 sm:p-10 min-h-[420px]">

            {/* Step 1: 비즈니스 정보 */}
            {step === 1 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-bold text-slate-800">1. 기본 비즈니스 정보</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">회사명 (또는 브랜드명) <span className="text-red-500">*</span></label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="예: (주)에이전시" className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">서비스 한 줄 소개</label>
                    <input type="text" name="serviceDesc" value={formData.serviceDesc} onChange={handleChange} placeholder="예: 2030 직장인을 위한 맞춤형 식단 배달 서비스" className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">주요 타겟 고객</label>
                    <input type="text" name="target" value={formData.target} onChange={handleChange} placeholder="예: 30대 초반 여성, 건강에 관심이 많은 직장인" className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">웹사이트 제작의 핵심 목적 (가장 중요한 1개 선택)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['브랜드 홍보 및 신뢰도 상승', '고객 DB 수집 (상담/문의 확보)', '온라인 상품 결제 및 판매', '커뮤니티 및 정보 제공', '잘 모르겠습니다 (상담 희망)', '기타'].map((item) => (
                        <div key={item} className="flex flex-col">
                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.purpose === item ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input type="radio" name="purpose" value={item} checked={formData.purpose === item} onChange={handleChange} className="hidden" />
                            <div className={`min-w-[20px] h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${formData.purpose === item ? 'border-blue-600' : 'border-slate-300'}`}>
                              {formData.purpose === item && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                            </div>
                            <span className={`text-sm ${formData.purpose === item ? 'text-blue-700 font-bold' : 'text-slate-600 font-medium'}`}>{item}</span>
                          </label>
                          {item === '기타' && formData.purpose === '기타' && (
                            <input
                              type="text"
                              name="purposeOther"
                              value={formData.purposeOther}
                              onChange={handleChange}
                              placeholder="기타 목적을 입력해주세요"
                              className="mt-2 w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-700"
                              autoFocus
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 디자인 및 무드 */}
            {step === 2 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-bold text-slate-800">2. 디자인 및 무드</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2">원하시는 느낌을 가장 잘 파악할 수 있는 것은 '참고 사이트'입니다.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">참고 사이트 1 (URL 및 좋은 점)</label>
                    <textarea name="ref1" value={formData.ref1} onChange={handleChange} rows="2" placeholder={"URL: https://...\n좋은 점: 깔끔한 레이아웃과 폰트가 마음에 듭니다."} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400 text-slate-700 font-medium"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">참고 사이트 2 (URL 및 좋은 점)</label>
                    <textarea name="ref2" value={formData.ref2} onChange={handleChange} rows="2" placeholder={"URL: https://...\n좋은 점: 메인 화면의 애니메이션 효과가 좋습니다."} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400 text-slate-700 font-medium"></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">선호하는 브랜드 컬러</label>
                      <input type="text" name="brandColor" value={formData.brandColor} onChange={handleChange} placeholder="예: 네이비, 파스텔 톤, 블랙&화이트" className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">피하고 싶은 스타일</label>
                      <input type="text" name="avoidStyle" value={formData.avoidStyle} onChange={handleChange} placeholder="예: 너무 화려한 색상, 복잡한 메뉴" className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: 구조 및 기능 */}
            {step === 3 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-bold text-slate-800">3. 구조 및 기능</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">예상되는 메뉴 구성</label>
                    <textarea name="menus" value={formData.menus} onChange={handleChange} rows="3" placeholder="예: 홈, 회사소개, 서비스안내, 포트폴리오, 공지사항, 문의하기" className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400 text-slate-700 font-medium"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">구현이 필요한 필수 기능 (다중 선택 가능)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['회원가입 및 로그인', '실시간 채팅 (채널톡, 카카오)', '예약 및 캘린더 연동', 'PG사 결제 연동', '다국어 지원 (영문 등)', '게시판 / 블로그 기능', '잘 모르겠습니다 (상담 희망)', '기타'].map((item) => (
                        <div key={item} className="flex flex-col">
                          <label className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all ${formData.features.includes(item) ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input type="checkbox" name="features" value={item} checked={formData.features.includes(item)} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/50" />
                            <span className={`ml-3 text-sm ${formData.features.includes(item) ? 'text-blue-700 font-bold' : 'text-slate-600 font-medium'}`}>{item}</span>
                          </label>
                          {item === '기타' && formData.features.includes('기타') && (
                            <input
                              type="text"
                              name="featureOther"
                              value={formData.featureOther}
                              onChange={handleChange}
                              placeholder="기타 기능을 입력해주세요"
                              className="mt-2 w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-700"
                              autoFocus
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">관리자 페이지 사용 계획</label>
                    <div className="relative">
                      <select name="adminNeed" value={formData.adminNeed} onChange={handleChange} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700 font-medium appearance-none bg-white">
                        <option value="" disabled>선택해주세요</option>
                        <option value="자주 수정함">자주 수정함 (팝업, 배너, 텍스트 등을 직접 수시로 변경)</option>
                        <option value="게시글만 작성">게시글만 작성 (공지사항, 블로그 글 정도만 직접 작성)</option>
                        <option value="수정 안함">거의 수정 안함 (에이전시에 유지보수 의뢰 예정)</option>
                        <option value="잘 모르겠습니다 (상담 희망)">잘 모르겠습니다 (상담 희망)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: 준비된 자료 현황 */}
            {step === 4 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-bold text-slate-800">4. 준비된 자료 현황</h2>
                  <p className="text-sm font-medium text-slate-500 mt-2">현재 준비된 자료가 없더라도 걱정하지 마세요. 에이전시에서 도움을 드릴 수 있습니다.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                    <label className="block text-sm font-bold text-slate-800 mb-3">로고 파일 (AI, PNG 등)</label>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                      {['준비 완료', '텍스트 로고만 있음', '로고 제작 의뢰 필요'].map((opt) => (
                        <label key={opt} className="flex items-center cursor-pointer group">
                          <input type="radio" name="logoAsset" value={opt} checked={formData.logoAsset === opt} onChange={handleChange} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500/50" />
                          <span className={`ml-2 text-sm font-medium transition-colors ${formData.logoAsset === opt ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                    <label className="block text-sm font-bold text-slate-800 mb-3">사진 및 이미지 자료</label>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                      {['직접 촬영본 있음', '유료 스톡 이미지 사용 희망', '촬영 의뢰 필요'].map((opt) => (
                        <label key={opt} className="flex items-center cursor-pointer group">
                          <input type="radio" name="imageAsset" value={opt} checked={formData.imageAsset === opt} onChange={handleChange} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500/50" />
                          <span className={`ml-2 text-sm font-medium transition-colors ${formData.imageAsset === opt ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50/50">
                    <label className="block text-sm font-bold text-slate-800 mb-3">웹사이트에 들어갈 텍스트/원고</label>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0">
                      {['문서로 정리 완료', '기존 회사소개서만 있음', '기획/카피라이팅 지원 필요'].map((opt) => (
                        <label key={opt} className="flex items-center cursor-pointer group">
                          <input type="radio" name="textAsset" value={opt} checked={formData.textAsset === opt} onChange={handleChange} className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500/50" />
                          <span className={`ml-2 text-sm font-medium transition-colors ${formData.textAsset === opt ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: 일정 및 예산 */}
            {step === 5 && (
              <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-2xl font-bold text-slate-800">5. 일정 및 예산</h2>
                </div>

                <div className="space-y-7">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">희망 오픈일 (런칭 목표일)</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full sm:w-1/2 p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium" />
                    <p className="mt-2 text-xs font-medium text-slate-400">* 행사, 박람회 등 데드라인이 명확하다면 반드시 기입해 주세요.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">예상 예산 범위</label>
                    <div className="relative">
                      <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700 font-medium appearance-none bg-white">
                        <option value="" disabled>선택해주세요</option>
                        <option value="100만 원 미만">100만 원 미만</option>
                        <option value="100만 원 ~ 200만 원 미만">100만 원 ~ 200만 원 미만</option>
                        <option value="200만 원 ~ 500만 원">200만 원 ~ 500만 원</option>
                        <option value="500만 원 ~ 1,000만 원">500만 원 ~ 1,000만 원</option>
                        <option value="1,000만 원 이상">1,000만 원 이상</option>
                        <option value="잘 모르겠습니다 (상담 희망)">잘 모르겠습니다 (상담 희망)</option>
                        <option value="기타">기타 (직접 입력)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>
                    {formData.budget === '기타' && (
                      <input
                        type="text"
                        name="budgetOther"
                        value={formData.budgetOther}
                        onChange={handleChange}
                        placeholder="예산을 직접 입력해주세요 (예: 협의 필요)"
                        className="mt-3 w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm text-slate-700"
                        autoFocus
                      />
                    )}
                    <p className="mt-3 text-xs font-medium text-slate-400">* 예산 범위에 맞춰 최적의 플랫폼과 퀄리티를 제안해 드립니다.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="bg-white p-6 border-t border-slate-100 rounded-b-2xl">
            {submitError && (
              <p className="text-sm text-red-500 font-medium text-center mb-4">{submitError}</p>
            )}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <ChevronLeft size={16} className="mr-1" /> 이전
              </button>

              {step < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-7 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  다음 단계로 <ChevronRight size={16} className="ml-1" />
                </button>
              ) : (
                <button
                  onClick={submitForm}
                  disabled={isSubmitting}
                  className="flex items-center px-7 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> 제출 중...</>
                  ) : (
                    <><Send size={16} className="mr-2" /> 제출하기</>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
