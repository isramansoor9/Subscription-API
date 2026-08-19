import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });

        if (decision.isDenied()) {
            return res.status(429).json({
                success: false,
                error: "Too Many Requests",
                reason: decision.reason,
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet Middleware Error:", error);
        next(error);
    }
};

export default arcjetMiddleware;
