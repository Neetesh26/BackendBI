import { HttpMessage } from "../constants/http-message.constant";
import { HttpStatus } from "../constants/http-status.constant";



class HttpException extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = message || HttpMessage.INTERNAL_SERVER_ERROR;
        this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default HttpException;