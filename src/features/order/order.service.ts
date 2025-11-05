// import { Order, OrderStatus } from '@prisma/client';
// import prisma from '~/prisma';
// import { packageService } from '../package/package.service';

// class OrderService {
//   public async create(packageId: number,  currentUser: UserPayLoad): Promise<Order> {
//     const pkg = await packageService.readOneForRecruiter(packageId);

//     const order = await prisma.order.create({
//       data: {
//         packageId,
//         recruiterId: currentUser.id,
//         totalPrice: pkg.price,
//         status: OrderStatus.SUCCESS
//       }
//     });

//     return order;
//   }
// }

// export const orderService: OrderService = new OrderService();
