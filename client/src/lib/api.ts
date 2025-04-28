import { apiRequest } from "./queryClient";
import { RoomType, DesignStyle } from "@shared/schema";

// Interface for creating a new render
interface CreateRenderParams {
  originalImageUrl: string;
  roomType: RoomType;
  designStyle: DesignStyle;
  notes?: string;
}

// Function to create a new render
export const createRender = async (params: CreateRenderParams) => {
  const response = await apiRequest("POST", "/api/renders", params);
  return response.json();
};

// Function to get render history
export const getRenderHistory = async () => {
  const response = await apiRequest("GET", "/api/renders");
  return response.json();
};

// Function to get a specific render
export const getRender = async (id: number) => {
  const response = await apiRequest("GET", `/api/renders/${id}`);
  return response.json();
};

// Function to upload an image
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const response = await fetch("/api/renders/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload image");
  }
  
  return response.json();
};

// Function to update subscription plan
export const updateSubscription = async (planType: "free" | "premium") => {
  const response = await apiRequest("POST", "/api/subscription", { planType });
  return response.json();
};

// Function to get user profile
export const getUserProfile = async () => {
  const response = await apiRequest("GET", "/api/profile");
  return response.json();
};
