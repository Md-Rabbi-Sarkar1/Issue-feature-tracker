import type { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const statusCode =
        err.statusCode || 500;

    const message =
        err.message || "Something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
        error: {
            statusCode,
            details: err.details || null
        }
    });
};