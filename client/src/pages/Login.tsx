import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { LionLogo } from "@/components/lion-logo";
import { LineLoginButton } from "@/components/line-login-button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await signIn(formData.email, formData.password);
        
        if (result.success) {
          toast({
            title: "登入成功",
            description: "歡迎回來！",
          });
          navigate("/");
        } else {
          toast({
            title: "登入失敗",
            description: result.error || "請檢查您的電子郵件和密碼",
            variant: "destructive",
          });
        }
      } else {
        // Register
        const result = await signUp(formData.email, formData.password, formData.displayName);
        
        if (result.success) {
          toast({
            title: "註冊成功",
            description: "您的帳戶已成功創建",
          });
          navigate("/");
        } else {
          toast({
            title: "註冊失敗",
            description: result.error || "無法創建帳戶，請稍後再試",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: isLogin ? "登入失敗" : "註冊失敗",
        description: "發生錯誤，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">ZOO3</h1>
        </div>
        <p className="mt-1 text-sm">{isLogin ? "登入您的帳戶" : "創建新帳戶"}</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 flex flex-col justify-center">
        <Card className="border-2 border-lion-orange/20 shadow-lion">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{isLogin ? "登入" : "註冊"}</CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "使用您的電子郵件和密碼登入"
                : "創建一個新帳戶以開始使用"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* LINE Login Button */}
            <div className="space-y-2">
              <LineLoginButton
                liffId={import.meta.env.VITE_LIFF_ID || "1234567890-abcdefgh"}
                className="w-full"
              >
                使用 LINE 帳號{isLogin ? "登入" : "註冊"}
              </LineLoginButton>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    或使用電子郵件
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">顯示名稱</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="您的顯示名稱"
                    value={formData.displayName}
                    onChange={handleChange}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="您的電子郵件"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="您的密碼"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                variant="orange"
                disabled={isLoading}
              >
                {isLoading
                  ? isLogin
                    ? "登入中..."
                    : "註冊中..."
                  : isLogin
                  ? "登入"
                  : "註冊"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              {isLogin ? "還沒有帳戶？" : "已經有帳戶？"}
              <Button
                variant="link"
                className="text-lion-orange p-0 h-auto font-normal"
                onClick={toggleAuthMode}
              >
                {isLogin ? "註冊" : "登入"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2023 ZOO3 平台. 保留所有權利.</p>
      </footer>
    </div>
  );
}
