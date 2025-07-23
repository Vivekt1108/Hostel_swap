import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, User, MessageCircle, Filter } from "lucide-react";
import { useState } from "react";
import SwapRequestForm from "./swap-request-form";

export default function AvailableSwaps() {
  const [selectedHostel, setSelectedHostel] = useState<string>("all");
  const [targetStudent, setTargetStudent] = useState<any>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { data: availableSwaps = [], isLoading } = useQuery({
    queryKey: ["/api/available-swaps"],
  });

  const { data: hostels = [] } = useQuery({
    queryKey: ["/api/hostels"],
  });

  const filteredSwaps = availableSwaps.filter((swap: any) => {
    if (selectedHostel === "all") return true;
    return swap.roomDetails?.hostel?.name === selectedHostel;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMatchScore = () => Math.floor(Math.random() * 40) + 60; // Mock match score

  const handleProposeSwap = (student: any) => {
    setTargetStudent(student);
    setShowRequestForm(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Swap Opportunities</CardTitle>
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Available Swap Opportunities</CardTitle>
            <div className="flex space-x-2">
              <Select value={selectedHostel} onValueChange={setSelectedHostel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Hostels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hostels</SelectItem>
                  {hostels.map((hostel: any) => (
                    <SelectItem key={hostel.id} value={hostel.name}>
                      {hostel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredSwaps.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No swap opportunities available
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSwaps.map((student: any) => {
                const matchScore = getMatchScore();
                return (
                  <div key={student.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-medium">
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.studentId} • {student.roomDetails?.hostel?.name}, Room {student.roomDetails?.roomNumber}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={
                          matchScore >= 80 
                            ? "bg-green-100 text-green-600" 
                            : matchScore >= 65 
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {matchScore >= 80 ? "High Match" : matchScore >= 65 ? "Medium Match" : "Low Match"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Offering</p>
                        <p className="font-medium text-gray-900">
                          {student.roomDetails?.roomNumber} ({student.roomDetails?.hostel?.name})
                        </p>
                        <p className="text-sm text-gray-600">Floor {student.roomDetails?.floor}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Looking For</p>
                        <p className="font-medium text-gray-900">Any room</p>
                        <p className="text-sm text-gray-600">Open to swap</p>
                      </div>
                    </div>
                    
                    {student.preferences && (
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        {student.preferences.split(", ").slice(0, 3).map((pref: string, index: number) => (
                          <span key={index}>
                            <span className="mr-1">•</span>
                            {pref}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => handleProposeSwap(student)}
                        className="flex-1 bg-primary hover:bg-blue-700"
                      >
                        <Handshake className="h-4 w-4 mr-2" />
                        Propose Swap
                      </Button>
                      <Button variant="outline" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {filteredSwaps.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-primary hover:text-blue-700">
                Load More Opportunities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SwapRequestForm 
        open={showRequestForm} 
        onOpenChange={setShowRequestForm}
        targetStudent={targetStudent}
      />
    </>
  );
}
