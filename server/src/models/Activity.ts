import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    user_id: mongoose.Types.ObjectId;
    action: string;
    details?: any;
    workspace_id?: string;
    created_at: Date;
}

const ActivitySchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: Schema.Types.Mixed
    },
    workspace_id: {
        type: String, // design id or workspace id
        required: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
