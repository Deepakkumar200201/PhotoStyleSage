import { useState } from "react";
import { Render } from "@shared/schema";
import { format } from "date-fns";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Download, ExternalLink, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RenderHistoryItemProps {
  render: Render;
}

export default function RenderHistoryItem({ render }: RenderHistoryItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusIcon = () => {
    switch (render.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (render.status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return render.status;
    }
  };
  
  const getStatusColor = () => {
    switch (render.status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format the room type and design style for display
  const formatRoomType = (roomType: string) => {
    return roomType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const formatDesignStyle = (style: string) => {
    return style.charAt(0).toUpperCase() + style.slice(1);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        {render.status === "completed" && render.renderedImageUrl ? (
          // Show BeforeAfterSlider if the render is completed
          <BeforeAfterSlider 
            beforeImage={render.originalImageUrl} 
            afterImage={render.renderedImageUrl}
            className="h-48 md:h-64" 
          />
        ) : (
          // Show just the original image if still processing or failed
          <div className="relative h-48 md:h-64">
            <img 
              src={render.originalImageUrl} 
              alt="Original room" 
              className="w-full h-full object-cover"
            />
            
            {render.status !== "completed" && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-center px-4 py-2 rounded-lg bg-black bg-opacity-50">
                  <div className="flex items-center justify-center mb-2">
                    {getStatusIcon()}
                    <span className="ml-2 font-medium">{getStatusText()}</span>
                  </div>
                  {render.status === "processing" && (
                    <p className="text-sm">Your design is being generated</p>
                  )}
                  {render.status === "pending" && (
                    <p className="text-sm">Waiting to start processing</p>
                  )}
                  {render.status === "failed" && (
                    <p className="text-sm">Something went wrong</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{formatRoomType(render.roomType)}</Badge>
            <Badge>{formatDesignStyle(render.designStyle)}</Badge>
            {render.isPremiumQuality && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                Premium
              </Badge>
            )}
          </div>
          <Badge className={getStatusColor()}>
            <span className="flex items-center">
              {getStatusIcon()}
              <span className="ml-1">{getStatusText()}</span>
            </span>
          </Badge>
        </div>
        
        {expanded && render.notes && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium mb-1">Notes:</p>
            <p>{render.notes}</p>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Created {render.createdAt ? format(new Date(render.createdAt), 'MMM dd, yyyy') : ''}
        </div>
      </CardContent>
      
      {expanded && render.status === "completed" && render.renderedImageUrl && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(render.renderedImageUrl, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Size
          </Button>
          <Button
            size="sm"
            onClick={() => {
              const link = document.createElement('a');
              link.href = render.renderedImageUrl as string;
              link.download = `roomrevive-${render.id}.jpg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// Skeleton loader for render history items
export function RenderHistoryItemSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 md:h-64 w-full" />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
