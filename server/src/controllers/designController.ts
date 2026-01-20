import { Request, Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import Design from '../models/Design';
import { logActivity } from './activityController';

export const createDesign = async (req: AuthRequest, res: Response) => {
    console.log('Create Design Request Body:', req.body);
    const { workspaceId, workspace_id, teamId, team_id, name, data } = req.body;

    const resolvedWorkspaceId = workspaceId || workspace_id;
    const resolvedTeamId = teamId || team_id;

    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.userId;

    try {
        const design = new Design({
            workspace_id: resolvedWorkspaceId,
            team_id: resolvedTeamId,
            name: name || 'Untitled Design',
            data,
            created_by: userId,
            public_id: crypto.randomBytes(16).toString('hex')
        });

        await design.save();

        // Log activity
        await logActivity(userId, 'created_design', { designId: design._id, name: design.name }, resolvedWorkspaceId);

        res.status(201).json(design);
    } catch (error: any) {
        console.error('Create design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getDesignsByTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    try {
        const designs = await Design.find({ team_id: teamId })
            .sort({ updated_at: -1 });
        res.json(designs);
    } catch (error: any) {
        console.error('Get designs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getDesignsByWorkspace = async (req: Request, res: Response) => {
    const { workspaceId } = req.params;

    try {
        const designs = await Design.find({ workspace_id: workspaceId })
            .sort({ updated_at: -1 });
        res.json(designs);
    } catch (error: any) {
        console.error('Get designs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateDesign = async (req: any, res: Response) => {
    const { id } = req.params;
    const { data, name } = req.body;

    try {
        const updateFields: any = { data };
        if (name) updateFields.name = name;

        updateFields.updated_at = new Date();

        const design = await Design.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        // Migration: Ensure public_id exists
        if (!design.public_id) {
            design.public_id = crypto.randomBytes(16).toString('hex');
            await design.save();
        }

        if (req.user?.userId) {
            await logActivity(req.user.userId, 'updated_design', { designId: design._id, name: design.name }, design.public_id);
        }

        res.json(design);
    } catch (error: any) {
        console.error('Update design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getDesignById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const design = await Design.findById(id);
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        // Migration: Ensure public_id exists
        if (!design.public_id) {
            design.public_id = crypto.randomBytes(16).toString('hex');
            await design.save();
        }

        res.json(design);
    } catch (error: any) {
        console.error('Get design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserDesigns = async (req: AuthRequest, res: Response) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const designs = await Design.find({ created_by: req.user.userId })
            .sort({ updated_at: -1 });
        res.json(designs);
    } catch (error: any) {
        console.error('Get user designs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const togglePublic = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { isPublic } = req.body;

    try {
        const design = await Design.findById(id);
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }

        // Check if user is owner or team member (future check)
        // For now, simple owner check
        if (design.created_by.toString() !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to share this design' });
        }

        // Ensure public_id exists when enabling sharing
        if (!design.public_id) {
            design.public_id = crypto.randomBytes(16).toString('hex');
        }

        design.is_public = isPublic;
        await design.save();

        // Log activity
        if (req.user?.userId) {
            await logActivity(req.user.userId, isPublic ? 'published_design' : 'unpublished_design', { designId: design._id, name: design.name });
        }

        res.json(design);
    } catch (error: any) {
        console.error('Toggle public error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPublicDesign = async (req: Request, res: Response) => {
    const { publicId } = req.params;

    try {
        const design = await Design.findOne({ public_id: publicId, is_public: true });
        if (!design) {
            return res.status(404).json({ message: 'Shared design not found or private' });
        }
        res.json(design);
    } catch (error: any) {
        console.error('Get public design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
