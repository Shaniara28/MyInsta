
const { database } = require("../config/mongodb");
const { hashPassword, confirmPassword } = require("../helpers/bcrypt");

const users = database.collection("User");

class UserModel {
    static async register(userData) {
        const { name, username, email, password } = userData;

        if (!username) {
            throw new Error("Username is required");
        }

        if (!email) {
            throw new Error("Email is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        if (password.length < 5) {
            throw new Error("Password must be at least 5 characters");
        }

        const userExist = await users.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (userExist) {
            throw new Error("Username or email already exists");
        }

        const hashedPassword = hashPassword(password);

        const newUser = {
            ...(name !== undefined ? { name } : {}),
            username,
            email,
            password: hashedPassword,
        };

        const result = await users.insertOne(newUser);

        return {
            _id: result.insertedId.toString(),
            name: newUser.name,
            username: newUser.username,
            email: newUser.email
        };
    }

    static async login(userData) {
        const { username, password } = userData;

        if (!username) {
            throw new Error("Username is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        const user = await users.findOne({ username });

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isPasswordValid = confirmPassword(password, user.password)

        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
        };
    }
}

module.exports = UserModel;
