import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const authenticateUser = async (req, res,next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            msg: 'Unauthorised'
        })
    }


    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                msg: 'Unauthorised'
            })
        }

        req.user = user;
        next()


    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Unauthorised'
        })
}




}



    export const authenticateSeller = async (req, res, next) => {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                msg: "Unauthorised user"
            })
        }
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET)

            const user = await userModel.findById(decoded.id);


            if (!user) {
                return res.status(401).json({
                    msg: "Unauthorised user"
                })
            }
            if (user.role != "Seller") {
                return res.status(403).json({
                    msg: "Forbidden"
                })
            }

            req.user = user;
            next()
        } catch (error) {
            return res.status(401).json({
                msg: "Unauthorised user"
            })
        }

    }


