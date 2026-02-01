import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface SurveySectionProps {
  answers: Record<string, string | string[]>;
  onChange: (answers: Record<string, string | string[]>) => void;
}

const SurveySection: React.FC<SurveySectionProps> = ({ answers, onChange }) => {
  const handleRadioChange = (question: string, value: string) => {
    onChange({ ...answers, [question]: value });
  };

  const handleSliderChange = (question: string, value: number[]) => {
    onChange({ ...answers, [question]: value[0].toString() });
  };

  const handleCheckboxChange = (question: string, value: string, checked: boolean) => {
    const current = (answers[question] as string[]) || [];
    const updated = checked
      ? [...current, value]
      : current.filter(v => v !== value);
    onChange({ ...answers, [question]: updated });
  };

  return (
    <div className="space-y-6">
      {/* Q3 - 滑桿 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          3. 您對「個人碳足跡」的概念熟悉程度為何？
          <span className="font-normal text-sm text-muted-foreground ml-2">(1=非常不熟悉，5=非常熟悉)</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm">1</span>
          <Slider
            value={[parseInt(answers.q3 as string) || 3]}
            onValueChange={(v) => handleSliderChange('q3', v)}
            min={1}
            max={5}
            step={1}
            className="flex-1"
          />
          <span className="text-sm">5</span>
          <span className="ml-4 px-3 py-1 rounded bg-secondary text-secondary-foreground font-bold">
            {answers.q3 || 3}
          </span>
        </div>
      </div>

      {/* Q4 - 單選 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          4. 您主要的交通方式為何？
        </p>
        <RadioGroup
          value={answers.q4 as string}
          onValueChange={(v) => handleRadioChange('q4', v)}
          className="space-y-2"
        >
          {[
            { value: 'A', label: 'A. 機車/汽車 (自駕)' },
            { value: 'B', label: 'B. 大眾運輸 (公車/捷運/火車)' },
            { value: 'C', label: 'C. 腳踏車/步行' },
            { value: 'D', label: 'D. 共享汽機車或計程車' },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-2 rounded hover:bg-background transition-colors">
              <RadioGroupItem value={option.value} id={`q4-${option.value}`} />
              <Label htmlFor={`q4-${option.value}`} className="flex-1 cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Q5 - 滑桿 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          5. 您認為「大學生應為氣候變遷採取行動」的重要性有多高？
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm">1</span>
          <Slider
            value={[parseInt(answers.q5 as string) || 3]}
            onValueChange={(v) => handleSliderChange('q5', v)}
            min={1}
            max={5}
            step={1}
            className="flex-1"
          />
          <span className="text-sm">5</span>
          <span className="ml-4 px-3 py-1 rounded bg-secondary text-secondary-foreground font-bold">
            {answers.q5 || 3}
          </span>
        </div>
      </div>

      {/* Q6 - 複選 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          6. 您最想從我們的碳排放網站中獲得哪類資訊？（可複選）
        </p>
        <div className="space-y-2">
          {[
            { value: 'A', label: 'A. 量化數據：精準的個人碳足跡計算結果' },
            { value: 'B', label: 'B. 知識學習：關於碳中和、綠色能源的專業知識' },
            { value: 'C', label: 'C. 行動指引：具體、可執行的減碳生活建議' },
            { value: 'D', label: 'D. 政策與新聞：國內外最新氣候政策與相關新聞' },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-2 rounded hover:bg-background transition-colors">
              <Checkbox
                id={`q6-${option.value}`}
                checked={((answers.q6 as string[]) || []).includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange('q6', option.value, checked as boolean)}
              />
              <Label htmlFor={`q6-${option.value}`} className="flex-1 cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Q7 - 單選 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          7. 您願意投入多少時間/精力來計算或追蹤個人碳排放？
        </p>
        <RadioGroup
          value={answers.q7 as string}
          onValueChange={(v) => handleRadioChange('q7', v)}
          className="space-y-2"
        >
          {[
            { value: 'A', label: 'A. 低：只想看大致數據，不需手動輸入' },
            { value: 'B', label: 'B. 中：願意每週花費 5-10 分鐘輸入數據' },
            { value: 'C', label: 'C. 高：願意每天記錄數據以追求最精準結果' },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-2 rounded hover:bg-background transition-colors">
              <RadioGroupItem value={option.value} id={`q7-${option.value}`} />
              <Label htmlFor={`q7-${option.value}`} className="flex-1 cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Q8 - 滑桿 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          8. 您認為台灣企業「實施內部碳定價」對大學生的職涯規劃重要性有多高？
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm">1</span>
          <Slider
            value={[parseInt(answers.q8 as string) || 3]}
            onValueChange={(v) => handleSliderChange('q8', v)}
            min={1}
            max={5}
            step={1}
            className="flex-1"
          />
          <span className="text-sm">5</span>
          <span className="ml-4 px-3 py-1 rounded bg-secondary text-secondary-foreground font-bold">
            {answers.q8 || 3}
          </span>
        </div>
      </div>

      {/* Q9 - 滑桿 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          9. 您對「碳捕捉、利用與封存 (CCUS)」等新興減碳技術的發展潛力有多關注？
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm">1</span>
          <Slider
            value={[parseInt(answers.q9 as string) || 3]}
            onValueChange={(v) => handleSliderChange('q9', v)}
            min={1}
            max={5}
            step={1}
            className="flex-1"
          />
          <span className="text-sm">5</span>
          <span className="ml-4 px-3 py-1 rounded bg-secondary text-secondary-foreground font-bold">
            {answers.q9 || 3}
          </span>
        </div>
      </div>

      {/* Q10 - 單選 */}
      <div className="p-4 rounded-lg bg-muted">
        <p className="font-bold text-foreground mb-4">
          10. 若您未來進入一家企業實習，參與「綠色轉型專案」時，哪一種任務最吸引您？
        </p>
        <RadioGroup
          value={answers.q10 as string}
          onValueChange={(v) => handleRadioChange('q10', v)}
          className="space-y-2"
        >
          <div className="flex items-start space-x-3 p-2 rounded hover:bg-background transition-colors">
            <RadioGroupItem value="A" id="q10-A" className="mt-1" />
            <Label htmlFor="q10-A" className="flex-1 cursor-pointer">
              A（企業體系導向）：規劃整間辦公大樓或工廠的「能源管理規則」，並計算公司整年度排了多少碳。
            </Label>
          </div>
          <div className="flex items-start space-x-3 p-2 rounded hover:bg-background transition-colors">
            <RadioGroupItem value="B" id="q10-B" className="mt-1" />
            <Label htmlFor="q10-B" className="flex-1 cursor-pointer">
              B（終端產品導向）：針對公司賣得最好的一款「主打產品」，研究如何從原料採購到回收處理都變得更環保。
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default SurveySection;
