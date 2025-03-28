import { FC } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  onShowHelp?: () => void;
}

const Header: FC<HeaderProps> = ({ title = "ShoeAR", onShowHelp }) => {
  return (
    <header className="flex justify-between items-center px-4 py-3 bg-white shadow-sm z-20">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {onShowHelp && (
        <div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100" 
            onClick={onShowHelp}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
