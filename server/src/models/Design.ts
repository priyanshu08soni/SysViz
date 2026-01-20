import mongoose, { Schema, Document } from 'mongoose';

export interface IDesign extends Document {
    workspace_id: string; // Keep for compatibility if needed
    team_id?: mongoose.Types.ObjectId;
    name: string;
    data: any; // JSON data for nodes, edges, etc.
    is_public: boolean;
    public_id: string;
    version: number;
    created_by: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const DesignSchema: Schema = new Schema({
    workspace_id: {
        type: String,
        required: false, // Make optional
        index: true
    },
    team_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        index: true,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    is_public: {
        type: Boolean,
        default: false
    },
    public_id: {
        type: String,
        unique: true,
        sparse: true // Only index if value exists
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model<IDesign>('Design', DesignSchema);
