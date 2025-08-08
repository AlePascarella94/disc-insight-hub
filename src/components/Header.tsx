
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("w-full py-4 px-4 lg:px-8 border-b", className)}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          Thalita Pascarella | DISC
        </h1>
      </div>
    </header>
  );
};

export default Header;
