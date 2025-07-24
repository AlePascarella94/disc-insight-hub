
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
          nomeCompleto: name,
          whatsapp: whatsapp,
          ...percentages
        };
      } else {
        webhookData = {
          nomeCompleto: name,
          whatsapp: whatsapp
        };
      }

      // Send data to webhook
      const response = await fetch('https://www.pascarellatech.dedyn.io/webhook-test/DISC', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar dados');
      }
      
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
