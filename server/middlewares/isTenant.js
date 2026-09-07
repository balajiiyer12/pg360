export const isTenant = (req, res, next) => {
    if (req.user.role !== "tenant") {
        return res.status(403).json({
        success: false,
        message: "Access denied"
    });
    }
    next();
};