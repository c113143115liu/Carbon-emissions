import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PersonalInfoValue {
  grade: string;
  college: string;
  hasCourse: string;
}

interface PersonalInfoSectionProps {
  value: PersonalInfoValue;
  onChange: (value: PersonalInfoValue) => void;
}

const grades = ['大一', '大二', '大三', '大四', '研究所'];
const colleges = [
  { value: '人文', label: '文學院' },
  { value: '科學', label: '理學院' },
  { value: '工程', label: '工學院' },
  { value: '管理', label: '管理學院' },
  { value: '社科', label: '社會科學學院' },
  { value: '醫學', label: '醫學/健康學院' },
  { value: '其他', label: '其他' },
];

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-muted border-l-4 border-primary">
        <p className="font-bold text-secondary mb-4">1. 您目前的年級是？科系屬於哪一學群？</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>年級：</Label>
            <Select
              value={value.grade}
              onValueChange={(v) => onChange({ ...value, grade: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="請選擇" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>學群：</Label>
            <Select
              value={value.college}
              onValueChange={(v) => onChange({ ...value, college: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="請選擇" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college.value} value={college.value}>
                    {college.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted border-l-4 border-primary">
        <p className="font-bold text-secondary mb-4">
          2. 您是否修習過任何與「永續發展」、「氣候變遷」或「碳管理」相關的課程？
        </p>
        
        <RadioGroup
          value={value.hasCourse}
          onValueChange={(v) => onChange({ ...value, hasCourse: v })}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="course-yes" />
            <Label htmlFor="course-yes">是</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="course-no" />
            <Label htmlFor="course-no">否</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
