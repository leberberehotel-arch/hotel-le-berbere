import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem("admin_token", token);
        setLocation("/admin");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-serif text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm font-light tracking-wide">
            Hotel Le Berbère · Restricted Area
          </p>
        </div>

        <div className="bg-card border border-primary/20 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widests text-muted-foreground">
                Admin Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none border-border bg-background focus-visible:ring-primary h-12 pr-12"
                  placeholder="Enter admin password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="text-destructive text-sm font-light">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase h-12 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {isLoading ? "Verifying..." : "Enter Dashboard"}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 tracking-wider uppercase">
          <a href="/" className="hover:text-primary transition-colors">← Return to Hotel Site</a>
        </p>
      </motion.div>
    </div>
  );
}
