import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2, Lock, Trophy, BookOpen } from 'lucide-react';
import { useSurveyResponses } from '@/hooks/useSurveyResponses';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { toast } from 'sonner';

interface PostQuizPageProps {
  isLearningCompleted: boolean;
  requiredLessons: number;
  completedLessons: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  correctAnswer: string;
  explanation: string;
}

const postQuizQuestions: QuizQuestion[] = [
  {
    id: 'post_q1',
    question: '1. 根據 GHG Protocol，企業的直接排放（如工廠燃燒化石燃料）屬於哪個範疇？',
    options: [
      { value: 'A', label: '(A) 範疇一 (Scope 1)' },
      { value: 'B', label: '(B) 範疇二 (Scope 2)' },
      { value: 'C', label: '(C) 範疇三 (Scope 3)' },
      { value: 'D', label: '(D) 不確定' },
    ],
    correctAnswer: 'A',
    explanation: '**範疇一 (Scope 1)** 是指企業直接控制的排放源所產生的排放，包括工廠鍋爐、公司車輛等直接燃燒化石燃料的排放。',
  },
  {
    id: 'post_q2',
    question: '2. 下列哪項措施對減少個人碳足跡最有效？',
    options: [
      { value: 'A', label: '(A) 購買碳權抵銷' },
      { value: 'B', label: '(B) 減少肉類攝取並選擇大眾運輸' },
      { value: 'C', label: '(C) 使用塑膠袋' },
      { value: 'D', label: '(D) 增加汽車使用頻率' },
    ],
    correctAnswer: 'B',
    explanation: '減少肉類攝取（尤其是牛肉）和選擇大眾運輸是最有效的個人減碳措施。畜牧業是主要的溫室氣體來源，而私人汽車的碳排放遠高於大眾運輸。',
  },
  {
    id: 'post_q3',
    question: '3. 台灣的「2050 淨零排放」目標意味著什麼？',
    options: [
      { value: 'A', label: '(A) 完全不排放任何溫室氣體' },
      { value: 'B', label: '(B) 排放量與移除量達到平衡' },
      { value: 'C', label: '(C) 只減少 50% 的排放' },
      { value: 'D', label: '(D) 不清楚' },
    ],
    correctAnswer: 'B',
    explanation: '**淨零排放 (Net Zero)** 是指人為產生的溫室氣體排放量與透過碳匯（如森林）或碳捕捉技術移除的量達到平衡，使淨排放為零。',
  },
  {
    id: 'post_q4',
    question: '4. ESG 中的 "E" 代表什麼？',
    options: [
      { value: 'A', label: '(A) Economic (經濟)' },
      { value: 'B', label: '(B) Environmental (環境)' },
      { value: 'C', label: '(C) Efficiency (效率)' },
      { value: 'D', label: '(D) Energy (能源)' },
    ],
    correctAnswer: 'B',
    explanation: 'ESG 代表 **Environmental (環境)、Social (社會)、Governance (公司治理)**。E 代表環境面向，包括氣候變遷、碳排放、資源使用等議題。',
  },
  {
    id: 'post_q5',
    question: '5. 碳定價機制的主要目的是什麼？',
    options: [
      { value: 'A', label: '(A) 增加政府收入' },
      { value: 'B', label: '(B) 讓碳排放產生經濟成本，促進減排' },
      { value: 'C', label: '(C) 限制企業發展' },
      { value: 'D', label: '(D) 不確定' },
    ],
    correctAnswer: 'B',
    explanation: '**碳定價**的主要目的是將碳排放的外部成本內部化，讓排放者承擔環境成本，從而創造經濟誘因促進減排和清潔技術投資。',
  },
];

