import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LionLogo } from "@/components/lion-logo";
import { useAuth } from "@/context/AuthContext";
import { useRewards } from "@/hooks/useRewards";
import { Transaction } from "@/types";
import { ArrowDown, ArrowUp, Gift, Trophy } from "lucide-react";

export default function Rewards() {
  const { user, profile } = useAuth();
  const { transactions, isLoading } = useRewards();
  const [activeTab, setActiveTab] = useState("balances");

  // Function to format transaction date
  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // Function to get transaction icon
  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.transaction_type) {
      case "task_reward":
        return <Trophy className="h-4 w-4 text-lion-orange" />;
      case "daily_reward":
        return <Gift className="h-4 w-4 text-lion-teal" />;
      case "referral_reward":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case "transfer_out":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowDown className="h-4 w-4 text-green-500" />;
    }
  };

  // Function to get transaction type label
  const getTransactionTypeLabel = (transaction: Transaction) => {
    switch (transaction.transaction_type) {
      case "task_reward":
        return "任務獎勵";
      case "daily_reward":
        return "每日獎勵";
      case "referral_reward":
        return "推薦獎勵";
      case "transfer_out":
        return "轉出";
      default:
        return transaction.transaction_type;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">獎勵中心</h1>
        </div>
        <p className="mt-1 text-sm">查看您的代幣和交易記錄</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4">
        <Tabs
          defaultValue="balances"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="balances">代幣餘額</TabsTrigger>
            <TabsTrigger value="transactions">交易記錄</TabsTrigger>
          </TabsList>

          <TabsContent value="balances" className="space-y-4">
            {/* KAIA Balance Card */}
            <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-sm">🪙</span> KAIA 代幣
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">餘額</p>
                    <p className="text-3xl font-bold text-lion-accent">
                      {profile?.total_kaia || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-lion-orange/10 rounded-full flex items-center justify-center">
                    <img
                      src="/images/kaia-token.png"
                      alt="KAIA Token"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ZOO Balance Card */}
            <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-sm">🦁</span> ZOO 代幣
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">餘額</p>
                    <p className="text-3xl font-bold text-lion-accent">
                      {profile?.total_zoo || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-lion-orange/10 rounded-full flex items-center justify-center">
                    <img
                      src="/images/zoo-token.png"
                      alt="ZOO Token"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WBTC Balance Card */}
            <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-sm">₿</span> WBTC 代幣
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">餘額</p>
                    <p className="text-3xl font-bold text-lion-accent">
                      {profile?.total_wbtc || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-lion-orange/10 rounded-full flex items-center justify-center">
                    <img
                      src="/images/wbtc-token.png"
                      alt="WBTC Token"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-2 border-lion-orange/20 shadow-lion overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lion-orange/10 to-lion-orange/5 pb-2">
                <CardTitle className="text-lg">交易記錄</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">載入交易記錄中...</p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getTransactionIcon(transaction)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.description || getTransactionTypeLabel(transaction)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTransactionDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
                              transaction.transaction_type === "transfer_out"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {transaction.transaction_type === "transfer_out" ? "-" : "+"}
                            {transaction.amount} {transaction.token}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">暫無交易記錄</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="rewards" />
    </div>
  );
}
