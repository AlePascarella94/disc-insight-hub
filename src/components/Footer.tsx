
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("w-full py-6 px-4 lg:px-8 border-t mt-auto", className)}>
      <div className="container mx-auto text-center">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} Thalita Valentim. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
