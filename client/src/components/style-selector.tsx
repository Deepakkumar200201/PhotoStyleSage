import { useState } from "react";
import { DESIGN_STYLES, PREMIUM_DESIGN_STYLES, DesignStyle } from "@shared/schema";
import { Check, Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface StyleSelectorProps {
  selectedStyle: DesignStyle | null;
  onSelectStyle: (style: DesignStyle) => void;
}

export default function StyleSelector({
  selectedStyle,
  onSelectStyle,
}: StyleSelectorProps) {
  const { user } = useAuth();
  const isPremium = user?.planType === "premium";
  
  // Map design styles to display names
  const styleNames = {
    "modern": "Modern",
    "minimalist": "Minimalist",
    "scandinavian": "Scandinavian",
    "boho": "Bohemian",
    "industrial": "Industrial",
    "mid-century": "Mid-Century",
    "traditional": "Traditional",
    "coastal": "Coastal",
  };
  
  // Images for each style (using placeholder URLs for now)
  const styleImages = {
    "modern": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1000", 
    "minimalist": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1000",
    "scandinavian": "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=1000",
    "boho": "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&q=80&w=1000",
    "industrial": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1000",
    "mid-century": "https://images.unsplash.com/photo-1556702571-3e11dd2b1a92?auto=format&fit=crop&q=80&w=1000",
    "traditional": "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000",
    "coastal": "https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&q=80&w=1000",
  };
  
  // Style descriptions
  const styleDescriptions = {
    "modern": "Clean lines, neutral colors, minimal decor",
    "minimalist": "Simple, essential, uncluttered spaces",
    "scandinavian": "Light woods, white spaces, natural elements",
    "boho": "Eclectic, colorful, layered textures",
    "industrial": "Raw materials, exposed elements, urban feel",
    "mid-century": "Functional, sleek, retro-inspired",
    "traditional": "Classic elements, rich textures, symmetrical",
    "coastal": "Light colors, natural light, beach-inspired",
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Choose a design style</h3>
      <p className="text-gray-600 mb-6">
        Select the style you'd like to see your room transformed into.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Basic Styles */}
        {DESIGN_STYLES.map((style) => (
          <button
            key={style}
            onClick={() => onSelectStyle(style)}
            className={`
              relative overflow-hidden rounded-lg border hover:shadow-md transition-all group
              ${
                selectedStyle === style
                  ? "border-primary-600 ring-2 ring-primary-200"
                  : "border-gray-200 hover:border-primary-300"
              }
            `}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={styleImages[style]}
                alt={`${styleNames[style]} Interior Design Style`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-4">
              <h4
                className={`font-bold mb-1 ${
                  selectedStyle === style ? "text-primary-700" : "text-gray-900"
                }`}
              >
                {styleNames[style]}
              </h4>
              <p className="text-sm text-gray-600">{styleDescriptions[style]}</p>
            </div>
            {selectedStyle === style && (
              <div className="absolute top-3 right-3 bg-primary-600 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>
        ))}

        {/* Premium Styles */}
        {PREMIUM_DESIGN_STYLES.map((style) => (
          <button
            key={style}
            onClick={() => isPremium && onSelectStyle(style)}
            disabled={!isPremium}
            className={`
              relative overflow-hidden rounded-lg border hover:shadow-md transition-all group
              ${!isPremium ? "opacity-70 cursor-not-allowed" : ""}
              ${
                selectedStyle === style
                  ? "border-primary-600 ring-2 ring-primary-200"
                  : "border-gray-200 hover:border-primary-300"
              }
            `}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={styleImages[style]}
                alt={`${styleNames[style]} Interior Design Style`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {!isPremium && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-yellow-500 text-gray-900 rounded-full p-2">
                    <Crown className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <h4
                  className={`font-bold mb-1 ${
                    selectedStyle === style ? "text-primary-700" : "text-gray-900"
                  }`}
                >
                  {styleNames[style]}
                </h4>
                {!isPremium && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{styleDescriptions[style]}</p>
            </div>
            {selectedStyle === style && (
              <div className="absolute top-3 right-3 bg-primary-600 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>
        ))}
      </div>

      {!isPremium && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            <Crown className="h-4 w-4 inline-block text-yellow-500 mr-1" />
            Premium subscribers get access to additional exclusive styles
          </p>
        </div>
      )}
    </div>
  );
}
