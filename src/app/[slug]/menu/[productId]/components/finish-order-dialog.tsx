"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumptionMethod } from "@prisma/client";
import { ChevronLeftIcon, Loader2Icon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createOrder } from "../../actions/create-order";
import { CartContext, CartProduct } from "../../context/cart";

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Informe o seu nome!",
  }),

  cellphone: z.string().trim().min(1, {
    message: "Informe o seu Telefone!",
  }),
});
type FormSchema = z.infer<typeof formSchema>;

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatOrderMessage = (name: string, cellphone: string, products: CartProduct[], orderId: number) => {
  const formattedProducts = products
    .map((product) => `${product.quantity}x ${product.name} - R$ ${(product.price * product.quantity).toFixed(2)}`)
    .join('\n');
  
  const total = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  
  return `*Novo Pedido*: #${orderId}\n\nCliente: ${name}\nTelefone: ${cellphone}\n\n*Itens do Pedido:*\n${formattedProducts}\n\n> *Total: R$ ${total.toFixed(2)}*`;
};

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useContext(CartContext);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      cellphone: "",
    },
    shouldUnregister: true,
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true);
      const consumptionMethod = searchParams.get(
        "consumptionMethod"
      ) as ConsumptionMethod;
      
      // Criar o pedido
      const order = await createOrder({
        consumptionMethod,
        customerCellPhone: data.cellphone,
        customerName: data.name,
        products,
        slug,
      });
      
      if (order) {
        // Formatar a mensagem para o WhatsApp
        const message = formatOrderMessage(data.name, data.cellphone, products, order.id);
        setOrderMessage(message);
        
        // Mostrar mensagem de sucesso
        toast.success("Pedido criado com sucesso!");
        
        // Mostrar botão do WhatsApp
        setShowWhatsApp(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar o pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger className="w-full" asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar pedido</DrawerTitle>
          <DrawerDescription>
            Insira suas informações para concluir a compra!
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu Nome" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cellphone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <PatternFormat
                        placeholder="Digite o seu Telefone"
                        format="##-#####-####"
                        customInput={Input}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter>
                {!showWhatsApp ? (
                  <>
                    <Button
                      type="submit"
                      className="rounded-full"
                      variant="destructive"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2Icon className="animate-spin" />}
                      Criar Pedido
                    </Button>
                    <DrawerClose asChild>
                      <Button 
                        variant="secondary" 
                        className="w-full rounded-full flex items-center justify-center gap-2 text-muted-foreground"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Voltar
                      </Button>
                    </DrawerClose>
                  </>
                ) : (
                  <div className="space-y-3 w-full">
                    <Button
                      type="button"
                      className="w-full rounded-full bg-green-500 hover:bg-green-600"
                      onClick={() => {
                        const phoneNumber = "5511975640573";
                        window.open(
                          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderMessage)}`,
                          '_blank'
                        );
                      }}
                    >
                      Enviar pedido no WhatsApp
                    </Button>
                    <Button
                      type="button"
                      className="w-full rounded-full"
                      variant="secondary"
                      onClick={() => {
                        window.location.href = `/${slug}/orders?cellphone=${form.getValues().cellphone}`;
                      }}
                    >
                      Ver meus pedidos
                    </Button>
           
                  </div>
                )}
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinishOrderDialog;
