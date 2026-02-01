import React from 'react';
import { ExternalLink } from 'lucide-react';

const ReferencePage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="section-title">氣候變遷與碳管理案例認識</h2>

      <div className="card-eco">
        <h3 className="text-lg font-bold text-secondary mb-4">實際應用案例</h3>
        <ul className="space-y-3 list-disc pl-5">
          <li><strong>企業碳盤查 (ISO 14064-1)：</strong>企業透過盤查，識別範疇一、二、三的排放，以設定減量目標。</li>
          <li><strong>產品碳足跡 (LCA)：</strong>透過產品碳足跡標籤，供消費者參考。</li>
          <li><strong>環境管理系統 (ISO 14001)：</strong>系統化管理和改善環境績效。</li>
        </ul>
      </div>

      <div className="card-eco">
        <h3 className="text-lg font-bold text-secondary mb-4">如何減少個人碳排放</h3>
        <div className="space-y-4">
          <div><h4 className="font-bold text-primary">住家與能源</h4><p>購買能源效率 1 級電器，設定冷氣 26-28°C。</p></div>
          <div><h4 className="font-bold text-primary">交通與通勤</h4><p>優先搭乘大眾運輸，短程使用自行車或步行。</p></div>
          <div><h4 className="font-bold text-primary">飲食與消費</h4><p>減少牛肉攝取，購買當地當季食物。</p></div>
        </div>
      </div>

      <div className="card-eco">
        <h3 className="text-lg font-bold text-secondary mb-4">參考網站</h3>
        <ul className="space-y-2">
          <li><a href="https://esg.tsmc.com" target="_blank" rel="noopener" className="flex items-center gap-2 text-secondary hover:underline"><ExternalLink className="w-4 h-4" />台積電永續報告</a></li>
          <li><a href="https://cfp-calculate.tw" target="_blank" rel="noopener" className="flex items-center gap-2 text-secondary hover:underline"><ExternalLink className="w-4 h-4" />產品碳足跡資訊網</a></li>
          <li><a href="https://www.moenv.gov.tw" target="_blank" rel="noopener" className="flex items-center gap-2 text-secondary hover:underline"><ExternalLink className="w-4 h-4" />環境部</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencePage;
