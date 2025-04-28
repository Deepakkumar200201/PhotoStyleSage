import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import RenderHistoryItem, { RenderHistoryItemSkeleton } from "@/components/render-history-item";
import { useAuth } from "@/hooks/use-auth";
import { Render } from "@shared/schema";
import { Clock, ImagePlus, Image, Clock3, Sparkles, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "completed" | "processing">("all");

  // Fetch user's render history
  const {
    data: renders,
    isLoading,
    error,
  } = useQuery<Render[]>({
    queryKey: ["/api/renders"],
  });

  const filteredRenders = renders?.filter((render) => {
    if (filter === "all") return true;
    if (filter === "completed") return render.status === "completed";
    if (filter === "processing") 
      return render.status === "processing" || render.status === "pending";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Main content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your designs and see your render history
                  </p>
                </div>
                <Button asChild>
                  <Link href="/render">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    New Render
                  </Link>
                </Button>
              </div>

              {/* Render Filters */}
              <div className="flex space-x-2 mb-6">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  <Image className="mr-2 h-4 w-4" />
                  All
                </Button>
                <Button
                  variant={filter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("completed")}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Completed
                </Button>
                <Button
                  variant={filter === "processing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("processing")}
                >
                  <Clock3 className="mr-2 h-4 w-4" />
                  Processing
                </Button>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Renders</h2>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                      <RenderHistoryItemSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    Failed to load renders. Please try again.
                  </div>
                ) : filteredRenders && filteredRenders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRenders.map((render) => (
                      <RenderHistoryItem key={render.id} render={render} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                      <Image className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No renders found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      {filter !== "all" 
                        ? `You don't have any ${filter} renders yet.` 
                        : "You haven't created any renders yet. Upload a photo to get started."}
                    </p>
                    <Button asChild>
                      <Link href="/render">Upload Room Photo</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 space-y-6">
              {/* Account Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Plan</span>
                    <Badge className={user?.planType === "premium" ? "bg-yellow-100 text-yellow-800" : ""}>
                      {user?.planType === "premium" ? (
                        <span className="flex items-center">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </span>
                      ) : (
                        "Free"
                      )}
                    </Badge>
                  </div>
                  {user?.planType === "free" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Renders Remaining</span>
                      <span className="font-medium">{user?.rendersRemaining} / 3</span>
                    </div>
                  )}
                </CardContent>
                <Separator />
                <CardFooter className="pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/profile">Manage Account</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3">
                        <Image className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Total Renders</div>
                        <div className="text-sm text-gray-500">All time</div>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">{renders?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Processing</div>
                        <div className="text-sm text-gray-500">In progress</div>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">
                      {renders?.filter(r => r.status === "processing" || r.status === "pending").length || 0}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Card */}
              {user?.planType === "free" && (
                <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-white">Upgrade to Premium</CardTitle>
                    <CardDescription className="text-primary-100">
                      Unlock unlimited renders and more styles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary-200 mr-2 mt-0.5" />
                      <span>Unlimited room renders</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary-200 mr-2 mt-0.5" />
                      <span>High-resolution downloads</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-primary-200 mr-2 mt-0.5" />
                      <span>Premium exclusive styles</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full bg-white text-primary-600 hover:bg-gray-100">
                      <Link href="/profile">Upgrade Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Check component for the Premium upgrade card
function Check(props: React.ComponentProps<typeof Clock>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
