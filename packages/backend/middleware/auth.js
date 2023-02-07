import jwt from 'jsonwebtoken';

export const JwtGuard = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: 'Unauthorized!' });
    }

    const token = await req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized!' });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken.address;
    next();
  } catch (e) {
    return res.status(404).json({ message: e.message });
  }
};
