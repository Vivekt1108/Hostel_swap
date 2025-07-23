import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import CurrentAssignment from "@/components/swap/current-assignment";
import ActiveSwaps from "@/components/swap/active-swaps";
import AvailableSwaps from "@/components/swap/available-swaps";
import Sidebar from "@/components/swap/sidebar";

export default function Dashboard() {
  const { data: student, isLoading } = useQuery({
    queryKey: ["/api/students/me"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-96 bg-gray-200 rounded"></div>
                  <div className="h-96 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold">HostelSwap Dashboard</h1>
        <p>Welcome {student?.name || 'User'}!</p>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Current Assignment</h2>
          {student?.roomDetails ? (
            <div>
              <p><strong>Room:</strong> {student.roomDetails.roomNumber}</p>
              <p><strong>Hostel:</strong> {student.roomDetails.hostel?.name}</p>
              <p><strong>Floor:</strong> {student.roomDetails.floor}</p>
              {student.roommateDetails && (
                <p><strong>Roommate:</strong> {student.roommateDetails.name}</p>
              )}
            </div>
          ) : (
            <p>No room assignment found</p>
          )}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="block w-full text-left p-2 hover:bg-gray-50 border rounded">
              Browse Available Swaps
            </button>
            <button className="block w-full text-left p-2 hover:bg-gray-50 border rounded">
              View My Requests
            </button>
            <button className="block w-full text-left p-2 hover:bg-gray-50 border rounded">
              Messages
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
