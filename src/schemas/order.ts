import { number, object, string, TypeOf } from 'zod';

export const  createOrderSchema = object ({
    body: object({
        order_price:number({
            required_error: 'Order price is required'
        }),
        product_id:string({
            required_error: 'Product id is required'
        }),
    }),
});

const params = {
    params: object({
        OrderId: string(),
    })
};

export const getOrderSchema = object({
    ...params
});

export const updateOrderSchema = object({
    ...params,
    body: object({
    //   title: string(),
    //   content: string(),
    //   image: string(),
    }).partial(),
  });
  
  export const deleteOrderSchema = object({
    ...params,
  });
  
  export type CreateOrderInput = TypeOf<typeof createOrderSchema>['body'];
  export type GetOrderInput = TypeOf<typeof getOrderSchema>['params'];
  export type UpdateOrderInput = TypeOf<typeof updateOrderSchema>;
  export type DeleteOrderInput = TypeOf<typeof deleteOrderSchema>['params'];
  
  