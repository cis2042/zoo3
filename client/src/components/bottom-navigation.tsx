import { Link } from "react-router-dom";
import { Home, Gift, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  const tabs = [
    {
      id: "home",
      label: "首頁",
      icon: Home,
      path: "/",
    },
    {
      id: "tasks",
      label: "任務",
      icon: Gift,
      path: "/tasks",
    },
    {
      id: "rewards",
      label: "獎勵",
      icon: Trophy,
      path: "/rewards",
    },
    {
      id: "profile",
      label: "我的",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.path}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
            activeTab === tab.id
              ? "text-lion-orange"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <tab.icon
            className={cn(
              "h-6 w-6 mb-1",
              activeTab === tab.id ? "text-lion-orange" : "text-gray-500"
            )}
          />
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );
}
