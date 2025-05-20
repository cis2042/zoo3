import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LionLogo } from "@/components/lion-logo";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types";
import { Check, ExternalLink } from "lucide-react";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, isLoading, isCompleting, completeTask } = useTasks();
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  // Group tasks by token type
  const groupedTasks = tasks.reduce((acc, task) => {
    const token = task.reward_token;
    if (!acc[token]) {
      acc[token] = [];
    }
    acc[token].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Function to handle task completion
  const handleCompleteTask = async (taskId: string) => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要先登入才能完成任務",
        variant: "destructive",
      });
      return;
    }

    const result = await completeTask(taskId);

    if (result.success) {
      toast({
        title: "任務完成！",
        description: result.message || "您已成功完成任務並獲得獎勵",
      });
    } else {
      toast({
        title: "無法完成任務",
        description: result.error || "完成任務時發生錯誤，請稍後再試",
        variant: "destructive",
      });
    }
  };

  // Function to toggle task description
  const toggleTaskDescription = (taskId: string) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskId);
    }
  };

  // Function to handle redirect
  const handleRedirect = (url: string | undefined, taskId: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      handleCompleteTask(taskId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">任務中心</h1>
        </div>
        <p className="mt-1 text-sm">完成任務獲取獎勵</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">載入任務中...</p>
          </div>
        ) : (
          <>
            {/* KAIA Tasks */}
            {groupedTasks.KAIA && groupedTasks.KAIA.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-lion-accent flex items-center gap-1">
                  <span className="text-sm">🪙</span> KAIA 任務
                </h2>
                {groupedTasks.KAIA.map((task) => (
                  <Card
                    key={task.id}
                    className={`border ${
                      task.completed
                        ? "border-lion-teal/30 bg-lion-teal/5"
                        : "border-lion-orange/30 hover:border-lion-orange/50"
                    } transition-all duration-200`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          {expandedTask === task.id && (
                            <CardDescription>{task.description}</CardDescription>
                          )}
                        </div>
                        <div className="bg-lion-face rounded-md px-2 py-1 text-xs font-medium text-lion-accent">
                          +{task.reward_amount} KAIA
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 p-0 h-auto"
                        onClick={() => toggleTaskDescription(task.id)}
                      >
                        {expandedTask === task.id ? "隱藏詳情" : "查看詳情"}
                      </Button>
                      <Button
                        variant={task.completed ? "teal" : "orange"}
                        size="sm"
                        disabled={task.completed || isCompleting}
                        onClick={() => handleRedirect(task.redirect_url, task.id)}
                        className="flex items-center gap-1"
                      >
                        {task.completed ? (
                          <>
                            <Check className="h-4 w-4" /> 已完成
                          </>
                        ) : task.redirect_url ? (
                          <>
                            <ExternalLink className="h-4 w-4" /> 前往
                          </>
                        ) : (
                          "完成任務"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* ZOO Tasks */}
            {groupedTasks.ZOO && groupedTasks.ZOO.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-lion-accent flex items-center gap-1">
                  <span className="text-sm">🦁</span> ZOO 任務
                </h2>
                {groupedTasks.ZOO.map((task) => (
                  <Card
                    key={task.id}
                    className={`border ${
                      task.completed
                        ? "border-lion-teal/30 bg-lion-teal/5"
                        : "border-lion-orange/30 hover:border-lion-orange/50"
                    } transition-all duration-200`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          {expandedTask === task.id && (
                            <CardDescription>{task.description}</CardDescription>
                          )}
                        </div>
                        <div className="bg-lion-face rounded-md px-2 py-1 text-xs font-medium text-lion-accent">
                          +{task.reward_amount} ZOO
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 p-0 h-auto"
                        onClick={() => toggleTaskDescription(task.id)}
                      >
                        {expandedTask === task.id ? "隱藏詳情" : "查看詳情"}
                      </Button>
                      <Button
                        variant={task.completed ? "teal" : "orange"}
                        size="sm"
                        disabled={task.completed || isCompleting}
                        onClick={() => handleRedirect(task.redirect_url, task.id)}
                        className="flex items-center gap-1"
                      >
                        {task.completed ? (
                          <>
                            <Check className="h-4 w-4" /> 已完成
                          </>
                        ) : task.redirect_url ? (
                          <>
                            <ExternalLink className="h-4 w-4" /> 前往
                          </>
                        ) : (
                          "完成任務"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* WBTC Tasks */}
            {groupedTasks.WBTC && groupedTasks.WBTC.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-lion-accent flex items-center gap-1">
                  <span className="text-sm">₿</span> WBTC 任務
                </h2>
                {groupedTasks.WBTC.map((task) => (
                  <Card
                    key={task.id}
                    className={`border ${
                      task.completed
                        ? "border-lion-teal/30 bg-lion-teal/5"
                        : "border-lion-orange/30 hover:border-lion-orange/50"
                    } transition-all duration-200`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          {expandedTask === task.id && (
                            <CardDescription>{task.description}</CardDescription>
                          )}
                        </div>
                        <div className="bg-lion-face rounded-md px-2 py-1 text-xs font-medium text-lion-accent">
                          +{task.reward_amount} WBTC
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 p-0 h-auto"
                        onClick={() => toggleTaskDescription(task.id)}
                      >
                        {expandedTask === task.id ? "隱藏詳情" : "查看詳情"}
                      </Button>
                      <Button
                        variant={task.completed ? "teal" : "orange"}
                        size="sm"
                        disabled={task.completed || isCompleting}
                        onClick={() => handleRedirect(task.redirect_url, task.id)}
                        className="flex items-center gap-1"
                      >
                        {task.completed ? (
                          <>
                            <Check className="h-4 w-4" /> 已完成
                          </>
                        ) : task.redirect_url ? (
                          <>
                            <ExternalLink className="h-4 w-4" /> 前往
                          </>
                        ) : (
                          "完成任務"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {Object.keys(groupedTasks).length === 0 && (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">暫無可用任務</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="tasks" />
    </div>
  );
}
