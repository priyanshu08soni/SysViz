"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspacesByTeam = exports.createWorkspace = exports.getMyTeams = exports.createTeam = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const Workspace_1 = __importDefault(require("../models/Workspace"));
const createTeam = async (req, res) => {
    const { name } = req.body;
    const ownerId = req.user.userId;
    try {
        const team = new Team_1.default({
            name,
            owner_id: ownerId,
            members: [{
                    user_id: ownerId,
                    role: 'owner'
                }]
        });
        await team.save();
        res.status(201).json(team);
    }
    catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createTeam = createTeam;
const getMyTeams = async (req, res) => {
    try {
        const teams = await Team_1.default.find({
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
    }
    catch (error) {
        console.error('Get my teams error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getMyTeams = getMyTeams;
const createWorkspace = async (req, res) => {
    const { teamId, name, description } = req.body;
    try {
        const workspace = new Workspace_1.default({
            team_id: teamId,
            name,
            description
        });
        await workspace.save();
        res.status(201).json(workspace);
    }
    catch (error) {
        console.error('Create workspace error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createWorkspace = createWorkspace;
const getWorkspacesByTeam = async (req, res) => {
    const { teamId } = req.params;
    try {
        const workspaces = await Workspace_1.default.find({ team_id: teamId })
            .sort({ created_at: -1 });
        res.json(workspaces);
    }
    catch (error) {
        console.error('Get workspaces error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getWorkspacesByTeam = getWorkspacesByTeam;
