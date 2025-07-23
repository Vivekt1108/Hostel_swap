import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, MessageCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function ActiveSwaps() {
  const { toast } = useToast();
  
  const { data: swapRequests = [], isLoading } = useQuery({
    queryKey: ["/api/swap-requests"],
  });

  const handleAcceptSwap = async (requestId: number) => {
    try {
      await apiRequest("PUT", `/api/swap-requests/${requestId}`, {
        status: "accepted"
      });
      
      toast({
        title: "Swap accepted",
        description: "The swap request has been accepted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/swap-requests"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept swap request",
        variant: "destructive",
      });
    }
  };

  const handleDeclineSwap = async (requestId: number) => {
    try {
      await apiRequest("PUT", `/api/swap-requests/${requestId}`, {
        status: "declined"
      });
      
      toast({
        title: "Swap declined",
        description: "The swap request has been declined",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/swap-requests"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline swap request",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning">Pending Response</Badge>;
      case "accepted":
        return <Badge variant="secondary" className="bg-green-100 text-green-600">Accepted</Badge>;
      case "declined":
        return <Badge variant="secondary" className="bg-red-100 text-red-600">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const incomingRequests = swapRequests.filter((req: any) => req.type === 'incoming' && req.status === 'pending');
  const outgoingRequests = swapRequests.filter((req: any) => req.type === 'outgoing');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Swap Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Swap Requests</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {incomingRequests.length} Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {swapRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No active swap requests
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {incomingRequests.map((request: any) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 text-primary rounded-full flex items-center justify-center font-medium">
                      {getInitials(request.requester?.name || "")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.requester?.name}</p>
                      <p className="text-sm text-gray-600">
                        {request.requester?.studentId} • Looking to swap
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Swap Details</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="bg-primary text-white px-2 py-1 rounded text-xs">Them</span>
                      <span className="text-gray-600">Requesting your room</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-primary px-2 py-1 rounded text-xs">You</span>
                      <span className="text-gray-600">Your current room</span>
                    </div>
                  </div>
                </div>
                
                {request.message && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{request.message}</p>
                  </div>
                )}
                
                {request.status === 'pending' && (
                  <div className="flex space-x-3">
                    <Button 
                      onClick={() => handleAcceptSwap(request.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDeclineSwap(request.id)}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {outgoingRequests.map((request: any) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium">
                      {getInitials(request.targetStudent?.name || "?")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.targetStudent?.name || "Direct room request"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your outgoing request
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Request</h4>
                  <div className="text-sm text-gray-600">
                    {request.requestType === 'direct' ? 'Direct room swap request' : 'Chain swap request'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
