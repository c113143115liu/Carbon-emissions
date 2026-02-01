import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { Json } from '@/integrations/supabase/types';

export interface SurveyResponse {
  id: string;
  user_id: string;
  survey_type: string;
  question_id: string;
  question_text: string | null;
  answer: Json;
  is_correct: boolean | null;
  score: number | null;
  created_at: string;
}

export const useSurveyResponses = () => {
  const { user } = useSupabaseAuth();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResponses();
    } else {
      setResponses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchResponses = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching survey responses:', error);
    } else {
      setResponses(data || []);
    }
    setLoading(false);
  };

  const saveResponse = async (
    surveyType: string,
    questionId: string,
    answer: Json,
    questionText?: string,
    isCorrect?: boolean,
    score?: number
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        user_id: user.id,
        survey_type: surveyType,
        question_id: questionId,
        question_text: questionText || null,
        answer,
        is_correct: isCorrect ?? null,
        score: score ?? 0
      })
      .select()
      .single();

    if (!error && data) {
      setResponses(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const saveBatchResponses = async (
    surveyType: string,
    responsesData: Array<{
      questionId: string;
      answer: Json;
      questionText?: string;
      isCorrect?: boolean;
      score?: number;
    }>
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const insertData = responsesData.map(r => ({
      user_id: user.id,
      survey_type: surveyType,
      question_id: r.questionId,
      question_text: r.questionText || null,
      answer: r.answer,
      is_correct: r.isCorrect ?? null,
      score: r.score ?? 0
    }));

    const { data, error } = await supabase
      .from('survey_responses')
      .insert(insertData)
      .select();

    if (!error && data) {
      setResponses(prev => [...data, ...prev]);
    }
    return { data, error };
  };

  const getResponsesByType = (surveyType: string) => {
    return responses.filter(r => r.survey_type === surveyType);
  };

  const getTotalScore = (surveyType: string) => {
    return getResponsesByType(surveyType)
      .reduce((sum, r) => sum + (r.score || 0), 0);
  };

  return {
    responses,
    loading,
    fetchResponses,
    saveResponse,
    saveBatchResponses,
    getResponsesByType,
    getTotalScore
  };
};
