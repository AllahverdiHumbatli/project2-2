import {UserDBType} from "./types";

declare global {
    namespace Express {
        export interface Request {
            user: UserDBType | null,
            cookies?: { [key: string]: string };
        }
    }
}