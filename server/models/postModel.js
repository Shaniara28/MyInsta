const { database } = require("../config/mongodb")

class PostModel {
    static collection() {
        return database.collection("Posts")
    }

    static async getAll() {
        const agg = [
            {
                $lookup: {
                    from: "User",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    "author.password": 0,
                    "author.email": 0,
                }
            }
        ];

        const posts = await this.collection().aggregate(agg).toArray();
        console.log(posts);
        return posts
    }
}

module.exports = PostModel;