import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Home, Search, History, MessageSquare, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <img
                src="/logo.jpg"
                alt="logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-2xl hover:w-14 hover:h-14 transition-all"
              />
            </span>
            <span className="bg-gradient-to-r from-orange-500 via-white to-green-600 bg-clip-text text-transparent font-bold">
              Swadeshi-Scan
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/history">
                <History className="h-4 w-4" />
                <span className="sr-only">History</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/reviews">
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Reviews</span>
              </Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden flex-1 items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link href="/search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Link>
                <Link href="/history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </Link>
                <Link href="/reviews" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Reviews</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <span>Toggle Theme</span>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}