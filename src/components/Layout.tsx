
import Header from "./Header";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={cn("flex-grow container mx-auto px-4 py-8", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
