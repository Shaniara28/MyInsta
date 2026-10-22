
const { ObjectId } = require("mongodb");
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
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid user ID");
        }

        const agg = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "Follow",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "followerRelations",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "followerRelations.followerId",
                    foreignField: "_id",
                    as: "followers",
                },
            },
            {
                $lookup: {
                    from: "Follow",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "followingRelations",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "followingRelations.followingId",
                    foreignField: "_id",
                    as: "following",
                },
            },
            {
                $project: {
                    password: 0,
                    followerRelations: 0,
                    followingRelations: 0,
                    "followers.password": 0,
                    "followers.email": 0,
                    "following.password": 0,
                    "following.email": 0,
                },
            },
        ];

        const users = await this.collection()
            .aggregate(agg)
            .toArray();

        if (users.length === 0) {
            throw new Error("User not found");
        }

        return users[0];
    }

    static async search(input) {
        const keyword = input.trim()

        const users = await this.collection().find(
            {
                username: {
                    $regex: keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                    $options: "i",
                }
            },
            {
                projection: {
                    password: 0,
                    email: 0
                },
            }
        ).toArray();

        return users;
    }
}

module.exports = UserModel;
