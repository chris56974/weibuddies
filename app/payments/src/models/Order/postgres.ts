import { Pool } from 'pg';
import { IOrderDatabase } from './interface';

const pg = new Pool();

export const postgresDb: IOrderDatabase = {
  getOrder(id) {
    return pg
      .query({
        name: 'getOrder',
        text: 'SELECT * FROM orders WHERE id = $1;',
        values: [id],
      })
      .then((data) => data.rows[0]);
  },
  createOrder(id, price, status, userId, version) {
    return pg
      .query({
        name: 'createOrder',
        text: 'INSERT INTO orders (order_id, price, status, user_id, version) VALUES ($1, $2, $3, $4);',
        values: [id, price, status, userId, version],
      })
      .then((response) => response.rows[0]);
  },
  setOrderStatus(orderId, newStatus) {
    return pg
      .query({
        name: 'removeOrder',
        text: 'UPDATE orders SET order_status = $2 WHERE id = $1;',
        values: [orderId, newStatus],
      })
      .then((res) => res.rows[0]);
  },
};
