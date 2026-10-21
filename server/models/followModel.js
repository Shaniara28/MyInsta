
const { database } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class FollowModel {
    static collection() {
        return database.collection("Follow");
    }

    static async toggleFollow(followData) {
        const { followerId, followingId } = followData;

        if (
            !ObjectId.isValid(followerId) ||
            !ObjectId.isValid(followingId)
        ) {
            throw new Error("Invalid user ID");
        }

        const follower = new ObjectId(followerId);
        const following = new ObjectId(followingId);

        if (follower.equals(following)) {
            throw new Error("You cannot follow yourself");
        }

        const followerUser = await database
            .collection("User")
            .findOne({ _id: follower });

        const followingUser = await database
            .collection("User")
            .findOne({ _id: following });

        if (!followerUser || !followingUser) {
            throw new Error("User not found");
        }

        const existingFollow = await this.collection().findOne({
            followerId: follower,
            followingId: following,
        });

        if (existingFollow) {
            await this.collection().deleteOne({
                _id: existingFollow._id,
            });

            return {
                message: "Unfollowed successfully",
                isFollowing: false,
            };
        }

        const newFollow = {
            followerId: follower,
            followingId: following,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await this.collection().insertOne(newFollow);

        return {
            message: "Followed successfully",
            isFollowing: true,
        };
    }
}

module.exports = FollowModel;
