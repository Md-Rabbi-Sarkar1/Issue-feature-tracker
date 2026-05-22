import type { RUser } from "./type";

declare global {
    namespace Express {
        interface Request {
            user: RUser & { id: number }
        }
    }
}