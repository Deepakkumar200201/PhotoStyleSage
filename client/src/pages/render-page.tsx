import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FileUpload from "@/components/file-upload";
import RoomTypeSelector from "@/components/room-type-selector";
import StyleSelector from "@/components/style-selector";
import { useToast } from "@/hooks/use-toast";
import { createRender } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { RoomType, DesignStyle } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Home, 
  Palette, 
  CheckCircle, 
  Loader2 
} from "lucide-react";

// Step type definition
type Step = "upload" | "room-info" | "style";

export default function RenderPage() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for the multi-step form
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [notes, setNotes] = useState<string>("");

  // Handle file selection
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  // Handle file upload completion
  const handleFileUploaded = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    // Move to the next step after upload
    setCurrentStep("room-info");
  };

  // Create render mutation
  const createRenderMutation = useMutation({
    mutationFn: createRender,
    onSuccess: (data) => {
      toast({
        title: "Render created successfully",
        description: "Your design is being generated. We'll notify you when it's ready.",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create render",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!uploadedImageUrl || !selectedRoomType || !selectedStyle) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if the user is on the free plan and has no renders remaining
    if (user?.planType === "free" && user.rendersRemaining <= 0) {
      toast({
        title: "No renders remaining",
        description: "You've used all your free renders. Upgrade to premium for unlimited renders.",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    createRenderMutation.mutate({
      originalImageUrl: uploadedImageUrl,
      roomType: selectedRoomType,
      designStyle: selectedStyle,
      notes: notes.trim() || undefined,
    });
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStep === "upload" && !uploadedImageUrl) {
      toast({
        title: "Upload required",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === "room-info" && !selectedRoomType) {
      toast({
        title: "Room type required",
        description: "Please select a room type",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === "upload") setCurrentStep("room-info");
    else if (currentStep === "room-info") setCurrentStep("style");
  };

  const goToPreviousStep = () => {
    if (currentStep === "room-info") setCurrentStep("upload");
    else if (currentStep === "style") setCurrentStep("room-info");
  };

  // Render steps indicator
  const renderStepsIndicator = () => {
    const steps = [
      { id: "upload", label: "Upload", icon: Upload },
      { id: "room-info", label: "Room Info", icon: Home },
      { id: "style", label: "Style", icon: Palette },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isPast = 
              (currentStep === "room-info" && step.id === "upload") || 
              (currentStep === "style" && (step.id === "upload" || step.id === "room-info"));
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className="flex items-center">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium
                      ${isActive || isPast ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}
                    `}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={isActive || isPast ? 'font-medium text-gray-900' : 'text-gray-500'}>
                      {step.label}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-16 h-1 mx-4 bg-gray-200">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: isPast ? '100%' : '0',
                        backgroundColor: isPast ? 'rgb(79, 70, 229)' : ''
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Render</h1>
              <p className="text-gray-600">
                Transform your space with AI-powered interior design
              </p>
            </div>

            {/* Steps Indicator */}
            {renderStepsIndicator()}

            {/* Form Card */}
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Upload Photo */}
                {currentStep === "upload" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Upload a photo of your room
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We'll transform it using AI-powered interior design. For best results, use a well-lit photo with minimal clutter.
                    </p>
                    
                    <FileUpload
                      onFileSelected={handleFileSelected}
                      onFileUploaded={handleFileUploaded}
                    />
                  </div>
                )}

                {/* Step 2: Room Info */}
                {currentStep === "room-info" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Tell us about your room
                    </h2>
                    <p className="text-gray-600 mb-6">
                      This helps our AI generate the most accurate redesign for your space.
                    </p>
                    
                    <div className="space-y-6">
                      <RoomTypeSelector
                        selectedRoomType={selectedRoomType}
                        onSelectRoomType={setSelectedRoomType}
                      />
                      
                      <div>
                        <label htmlFor="room-notes" className="block font-medium text-gray-700 mb-2">
                          Any specific notes about this room? (optional)
                        </label>
                        <Textarea
                          id="room-notes"
                          placeholder="e.g., I want to keep the window placement, I need space for a desk..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Style Selection */}
                {currentStep === "style" && (
                  <StyleSelector
                    selectedStyle={selectedStyle}
                    onSelectStyle={setSelectedStyle}
                  />
                )}

                {/* Navigation Buttons */}
                <div className={`mt-8 flex ${currentStep === "upload" ? 'justify-end' : 'justify-between'}`}>
                  {currentStep !== "upload" && (
                    <Button 
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={createRenderMutation.isPending}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  
                  {currentStep !== "style" ? (
                    <Button onClick={goToNextStep}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={!selectedStyle || createRenderMutation.isPending}
                    >
                      {createRenderMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Generate Design
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Render Count Info */}
            {user?.planType === "free" && (
              <div className="mt-4 text-sm text-gray-500 flex items-center justify-center">
                <p>
                  <span className="font-medium">{user.rendersRemaining}</span> of 3 free renders remaining this month
                  {user.rendersRemaining <= 1 && (
                    <Button variant="link" className="h-auto p-0 ml-1" asChild>
                      <a href="/profile">Upgrade to premium</a>
                    </Button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
