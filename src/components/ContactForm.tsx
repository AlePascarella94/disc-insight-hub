
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInfo } from "@/types/disc";
import { useToast } from "@/components/ui/use-toast";

interface ContactFormProps {
  onSubmit: (contactInfo: ContactInfo) => void;
  scores?: { D: number; I: number; S: number; C: number };
}

const ContactForm = ({ onSubmit, scores }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !whatsapp.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data to be sent
      const contactInfo = { name, whatsapp };
      
      // Send data to WordPress (you'll need to set up a form handling plugin on WordPress)
      // This is a basic example - you'll need to adjust the endpoint URL to match your WordPress setup
      const formData = new FormData();
      formData.append('name', name);
      formData.append('whatsapp', whatsapp);
      formData.append('email_to', 'atendimento@thalitavalentim.com.br');
      
      // Add DISC scores if available
      if (scores) {
        formData.append('score_dominante', scores.D.toString());
        formData.append('score_influente', scores.I.toString());
        formData.append('score_estavel', scores.S.toString());
        formData.append('score_analitico', scores.C.toString());
      }

      // Note: For WordPress integration, you'll need to set up a form handling plugin like Contact Form 7,
      // WPForms, or use a custom endpoint in your WordPress site.
      // This is a placeholder - replace with your actual WordPress form submission endpoint
      const response = await fetch('https://thalitavalentim.com.br/wp-json/contact-form-7/v1/contact-forms/YOUR_FORM_ID/feedback', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // This might be needed for cross-origin requests
      });
      
      // Call the original onSubmit function to continue with the app flow
      onSubmit(contactInfo);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.",
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Seu WhatsApp</Label>
            <Input 
              id="whatsapp" 
              placeholder="(00) 00000-0000" 
              value={formatWhatsApp(whatsapp)}
              onChange={handleWhatsAppChange}
              inputMode="numeric"
              required
            />
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
