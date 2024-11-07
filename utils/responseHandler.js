const responseHandler = (res, statusCode, message, data = null) => {
    const response = {
        statusCode,
        message,
        data,
    };
    return res.status(statusCode).json(response);
}

module.exports = responseHandler;