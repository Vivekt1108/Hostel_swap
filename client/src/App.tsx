import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import BrowseSwaps from "@/pages/browse-swaps";
import MyRequests from "@/pages/my-requests";
import Messages from "@/pages/messages";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { useState, useEffect, createContext, useContext, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;  
  student: any;
  login: (sessionId: string, student: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  student: null,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const savedStudent = localStorage.getItem("student");
      
      if (sessionId && savedStudent) {
        setIsAuthenticated(true);
        setStudent(JSON.parse(savedStudent));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      localStorage.removeItem("sessionId");
      localStorage.removeItem("student");
    }
    setIsLoading(false);
  }, []);

  const login = (sessionId: string, studentData: any) => {
    try {
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("student", JSON.stringify(studentData));
      setIsAuthenticated(true);
      setStudent(studentData);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("student");
      setIsAuthenticated(false);
      setStudent(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/browse" component={BrowseSwaps} />
      <Route path="/requests" component={MyRequests} />
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function UnauthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/" component={Login} />
      <Route component={Login} />
    </Switch>
  );
}

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const sessionId = localStorage.getItem("sessionId");
      const student = localStorage.getItem("student");
      setIsAuthenticated(!!(sessionId && student));
      setIsLoading(false);
    };
    
    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div>
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
