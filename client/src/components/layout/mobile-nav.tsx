import { Home, Search, RefreshCw, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileNav() {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location === "/" },
    { name: "Browse", href: "/browse", icon: Search, current: location === "/browse" },
    { name: "Requests", href: "/requests", icon: RefreshCw, current: location === "/requests" },
    { name: "Messages", href: "/messages", icon: MessageCircle, current: location === "/messages" },
    { name: "Profile", href: "/profile", icon: User, current: location === "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 relative ${
                item.current ? "text-primary" : "text-gray-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
              {item.name === "Requests" && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
