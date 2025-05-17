// src/infrastructure/middlewares/errorHandler.ts
import { Response, Request, NextFunction } from "express";
import { STATUS_CODES } from "../../shared/statusCodes";

class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message
    });
}

export function createError(message: string, statusCode: number) {
    return new AppError(message, statusCode);
}