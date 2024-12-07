export const errorHandler = (statusCode, message)=>{
    const error = new Error()     //we use js error constructor to create an error
    error.statusCode = statusCode
    error.message = message;
    return error;
}