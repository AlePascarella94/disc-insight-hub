
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

const ThankYou = () => {
  return (
    <Card className="w-full max-w-md mx-auto text-center animate-fade-in">
      <CardHeader>
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <CheckIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Obrigado!</CardTitle>
        <CardDescription>
          Sua avaliação DISC foi concluída com sucesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Entraremos em contato através do WhatsApp para fornecer os resultados detalhados da sua análise de perfil comportamental DISC.
        </p>
        <div className="mt-8 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            A análise DISC ajuda a entender melhor seus padrões comportamentais e como você pode utilizá-los para aprimorar suas relações pessoais e profissionais.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThankYou;
