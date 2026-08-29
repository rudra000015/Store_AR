import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"



export async function sendToken(user, res) {
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    return res.status(200).json({
        token,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}




export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body

    try {
        const isExistingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (isExistingUser) {
            return res.status(400).json({
                msg: "User with this email or contact already exist"
            })
        }


        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "Seller" : "Buyer"
        })

        return sendToken(user, res)

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server Error"
        })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid email or password"
            });
        }

        return sendToken(user, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error"
        });
    }
}



export const googleLogin = async (req, res) => {
    const { id, displayName, emails, photos } = req.user;
    const email = emails[0].value;
    const profilePic = photos[0].value;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        user = await userModel.create({
            email,
            googleId: id,
            fullName: displayName,
        })
    }


    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

res.cookie("token",token);
res.redirect("http://localhost:5174/")


}


export const getme = async (req,res)=>{
    const user = req.user;

    res.status(200).json({
        msg:"user fetched successfully",
        success:true,
        user:{
            id :user._id,
            email:user.email,
            fullname:user.fullname,
            contact:user.contact,
            role:user.role
        }
    })
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        msg: "Logged out successfully",
        success: true
    });
};

