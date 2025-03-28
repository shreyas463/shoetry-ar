import { FC } from "react";
import { X, Camera, Footprints, ShoppingBag, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "Camera Permission",
      description: "Allow camera access when prompted to enable AR features.",
      icon: Camera,
    },
    {
      title: "Position Your Feet",
      description: "Align your feet with the on-screen guides for best results.",
      icon: Footprints,
    },
    {
      title: "Choose Shoes",
      description: "Select from our catalog to try different shoes virtually.",
      icon: ShoppingBag,
    },
    {
      title: "Take Photos",
      description: "Capture your AR try-on to share or save for later.",
      icon: ImageIcon,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl m-6 p-6 max-w-md">
        <DialogHeader className="flex justify-between items-start mb-4">
          <DialogTitle className="text-xl font-semibold">How to Use ShoeAR</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 h-auto p-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex">
              <div className="mr-4 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">Step {index + 1}: {step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button 
            className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-medium" 
            onClick={onClose}
          >
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
