const { database } = require("../config/mongodb")
const { ObjectId } = require("mongodb");

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

        return posts
    }

    static async getById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid post ID");
        }

        const agg = [
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: "$author",
            },
            {
                $lookup: {
                    from: "User",
                    localField: "comments.username",
                    foreignField: "username",
                    as: "commentUsers",
                },
            },
            {
                $lookup: {
                    from: "User",
                    localField: "likes.username",
                    foreignField: "username",
                    as: "likeUsers",
                },
            },
            {
                $project: {
                    "author.password": 0,
                    "author.email": 0,
                    "commentUsers.password": 0,
                    "commentUsers.email": 0,
                    "likeUsers.password": 0,
                    "likeUsers.email": 0,
                },
            },
        ];

        const posts = await this.collection()
            .aggregate(agg)
            .toArray();

        if (posts.length === 0) {
            throw new Error("Post not found");
        }

        return posts[0];
    }

    static async addPost(content, tags, imgUrl, authorId) {

        if (!content) {
            throw new Error("Post content is required");
        }

        const newPost = {
            content,
            tags: tags || [],
            imgUrl,
            authorId,
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const data = await this.collection().insertOne(newPost);

        return await this.getById(data.insertedId.toString());
    }

    static async addComment(commentData) {
        const { postId, content, username } = commentData;

        if (!content || !content.trim()) {
            throw new Error("Comment content is required");
        }

        const post = await this.getById(postId);

        if (!post) {
            throw new Error("Post not found");
        }

        const newComment = {
            content,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.collection().updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: {
                    comments: newComment,
                },
                $set: {
                    updatedAt: new Date(),
                },
            }
        );

        return newComment;
    }


    static async addLike(likeData) {
        const { postId, username } = likeData;

        const post = await this.getById(postId);

        if (!post) {
            throw new Error("Post not found");
        }

        const existingLike = post.likes?.find(
            (like) => like.username === username
        );

        if (existingLike) {
            await this.collection().updateOne(
                { _id: new ObjectId(postId) },
                {
                    $pull: {
                        likes: { username },
                    },
                    $set: {
                        updatedAt: new Date(),
                    },
                }
            );
        } else {
            await this.collection().updateOne(
                { _id: new ObjectId(postId) },
                {
                    $push: {
                        likes: {
                            username,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    },
                    $set: {
                        updatedAt: new Date(),
                    },
                }
            );
        }

        return await this.getById(postId);;
    }

}

module.exports = PostModel;