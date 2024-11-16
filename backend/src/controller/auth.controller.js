import { User } from "../models/user.models.js";

export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl } = req.body;
        // get the user if there
        const user = await User.findOne({ clerkId: id });
        if (!user) {
            // signup
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                imageUrl,
            });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in callbacks", error);
        next(error);
    }
};
