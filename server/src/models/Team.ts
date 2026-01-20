import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
    name: string;
    code: string;
    owner_id: mongoose.Types.ObjectId;
    members: Array<{
        user_id: mongoose.Types.ObjectId;
        role: 'owner' | 'editor' | 'viewer';
    }>;
    created_at: Date;
}

const TeamSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'editor', 'viewer'],
            default: 'viewer'
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ITeam>('Team', TeamSchema);
