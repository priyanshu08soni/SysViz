import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspace extends Document {
    team_id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    created_at: Date;
}

const WorkspaceSchema: Schema = new Schema({
    team_id: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
