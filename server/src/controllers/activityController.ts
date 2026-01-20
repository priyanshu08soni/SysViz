import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Activity from '../models/Activity';

// Helper to log activity
export const logActivity = async (userId: string, action: string, details?: any, workspaceId?: string) => {
    try {
        await Activity.create({
            user_id: userId,
            action,
            details,
            workspace_id: workspaceId
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

export const getActivities = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Build query
        const query: any = { user_id: req.user.userId };

        if (req.query.designId) {
            const designIdStr = req.query.designId as string;
            if (mongoose.Types.ObjectId.isValid(designIdStr)) {
                // Return activities that match either string or ObjectId (some might be stored as one or other)
                query.$or = [
                    { 'details.designId': new mongoose.Types.ObjectId(designIdStr) },
                    { 'details.designId': designIdStr }
                ];
            } else {
                query['details.designId'] = designIdStr;
            }
        }

        const activities = await Activity.find(query)
            .sort({ created_at: -1 })
            .limit(50);

        res.json(activities);
    } catch (error: any) {
        console.error('Get activities error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
