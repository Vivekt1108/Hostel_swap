import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import AvailableSwaps from "@/components/swap/available-swaps";

export default function BrowseSwaps() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Swap Opportunities</h1>
          <p className="text-gray-600">Find students looking to swap rooms and roommates</p>
        </div>
        
        <AvailableSwaps />
      </main>
      
      <MobileNav />
    </div>
  );
}
