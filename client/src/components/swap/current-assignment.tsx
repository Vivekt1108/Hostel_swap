import { Building, DoorOpen, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import SwapRequestForm from "./swap-request-form";

interface CurrentAssignmentProps {
  student: any;
}

export default function CurrentAssignment({ student }: CurrentAssignmentProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);

  if (!student) return null;

  const { roomDetails, roommateDetails } = student;

  return (
    <>
      <div className="mb-8">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Current Assignment</h2>
              {student.isLookingToSwap && (
                <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                  <span className="mr-1">⚠️</span>
                  Looking to Swap
                </Badge>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Hostel</p>
                    <p className="font-medium text-gray-900">
                      {roomDetails?.hostel?.name || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DoorOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Room Number</p>
                    <p className="font-medium text-gray-900">
                      {roomDetails?.roomNumber || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Current Roommate</p>
                    <p className="font-medium text-gray-900">
                      {roommateDetails 
                        ? `${roommateDetails.name} (${roommateDetails.studentId})`
                        : "No roommate assigned"
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Room Preferences</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {student.preferences ? (
                      student.preferences.split(", ").map((pref: string, index: number) => (
                        <p key={index}>
                          <span className="text-green-600 mr-2">✓</span>
                          {pref}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-500">No preferences set</p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={() => setShowRequestForm(true)}
                  className="w-full bg-primary hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Swap Request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SwapRequestForm 
        open={showRequestForm} 
        onOpenChange={setShowRequestForm}
      />
    </>
  );
}
