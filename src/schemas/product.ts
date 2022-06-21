import { number, object, string, TypeOf } from 'zod';

export const  createProductSchema = object ({
    body: object({
        product_name:string({
            required_error: 'Product name is required'
        }),
        product_cost:number({
            required_error: 'Product cost is required'
        }),
    }),
});

const params = {
    params: object({
        ProductId: string(),
    })
};

export const getProductSchema = object({
    ...params
});

export const updateProductSchema = object({
    ...params,
    body: object({
      title: string(),
      content: string(),
      image: string(),
    }).partial(),
  });
  
  export const deleteProductSchema = object({
    ...params,
  });
  
  export type CreateProductInput = TypeOf<typeof createProductSchema>['body'];
  export type GetProductInput = TypeOf<typeof getProductSchema>['params'];
  export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
  export type DeleteProductInput = TypeOf<typeof deleteProductSchema>['params'];
  
  