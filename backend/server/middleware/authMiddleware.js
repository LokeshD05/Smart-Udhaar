// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({ message: "No token" })
//         }

//         const token = authHeader.split(" ")[1]; //bearer token
//         if (!token) {
//             return res.status(401).json({ message: "Invalid token format" });
//         }

//         const decoded = jwt.verify(token, process.env.secretKey);
//         req.user = decoded;
        
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };

// export default authMiddleware;
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;   // 🔥 read from cookies

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.secretKey);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
