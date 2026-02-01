import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAdminData } from '@/hooks/useAdminData';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import Navbar, { PageType } from '@/components/Navbar';
import SurveyPage from '@/components/survey/SurveyPage';
import CalculatorPage from '@/components/calculator/CalculatorPage';
import ReferencePage from '@/components/reference/ReferencePage';
import LearningPage from '@/components/learning/LearningPage';
import PostQuizPage from '@/components/survey/PostQuizPage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, LogOut, User, Loader2 } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useSupabaseAuth();
  const { profile, loading: profileLoading, updateProfile, createProfile } = useProfile();
  const { isAdmin, checkingAdmin } = useAdminData();
  const { progress, loading: progressLoading, getCompletedCount } = useLearningProgress();
  const [currentPage, setCurrentPage] = useState<PageType>('survey');
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  
  // Minimum lessons required to unlock post-quiz
  const REQUIRED_LESSONS = 3;

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Check if survey is completed from profile
  useEffect(() => {
    if (profile?.persona) {
      setIsQuizCompleted(true);
    }
  }, [profile]);

  const handleSurveyComplete = async (persona: string, college: string) => {
    setIsQuizCompleted(true);
    
    if (user) {
      if (profile) {
        await updateProfile({ persona, college });
      } else {
        await createProfile({ persona, college });
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || profileLoading || checkingAdmin || progressLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedLessons = getCompletedCount();
  const isLearningCompleted = completedLessons >= REQUIRED_LESSONS;

  const renderPage = () => {
    switch (currentPage) {
      case 'survey':
        return <SurveyPage onComplete={handleSurveyComplete} />;
      case 'calculator':
        return <CalculatorPage />;
      case 'reference':
        return <ReferencePage />;
      case 'learning':
        return <LearningPage persona={profile?.persona || undefined} college={profile?.college || undefined} />;
      case 'postQuiz':
        return (
          <PostQuizPage 
            isLearningCompleted={isLearningCompleted}
            requiredLessons={REQUIRED_LESSONS}
            completedLessons={completedLessons}
          />
        );
      case 'endQuiz':
        return (
          <div className="card-eco text-center py-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">結束問卷</h2>
            <p className="text-muted-foreground">您的學習回饋問卷。</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container max-w-4xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">碳排放計算器教育平台</h1>
                {profile?.persona && (
                  <p className="text-sm text-muted-foreground">
                    身份：<span className="text-primary font-medium">{profile.persona}</span>
                    {profile.college && (
                      <span className="ml-2">| 學群：<span className="text-secondary font-medium">{profile.college}</span></span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{user.email?.split('@')[0]}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Navbar 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
              isQuizCompleted={isQuizCompleted}
              isAdmin={isAdmin}
            />
            {renderPage()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
