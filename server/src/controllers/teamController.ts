import { Request, Response } from 'express';
import Team from '../models/Team';
import Workspace from '../models/Workspace';
import mongoose from 'mongoose';

// Helper to generate a unique team code
const generateTeamCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const createTeam = async (req: any, res: Response) => {
    const { name } = req.body;
    const ownerId = req.user.userId;

    try {
        let code = generateTeamCode();
        // Ensure code is unique (extremely rare collision but good to check)
        let existingTeam = await Team.findOne({ code });
        while (existingTeam) {
            code = generateTeamCode();
            existingTeam = await Team.findOne({ code });
        }

        const team = new Team({
            name,
            code,
            owner_id: ownerId,
            members: [{
                user_id: ownerId,
                role: 'owner'
            }]
        });

        await team.save();
        res.status(201).json(team);
    } catch (error: any) {
        console.error('Create team error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const joinTeam = async (req: any, res: Response) => {
    const { code } = req.body;
    const userId = req.user.userId;

    try {
        const team = await Team.findOne({ code });

        if (!team) {
            return res.status(404).json({ message: 'Team not found with this code' });
        }

        // Check if user is already a member
        const isMember = team.members.some(m => m.user_id.toString() === userId);
        if (isMember) {
            return res.status(400).json({ message: 'You are already a member of this team' });
        }

        team.members.push({
            user_id: userId as any,
            role: 'editor'
        });

        await team.save();
        res.json({ message: 'Successfully joined team', team });
    } catch (error: any) {
        console.error('Join team error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMyTeams = async (req: any, res: Response) => {
    try {
        const teams = await Team.find({
            'members.user_id': req.user.userId
        }).sort({ created_at: -1 });

        // Add the current user's role to each team object for the frontend
        const teamsWithRole = teams.map(team => {
            const member = team.members.find(m => m.user_id.toString() === req.user.userId);
            return {
                ...team.toObject(),
                role: member?.role
            };
        });

        res.json(teamsWithRole);
    } catch (error: any) {
        console.error('Get my teams error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createWorkspace = async (req: Request, res: Response) => {
    const { teamId, name, description } = req.body;

    try {
        const workspace = new Workspace({
            team_id: teamId,
            name,
            description
        });

        await workspace.save();
        res.status(201).json(workspace);
    } catch (error: any) {
        console.error('Create workspace error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getWorkspacesByTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    try {
        const workspaces = await Workspace.find({ team_id: teamId })
            .sort({ created_at: -1 });
        res.json(workspaces);
    } catch (error: any) {
        console.error('Get workspaces error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
