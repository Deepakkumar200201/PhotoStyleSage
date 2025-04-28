import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

// Login and Register form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const defaultTab = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Example images for the split slider
  const beforeImage = "https://images.unsplash.com/photo-1615529179035-e08a2a144909?auto=format&fit=crop&q=80&w=1000";
  const afterImage = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000";

  // Forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  });

  // Handle form submissions
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Update URL when tab changes
  useEffect(() => {
    const newUrl = `/auth?tab=${activeTab}`;
    window.history.replaceState({}, "", newUrl);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden shadow-lg">
            {/* Form Section */}
            <div className="lg:w-1/2 p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <Link href="/">
                  <a className="flex items-center mb-8 text-primary-600 hover:text-primary-700">
                    <i className="ri-arrow-left-line mr-2"></i>
                    <span>Back to Home</span>
                  </a>
                </Link>

                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-600 mt-1">Log in to continue your design journey</p>
                      </div>

                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-center justify-between">
                            <FormField
                              control={loginForm.control}
                              name="rememberMe"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                                </FormItem>
                              )}
                            />
                            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                              Forgot password?
                            </a>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Logging in..." : "Log In"}
                          </Button>
                        </form>
                      </Form>

                      <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="bg-white">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                            alt="Google"
                            className="h-4 w-4 mr-2"
                          />
                          Google
                        </Button>
                        <Button className="bg-[#1877F2] hover:bg-[#0c63d4]">
                          <i className="ri-facebook-fill text-lg mr-2"></i>
                          Facebook
                        </Button>
                      </div>

                      <p className="text-center text-sm text-gray-600 mt-8">
                        Don't have an account?{" "}
                        <button
                          onClick={() => setActiveTab("signup")}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </TabsContent>

                  {/* Sign Up Tab */}
                  <TabsContent value="signup">
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
                        <p className="text-gray-600 mt-1">Start transforming your space today</p>
                      </div>

                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-gray-500 mt-1">
                                  Must be at least 8 characters with 1 uppercase, 1 number
                                </p>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="terms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal">
                                    I agree to the{" "}
                                    <a href="#" className="text-primary-600 hover:text-primary-700">
                                      Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-primary-600 hover:text-primary-700">
                                      Privacy Policy
                                    </a>
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                          </Button>
                        </form>
                      </Form>

                      <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="bg-white">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                            alt="Google"
                            className="h-4 w-4 mr-2"
                          />
                          Google
                        </Button>
                        <Button className="bg-[#1877F2] hover:bg-[#0c63d4]">
                          <i className="ri-facebook-fill text-lg mr-2"></i>
                          Facebook
                        </Button>
                      </div>

                      <p className="text-center text-sm text-gray-600 mt-8">
                        Already have an account?{" "}
                        <button
                          onClick={() => setActiveTab("login")}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          Log in
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Hero Section */}
            <div className="hidden lg:block lg:w-1/2 bg-primary-50">
              <div className="flex flex-col h-full p-12 justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Transform Your Space with AI-Powered Design
                </h2>
                <p className="text-gray-600 mb-8">
                  Upload a photo of your room and instantly see it redesigned in various styles. No design skills needed!
                </p>

                <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
                  <BeforeAfterSlider
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                    beforeLabel="Original"
                    afterLabel="AI Redesigned"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <i className="ri-check-line text-green-500"></i>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-medium text-gray-900">Create in seconds.</span> Get instant AI-powered interior design renders.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <i className="ri-check-line text-green-500"></i>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-medium text-gray-900">Multiple styles.</span> Modern, Scandinavian, Minimalist, and more.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <i className="ri-check-line text-green-500"></i>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-medium text-gray-900">3 free renders.</span> Try it now without any commitment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
