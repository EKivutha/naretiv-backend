import { NextFunction, Request, Response } from 'express';
import {
    CreateMessageInput,
    DeleteMessageInput,
    GetMessageInput,
    UpdateMessageInput,
} from '../schemas/message';
import { createMessage, findMessage, getMessage } from '../services/message';
import { findProduct, findProductById } from '../services/product';
import { findUserById } from '../services/user';
import AppError from '../utils/appError';

// 👈 Message method:- Create a new Message
export const createMessageHandler = async (
    req: Request<{}, {}, CreateMessageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUserById(res.locals.user.id as string);
        const user_to = await findUserById(req.body.receiver_id as string)

        if (user!.role == 'buyer' || user!.role == 'admin') {
            try {
                const Message = await createMessage(req.body, user!, user_to!);

                res.status(201).json({
                    status: 'success',
                    data: {
                        Message,
                    },
                });
            } catch (err: any) {
                if (err.code === '23505') {
                    return res.status(409).json({
                        status: 'fail',
                        message: 'Message with that title already exist',
                    });
                }
                next(err);
            }

        } else {
            return next(new AppError(401, 'User is not authorized to create Message'));
        }
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'fail',
                message: 'Could not create Message',
            });
        }
        next(err);

    }
};

export const getMessageHandler = async (
    req: Request<GetMessageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await findUserById(res.locals.user.id as string);

        if (user!.role == 'admin') {
            const Message = await getMessage(req.params.messageId)

            if (!Message) {
                return next(new AppError(404, 'Message with that id not found'))
            }
            res.status(200).json({
                status: 'success',
                data: {
                    Message,
                },

            })
        }
        else {
            return next(
                new AppError(
                    401, 'User is not allowed to get Message list'
                )
            );
        }
    }
    catch (err: any) {
        next(err);
    }
}

export const getAllMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const Messages = await findMessage({}, {}, {});

        res.status(200).json({
            status: 'success',
            data: {
                Messages
            }
        })
    } catch (err: any) {
        next(err);
    }
}

export const updateMessageHandler = async (
    req: Request<UpdateMessageInput['params'], {}, UpdateMessageInput['body']>,
    res: Response,
    next: NextFunction
) => {
    try {
        const Message = await getMessage(req.params.messageId);

        if (!Message) {
            return next(new AppError(404, 'Message with that ID not found'));
        }

        Object.assign(Message, req.body);

        const updatedMessage = await Message.save();

        res.status(200).json({
            status: 'success',
            data: {
                Message: updatedMessage,
            },
        });
    } catch (err: any) {
        next(err);
    }
};


export const deleteMessageHandler = async (
    req: Request<DeleteMessageInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const Message = await getMessage(req.params.messageId);

        if (!Message) {
            return next(new AppError(404, 'Message with that ID not found'));
        }

        await Message.remove();

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err: any) {
        next(err);
    }
};
