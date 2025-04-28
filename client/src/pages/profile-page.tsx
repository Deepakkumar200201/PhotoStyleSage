import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { updateSubscription, getUserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Trash2, LogOut, CreditCard, ExternalLink, AlertTriangle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  // State for notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    renderComplete: true,
    emailUpdates: false,
    marketingEmails: false,
  });

  // Upgrade subscription mutation
  const upgradeMutation = useMutation({
    mutationFn: () => updateSubscription("premium"),
    onSuccess: () => {
      toast({
        title: "Subscription updated",
        description: "You've successfully upgraded to Premium!",
      });
      // Update user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setShowPaymentDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Downgrade subscription mutation
  const downgradeMutation = useMutation({
    mutationFn: () => updateSubscription("free"),
    onSuccess: () => {
      toast({
        title: "Subscription updated",
        description: "Your subscription has been downgraded to the Free plan.",
      });
      // Update user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Downgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile</h1>
              <p className="text-gray-600">Manage your account and subscription</p>
            </div>

            <Tabs defaultValue="subscription" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              {/* Subscription Tab */}
              <TabsContent value="subscription" className="space-y-6">
                {/* Current Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      Your current subscription and usage information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Plan:</span>
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
                    
                    {user?.planType === "free" ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Renders Remaining:</span>
                          <span>{user.rendersRemaining} / 3 per month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Limitations:</span>
                          <span className="text-sm text-gray-500">
                            Standard resolution, Basic styles only
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Renders:</span>
                          <span>Unlimited</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Quality:</span>
                          <span>High-resolution</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Styles:</span>
                          <span>All styles (including premium)</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    {user?.planType === "free" ? (
                      <Button onClick={() => setShowPaymentDialog(true)} className="w-full">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Premium
                      </Button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Downgrade to Free
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Downgrade to Free Plan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You'll lose access to unlimited renders, high-resolution downloads, and premium styles. 
                              Your limit will be 3 renders per month.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => downgradeMutation.mutate()}
                              disabled={downgradeMutation.isPending}
                            >
                              {downgradeMutation.isPending ? "Downgrading..." : "Downgrade"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </CardFooter>
                </Card>

                {/* Plan Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="font-medium">Feature</div>
                      <div className="font-medium">Free</div>
                      <div className="font-medium">Premium</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>Monthly Renders</div>
                      <div>3</div>
                      <div>Unlimited</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>Available Styles</div>
                      <div>4 Basic</div>
                      <div>All (8+)</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>Output Quality</div>
                      <div>Standard</div>
                      <div>High-res</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>Save & Organize</div>
                      <div className="text-gray-400">✕</div>
                      <div className="text-green-600">✓</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>Priority Rendering</div>
                      <div className="text-gray-400">✕</div>
                      <div className="text-green-600">✓</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>New Feature Access</div>
                      <div className="text-gray-400">✕</div>
                      <div className="text-green-600">✓</div>
                      
                      <Separator className="col-span-3 my-2" />
                      
                      <div>Price</div>
                      <div>₹0</div>
                      <div>₹499/mo<br />or ₹4999/yr</div>
                    </div>
                  </CardContent>
                  {user?.planType === "free" && (
                    <CardFooter>
                      <Button onClick={() => setShowPaymentDialog(true)} className="w-full">
                        Get Premium
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="render-complete" className="font-medium">
                          Render Completion Notifications
                        </Label>
                        <p className="text-sm text-gray-500">
                          Get notified when your room renders are completed
                        </p>
                      </div>
                      <Switch 
                        id="render-complete"
                        checked={notificationPrefs.renderComplete}
                        onCheckedChange={(checked) => 
                          setNotificationPrefs({...notificationPrefs, renderComplete: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-updates" className="font-medium">
                          Product Updates
                        </Label>
                        <p className="text-sm text-gray-500">
                          Receive emails about new features and improvements
                        </p>
                      </div>
                      <Switch 
                        id="email-updates"
                        checked={notificationPrefs.emailUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationPrefs({...notificationPrefs, emailUpdates: checked})
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails" className="font-medium">
                          Marketing Emails
                        </Label>
                        <p className="text-sm text-gray-500">
                          Special offers, promotions, and marketing newsletters
                        </p>
                      </div>
                      <Switch 
                        id="marketing-emails"
                        checked={notificationPrefs.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotificationPrefs({...notificationPrefs, marketingEmails: checked})
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Preferences updated",
                          description: "Your notification preferences have been saved."
                        });
                      }}
                    >
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                    <CardDescription>
                      Customize your display settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode" className="font-medium">
                          Dark Mode
                        </Label>
                        <p className="text-sm text-gray-500">
                          Switch between light and dark theme
                        </p>
                      </div>
                      <Switch 
                        id="dark-mode"
                        disabled
                      />
                    </div>
                    <p className="text-sm text-amber-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Manage your personal account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">Email Address</Label>
                      <div className="font-medium">{user?.email}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm text-gray-500">Account Created</Label>
                      <div className="font-medium">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString() 
                          : "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>GDPR Data Controls</CardTitle>
                    <CardDescription>
                      Manage your data and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Button variant="outline" asChild className="w-full mb-2">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Download My Data
                        </a>
                      </Button>
                      <p className="text-xs text-gray-500">
                        Get a copy of all the data we store about you and your usage
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 mb-2">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete All My Data
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete all your data including renders, account information, and usage history.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Yes, delete all my data
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <p className="text-xs text-gray-500">
                        Permanently delete all data associated with your account
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {logoutMutation.isPending ? "Logging out..." : "Log Out"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method and billing cycle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="monthly"
                    name="billing-cycle"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                  <label htmlFor="monthly" className="ml-3 block">
                    <span className="text-sm font-medium text-gray-900">Monthly Billing</span>
                    <span className="text-sm text-gray-500 block">₹499 per month</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4 bg-primary-50 border-primary-200">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="yearly"
                    name="billing-cycle"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="yearly" className="ml-3 block">
                    <span className="text-sm font-medium text-gray-900">Annual Billing</span>
                    <span className="text-sm text-gray-500 block">₹4999 per year (save ₹989)</span>
                  </label>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Save 16%
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Payment Method</h4>
              <div className="flex justify-around gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-16 flex-col border border-gray-300"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Google_Pay_logo.svg/512px-Google_Pay_logo.svg.png" 
                    alt="Google Pay" 
                    className="h-6 mb-1"
                  />
                  <span className="text-xs">Google Pay</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-16 flex-col border border-gray-300"
                >
                  <img 
                    src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" 
                    alt="PhonePe" 
                    className="h-6 mb-1" 
                  />
                  <span className="text-xs">PhonePe</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-16 flex-col border border-gray-300"
                >
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span className="text-xs">Card</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => upgradeMutation.mutate()}
              disabled={upgradeMutation.isPending}
            >
              {upgradeMutation.isPending ? (
                "Processing..."
              ) : (
                <>Proceed to Payment</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
