import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useAdminData, AdminProfile, AdminSurveyResponse, AdminLearningProgress, AdminCalculatorResult } from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Users, 
  FileText, 
  BookOpen, 
  ArrowLeft, 
  RefreshCw,
  ShieldCheck,
  BarChart3,
  Calculator
} from 'lucide-react';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const { 
    isAdmin, 
    checkingAdmin, 
    loading, 
    profiles, 
    surveyResponses, 
    learningProgress,
    calculatorResults,
    fetchAllData,
    getResponsesByType,
    getUserResponses,
    getUserProgress,
    getUserCalculatorResults,
    getStats
  } = useAdminData();
  
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [surveyTab, setSurveyTab] = useState<string>('initial');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">驗證權限中...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <ShieldCheck className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">權限不足</h2>
            <p className="text-muted-foreground mb-6">您沒有管理員權限訪問此頁面。</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首頁
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getStats();
  const selectedUserProfile = profiles.find(p => p.user_id === selectedUser);

  const formatAnswer = (answer: unknown): string => {
    if (typeof answer === 'string') return answer;
    if (Array.isArray(answer)) return answer.join(', ');
    if (typeof answer === 'object' && answer !== null) return JSON.stringify(answer);
    return String(answer);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container max-w-6xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">管理後台</h1>
                <p className="text-sm text-muted-foreground">碳排放計算器教育平台</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => fetchAllData()} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                重新整理
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回首頁
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto py-8 px-4 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                總使用者數
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                已完成問卷
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{stats.completedSurvey}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                課程完成數
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{stats.totalLessonsCompleted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                問卷作答數
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{surveyResponses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">使用者</TabsTrigger>
            <TabsTrigger value="initial">初始問卷</TabsTrigger>
            <TabsTrigger value="knowledge">知識測驗</TabsTrigger>
            <TabsTrigger value="college">學群測驗</TabsTrigger>
            <TabsTrigger value="postQuiz">後測問卷</TabsTrigger>
            <TabsTrigger value="calculator">計算記錄</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>使用者列表與學習進度</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>使用者名稱</TableHead>
                        <TableHead>數位身份</TableHead>
                        <TableHead>學群</TableHead>
                        <TableHead>年級</TableHead>
                        <TableHead>問卷作答數</TableHead>
                        <TableHead>課程完成數</TableHead>
                        <TableHead>註冊時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            尚無使用者資料
                          </TableCell>
                        </TableRow>
                      ) : (
                        profiles.map((profile) => {
                          const userResponses = getUserResponses(profile.user_id);
                          const userProgress = getUserProgress(profile.user_id);
                          const completedLessons = userProgress.filter(p => p.completed).length;
                          
                          return (
                            <TableRow key={profile.id}>
                              <TableCell className="font-medium">{profile.username || '未設定'}</TableCell>
                              <TableCell>
                                {profile.persona ? (
                                  <Badge variant="secondary">{profile.persona}</Badge>
                                ) : (
                                  <span className="text-muted-foreground">未完成</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {profile.college ? (
                                  <Badge variant="outline">{profile.college}</Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>{profile.grade || '-'}</TableCell>
                              <TableCell>{userResponses.length}</TableCell>
                              <TableCell>{completedLessons}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(profile.created_at).toLocaleDateString('zh-TW')}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Initial Survey Tab */}
          <TabsContent value="initial">
            <Card>
              <CardHeader>
                <CardTitle>初始問卷作答紀錄</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>使用者</TableHead>
                        <TableHead>題目 ID</TableHead>
                        <TableHead>題目內容</TableHead>
                        <TableHead>答案</TableHead>
                        <TableHead>作答時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getResponsesByType('initial').length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            尚無初始問卷作答紀錄
                          </TableCell>
                        </TableRow>
                      ) : (
                        getResponsesByType('initial').map((response) => {
                          const userProfile = profiles.find(p => p.user_id === response.user_id);
                          return (
                            <TableRow key={response.id}>
                              <TableCell className="font-medium">
                                {userProfile?.username || response.user_id.slice(0, 8)}
                              </TableCell>
                              <TableCell>{response.question_id}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {response.question_text || '-'}
                              </TableCell>
                              <TableCell>{formatAnswer(response.answer)}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(response.created_at).toLocaleDateString('zh-TW')}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Quiz Tab */}
          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle>知識測驗作答紀錄</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>使用者</TableHead>
                        <TableHead>題目 ID</TableHead>
                        <TableHead>題目內容</TableHead>
                        <TableHead>答案</TableHead>
                        <TableHead>正確</TableHead>
                        <TableHead>分數</TableHead>
                        <TableHead>作答時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getResponsesByType('knowledge').length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            尚無知識測驗作答紀錄
                          </TableCell>
                        </TableRow>
                      ) : (
                        getResponsesByType('knowledge').map((response) => {
                          const userProfile = profiles.find(p => p.user_id === response.user_id);
                          return (
                            <TableRow key={response.id}>
                              <TableCell className="font-medium">
                                {userProfile?.username || response.user_id.slice(0, 8)}
                              </TableCell>
                              <TableCell>{response.question_id}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {response.question_text || '-'}
                              </TableCell>
                              <TableCell>{formatAnswer(response.answer)}</TableCell>
                              <TableCell>
                                {response.is_correct !== null ? (
                                  <Badge variant={response.is_correct ? 'default' : 'destructive'}>
                                    {response.is_correct ? '正確' : '錯誤'}
                                  </Badge>
                                ) : '-'}
                              </TableCell>
                              <TableCell>{response.score ?? '-'}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(response.created_at).toLocaleDateString('zh-TW')}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* College Quiz Tab */}
          <TabsContent value="college">
            <Card>
              <CardHeader>
                <CardTitle>學群測驗作答紀錄</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>使用者</TableHead>
                        <TableHead>學群</TableHead>
                        <TableHead>題目 ID</TableHead>
                        <TableHead>題目內容</TableHead>
                        <TableHead>答案</TableHead>
                        <TableHead>正確</TableHead>
                        <TableHead>分數</TableHead>
                        <TableHead>作答時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getResponsesByType('college').length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            尚無學群測驗作答紀錄
                          </TableCell>
                        </TableRow>
                      ) : (
                        getResponsesByType('college').map((response) => {
                          const userProfile = profiles.find(p => p.user_id === response.user_id);
                          return (
                            <TableRow key={response.id}>
                              <TableCell className="font-medium">
                                {userProfile?.username || response.user_id.slice(0, 8)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{userProfile?.college || '-'}</Badge>
                              </TableCell>
                              <TableCell>{response.question_id}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {response.question_text || '-'}
                              </TableCell>
                              <TableCell>{formatAnswer(response.answer)}</TableCell>
                              <TableCell>
                                {response.is_correct !== null ? (
                                  <Badge variant={response.is_correct ? 'default' : 'destructive'}>
                                    {response.is_correct ? '正確' : '錯誤'}
                                  </Badge>
                                ) : '-'}
                              </TableCell>
                              <TableCell>{response.score ?? '-'}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(response.created_at).toLocaleDateString('zh-TW')}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Quiz Tab */}
          <TabsContent value="postQuiz">
            <Card>
              <CardHeader>
                <CardTitle>後測問卷作答紀錄</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Summary Stats */}
                    {(() => {
                      const postQuizResponses = getResponsesByType('postQuiz');
                      const uniqueUsers = new Set(postQuizResponses.map(r => r.user_id)).size;
                      const correctAnswers = postQuizResponses.filter(r => r.is_correct).length;
                      const totalAnswers = postQuizResponses.length;
                      const avgScore = totalAnswers > 0 ? (correctAnswers / totalAnswers * 100) : 0;
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">完成人數</p>
                            <p className="text-2xl font-bold text-primary">{uniqueUsers}</p>
                          </div>
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">總作答數</p>
                            <p className="text-2xl font-bold text-secondary">{totalAnswers}</p>
                          </div>
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">平均正確率</p>
                            <p className="text-2xl font-bold text-accent">{avgScore.toFixed(1)}%</p>
                          </div>
                        </div>
                      );
                    })()}

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>使用者</TableHead>
                          <TableHead>題目 ID</TableHead>
                          <TableHead>題目內容</TableHead>
                          <TableHead>答案</TableHead>
                          <TableHead>正確</TableHead>
                          <TableHead>分數</TableHead>
                          <TableHead>作答時間</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getResponsesByType('postQuiz').length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              尚無後測問卷作答紀錄
                            </TableCell>
                          </TableRow>
                        ) : (
                          getResponsesByType('postQuiz').map((response) => {
                            const userProfile = profiles.find(p => p.user_id === response.user_id);
                            return (
                              <TableRow key={response.id}>
                                <TableCell className="font-medium">
                                  {userProfile?.username || response.user_id.slice(0, 8)}
                                </TableCell>
                                <TableCell>{response.question_id}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {response.question_text || '-'}
                                </TableCell>
                                <TableCell>{formatAnswer(response.answer)}</TableCell>
                                <TableCell>
                                  {response.is_correct !== null ? (
                                    <Badge variant={response.is_correct ? 'default' : 'destructive'}>
                                      {response.is_correct ? '正確' : '錯誤'}
                                    </Badge>
                                  ) : '-'}
                                </TableCell>
                                <TableCell>{response.score ?? '-'}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {new Date(response.created_at).toLocaleDateString('zh-TW')}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  碳排放計算記錄
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">總計算次數</p>
                        <p className="text-2xl font-bold text-primary">{stats.totalCalculations}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">平均月排放量</p>
                        <p className="text-2xl font-bold text-destructive">{stats.avgEmissions.toFixed(2)} kg</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">參與使用者</p>
                        <p className="text-2xl font-bold text-secondary">
                          {new Set(calculatorResults.map(r => r.user_id)).size}
                        </p>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>使用者</TableHead>
                          <TableHead>計算類型</TableHead>
                          <TableHead>月排放量</TableHead>
                          <TableHead>年排放量(估)</TableHead>
                          <TableHead>輸入摘要</TableHead>
                          <TableHead>計算時間</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculatorResults.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              尚無計算記錄
                            </TableCell>
                          </TableRow>
                        ) : (
                          calculatorResults.map((result) => {
                            const userProfile = profiles.find(p => p.user_id === result.user_id);
                            const inputs = result.inputs as Record<string, unknown>;
                            const homeInputs = inputs?.home as { elec?: number; gas?: number } | undefined;
                            
                            return (
                              <TableRow key={result.id}>
                                <TableCell className="font-medium">
                                  {userProfile?.username || result.user_id.slice(0, 8)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {result.calculator_type === 'monthly' ? '月度計算' : result.calculator_type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-bold text-destructive">
                                  {result.result_kg.toFixed(2)} kg
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {(result.result_kg * 12).toFixed(2)} kg
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                  {homeInputs?.elec ? `電力:${homeInputs.elec}kWh` : ''}
                                  {homeInputs?.gas ? ` 瓦斯:${homeInputs.gas}度` : ''}
                                  {!homeInputs?.elec && !homeInputs?.gas ? '-' : ''}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {new Date(result.created_at).toLocaleDateString('zh-TW')}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>數位身份分布</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.personaDistribution).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">尚無資料</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.personaDistribution).map(([persona, count]) => (
                    <div key={persona} className="flex items-center justify-between">
                      <span className="font-medium">{persona}</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ width: `${(count / stats.totalUsers) * 100}px` }}
                        />
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>學群分布</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(stats.collegeDistribution).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">尚無資料</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.collegeDistribution).map(([college, count]) => (
                    <div key={college} className="flex items-center justify-between">
                      <span className="font-medium">{college}</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 bg-secondary rounded-full" 
                          style={{ width: `${(count / stats.totalUsers) * 100}px` }}
                        />
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
