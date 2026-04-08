import successResponse from "../../Utlis/successResponse.utlis.js";
import UserModel from "../../DB/model/User.model.js";
import { comparePassowrd, hashPassword } from "../../Utlis/hash.utlis.js";
import { signToken } from "../../Utlis/token.utlis.js";

export const signUp = async (req, res, next) => {
    const { role, fullName, userName, age, phone, email, password } = req.body
    const user = await UserModel.findOne({ email: email })
    if (user) {
        return next(new Error("Email already exists", { cause: 409 }))
    }
    const haShPassword = await hashPassword({ plainText: password })
    const createUser = await UserModel.create({
        role,
        fullName,
        userName,
        age,
        phone,
        email,
        password: haShPassword
    })
    return successResponse({ res, statusCode: 201, message: "User Create Successfully", data: createUser })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })
    if (!user) {
        return next(new Error("user not Founded", { cause: 404 }))
    }
    const isMatch = await comparePassowrd({ plainText: password, hashPassword: user.password })
    if (!isMatch) {
        return next(new Error("Invalid password", { cause: 400 }))
    }
    const accessToken = signToken({
        payload: { _id: user._id }, options: {
            expiresIn: "1d",
            issuer: "Sakanly",
            subject: "Authentication",
        }
    })

    const refreshToken = signToken({
        payload: { _id: user._id }, options: {
            expiresIn: "7d",
            issuer: "Sakanly",
            subject: "Authentication",
        }
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 يوم
        path: "/"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
        path: "/"
    });

    return successResponse({ res, statusCode: 200, message: "Login Successfully", data: { accessToken, refreshToken } })
}

export const getAllUsers = async (req, res, next) => {
    const user = await UserModel.find()
    if (!user) {
        return next(new Error("user not Founded", { cause: 404 }))
    }
    return successResponse({ res, statusCode: 200, message: "User:", data: user })
}


//get detials of user 