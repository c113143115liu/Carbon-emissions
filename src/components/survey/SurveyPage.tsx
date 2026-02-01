import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PersonalInfoSection from './PersonalInfoSection';
import SurveySection from './SurveySection';
import KnowledgeQuizSection from './KnowledgeQuizSection';
import CollegeQuizSection from './CollegeQuizSection';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useSurveyResponses } from '@/hooks/useSurveyResponses';
import { useProfile } from '@/hooks/useProfile';
import { Json } from '@/integrations/supabase/types';

interface SurveyPageProps {
  onComplete: (persona: string, college: string) => void;
}

const SurveyPage: React.FC<SurveyPageProps> = ({ onComplete }) => {
  const { responses, loading: responsesLoading, saveBatchResponses, getResponsesByType } = useSurveyResponses();
  const { profile } = useProfile();
  
  const [personalInfo, setPersonalInfo] = useState({ grade: '', college: '', hasCourse: '' });
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string | string[]>>({});
  const [knowledgeAnswers, setKnowledgeAnswers] = useState<Record<string, string>>({});
  const [collegeAnswers, setCollegeAnswers] = useState<Record<string, string | string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing responses from database
  useEffect(() => {
    if (!responsesLoading && responses.length > 0) {
      // Load personal info from profile
      if (profile) {
        setPersonalInfo(prev => ({
          ...prev,
          grade: profile.grade || '',
          college: profile.college || ''
        }));
      }

      // Load initial survey responses
      const initialResponses = getResponsesByType('initial');
      const loadedSurveyAnswers: Record<string, string | string[]> = {};
      initialResponses.forEach(r => {
        loadedSurveyAnswers[r.question_id] = r.answer as string | string[];
      });
      if (Object.keys(loadedSurveyAnswers).length > 0) {
        setSurveyAnswers(loadedSurveyAnswers);
      }

      // Load knowledge quiz responses
      const knowledgeResponses = getResponsesByType('knowledge');
      const loadedKnowledgeAnswers: Record<string, string> = {};
      knowledgeResponses.forEach(r => {
        loadedKnowledgeAnswers[r.question_id] = r.answer as string;
      });
      if (Object.keys(loadedKnowledgeAnswers).length > 0) {
        setKnowledgeAnswers(loadedKnowledgeAnswers);
      }

      // Load college quiz responses
      const collegeResponses = getResponsesByType('college');
      const loadedCollegeAnswers: Record<string, string | string[]> = {};
      collegeResponses.forEach(r => {
        loadedCollegeAnswers[r.question_id] = r.answer as string | string[];
      });
      if (Object.keys(loadedCollegeAnswers).length > 0) {
        setCollegeAnswers(loadedCollegeAnswers);
      }

      // Check if survey was already completed
      if (profile?.persona) {
        setIsCompleted(true);
      }
    }
  }, [responsesLoading, responses, profile]);

  // Also load from profile for grade/college
  useEffect(() => {
    if (profile) {
      if (profile.grade || profile.college) {
        setPersonalInfo(prev => ({
          ...prev,
          grade: profile.grade || prev.grade,
          college: profile.college || prev.college
        }));
      }
      if (profile.persona) {
        setIsCompleted(true);
      }
    }
  }, [profile]);

  const handleSubmit = async () => {
    setErrorMessage('');

    // 驗證個人資料
    if (!personalInfo.grade || !personalInfo.college || !personalInfo.hasCourse) {
      setErrorMessage('🚨 請先完成所有個人資料的選擇！');
      return;
    }

    // 驗證基本知識題
    const basicQuestions = ['q3', 'q4', 'q5'];
    const allBasicAnswered = basicQuestions.every(q => knowledgeAnswers[q]);
    if (!allBasicAnswered) {
      setErrorMessage('🚨 請完成所有基本知識題 (Q3-Q5)！');
      return;
    }

    // 驗證學群題
    const collegeId = personalInfo.college === '其他' ? '工程' : personalInfo.college;
    const collegeQuestionCount = Object.keys(collegeAnswers).filter(k => k.startsWith(`q-${collegeId}`)).length;
    if (collegeQuestionCount < 3) {
      setErrorMessage('🚨 請完成您學群的三題進階知識題！');
      return;
    }

    setIsSaving(true);

    try {
      // Save initial survey responses
      const initialResponsesData = Object.entries(surveyAnswers).map(([questionId, answer]) => ({
        questionId,
        answer: answer as Json,
        questionText: null
      }));
      
      if (initialResponsesData.length > 0) {
        await saveBatchResponses('initial', initialResponsesData);
      }

      // Save knowledge quiz responses
      const knowledgeResponsesData = Object.entries(knowledgeAnswers).map(([questionId, answer]) => ({
        questionId,
        answer: answer as Json,
        questionText: null,
        isCorrect: true, // You can add proper validation logic here
        score: 1
      }));
      
      if (knowledgeResponsesData.length > 0) {
        await saveBatchResponses('knowledge', knowledgeResponsesData);
      }

      // Save college quiz responses
      const collegeResponsesData = Object.entries(collegeAnswers).map(([questionId, answer]) => ({
        questionId,
        answer: answer as Json,
        questionText: null,
        isCorrect: true,
        score: 1
      }));
      
      if (collegeResponsesData.length > 0) {
        await saveBatchResponses('college', collegeResponsesData);
      }

      // 生成身份
      const persona = generatePersona(surveyAnswers, personalInfo);
      
      setIsCompleted(true);
      onComplete(persona, personalInfo.college);
    } catch (error) {
      console.error('Error saving responses:', error);
      setErrorMessage('儲存失敗，請重試');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePersona = (answers: Record<string, string | string[]>, info: { grade: string; college: string }) => {
    const q7 = answers.q7 as string;
    const q9 = parseInt(answers.q9 as string) || 3;
    const q10 = answers.q10 as string;

    const isHighK = q9 >= 4;
    const isHighC = q7 === 'B' || q7 === 'C';
    const focus = q10;

    if (isHighK && isHighC && focus === 'A') return '領導者';
    if (isHighK && isHighC && focus === 'B') return '研究者';
    if (isHighK && !isHighC && focus === 'A') return '政策分析員';
    if (isHighK && !isHighC && focus === 'B') return '前瞻技術愛好者';
    if (!isHighK && isHighC && focus === 'A') return '實踐行動家';
    if (!isHighK && isHighC && focus === 'B') return '綠色生活實踐家';
    if (!isHighK && !isHighC && focus === 'A') return '管理入門者';
    return '自覺消費者';
  };

  if (responsesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">載入問卷資料中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="section-title">初始問卷 (即時回饋版)</h2>

      {/* 第一部分：個人資料 */}
      <div className="card-eco">
        <h3 className="text-xl font-bold text-secondary mb-4">第一部分（個人資料）</h3>
        <PersonalInfoSection
          value={personalInfo}
          onChange={setPersonalInfo}
        />
      </div>

      {/* 第二部分：問卷調查 */}
      <div className="card-eco">
        <h3 className="text-xl font-bold text-secondary mb-4">第二部分</h3>
        <SurveySection
          answers={surveyAnswers}
          onChange={setSurveyAnswers}
        />
        <Button
          onClick={handleSubmit}
          className="w-full mt-6 btn-primary-gradient text-lg h-14"
          disabled={isCompleted || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              儲存中...
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              已完成問卷，教學平台已解鎖
            </>
          ) : (
            <>
              送出問卷，啟動個人空間
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* 第三部分：基礎知識題 */}
      <div className="card-eco">
        <h3 className="text-xl font-bold text-secondary mb-4">第三部分（基礎知識認知）</h3>
        <KnowledgeQuizSection
          answers={knowledgeAnswers}
          onChange={setKnowledgeAnswers}
        />
      </div>

      {/* 第四部分：學群專屬題目 */}
      {personalInfo.college && (
        <div className="card-eco">
          <h3 className="text-xl font-bold text-secondary mb-4">
            進階知識題（{personalInfo.college === '其他' ? '工程' : personalInfo.college}學院）
          </h3>
          <CollegeQuizSection
            college={personalInfo.college === '其他' ? '工程' : personalInfo.college}
            answers={collegeAnswers}
            onChange={setCollegeAnswers}
          />
        </div>
      )}

      {/* 錯誤訊息 */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive font-medium animate-fade-in">
          {errorMessage}
        </div>
      )}

      {/* 成功訊息 */}
      {isCompleted && (
        <div className="p-4 rounded-lg bg-success/10 border border-success text-success font-medium animate-fade-in">
          🎉 初始問卷已完成！「教學平台」及後續所有內容已解鎖。
        </div>
      )}
    </div>
  );
};

export default SurveyPage;
