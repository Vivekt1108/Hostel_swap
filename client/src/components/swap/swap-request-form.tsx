import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface SwapRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetStudent?: any;
}

export default function SwapRequestForm({ open, onOpenChange, targetStudent }: SwapRequestFormProps) {
  const [requestType, setRequestType] = useState<string>("direct");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: availableStudents = [] } = useQuery({
    queryKey: ["/api/available-swaps"],
    enabled: open && !targetStudent,
  });

  const [selectedTargetId, setSelectedTargetId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const targetStudentId = targetStudent?.id || parseInt(selectedTargetId);
      
      if (!targetStudentId && requestType === "direct") {
        toast({
          title: "Error",
          description: "Please select a target student",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      await apiRequest("POST", "/api/swap-requests", {
        targetStudentId: requestType === "direct" ? targetStudentId : null,
        requestType,
        message: message || null,
      });

      toast({
        title: "Request sent",
        description: "Your swap request has been sent successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/swap-requests"] });
      onOpenChange(false);
      setMessage("");
      setSelectedTargetId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send swap request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Swap Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="requestType">Request Type</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Swap</SelectItem>
                <SelectItem value="chain">Chain Swap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {requestType === "direct" && !targetStudent && (
            <div>
              <Label htmlFor="targetStudent">Target Student</Label>
              <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} ({student.studentId}) - {student.roomDetails?.roomNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetStudent && (
            <div className="bg-gray-50 rounded-lg p-3">
              <Label>Target Student</Label>
              <p className="font-medium">{targetStudent.name}</p>
              <p className="text-sm text-gray-600">
                {targetStudent.studentId} - {targetStudent.roomDetails?.roomNumber}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to explain your request..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
