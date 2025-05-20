import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LionLogo } from "@/components/lion-logo";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { useTasks } from "@/hooks/useTasks";
import { LogOut, Award, Gift, User as UserIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const { balances, isWalletConnected } = useWallet();
  const { tasks } = useTasks();

  // Calculate completed tasks
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  // Handle sign out
  const handleSignOut = () => {
    signOut();
    toast({
      title: "已登出",
      description: "您已成功登出",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">個人資料</h1>
        </div>
        <p className="mt-1 text-sm">查看您的成就和資料</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-4">
        {/* User Profile Card */}
        <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-lion-orange" />
              用戶資料
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-lion-orange/10 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-lion-orange" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {profile?.display_name || user?.email || "未登入用戶"}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.email || "請連接錢包以查看您的資料"}
                </p>
                {profile && (
                  <p className="text-xs text-lion-orange mt-1">
                    推薦碼: {profile.referral_code}
                  </p>
                )}
              </div>
            </div>

            {isWalletConnected && (
              <Button
                variant="outline"
                className="mt-4 w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                登出
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-lion-orange" />
              統計數據
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">已完成任務</p>
                <p className="text-xl font-bold text-lion-accent">
                  {profile?.total_tasks_completed || 0}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">任務完成率</p>
                <p className="text-xl font-bold text-lion-accent">
                  {completionPercentage}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">連續登入</p>
                <p className="text-xl font-bold text-lion-accent">
                  {profile?.login_streak || 0} 天
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-500">推薦人數</p>
                <p className="text-xl font-bold text-lion-accent">
                  {profile?.referral_count || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-lion-orange" />
              成就
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Login Streak Achievement */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">連續登入達人</h4>
                    <p className="text-xs text-gray-500">連續登入獲得獎勵</p>
                  </div>
                  <div className="bg-lion-face rounded-md px-2 py-1 text-xs font-medium text-lion-accent">
                    {profile?.login_streak || 0}/7 天
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-lion-orange h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((profile?.login_streak || 0) / 7) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Task Completion Achievement */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">任務完成者</h4>
                    <p className="text-xs text-gray-500">完成平台上的任務</p>
                  </div>
                  <div className="bg-lion-face rounded-md px-2 py-1 text-xs font-medium text-lion-accent">
                    {completedTasksCount}/{totalTasksCount} 個
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-lion-orange h-2 rounded-full"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Referral Achievement */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">推薦大使</h4>
                    <p className="text-xs text-gray-500">邀請好友加入平台</p>
                  </div>
                  <div className="bg-lion-face rounded-md px-2 py-1 text-xs font-medium text-lion-accent">
                    {profile?.referral_count || 0}/10 人
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-lion-orange h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((profile?.referral_count || 0) / 10) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
