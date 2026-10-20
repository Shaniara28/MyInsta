
const { database } = require("../config/mongodb");
const { hashPassword, confirmPassword } = require("../helpers/bcrypt");
const validator = require("email-validator");

class UserModel {
    static collection() {
        return database.collection("User");
    }

    static async register(userData) {
        const { name, username, email, password } = userData;

        if (!username || !email || !password) {
            throw new Error("Username, email & password is required");
        }

        if (password.length < 5) {
            throw new Error("Password must be at least 5 characters");
        }

        const isEmailValid = validator.validate(email);

        if (!isEmailValid) {
            throw new Error("Invalid email format");
        }

        const userExist = await this.collection().findOne({
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

        const result = await this.collection().insertOne(newUser);

        return {
            _id: result.insertedId.toString(),
            name: newUser.name,
            username: newUser.username,
            email: newUser.email
        };
    }

    static async findByUsername(username) {
        return await this.collection().findOne({ username })
    }

    static async findById(id) {
        return await this.collection().findOne({ _id: new ObjectId(id) })
    }
}

module.exports = UserModel;
