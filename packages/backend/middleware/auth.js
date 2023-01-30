import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const JwtGuard = async (req, res, next) => {

   if (!req.headers.authorization) {
      return res.status(401).json({ msg: "Unauthorized!" });
   }

   const token = await req.headers.authorization.split(' ')[1];
   if (!token) {
      return res.status(401).json({ msg: "Unauthorized!" });
   }

   const jwtPayload = JSON.parse(atob(token && token.split('.')[1]))

   if (!jwtPayload || Date.now() / 1000 > jwtPayload.exp) {
      return res.status(401).json({ msg: "Session Expired!", code: "session_expired" });
   }

   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

   let userDetails = await User.findOne({ email: decodedToken.email });

   if (!userDetails) { return res.sendStatus(401); }

   userDetails.hash = undefined
   req.user = userDetails;
   next();

};

export default JwtGuard;