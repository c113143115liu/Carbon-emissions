import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ClipboardList, BookOpen, Calculator, Lightbulb, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PageType = 'survey' | 'learning' | 'postQuiz' | 'endQuiz' | 'calculator' | 'reference';

interface NavbarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  isQuizCompleted: boolean;
  isAdmin?: boolean;
}

const navItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
  { id: 'survey', label: '問卷', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'learning', label: '教學平台', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'postQuiz', label: '後測問卷', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'endQuiz', label: '結束問卷', icon: <FileText className="w-4 h-4" /> },
  { id: 'calculator', label: '計算器', icon: <Calculator className="w-4 h-4" /> },
  { id: 'reference', label: '參考資料', icon: <Lightbulb className="w-4 h-4" /> },
];

const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange, isQuizCompleted, isAdmin = false }) => {
  const handleNavClick = (page: PageType) => {
    const lockedPages: PageType[] = ['learning', 'postQuiz', 'endQuiz', 'calculator', 'reference'];
    
    if (lockedPages.includes(page) && !isQuizCompleted) {
      alert('⚠️ 請先完成「初始問卷」並提交，才能解鎖後續所有內容。');
      return;
    }
    
    onPageChange(page);
  };

  return (
    <header className="border-b-3 border-primary pb-4 mb-6">
      <h1 className="text-3xl font-bold text-secondary text-center mb-4 flex items-center justify-center gap-3">
        <Leaf className="w-8 h-8" />
        碳排放計算器
      </h1>
      
      <nav className="flex flex-wrap justify-center gap-2">
        {navItems.map((item) => {
          const isLocked = !isQuizCompleted && item.id !== 'survey';
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'nav-eco flex items-center gap-2 text-sm md:text-base',
                currentPage === item.id && 'active',
                isLocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
        
        {isAdmin && (
          <Link
            to="/admin"
            className="nav-eco flex items-center gap-2 text-sm md:text-base bg-primary/20 hover:bg-primary/30"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">管理後台</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
