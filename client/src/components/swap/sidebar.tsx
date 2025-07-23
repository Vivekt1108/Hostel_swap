import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, History, BookOpen, Headphones } from "lucide-react";

export default function Sidebar() {
  const { data: swapRequests = [] } = useQuery({
    queryKey: ["/api/swap-requests"],
  });

  const activeRequests = swapRequests.filter((req: any) => req.status === 'pending').length;
  const successfulSwaps = swapRequests.filter((req: any) => req.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Requests</span>
            <span className="font-semibold text-gray-900">{activeRequests}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Successful Swaps</span>
            <span className="font-semibold text-green-600">{successfulSwaps}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Match Score</span>
            <span className="font-semibold text-warning">78%</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center text-xs">
              <span>🔄</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">New swap proposal received</p>
              <p className="text-xs text-gray-600">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
              <span>👥</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Chain swap opportunity found</p>
              <p className="text-xs text-gray-600">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-warning text-white rounded-full flex items-center justify-center text-xs">
              <span>🔔</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Reminder: Update preferences</p>
              <p className="text-xs text-gray-600">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-primary hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Swap Request
          </Button>
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Update Preferences
          </Button>
          <Button variant="outline" className="w-full">
            <History className="h-4 w-4 mr-2" />
            View History
          </Button>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-primary">❓</span>
            <h3 className="font-medium text-gray-900">Need Help?</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Having trouble finding the right swap? Check our guide or contact support.
          </p>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:text-blue-700">
              <BookOpen className="h-4 w-4 mr-2" />
              Swapping Guide
            </Button>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary hover:text-blue-700">
              <Headphones className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
