const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

async function userRegister(req, res) {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "provide all required fields",
                status: "failed"

            })
        }

        const isUserExist = await userModel.findOne({
            email: email
        })
        if (isUserExist) {
            return res.status(422).json({
                message: "user already exist with same email",
                status: "failed"
            })
        }

        const newUser = await userModel.create({
            email, password, name
        })

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        })

        res.cookie('token', token)

        res.status(201).json({
            message: "User created successfully",
            status: "success",
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                },
                token
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Internal server error",
            status: "failed"
        });
    }
}



async function userLogin(req, res) {
    try {
        let { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Provide all required fields",
                status: "failed"
            });
        }

        // Normalize email
        email = email.trim().toLowerCase();

        // Find user and explicitly retrieve password hash
        const findUserByEmail = await userModel
            .findOne({ email })
            .select('+password');

        if (!findUserByEmail) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            });
        }

        // Verify password
        const isPasswordCorrect =
            await findUserByEmail.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: findUserByEmail._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Set HTTP-only authentication cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        // Return only safe user details
        return res.status(200).json({
            message: "User logged in successfully",
            status: "success",
            data: {
                user: {
                    id: findUserByEmail._id,
                    name: findUserByEmail.name,
                    email: findUserByEmail.email
                }
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
            status: "failed"
        });
    }
}


module.exports = { userRegister, userLogin }