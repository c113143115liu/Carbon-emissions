import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCalculatorResults, CalculatorResult } from '@/hooks/useCalculatorResults';
import { Save, History, Loader2, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EFS = {
  ELECTRICITY_EF: 0.509,
  GAS_EF: 2.115,
  TRANSPORT_EFS: { '機車': 0.054, '汽車': 0.170, '公車': 0.026, '高鐵': 0.015, '捷運/火車': 0.017 },
  FOOD_EFS: { '牛肉': 20.0, '豬肉': 7.0, '羊肉': 5.0, '家禽': 3.0, '魚類': 2.0, '奶製品/蛋': 1.0, '素食': 0.5 },
};

const CalculatorPage: React.FC = () => {
  const [home, setHome] = useState({ elec: 0, gas: 0 });
  const [transport, setTransport] = useState<Record<string, number>>({ '機車': 0, '汽車': 0, '公車': 0, '高鐵': 0, '捷運/火車': 0 });
  const [food, setFood] = useState<Record<string, number>>({ '牛肉': 0, '豬肉': 0, '羊肉': 0, '家禽': 0, '魚類': 0, '奶製品/蛋': 0, '素食': 0 });
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { results, loading, saveResult, fetchResults } = useCalculatorResults();

  const homeEmission = home.elec * EFS.ELECTRICITY_EF + home.gas * EFS.GAS_EF;
  const transportEmission = Object.entries(transport).reduce((sum, [k, v]) => sum + v * (EFS.TRANSPORT_EFS[k as keyof typeof EFS.TRANSPORT_EFS] || 0), 0);
  const foodEmission = Object.entries(food).reduce((sum, [k, v]) => sum + v * (EFS.FOOD_EFS[k as keyof typeof EFS.FOOD_EFS] || 0) * 4, 0);
  const totalMonthly = homeEmission + transportEmission + foodEmission;

  // Load latest result on mount
  useEffect(() => {
    if (results.length > 0) {
      const latest = results[0];
      const inputs = latest.inputs as Record<string, unknown>;
      if (inputs.home) setHome(inputs.home as { elec: number; gas: number });
      if (inputs.transport) setTransport(inputs.transport as Record<string, number>);
      if (inputs.food) setFood(inputs.food as Record<string, number>);
    }
  }, [results]);

  const handleSave = async () => {
    if (totalMonthly === 0) {
      toast.error('請先輸入數據後再儲存');
      return;
    }
    
    setSaving(true);
    const inputs = { home, transport, food };
    const { error } = await saveResult('monthly', inputs, totalMonthly);
    
    if (error) {
      toast.error('儲存失敗：' + error.message);
    } else {
      toast.success('計算結果已儲存！');
    }
    setSaving(false);
  };

  const formatInputs = (inputs: unknown): string => {
    const data = inputs as Record<string, unknown>;
    const parts: string[] = [];
    
    if (data.home) {
      const h = data.home as { elec: number; gas: number };
      if (h.elec > 0) parts.push(`電力:${h.elec}kWh`);
      if (h.gas > 0) parts.push(`瓦斯:${h.gas}度`);
    }
    
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="section-title">個人生活碳排放計算器</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4 mr-1" />
            {showHistory ? '隱藏歷史' : '查看歷史'}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || totalMonthly === 0}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            儲存結果
          </Button>
        </div>
      </div>

      {/* History Section */}
      {showHistory && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">計算歷史紀錄</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : results.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">尚無歷史紀錄</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>計算類型</TableHead>
                    <TableHead>主要輸入</TableHead>
                    <TableHead className="text-right">月排放量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.slice(0, 10).map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {new Date(result.created_at).toLocaleDateString('zh-TW')}
                      </TableCell>
                      <TableCell>
                        {result.calculator_type === 'monthly' ? '月度計算' : result.calculator_type}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {formatInputs(result.inputs)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-destructive">
                        {result.result_kg.toFixed(2)} kgCO₂e
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* 住家能源 */}
      <div className="card-eco">
        <h3 className="text-lg font-bold text-secondary mb-4">住家能源排放量 (每月)</h3>
        <div className="space-y-4">
          <div className="input-eco">
            <Label>電力消耗 (係數 0.509)</Label>
            <Input type="number" value={home.elec} onChange={e => setHome({...home, elec: +e.target.value})} className="w-24 text-right" />
            <span className="text-muted-foreground text-sm">kWh/月</span>
          </div>
          <div className="input-eco">
            <Label>天然氣消耗 (係數 2.115)</Label>
            <Input type="number" value={home.gas} onChange={e => setHome({...home, gas: +e.target.value})} className="w-24 text-right" />
            <span className="text-muted-foreground text-sm">度/月</span>
          </div>
        </div>
        <p className="text-right mt-4 text-lg font-bold text-destructive">住家總排放: {homeEmission.toFixed(2)} kgCO₂e/月</p>
      </div>

      {/* 交通通勤 */}
      <div className="card-eco">
        <h3 className="text-lg font-bold text-secondary mb-4">交通通勤排放量 (每月)</h3>
        <div className="space-y-3">
          {Object.entries(EFS.TRANSPORT_EFS).map(([mode, ef]) => (
            <div key={mode} className={`input-eco ${mode === '公車' ? 'highlight-item' : ''}`}>
              <Label>{mode} (係數 {ef})</Label>
              <Input type="number" value={transport[mode]} onChange={e => setTransport({...transport, [mode]: +e.target.value})} className="w-24 text-right" />
              <span className="text-muted-foreground text-sm">km/月</span>
            </div>
          ))}
        </div>
        <p className="text-right mt-4 text-lg font-bold text-destructive">交通總排放: {transportEmission.toFixed(2)} kgCO₂e/月</p>
      </div>

      {/* 飲食習慣 */}
      <div className="card-eco">
        <h3 className="text-lg font-bold text-secondary mb-4">飲食習慣碳排放 (每週次數)</h3>
        <div className="space-y-3">
          {Object.entries(EFS.FOOD_EFS).map(([item, ef]) => (
            <div key={item} className={`input-eco ${item === '素食' ? 'highlight-item' : ''}`}>
              <Label>{item} (係數 {ef})</Label>
              <Input type="number" value={food[item]} onChange={e => setFood({...food, [item]: +e.target.value})} className="w-24 text-right" />
              <span className="text-muted-foreground text-sm">周/次</span>
            </div>
          ))}
        </div>
        <p className="text-right mt-4 text-lg font-bold text-destructive">飲食總排放: {foodEmission.toFixed(2)} kgCO₂e/月</p>
      </div>

      {/* 總計 */}
      <div className="tally-section">
        <h3 className="text-xl font-bold text-primary text-center mb-4">您的個人每月碳排放總計</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-primary/30"><span>住家能源</span><span>{homeEmission.toFixed(2)} kgCO₂e/月</span></div>
          <div className="flex justify-between py-2 border-b border-primary/30"><span>交通通勤</span><span>{transportEmission.toFixed(2)} kgCO₂e/月</span></div>
          <div className="flex justify-between py-2 border-b border-primary/30"><span>飲食習慣</span><span>{foodEmission.toFixed(2)} kgCO₂e/月</span></div>
          <div className="flex justify-between py-3 text-xl font-bold text-destructive"><span>總排放量 (每月)</span><span>{totalMonthly.toFixed(2)} kgCO₂e/月</span></div>
          <div className="flex justify-between py-2 text-muted-foreground"><span>年排放量 (約)</span><span>{(totalMonthly * 12).toFixed(2)} kgCO₂e/年</span></div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={saving || totalMonthly === 0}
            className="w-full max-w-xs"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            儲存計算結果
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;