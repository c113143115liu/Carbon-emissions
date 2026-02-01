import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface QuizQuestionProps {
  id: string;
  question: string;
  options: Option[];
  correctAnswer: string | string[];
  explanation: string;
  selectedAnswer?: string;
  onAnswerChange: (value: string) => void;
  isMultiple?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  id,
  question,
  options,
  correctAnswer,
  explanation,
  selectedAnswer,
  onAnswerChange,
  isMultiple = false,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (selectedAnswer) {
      setShowFeedback(true);
    }
  }, [selectedAnswer]);

  const isCorrect = selectedAnswer === correctAnswer;
  const correctAnswerValue = Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer;

  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <p className="font-bold text-secondary mb-4 border-l-4 border-primary pl-3">
        {question}
      </p>

      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerChange}
        className="space-y-2"
      >
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          const isThisCorrect = option.value === correctAnswer;

          return (
            <div
              key={option.value}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-all',
                showFeedback && isSelected && isCorrect && 'quiz-option-correct',
                showFeedback && isSelected && !isCorrect && 'quiz-option-wrong',
                showFeedback && !isSelected && isThisCorrect && 'quiz-option-correct',
                !showFeedback && 'hover:bg-muted'
              )}
            >
              <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
              <Label htmlFor={`${id}-${option.value}`} className="flex-1 cursor-pointer">
                {option.label}
              </Label>
              {showFeedback && isSelected && isCorrect && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
              {showFeedback && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              {showFeedback && !isSelected && isThisCorrect && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>
          );
        })}
      </RadioGroup>

      {showFeedback && (
        <div className="explanation-box mt-4">
          <span className="font-bold text-warning block mb-2">
            💡 詳解 (正確答案：{correctAnswerValue})
          </span>
          <p className="text-sm text-foreground">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