const PostQuizPage: React.FC<PostQuizPageProps> = ({ 
  isLearningCompleted, 
  requiredLessons, 
  completedLessons 
}) => {
  const { responses, loading, saveBatchResponses, getResponsesByType } = useSurveyResponses();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if already completed
  useEffect(() => {
    const existingResponses = getResponsesByType('postQuiz');
    if (existingResponses.length > 0) {
      setSubmitted(true);
      setShowResults(true);
      // Restore answers
      const restoredAnswers: Record<string, string> = {};
      existingResponses.forEach(r => {
        restoredAnswers[r.question_id] = r.answer as string;
      });
      setAnswers(restoredAnswers);
    }
  }, [responses]);

  const handleAnswerChange = (questionId: string, value: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let correct = 0;
    postQuizQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: postQuizQuestions.length, percentage: (correct / postQuizQuestions.length) * 100 };
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    const unanswered = postQuizQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`請回答所有題目 (還有 ${unanswered.length} 題未作答)`);
      return;
    }

    setSaving(true);
    
    const responsesData = postQuizQuestions.map(q => ({
      questionId: q.id,
      answer: answers[q.id],
      questionText: q.question,
      isCorrect: answers[q.id] === q.correctAnswer,
      score: answers[q.id] === q.correctAnswer ? 20 : 0, // 20 points per question
    }));

    const { error } = await saveBatchResponses('postQuiz', responsesData);
    
    setSaving(false);
    
    if (error) {
      toast.error('儲存失敗：' + error.message);
    } else {
      setSubmitted(true);
      setShowResults(true);
      const score = calculateScore();
      toast.success(`後測完成！得分：${score.correct}/${score.total} (${score.percentage.toFixed(0)}%)`);
    }
  };

  const progressPercent = (completedLessons / requiredLessons) * 100;

  // Locked state
  if (!isLearningCompleted) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-dashed border-2 border-muted-foreground/30">
          <CardContent className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted">
                <Lock className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">後測問卷已鎖定</h2>
            <p className="text-muted-foreground mb-6">
              請先完成教學平台的課程學習，才能解鎖後測問卷。
            </p>
            
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">學習進度</span>
                <span className="font-medium">{completedLessons} / {requiredLessons} 課程</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <p className="text-xs text-muted-foreground">
                完成至少 {requiredLessons} 個課程即可解鎖後測
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const score = calculateScore();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-secondary/10 to-primary/10 border-none">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white shadow-md">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">後測問卷</h2>
              <p className="text-muted-foreground">
                測驗您在學習後對碳排放知識的理解程度
              </p>
            </div>
            {submitted && (
              <div className="text-right">
                <Badge variant={score.percentage >= 60 ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  {score.correct}/{score.total} ({score.percentage.toFixed(0)}%)
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6">
        {postQuizQuestions.map((q, index) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          const hasAnswered = !!answers[q.id];

          return (
            <Card key={q.id} className={showResults && hasAnswered ? (isCorrect ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5') : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-medium leading-relaxed">
                    {q.question}
                  </CardTitle>
                  {showResults && hasAnswered && (
                    isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive shrink-0" />
                    )
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[q.id] || ''}
                  onValueChange={(value) => handleAnswerChange(q.id, value)}
                  disabled={submitted}
                >
                  {q.options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        showResults && option.value === q.correctAnswer
                          ? 'border-primary bg-primary/10'
                          : showResults && answers[q.id] === option.value && option.value !== q.correctAnswer
                          ? 'border-destructive bg-destructive/10'
                          : answers[q.id] === option.value
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={`${q.id}-${option.value}`} />
                      <Label htmlFor={`${q.id}-${option.value}`} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {showResults && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">解析：</p>
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ 
                      __html: q.explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={saving || Object.keys(answers).length < postQuizQuestions.length}
            className="w-full max-w-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                儲存中...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                提交後測問卷 ({Object.keys(answers).length}/{postQuizQuestions.length} 已作答)
              </>
            )}
          </Button>
        </div>
      )}

      {/* Results Summary */}
      {showResults && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
          <CardContent className="py-6 text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${score.percentage >= 60 ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="text-2xl font-bold mb-2">
              {score.percentage >= 80 ? '太棒了！您已精通碳排放知識！' :
               score.percentage >= 60 ? '做得不錯！您對碳排放有良好的理解。' :
               '繼續加油！建議複習教學內容。'}
            </h3>
            <p className="text-muted-foreground">
              您的得分：{score.correct} / {score.total} ({score.percentage.toFixed(0)}%)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PostQuizPage;