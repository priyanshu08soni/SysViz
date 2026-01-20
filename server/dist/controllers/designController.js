"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDesignById = exports.updateDesign = exports.getDesignsByWorkspace = exports.createDesign = void 0;
const Design_1 = __importDefault(require("../models/Design"));
const createDesign = async (req, res) => {
    console.log('Create Design Request Body:', req.body);
    const { workspaceId, workspace_id, name, data } = req.body;
    // Support both camelCase and snake_case
    const resolvedWorkspaceId = workspaceId || workspace_id;
    if (!resolvedWorkspaceId) {
        console.error('Workspace ID missing in request');
        return res.status(400).json({ message: 'Workspace ID is required' });
    }
    // Check if user exists (middleware guarantees req.user)
    if (!req.user || !req.user.userId) {
        console.error('User not authenticated in controller');
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.userId;
    try {
        const design = new Design_1.default({
            workspace_id: resolvedWorkspaceId,
            name: name || 'Untitled Design',
            data,
            created_by: userId
        });
        await design.save();
        res.status(201).json(design);
    }
    catch (error) {
        console.error('Create design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createDesign = createDesign;
const getDesignsByWorkspace = async (req, res) => {
    const { workspaceId } = req.params;
    try {
        const designs = await Design_1.default.find({ workspace_id: workspaceId })
            .sort({ updated_at: -1 });
        res.json(designs);
    }
    catch (error) {
        console.error('Get designs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getDesignsByWorkspace = getDesignsByWorkspace;
const updateDesign = async (req, res) => {
    const { id } = req.params;
    const { data, name } = req.body;
    try {
        const updateFields = { data };
        if (name)
            updateFields.name = name;
        // updated_at is handled by the pre-save hook using save(), 
        // or we can explicitly set it here for findOneAndUpdate
        updateFields.updated_at = new Date();
        const design = await Design_1.default.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.json(design);
    }
    catch (error) {
        console.error('Update design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateDesign = updateDesign;
const getDesignById = async (req, res) => {
    const { id } = req.params;
    try {
        const design = await Design_1.default.findById(id);
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.json(design);
    }
    catch (error) {
        console.error('Get design error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getDesignById = getDesignById;
