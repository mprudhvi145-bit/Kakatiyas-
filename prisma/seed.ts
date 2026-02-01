
// @ts-ignore
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Clean existing data (Optional for dev)
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.productImage.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.artisan.deleteMany();
  // await prisma.user.deleteMany();

  // 2. Create Categories
  // const fashion = await prisma.category.create({ data: { name: 'Fashion', slug: 'fashion' } });
  // const jewelry = await prisma.category.create({ data: { name: 'Jewelry', slug: 'jewelry' } });
  // const handloom = await prisma.category.create({ data: { name: 'Handloom', slug: 'handloom' } });

  // 3. Create Sample Artisan
  // const artisan = await prisma.artisan.create({
  //   data: {
  //     name: 'Master Weaver Rao',
  //     region: 'Warangal',
  //     story: 'Expert in Kakatiya motifs.'
  //   }
  // });

  // 4. Create Admin User
  // await prisma.user.create({
  //   data: {
  //     email: 'admin@kakatiyas.com',
  //     role: 'ADMIN',
  //     name: 'Admin User'
  //   }
  // });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    (process as any).exit(1);
  });
