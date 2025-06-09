import jwt from 'jsonwebtoken';

const auth = async(request, response, next) => {
    try {
        const token = request.cookies.accessToken || request?.headers?.authorization?.split(" ")[1];
       
        if(!token) {
            return response.status(401).json({
                message: "Authentication required",
                error: true,
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        if(!decode) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            });
        }

        request.userId = decode.id;
        next();

    } catch (error) {
        // Handle different types of JWT errors
        if (error.name === 'JsonWebTokenError') {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            });
        }
        if (error.name === 'TokenExpiredError') {
            return response.status(401).json({
                message: "Token expired",
                error: true,
                success: false
            });
        }
        
        return response.status(500).json({
            message: "Authentication failed",
            error: true,
            success: false
        });
    }
};

export default auth;