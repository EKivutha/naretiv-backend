import { number, object, string, TypeOf } from 'zod';

export const  createMessageSchema = object ({
    body: object({
        receiver_id:string({
            required_error: 'receiver id is required'
        }),
        message_body:string({
            required_error: 'message body is required'
        }),
    }),
});

const params = {
    params: object({
        messageId: string(),
    })
};

export const getMessageSchema = object({
    ...params
});

export const updateMessageSchema = object({
    ...params,
    body: object({
      title: string(),
      content: string(),
      image: string(),
    }).partial(),
  });
  
  export const deleteMessageSchema = object({
    ...params,
  });
  
  export type CreateMessageInput = TypeOf<typeof createMessageSchema>['body'];
  export type GetMessageInput = TypeOf<typeof getMessageSchema>['params'];
  export type UpdateMessageInput = TypeOf<typeof updateMessageSchema>;
  export type DeleteMessageInput = TypeOf<typeof deleteMessageSchema>['params'];
  
  