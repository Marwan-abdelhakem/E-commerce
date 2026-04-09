const globalErrorHandler = (err, req, res, next) => {
    // Ensure CORS headers are sent even on errors
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    const statusCode = err.cause || 500
    return res
        .status(statusCode)
        .json({ 
            message: "something went wrong", 
            error: err.message, 
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        })
}

export default globalErrorHandler