import Image from "next/image";
import { notFound } from "next/navigation";

import { getComercioBySlug } from "@/data/get-comercio-by-slug";

import ConsumptionMethodOption from "./components/consumption-method-option";

interface ComercioPageProps {
  params: Promise<{ slug: string }>;
}

async function ComercioPage({ params }: ComercioPageProps) {
  const { slug } = await params;
  const comercio = await getComercioBySlug(slug);

  if (!comercio) {
    return notFound();
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 pt-24">
      <div className="flex flex-col ietms-center gap-2">
        <Image className="width-full"
          src={comercio?.avatarImageUrl}
          alt="{comercio?.name}"
          width= {150}
          height={150}
          
        />
      </div>
      <h2 className="font-semibold">{comercio.name}</h2>
      <div className="pt-24 text-center space-y-2">
        <h3 className="text-2xl font-semibold">Seja bem-vindo!</h3>
        <p className="opacity-55">
          Separamos ofertas especiais para você aproveitar.
        </p>
      </div>
      <div className="pt-12 grid grid-cols-1  ">
        <ConsumptionMethodOption 
          option="DINE_IN"
          slug={slug}
          buttonText="Abrir ofertas"
          imageAlt="Comer Aqui!"
          imageUrl="/catalog.png"
        ></ConsumptionMethodOption>

      </div>
    </div>
  );
}

export default ComercioPage;
