import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGE_OPTIONS } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Coins, BookOpen, CreditCard, LogOut, Sparkles, Shield } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { currentLang, setCurrentLang } = useLanguage();
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-1.5 rounded-lg transition-all" data-testid="link-home">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              StoryMaker
            </span>
          </div>
        </Link>

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button 
                variant={location === "/" ? "secondary" : "ghost"}
                className="gap-2"
                data-testid="link-create"
              >
                <Sparkles className="w-4 h-4" />
                {t('nav.create')}
              </Button>
            </Link>
            <Link href="/bookshelf">
              <Button 
                variant={location === "/bookshelf" ? "secondary" : "ghost"}
                className="gap-2"
                data-testid="link-bookshelf"
              >
                <BookOpen className="w-4 h-4" />
                {t('nav.bookshelf')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                variant={location === "/dashboard" ? "secondary" : "ghost"}
                className="gap-2"
                data-testid="link-dashboard"
              >
                <Coins className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            {user?.isAdmin === 'true' && (
              <Link href="/admin">
                <Button 
                  variant={location === "/admin" ? "secondary" : "ghost"}
                  className="gap-2"
                  data-testid="link-admin"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
            <Link href="/buy-credits">
              <Button 
                variant={location === "/buy-credits" ? "secondary" : "ghost"}
                className="gap-2"
                data-testid="link-buy-credits"
              >
                <CreditCard className="w-4 h-4" />
                {t('nav.buyCredits')}
              </Button>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Select value={currentLang} onValueChange={setCurrentLang}>
            <SelectTrigger className="w-[140px]" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} data-testid={`option-language-${lang.code}`}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAuthenticated ? (
            <>
              <Badge 
                variant="secondary" 
                className="gap-1.5 px-3 py-1.5 text-sm font-bold"
                data-testid="badge-credits"
              >
                <Coins className="w-4 h-4" />
                {user?.credits || 0}
              </Badge>
              <a href="/api/logout">
                <Button 
                  variant="ghost" 
                  size="icon"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </a>
            </>
          ) : (
            <a href="/api/login">
              <Button data-testid="button-login">
                {t('nav.login')}
              </Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
