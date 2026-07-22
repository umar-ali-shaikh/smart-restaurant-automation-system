const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    res.status(statusCode);

    res.json({
        success: false,
        message: err.message,
        data: null,
        errors: err.errors || null,
        ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
    });
};

export { notFound, errorHandler };
