import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowRight, 
  Play, 
  Check, 
  Upload, 
  Palette, 
  Wand2, 
  Crown 
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [position, setPosition] = useState(50);

  // Sample images for the hero section
  const beforeImage = "https://images.unsplash.com/photo-1615529179035-e08a2a144909?auto=format&fit=crop&q=80&w=1000";
  const afterImage = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white pt-12 pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Transform Your Space with AI-Powered Interior Design
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Upload a photo of any room and instantly see it redesigned in popular styles. 
                  No design skills needed - our AI does all the work.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button asChild className="px-6 py-6" size="lg">
                    <Link href={user ? "/render" : "/auth?tab=signup"}>
                      <span>Get Started Free</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="px-6 py-6">
                    <Link href="#how-it-works">
                      <Play className="mr-2 h-5 w-5" />
                      <span>How It Works</span>
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center mt-8 text-sm text-gray-500">
                  <div className="flex items-center mr-6">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>3 free renders monthly</span>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <BeforeAfterSlider
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                    beforeLabel="Original"
                    afterLabel="Modern Style"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How RoomRevive Works</h2>
              <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                Transform your space in three simple steps - no design experience necessary.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Upload Your Photo</h3>
                <p className="text-gray-600">
                  Take a photo of any room in your home and upload it to our platform. We accept JPG and PNG formats.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Select Your Style</h3>
                <p className="text-gray-600">
                  Choose from Modern, Minimalist, Scandinavian, or Boho styles to transform your space.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wand2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Get AI Renders</h3>
                <p className="text-gray-600">
                  Our AI transforms your room instantly. Compare before and after, then download your design.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button asChild size="lg" className="px-8 py-6">
                <Link href={user ? "/render" : "/auth?tab=signup"}>
                  Transform Your Room Now
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Design Styles Section */}
        <section id="styles" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Styles</h2>
              <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                Choose from our curated selection of popular interior design styles to transform your space.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Modern Style */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1000" 
                    alt="Modern Interior Design Style" 
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Modern</h3>
                  <p className="text-gray-600 mb-4">
                    Clean lines, a monochromatic palette, and materials like metal, glass, and steel. Modern design focuses on simplicity and function.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Clean Lines</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Neutral Colors</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Open Spaces</span>
                  </div>
                </div>
              </div>
              
              {/* Scandinavian Style */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=1000" 
                    alt="Scandinavian Interior Design Style" 
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scandinavian</h3>
                  <p className="text-gray-600 mb-4">
                    Characterized by simplicity, minimalism, and functionality, with an emphasis on white space, natural light, and neutral colors.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Light Woods</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">White Spaces</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Cozy Textiles</span>
                  </div>
                </div>
              </div>
              
              {/* Minimalist Style */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000" 
                    alt="Minimalist Interior Design Style" 
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Minimalist</h3>
                  <p className="text-gray-600 mb-4">
                    "Less is more" is the philosophy, featuring intentional negative space, simple color palettes, and essential furnishings only.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Decluttered</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Simple Forms</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Functional</span>
                  </div>
                </div>
              </div>
              
              {/* Boho Style */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&q=80&w=1000" 
                    alt="Boho Interior Design Style" 
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bohemian</h3>
                  <p className="text-gray-600 mb-4">
                    Free-spirited, layered with patterns, textures, and colors. Boho style embraces casual comfort and eclectic mixing of elements.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Rich Colors</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Mixed Patterns</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Natural Elements</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-6 flex items-center justify-center">
                <Crown className="h-4 w-4 text-yellow-500 mr-2" /> 
                Premium subscribers get access to additional exclusive styles
              </p>
              <Button asChild>
                <Link href={user ? "/render" : "/auth?tab=signup"}>
                  Try a Style Now
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                Choose the plan that fits your design needs
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="flex-1 bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <p className="text-gray-500 mb-6">Perfect for occasional redesigns</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-3 h-5 w-5" />
                    <span>3 room renders per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-3 h-5 w-5" />
                    <span>Standard resolution images</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-3 h-5 w-5" />
                    <span>4 basic design styles</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-3 h-5 w-5" />
                    <span>Before/after comparison</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <span className="mt-1 mr-3">✕</span>
                    <span>Unlimited renders</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <span className="mt-1 mr-3">✕</span>
                    <span>Premium design styles</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <span className="mt-1 mr-3">✕</span>
                    <span>High-resolution downloads</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth?tab=signup"}>
                    Start Free
                  </Link>
                </Button>
              </div>
              
              {/* Premium Plan */}
              <div className="flex-1 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl p-8 shadow-xl relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-yellow-400 text-xs font-bold uppercase tracking-wide text-gray-900 py-1 px-3 rounded-full">
                  Popular
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Premium Plan</h3>
                <p className="text-primary-100 mb-6">For serious home redesigns</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">₹499</span>
                  <span className="text-primary-100">/month</span>
                </div>
                <div className="text-sm text-primary-100 mb-6">or ₹4999/year (save ₹989)</div>
                <ul className="space-y-4 mb-8 text-white">
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span><strong>Unlimited</strong> room renders</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span><strong>High-resolution</strong> image downloads</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span>All basic design styles</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span><strong>Premium</strong> exclusive styles</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span>Priority rendering</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span>Save and organize designs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-primary-200 mt-1 mr-3 h-5 w-5" />
                    <span>Early access to new features</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-primary-600 hover:bg-gray-100" asChild>
                  <Link href={user ? "/profile" : "/auth?tab=signup"}>
                    Go Premium
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <div className="flex justify-center space-x-6 mb-6">
                <div className="flex items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Google_Pay_logo.svg/512px-Google_Pay_logo.svg.png" alt="Google Pay" className="h-6" />
                </div>
                <div className="flex items-center">
                  <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="h-8" />
                </div>
                <div className="flex items-center">
                  <img src="https://cdn.razorpay.com/logos/DdLCHDDEtBVzxX_medium.png" alt="Razorpay" className="h-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Secure payments powered by Razorpay. Cancel anytime.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                Join thousands of happy users who've transformed their spaces with RoomRevive
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill"></i>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">5.0</span>
                </div>
                <p className="text-gray-700 mb-6">
                  "I was stuck with how to redesign my living room. RoomRevive gave me stunning ideas in minutes! The Scandinavian design was exactly what I wanted."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">RP</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Riya Patel</h4>
                    <p className="text-sm text-gray-500">Mumbai</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="text-yellow-400 flex">
                    {[...Array(4)].map((_, i) => (
                      <i key={i} className="ri-star-fill"></i>
                    ))}
                    <i className="ri-star-half-fill"></i>
                  </div>
                  <span className="ml-2 text-gray-600">4.5</span>
                </div>
                <p className="text-gray-700 mb-6">
                  "As an interior design student, I use RoomRevive to quickly visualize different concepts. The premium subscription is worth every rupee for unlimited renders."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">AK</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Arjun Kumar</h4>
                    <p className="text-sm text-gray-500">Bangalore</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white rounded-xl p-8 shadow-md">
                <div className="flex items-center mb-6">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill"></i>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">5.0</span>
                </div>
                <p className="text-gray-700 mb-6">
                  "I was about to hire an expensive designer for my new home. RoomRevive helped me save lakhs of rupees by showing me exactly how each room could look."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">SA</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Shreya Agarwal</h4>
                    <p className="text-sm text-gray-500">Delhi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Space?</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of satisfied users who have redesigned their homes with RoomRevive's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-6">
                <Link href={user ? "/dashboard" : "/auth?tab=signup"}>
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-primary-700 text-white border border-primary-500 hover:bg-primary-800 px-8 py-6">
                <Link href={user ? "/render" : "/auth?tab=signup"}>
                  Upload Your Room
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
