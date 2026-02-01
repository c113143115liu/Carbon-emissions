import React from 'react';
import QuizQuestion from './QuizQuestion';

interface CollegeQuizSectionProps {
  college: string;
  answers: Record<string, string | string[]>;
  onChange: (answers: Record<string, string | string[]>) => void;
}

const collegeQuestions: Record<string, Array<{
  id: string;
  question: string;
  options: { value: string; label: string }[];
  correctAnswer: string | string[];
  explanation: string;
}>> = {
  '工程': [
    {
      id: 'q-工程-1',
      question: 'Q1. 產品碳足跡邊界: 若一間製造商宣布其生產的筆電符合「搖籃到大門 (Cradle-to-gate)」邊界的產品碳足跡規範，這代表該評估排除了哪些階段？',
      options: [
        { value: 'A', label: '(A) 原料開採階段' },
        { value: 'B', label: '(B) 生產製造階段' },
        { value: 'C', label: '(C) 產品使用階段' },
        { value: 'D', label: '(D) 廢棄處理階段' },
      ],
      correctAnswer: 'C',
      explanation: '**搖籃到大門 (Cradle-to-gate)** 邊界涵蓋了從原料開採到產品製造完成出廠。因此，它**排除了**產品的**使用階段 (C)** 和**廢棄處理階段 (D)**。',
    },
    {
      id: 'q-工程-2',
      question: 'Q2. LCA 功能單位: 為什麼在進行產品生命週期評估 (LCA) 時，必須先定義「功能單位 (Functional Unit)」？',
      options: [
        { value: 'A', label: '(A) 為了計算產品價格' },
        { value: 'B', label: '(B) 為了作為比較不同產品環境影響的基準' },
        { value: 'C', label: '(C) 為了決定產品的銷售市場' },
        { value: 'D', label: '(D) 為了計算產品利潤' },
      ],
      correctAnswer: 'B',
      explanation: '設定**功能單位 (Functional Unit)** 是為了將不同產品或服務的功能量化，作為**比較不同產品環境影響的基準單位**，確保評估的公平性。',
    },
    {
      id: 'q-工程-3',
      question: 'Q3. 為環境而設計 (DfE): 什麼是「為環境而設計 (Design for Environment, DfE)」的主要目標？',
      options: [
        { value: 'A', label: '(A) 最大化產品利潤' },
        { value: 'B', label: '(B) 最小化產品的生命週期環境衝擊' },
        { value: 'C', label: '(C) 簡化產品結構' },
        { value: 'D', label: '(D) 加速產品上市時間' },
      ],
      correctAnswer: 'B',
      explanation: '**為環境而設計 (DfE)** 的核心目標是在產品設計初期就透過優化材料和製程，**最大化地減少產品在整個生命週期的環境衝擊**。',
    },
  ],
  '管理': [
    {
      id: 'q-管理-4',
      question: 'Q4. 永續報告書: 根據 GRI 準則，企業的永續發展報告書必須優先揭露經過什麼流程篩選的議題？',
      options: [
        { value: 'A', label: '(A) 員工意見調查' },
        { value: 'B', label: '(B) 重大性分析 (Materiality Assessment)' },
        { value: 'C', label: '(C) 財務報表審計' },
        { value: 'D', label: '(D) 市場份額分析' },
      ],
      correctAnswer: 'B',
      explanation: '根據 **GRI 準則**，企業的永續發展報告書必須優先揭露通過**重大性分析 (Materiality Assessment)** 流程篩選出來的議題。',
    },
    {
      id: 'q-管理-5',
      question: 'Q5. 供應鏈管理: 要求供應商進行碳盤查和減排的最主要管理效益是什麼？',
      options: [
        { value: 'A', label: '(A) 降低產品售價' },
        { value: 'B', label: '(B) 管理與降低企業的範疇三排放風險' },
        { value: 'C', label: '(C) 增加供應商數量' },
        { value: 'D', label: '(D) 提高員工滿意度' },
      ],
      correctAnswer: 'B',
      explanation: '供應商的碳排屬於企業的**範疇三排放**。要求供應商進行碳盤查和減排，能讓企業有效**管理與降低自身的範疇三排放風險**。',
    },
    {
      id: 'q-管理-6',
      question: 'Q6. 員工通勤排放: 企業員工在上下班通勤中所產生的排放，應歸類於 GHG Protocol 的哪一個範疇？',
      options: [
        { value: 'A', label: '(A) 範疇 1 (直接排放)' },
        { value: 'B', label: '(B) 範疇 2 (能源間接排放)' },
        { value: 'C', label: '(C) 範疇 3 (其他間接排放)' },
        { value: 'D', label: '(D) 不屬於任何範疇' },
      ],
      correctAnswer: 'C',
      explanation: '企業員工在上下班通勤中所產生的排放，屬於企業**不擁有或不控制**的間接排放源，歸類於**範疇 3 (其他間接排放)**。',
    },
  ],
  '科學': [
    {
      id: 'q-科學-8',
      question: 'Q8. 氣候模型: 請問哪一個模型是科學家模擬未來氣候變遷情境的關鍵工具？',
      options: [
        { value: 'A', label: '(A) 股票市場預測模型' },
        { value: 'B', label: '(B) 流行病學模型' },
        { value: 'C', label: '(C) 耦合氣候模型 (Coupled Climate Model)' },
        { value: 'D', label: '(D) 機器學習模型' },
      ],
      correctAnswer: 'C',
      explanation: '**耦合氣候模型 (Coupled Climate Model)** 是科學家模擬大氣、海洋、陸地和海冰等氣候系統的關鍵工具。',
    },
    {
      id: 'q-科學-9',
      question: 'Q9. 溫室氣體種類: 甲烷的全球暖化潛勢高但大氣生命週期短，這代表什麼？',
      options: [
        { value: 'A', label: '(A) 甲烷對長期氣候變遷的影響比二氧化碳大' },
        { value: 'B', label: '(B) 快速減少甲烷排放，能在短期內對減緩暖化產生顯著效果' },
        { value: 'C', label: '(C) 甲烷的排放應被完全忽略' },
        { value: 'D', label: '(D) 只有二氧化碳需要被盤查' },
      ],
      correctAnswer: 'B',
      explanation: '甲烷的大氣壽命約 12 年，遠短於二氧化碳。這表示**快速減少甲烷排放，能在短期內對減緩全球暖化產生顯著效益**。',
    },
    {
      id: 'q-科學-10',
      question: 'Q10. 碳捕捉技術: 直接空氣捕獲 (DAC) 與工業點源碳捕捉的主要差異在於？',
      options: [
        { value: 'A', label: '(A) DAC 的成本較低' },
        { value: 'B', label: '(B) DAC 捕捉來自單一工廠的高濃度二氧化碳' },
        { value: 'C', label: '(C) DAC 是從大氣中捕獲低濃度二氧化碳' },
        { value: 'D', label: '(D) DAC 屬於範疇三排放' },
      ],
      correctAnswer: 'C',
      explanation: '**直接空氣捕獲 (DAC)** 是從**大氣中**捕獲極低濃度二氧化碳的技術，與工業點源捕捉高濃度 CO₂ 不同。',
    },
  ],
  '社科': [
    {
      id: 'q-社科-11',
      question: 'Q11. 國際合作機制: 聯合國「綠色氣候基金 (GCF)」的主要目的是什麼？',
      options: [
        { value: 'A', label: '(A) 研發新的減碳技術' },
        { value: 'B', label: '(B) 協助開發中國家進行氣候變遷的減緩和調適行動' },
        { value: 'C', label: '(C) 制定全球統一的碳定價標準' },
        { value: 'D', label: '(D) 負責審核企業的溫室氣體盤查報告' },
      ],
      correctAnswer: 'B',
      explanation: '**綠色氣候基金 (GCF)** 的主要任務是**協助開發中國家進行氣候變遷的減緩和調適行動**。',
    },
    {
      id: 'q-社科-12',
      question: 'Q12. 氣候政策工具: 碳稅與碳排放交易系統 (ETS) 的主要區別在於？',
      options: [
        { value: 'A', label: '(A) 碳稅控制總排放量，ETS 控制碳價格' },
        { value: 'B', label: '(B) 碳稅設定排放價格，ETS 透過總量管制設定排放量上限' },
        { value: 'C', label: '(C) 兩者沒有區別，只是名稱不同' },
        { value: 'D', label: '(D) 兩者都只適用於範疇三排放' },
      ],
      correctAnswer: 'B',
      explanation: '**碳稅**設定每噸排放的固定價格；而**碳排放交易系統 (ETS)** 設定總排放上限，價格由市場供需決定。',
    },
    {
      id: 'q-社科-13',
      question: 'Q13. 環境行為改變: 要有效推動民眾減少碳排放行為，除了提高意識外，還需要什麼政策配套？',
      options: [
        { value: 'A', label: '(A) 提供便利、可靠且低成本的替代方案' },
        { value: 'B', label: '(B) 僅依賴宣傳海報和口號' },
        { value: 'C', label: '(C) 調整經濟誘因' },
        { value: 'D', label: '(D) 改變環境設定 (Nudging)' },
      ],
      correctAnswer: 'A',
      explanation: '要有效推動民眾行為改變，必須提供**便利、可靠且低成本的替代方案**，並調整經濟誘因。',
    },
  ],
  '人文': [
    {
      id: 'q-人文-14',
      question: 'Q14. 氣候敘事: 為什麼本地化敘事比全球數據更有效？',
      options: [
        { value: 'A', label: '(A) 因為全球科學數據不準確' },
        { value: 'B', label: '(B) 本地化敘事能提高觀眾的情感共鳴和行動意願' },
        { value: 'C', label: '(C) 氣候變遷只會影響本地社區' },
        { value: 'D', label: '(D) 減少媒體報導成本' },
      ],
      correctAnswer: 'B',
      explanation: '**本地化敘事**能將氣候數據轉化為觀眾**可連結、有感觸的經驗**，提高情感共鳴和行動意願。',
    },
    {
      id: 'q-人文-15',
      question: 'Q15. 環境倫理: 「代際正義」這個概念指的是什麼？',
      options: [
        { value: 'A', label: '(A) 確保所有國家都能公平分配資源' },
        { value: 'B', label: '(B) 現世代的行為不應以犧牲後代子孫生存環境為代價' },
        { value: 'C', label: '(C) 確保政府官員的任期能跨越不同世代' },
        { value: 'D', label: '(D) 所有人都應該使用相同的技術' },
      ],
      correctAnswer: 'B',
      explanation: '**代際正義**強調**現世代的行為不應以犧牲後代子孫的生存環境和權益為代價**。',
    },
    {
      id: 'q-人文-16',
      question: 'Q16. 文化與氣候: 文學、藝術和電影在傳遞氣候變遷方面扮演什麼角色？',
      options: [
        { value: 'A', label: '(A) 提供精確的氣候模型數據' },
        { value: 'B', label: '(B) 透過敘事、情感轉化科學知識為文化意義' },
        { value: 'C', label: '(C) 負責監督政府的減排目標' },
        { value: 'D', label: '(D) 提高藝術品的市場價格' },
      ],
      correctAnswer: 'B',
      explanation: '文化媒介能夠將複雜的科學知識**轉化為大眾能夠理解、感受的文化意義**。',
    },
  ],
  '醫學': [
    {
      id: 'q-醫學-17',
      question: 'Q17. 醫療體系排放: 下列哪一項屬於醫院的「範疇 1」排放來源？',
      options: [
        { value: 'A', label: '(A) 醫院病房的空調冷媒洩漏' },
        { value: 'B', label: '(B) 麻醉氣體，特別是笑氣 (N₂O)' },
        { value: 'C', label: '(C) 救護車的汽油消耗' },
        { value: 'D', label: '(D) 員工通勤' },
      ],
      correctAnswer: 'B',
      explanation: '醫院使用的**麻醉氣體**（如 N₂O）是高 GWP 氣體，直接從醫療設備中釋放，是醫療體系獨特的範疇一排放源。',
    },
    {
      id: 'q-醫學-18',
      question: 'Q18. 氣候韌性: 衛生部門應如何應對氣候相關的公衛威脅？',
      options: [
        { value: 'A', label: '(A) 僅在災難發生後才進行應對' },
        { value: 'B', label: '(B) 完全依賴國際援助' },
        { value: 'C', label: '(C) 主動整合氣候風險評估至公共衛生規劃中' },
        { value: 'D', label: '(D) 忽略氣候變遷對健康的影響' },
      ],
      correctAnswer: 'C',
      explanation: '**氣候韌性**要求衛生部門**主動整合氣候風險評估至公共衛生規劃中**，建立早期預警系統。',
    },
    {
      id: 'q-醫學-19',
      question: 'Q19. 健康共益: 減少化石燃料使用的最大健康共益是什麼？',
      options: [
        { value: 'A', label: '(A) 增加就業機會' },
        { value: 'B', label: '(B) 降低呼吸道和心血管疾病發病率' },
        { value: 'C', label: '(C) 減少醫療保健支出' },
        { value: 'D', label: '(D) 以上皆是' },
      ],
      correctAnswer: 'D',
      explanation: '減少化石燃料可**降低空氣污染**，直接**降低呼吸道、心血管疾病發病率**，並**減少醫療保健支出**。',
    },
  ],
};

const CollegeQuizSection: React.FC<CollegeQuizSectionProps> = ({ college, answers, onChange }) => {
  const questions = collegeQuestions[college] || collegeQuestions['工程'];

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
          selectedAnswer={answers[q.id] as string}
          onAnswerChange={(value) => handleAnswerChange(q.id, value)}
        />
      ))}
    </div>
  );
};

export default CollegeQuizSection;
