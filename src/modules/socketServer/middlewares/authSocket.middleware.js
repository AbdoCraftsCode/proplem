import  {decodedToken}  from "../../../utlis/security/Token.security.js";

export const authMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const mockNext = (error) => {
      if (error) {
        throw error;
      }
    };

    const user = await decodedToken({
      authorization: `Bearer ${token}`,
      next: mockNext,
    });

    socket.user = user;

    console.log(
      `User authenticated: ${socket.user.username} (${socket.user._id})`
    );
    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Authentication error: " + error.message));
  }
};
