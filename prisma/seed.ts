const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

const main = async () => {
  await prismaClient.$transaction(async (tx: any) => {
    await tx.comercio.deleteMany();
    const comercio = await tx.comercio.create({
      data: {
        name: "AKEMI",
        slug: "AKEMI",
        description: "As melhores ofertas da cidade ",

        avatarImageUrl: "/akemi/perfil.jpg",
        coverImageUrl: "/akemi/outdoor_custom.jpg",
      },
    });
    const kitsCategory = await tx.menuCategory.create({
      data: {
        name: "Kits",
        restaurantId: restaurant.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Ferramentas",
          description:
            "Caixa de ferramentas completa com os melhores itens para você realizar seus projetos com qualidade e eficiência. Inclui martelo, chave de fenda, alicate, fita métrica e muito mais. Ideal para profissionais e entusiastas do faça você mesmo.",
          price: 39.9,
          imageUrl: "/akemi/cx_ferramentas.png",
          menuCategoryId: kitsCategory.id,
          comercioId: comercio.id,
        },
      ],
    });
    const internoCategory = await tx.menuCategory.create({
      data: {
        name: "Interno",
        restaurantId: comercio.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Ferramentas",
          description:
            "Caixa de ferramentas completa com os melhores itens para você realizar seus projetos com qualidade e eficiência. Inclui martelo, chave de fenda, alicate, fita métrica e muito mais. Ideal para profissionais e entusiastas do faça você mesmo.",
          price: 39.9,
          imageUrl: "/akemi/cx_ferramentas.png",
          menuCategoryId: internoCategory.id,
          comercioId: comercio.id,
        },
      ],
    });

    const externoCategory = await tx.menuCategory.create({
      data: {
        name: "Externo",
        comercioId: comercio.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Ferramentas",
          description:
            "Caixa de ferramentas completa com os melhores itens para você realizar seus projetos com qualidade e eficiência. Inclui martelo, chave de fenda, alicate, fita métrica e muito mais. Ideal para profissionais e entusiastas do faça você mesmo.",
          price: 39.9,
          imageUrl: "/akemi/cx_ferramentas.png",
          menuCategoryId: externoCategory.id,
          comercioId: comercio.id,
        },
      ],
    });
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
