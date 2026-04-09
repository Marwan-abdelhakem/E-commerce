const globalErrorHandler = (err, req, res, next) => {
    // CORS headers are already handled by cors middleware
    // Only add them here if they're missing (edge cases)
    if (!res.getHeader('Access-Control-Allow-Origin')) {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    // Determine status code
    const statusCode = err.cause || err.statusCode || 500;
    
    // Handle different error types
    let message = err.message || 'Something went wrong';
    
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists`;
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
    }
    
    // CORS errors
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            message: 'CORS policy: Origin not allowed',
            error: err.message
        });
    }
    
    // Response
    return res.status(statusCode).json({ 
        message: message,
        error: err.message,
        ...(process.env.NODE_ENV !== 'production' && { 
            stack: err.stack,
            details: err 
        })
    });
}

export default globalErrorHandler;