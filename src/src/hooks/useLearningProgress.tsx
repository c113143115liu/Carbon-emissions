import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

export interface LearningProgress {
  id: string;
  user_id: string;
  module_id: string;
  lesson_title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export const useLearningProgress = () => {
  const { user } = useSupabaseAuth();
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching learning progress:', error);
    } else {
      setProgress(data || []);
    }
    setLoading(false);
  };

  const toggleLessonComplete = async (moduleId: string, lessonTitle: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Check if progress exists
    const existing = progress.find(
      p => p.module_id === moduleId && p.lesson_title === lessonTitle
    );

    if (existing) {
      // Toggle completion
      const newCompleted = !existing.completed;
      const { error } = await supabase
        .from('learning_progress')
        .update({
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null
        })
        .eq('id', existing.id);

      if (!error) {
        setProgress(prev => prev.map(p => 
          p.id === existing.id 
            ? { ...p, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null }
            : p
        ));
      }
      return { error };
    } else {
      // Create new progress entry
      const { data, error } = await supabase
        .from('learning_progress')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          lesson_title: lessonTitle,
          completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!error && data) {
        setProgress(prev => [...prev, data]);
      }
      return { error };
    }
  };

  const isLessonCompleted = (moduleId: string, lessonTitle: string) => {
    return progress.some(
      p => p.module_id === moduleId && p.lesson_title === lessonTitle && p.completed
    );
  };

  const getCompletedCount = () => {
    return progress.filter(p => p.completed).length;
  };

  return {
    progress,
    loading,
    fetchProgress,
    toggleLessonComplete,
    isLessonCompleted,
    getCompletedCount
  };
};
