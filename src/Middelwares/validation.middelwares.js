export const validation = (schema, source = 'body') => {
    return (req, res, next) => {
        let dataToValidate;
        
        // تحديد مصدر البيانات المراد التحقق منها
        switch (source) {
            case 'body':
                dataToValidate = req.body;
                break;
            case 'params':
                dataToValidate = req.params;
                break;
            case 'query':
                dataToValidate = req.query;
                break;
            case 'headers':
                dataToValidate = req.headers;
                break;
            default:
                dataToValidate = req.body;
        }

        const validationResults = schema.validate(dataToValidate, { abortEarly: false });
        
        if (validationResults.error) {
            const errors = validationResults.error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            
            return res.status(400).json({
                message: "Validation Error",
                errors
            });
        }

        return next();
    };
};
