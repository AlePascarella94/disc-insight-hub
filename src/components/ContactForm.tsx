
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInfo } from "@/types/disc";
import { useToast } from "@/components/ui/use-toast";
import { sanitizeInput, validateBrazilianPhone, validateName, RateLimiter, encodeForTransmission } from "@/lib/security";

interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => void;
  scores?: { D: number; I: number; S: number; C: number };
}

// Create rate limiter instance outside component to persist across renders
const rateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

const ContactForm = ({ onSubmit, scores }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{name?: string; whatsapp?: string}>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Rate limiting check
    if (!rateLimiter.canAttempt()) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde um minuto antes de tentar novamente.",
        variant: "destructive"
      });
      return;
    }
    
    // Enhanced validation
    const errors: {name?: string; whatsapp?: string} = {};
    
    const sanitizedName = sanitizeInput(name);
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    
    if (!sanitizedName || !validateName(sanitizedName)) {
      errors.name = "Nome deve conter apenas letras, ter entre 2-100 caracteres";
    }
    
    if (!cleanWhatsapp || !validateBrazilianPhone(cleanWhatsapp)) {
      errors.whatsapp = "WhatsApp deve ter 11 dígitos no formato brasileiro (XX) 9XXXX-XXXX";
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Dados inválidos",
        description: "Por favor, verifique os campos destacados.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    rateLimiter.recordAttempt();

    try {
      // Prepare sanitized data
      const contactInfo = { 
        name: sanitizedName, 
        whatsapp: cleanWhatsapp 
      };
      
      // Calculate normalized percentages for webhook
      let webhookData;
      if (scores) {
        const totalScore = scores.D + scores.I + scores.S + scores.C;
        const percentages = {
          dominante: totalScore > 0 ? Math.round((scores.D / totalScore) * 100) : 0,
          influente: totalScore > 0 ? Math.round((scores.I / totalScore) * 100) : 0,
          estavel: totalScore > 0 ? Math.round((scores.S / totalScore) * 100) : 0,
          analitico: totalScore > 0 ? Math.round((scores.C / totalScore) * 100) : 0,
        };
        
        webhookData = {
          nomeCompleto: sanitizedName,
          whatsapp: cleanWhatsapp,
          ...percentages
        };
      } else {
        webhookData = {
          nomeCompleto: sanitizedName,
          whatsapp: cleanWhatsapp
        };
      }

      // Encode data for safe transmission
      const safeWebhookData = encodeForTransmission(webhookData);

      // Send data to webhook
      const response = await fetch('const response = await fetch('https://disk.thalitavalentim.com.br/webhook-test/DiskThalita', {', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(safeWebhookData)
      });

      if (!response.ok) {
        console.error('Webhook error:', response.status);
        throw new Error(`Falha ao enviar dados: ${response.status}`);
      }
      
      // Success - call the original onSubmit function
      onSubmit(contactInfo);
      
      toast({
        title: "Sucesso!",
        description: "Seus dados foram enviados com segurança.",
        variant: "default"
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // More specific error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro inesperado ao enviar dados";
        
      toast({
        title: "Erro ao enviar",
        description: `${errorMessage}. Por favor, tente novamente.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format WhatsApp number as user types
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setWhatsapp(value);
    }
  };

  // Format the WhatsApp display
  const formatWhatsApp = (value: string) => {
    if (!value) return "";
    if (value.length <= 2) return `(${value}`;
    if (value.length <= 6) return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl">Seus dados de contato</CardTitle>
        <CardDescription>
          Preencha seus dados para receber uma análise detalhada do seu perfil DISC.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome completo</Label>
            <Input 
              id="name" 
              placeholder="Digite seu nome" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={validationErrors.name ? "border-destructive" : ""}
              required
            />
            {validationErrors.name && (
              <p className="text-sm text-destructive">{validationErrors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Seu WhatsApp</Label>
            <Input 
              id="whatsapp" 
              placeholder="(00) 00000-0000" 
              value={formatWhatsApp(whatsapp)}
              onChange={handleWhatsAppChange}
              className={validationErrors.whatsapp ? "border-destructive" : ""}
              inputMode="numeric"
              required
            />
            {validationErrors.whatsapp && (
              <p className="text-sm text-destructive">{validationErrors.whatsapp}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ContactForm;
