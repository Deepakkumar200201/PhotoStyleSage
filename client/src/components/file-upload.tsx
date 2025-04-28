import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onFileUploaded?: (url: string) => void;
}

export default function FileUpload({ onFileSelected, onFileUploaded }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      const response = await fetch("/api/renders/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      const data = await response.json();
      
      if (onFileUploaded) {
        onFileUploaded(data.imageUrl);
      }
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-all cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="mx-auto w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8" />
          </div>
          <p className="font-medium text-gray-900 mb-1">
            Drop your image here, or <span className="text-primary-600">browse</span>
          </p>
          <p className="text-sm text-gray-500">JPG or PNG, max 10MB</p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Room preview"
              className="w-full h-64 object-cover"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 bg-white"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={uploadFile} 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
