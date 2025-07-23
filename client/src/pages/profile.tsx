import { useState, useEffect} from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { User, Settings, Bell, Eye } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["/api/students/me"],
  });

  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    preferences: student?.preferences || "",
    isLookingToSwap: student?.isLookingToSwap || false,
  });

  // Update form data when student data loads
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        preferences: student.preferences || "",
        isLookingToSwap: student.isLookingToSwap || false,
      });
    }
  }, [student]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await apiRequest("PUT", "/api/students/me", formData);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/students/me"] });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (studentLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isLoading}
                >
                  {isEditing ? (isLoading ? "Saving..." : "Save") : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={student?.studentId || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="preferences">Room Preferences</Label>
                <Textarea
                  id="preferences"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g., Non-smoking environment, Quiet study hours, Early sleeper"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lookingToSwap">Looking to Swap</Label>
                  <p className="text-sm text-gray-600">
                    Make yourself visible to other students looking for room swaps
                  </p>
                </div>
                <Switch
                  id="lookingToSwap"
                  checked={formData.isLookingToSwap}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isLookingToSwap: checked })
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Current Assignment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Hostel</p>
                    <p className="font-medium">
                      {student?.roomDetails?.hostel?.name || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Room</p>
                    <p className="font-medium">
                      {student?.roomDetails?.roomNumber || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Roommate</p>
                    <p className="font-medium">
                      {student?.roommateDetails?.name || "No roommate"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">New swap requests</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Chain swap opportunities</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Messages</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
