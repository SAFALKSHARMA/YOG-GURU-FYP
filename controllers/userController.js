import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        // Ensure userId is provided
        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }

        // Find user by the provided userId
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Return the user data
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        // Return the error message in the response
        res.json({ success: false, message: error.message });
    }
}
