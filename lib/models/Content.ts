import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description: string;
  category: string;
  thumbnailPath: string;
  uploadedBy: mongoose.Types.ObjectId; // Reference to User who uploaded it
  accessLevel: 'everyone' | 'lite' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'],
      message: 'Invalid category'
    }
  },
  thumbnailPath: {
    type: String,
    required: [true, 'Thumbnail path is required']
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploaded by is required']
  },
  accessLevel: {
    type: String,
    required: [true, 'Access level is required'],
    enum: {
      values: ['everyone', 'lite', 'premium'],
      message: 'Invalid access level'
    },
    default: 'everyone'
  }
}, {
  timestamps: true
});

// Create the model
const Content = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;

export interface Content {
  _id?: string;
  title: string;
  description: string;
  category: string;
  thumbnailPath: string;
  uploadedBy: string; // Reference to User who uploaded it
  accessLevel: 'everyone' | 'lite' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContentInput {
  title: string;
  description: string;
  category: string;
  thumbnailPath: string;
  uploadedBy: string;
  accessLevel?: 'everyone' | 'lite' | 'premium';
}

export class ContentModel {
  static sanitizeContent(content: Content): Content {
    return content;
  }

  static getCategories(): string[] {
    return [
      'Action',
      'Comedy',
      'Drama',
      'Horror',
      'Romance',
      'Sci-Fi'
    ];
  }

  static getAccessLevels(): Array<{ value: string; label: string; description: string }> {
    return [
      { value: 'everyone', label: 'Everyone', description: 'Available to all users' },
      { value: 'lite', label: 'Lite & Premium', description: 'Available to Lite and Premium users' },
      { value: 'premium', label: 'Premium Only', description: 'Available only to Premium users' }
    ];
  }
}