import { Bell, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";

export default function Header() {
  const { student, logout } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", current: location === "/" },
    { name: "Browse Swaps", href: "/browse", current: location === "/browse" },
    { name: "My Requests", href: "/requests", current: location === "/requests" },
    { name: "Messages", href: "/messages", current: location === "/messages" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900">HostelSwap</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`pb-4 ${
                    item.current
                      ? "text-primary font-medium border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{student?.name}</p>
                <p className="text-xs text-gray-600">{student?.studentId}</p>
              </div>
              <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                {getInitials(student?.name || "")}
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
