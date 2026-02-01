import React from 'react';
import QuizQuestion from './QuizQuestion';

interface KnowledgeQuizSectionProps {
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
}

const questions = [
  {
    id: 'q3',
    question: '3. 企業進行組織層級溫室氣體盤查的主要國際標準是？',
    options: [
      { value: 'A', label: '(A) ISO 9001' },
      { value: 'B', label: '(B) ISO 14064-1 (V2018)' },
      { value: 'C', label: '(C) ISO 50001' },
      { value: 'D', label: '(D) 不知道' },
    ],
    correctAnswer: 'B',
    explanation: '企業溫室氣體盤查的主要國際標準是 **ISO 14064-1 (2018版)**，它提供了一套量化和報告組織溫室氣體排放的框架。ISO 9001 是品質管理，ISO 50001 是能源管理。',
  },
  {
    id: 'q4',
    question: '4. 請問以下哪一種排放源屬於企業盤查的範疇三 (Scope 3) 排放？',
    options: [
      { value: 'A', label: '(A) 廠區鍋爐燃燒天然氣產生的排放' },
      { value: 'B', label: '(B) 購買並使用的電力所產生的排放' },
      { value: 'C', label: '(C) 員工出差搭乘飛機所產生的排放' },
      { value: 'D', label: '(D) 不清楚範疇的區分' },
    ],
    correctAnswer: 'C',
    explanation: '根據 GHG Protocol，**範疇三 (Scope 3)** 是指企業價值鏈中所有其他的間接排放。員工出差搭乘飛機屬於企業**不擁有、不控制**的交通方式，因此歸類於範疇三。',
  },
  {
    id: 'q5',
    question: '5. 請問企業若要做到「碳中和 (Carbon Neutrality)」，除了減少自身排放外，還必須做什麼？',
    options: [
      { value: 'A', label: '(A) 只要承諾未來減排即可' },
      { value: 'B', label: '(B) 需購買足夠的碳權 (Carbon Credit) 進行抵銷' },
      { value: 'C', label: '(C) 需大幅增加營收' },
      { value: 'D', label: '(D) 不清楚什麼是碳中和' },
    ],
    correctAnswer: 'B',
    explanation: '**碳中和**的目標是透過減少自身排放，並利用購買足夠的**碳權 (Carbon Credit)** 或進行碳抵銷來平衡剩餘的排放量，使淨排放量達到零。',
  },
];

const KnowledgeQuizSection: React.FC<KnowledgeQuizSectionProps> = ({ answers, onChange }) => {
  const handleAnswerChange = (questionId: string, value: string) => {
    onChange({ ...answers, [questionId]: value });
  };

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <QuizQuestion
          key={q.id}
          id={q.id}
          question={q.question}
          options={q.options}
          correctAnswer={q.correctAnswer}
          explanation={q.explanation}
          selectedAnswer={answers[q.id]}
          onAnswerChange={(value) => handleAnswerChange(q.id, value)}
        />
      ))}
    </div>
  );
};

export default KnowledgeQuizSection;
