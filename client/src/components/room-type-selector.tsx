import { ROOM_TYPES, RoomType } from "@shared/schema";
import { BedDouble, Sofa, Utensils, Bath, Briefcase, UtensilsCrossed } from "lucide-react";

interface RoomTypeSelectorProps {
  selectedRoomType: RoomType | null;
  onSelectRoomType: (roomType: RoomType) => void;
}

export default function RoomTypeSelector({
  selectedRoomType,
  onSelectRoomType,
}: RoomTypeSelectorProps) {
  // Map room types to their corresponding icons
  const roomTypeIcons = {
    "living-room": Sofa,
    "bedroom": BedDouble,
    "kitchen": Utensils,
    "bathroom": Bath,
    "office": Briefcase,
    "dining-room": UtensilsCrossed,
  };

  // Map room types to display names
  const roomTypeNames = {
    "living-room": "Living Room",
    "bedroom": "Bedroom",
    "kitchen": "Kitchen",
    "bathroom": "Bathroom",
    "office": "Office",
    "dining-room": "Dining Room",
  };

  return (
    <div>
      <label className="block font-medium text-gray-700 mb-3">
        What type of room is this?
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ROOM_TYPES.map((roomType) => {
          const Icon = roomTypeIcons[roomType];
          const isSelected = selectedRoomType === roomType;
          
          return (
            <button
              key={roomType}
              type="button"
              onClick={() => onSelectRoomType(roomType)}
              className={`
                p-4 border rounded-lg flex flex-col items-center transition-all
                ${
                  isSelected
                    ? "border-primary-600 ring-2 ring-primary-200 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                }
              `}
            >
              <Icon
                className={`h-6 w-6 mb-2 ${
                  isSelected ? "text-primary-600" : "text-gray-500"
                }`}
              />
              <span
                className={`${
                  isSelected ? "text-primary-700" : "text-gray-700"
                }`}
              >
                {roomTypeNames[roomType]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
