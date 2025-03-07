import express from "express";
import Report from './Report.js';

const reportRouter = express.Router();

// Create a report
reportRouter.post('/report', async (req, res) => {
    try {
        const { userId, name, username, reason, comments } = req.body;

        console.log('Report data received:', req.body);

        // Validate the input
        if (!userId || !username || !reason) {
            return res.status(400).json({ message: 'UserId, name, username, and reason are required.' });
        }

        // Create a new report
        const newReport = new Report({
            userId,
            name,
            username,
            reason,
            comments,
        });
        console.log('Creating report:', newReport);

        // Save the report
        await newReport.save();

        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Error submitting report' });
    }
});

// Fetch all reports (adjusted route name to '/reports')
reportRouter.get('/report', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
});

// Delete a specific report (new route added)
reportRouter.delete('/report/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the report by ID
        const report = await Report.findByIdAndDelete(id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Error deleting report', error: error.message });
    }
});

export default reportRouter;