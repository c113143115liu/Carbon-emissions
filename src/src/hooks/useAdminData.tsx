import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { Json } from '@/integrations/supabase/types';

export interface AdminProfile {
  id: string;
  user_id: string;
  username: string | null;
  persona: string | null;
  college: string | null;
  grade: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSurveyResponse {
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

export interface AdminLearningProgress {
  id: string;
  user_id: string;
  module_id: string;
  lesson_title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

export interface AdminCalculatorResult {
  id: string;
  user_id: string;
  calculator_type: string;
  inputs: Json;
  result_kg: number;
  created_at: string;
}

export const useAdminData = () => {
  const { user } = useSupabaseAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<AdminSurveyResponse[]>([]);
  const [learningProgress, setLearningProgress] = useState<AdminLearningProgress[]>([]);
  const [calculatorResults, setCalculatorResults] = useState<AdminCalculatorResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      setCheckingAdmin(false);
    };

    checkAdminRole();
  }, [user]);

  const fetchAllData = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    
    // Fetch all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      setProfiles(profilesData || []);
    }

    // Fetch all survey responses
    const { data: responsesData, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (responsesError) {
      console.error('Error fetching survey responses:', responsesError);
    } else {
      setSurveyResponses(responsesData || []);
    }

    // Fetch all learning progress
    const { data: progressData, error: progressError } = await supabase
      .from('learning_progress')
      .select('*')
      .order('created_at', { ascending: false });

    if (progressError) {
      console.error('Error fetching learning progress:', progressError);
    } else {
      setLearningProgress(progressData || []);
    }

    // Fetch all calculator results
    const { data: calculatorData, error: calculatorError } = await supabase
      .from('calculator_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (calculatorError) {
      console.error('Error fetching calculator results:', calculatorError);
    } else {
      setCalculatorResults(calculatorData || []);
    }

    setLoading(false);
  };

  // Get survey responses by type
  const getResponsesByType = (surveyType: string) => {
    return surveyResponses.filter(r => r.survey_type === surveyType);
  };

  // Get responses for a specific user
  const getUserResponses = (userId: string) => {
    return surveyResponses.filter(r => r.user_id === userId);
  };

  // Get learning progress for a specific user
  const getUserProgress = (userId: string) => {
    return learningProgress.filter(p => p.user_id === userId);
  };

  // Get calculator results for a specific user
  const getUserCalculatorResults = (userId: string) => {
    return calculatorResults.filter(r => r.user_id === userId);
  };

  // Get statistics
  const getStats = () => {
    const totalUsers = profiles.length;
    const completedSurvey = profiles.filter(p => p.persona).length;
    const totalLessonsCompleted = learningProgress.filter(p => p.completed).length;
    const totalCalculations = calculatorResults.length;
    
    // Survey types breakdown
    const initialSurvey = getResponsesByType('initial').length;
    const knowledgeQuiz = getResponsesByType('knowledge').length;
    const collegeQuiz = getResponsesByType('college').length;

    // Persona distribution
    const personaDistribution = profiles.reduce((acc, p) => {
      if (p.persona) {
        acc[p.persona] = (acc[p.persona] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // College distribution
    const collegeDistribution = profiles.reduce((acc, p) => {
      if (p.college) {
        acc[p.college] = (acc[p.college] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Average emissions
    const avgEmissions = calculatorResults.length > 0
      ? calculatorResults.reduce((sum, r) => sum + r.result_kg, 0) / calculatorResults.length
      : 0;

    return {
      totalUsers,
      completedSurvey,
      totalLessonsCompleted,
      totalCalculations,
      avgEmissions,
      surveyBreakdown: {
        initial: initialSurvey,
        knowledge: knowledgeQuiz,
        college: collegeQuiz
      },
      personaDistribution,
      collegeDistribution
    };
  };

  return {
    isAdmin,
    checkingAdmin,
    loading,
    profiles,
    surveyResponses,
    learningProgress,
    calculatorResults,
    fetchAllData,
    getResponsesByType,
    getUserResponses,
    getUserProgress,
    getUserCalculatorResults,
    getStats
  };
};
