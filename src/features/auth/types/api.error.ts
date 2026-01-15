
export interface ApiErrorResponse {
 
    statusCode: number;
    message: {
        title: string;
        message: string;
    }
    error: string;
}