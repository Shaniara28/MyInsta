
const { database } = require("../config/mongodb");
const { hashPassword } = require("../helpers/bcrypt");

class UserModel {
    static async register(userData) {
        const { name, username, email, password } = userData;

        const users = database.collection("User");

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
}

module.exports = UserModel;
