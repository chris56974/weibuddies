import { Router, Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@weibuddies/common';
import { body } from 'express-validator';
import { Product } from '../models/Product/Product';
import { Order } from '../models/Order/Order';
import { OrderCreatedPublisher } from '../events/publishers/OrderCreatedPublisher';
import { natsWrapper } from '../NatsWrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 15 * 60

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('TicketId must be provided')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Product.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError('Ticket is already reserved');

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      product: {
        id: product.id,
        price: product.price,
      },
    });

    return res.status(201).send(order);
  }
);

export { router as newOrderRouter };