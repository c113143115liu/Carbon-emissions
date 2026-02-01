import React, { useState } from 'react';
import { Lock, User, UserPlus, LogIn, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginPageProps {
  onClose: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('請填寫所有欄位');
      return;
    }

    if (isSignUp) {
      // 模擬註冊成功
      alert('註冊成功！請登入');
      setIsSignUp(false);
    } else {
      // 模擬登入成功
      login(username);
      onClose();
    }
  };

  const handleGuestLogin = () => {
    login('訪客');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="login-card animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-secondary">
            {isSignUp ? '註冊新帳號' : '登入碳排放計算器'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2 text-foreground font-semibold">
              <User className="w-4 h-4" />
              帳號/信箱
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="請輸入帳號"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-foreground font-semibold">
              <Lock className="w-4 h-4" />
              密碼
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 btn-primary-gradient text-lg">
            {isSignUp ? (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                立即註冊
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                確認登入
              </>
            )}
          </Button>

          {!isSignUp && (
            <Button
              type="button"
              variant="secondary"
              className="w-full h-12 text-lg"
              onClick={handleGuestLogin}
            >
              <UserX className="w-5 h-5 mr-2" />
              訪客登入
            </Button>
          )}
        </form>

        <p className="mt-6 text-center text-muted-foreground">
          <button
            type="button"
            className="text-secondary hover:underline font-medium"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? '已有帳號？點此登入' : '還沒有帳號？點此註冊'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
