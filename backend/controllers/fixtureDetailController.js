
import { getFixtureById } from "../services/fixtureService.js";

export const getFixtureDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Fixture ID is required" });
        }

        const details = await getFixtureById(id);

        if (!details) {
            return res.status(404).json({ success: false, message: "Fixture not found" });
        }

        res.status(200).json({ success: true, data: details });
    } catch (error) {
        console.error("Error in getFixtureDetails controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
