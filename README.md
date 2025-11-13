# OTT Platform Prototype

A minimal OTT (Over-The-Top) web application prototype built for a college project. This platform demonstrates role-based content delivery with subscription management.

## Features

### User Management
- **User Registration & Login**: Mandatory registration with username, email, and password
- **Role-Based Access**: Admin and User roles with different permissions
- **JWT Authentication**: Secure token-based authentication system

### Content Management (Admin)
- **Content Upload**: Admins can upload thumbnails, titles, descriptions, and categories
- **Access Control**: Set content visibility (Everyone/Lite/Premium users only)
- **Content Management**: View and delete uploaded content

### User Features
- **Content Feed**: Browse content cards with thumbnails and titles
- **Search & Filter**: Search by title and filter by category
- **Content Details**: View detailed information about content
- **Subscription Plans**:
  - Default (Free): Access to "Everyone" content only
  - Lite: Access to "Everyone" and "Lite" content
  - Premium: Access to all content
- **Account Management**: Update subscription plans and view profile

### Technical Features
- **File Storage**: Thumbnails stored in backend with database path references
- **Form Handling**: Formik for forms with Yup validation
- **Responsive Design**: HeroUI components with modern UI
- **Database Integration**: MongoDB for data storage
- **TypeScript**: Full TypeScript implementation

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: HeroUI with Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer for thumbnail uploads
- **Form Handling**: Formik with Yup validation
- **Styling**: Tailwind CSS

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Docker & Docker Compose** (recommended for local development)
   - OR local MongoDB installation
3. **Git**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OTT_Platform_Prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/ott-platform

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key

   # File Upload Configuration
   UPLOAD_DIR=./public/uploads/thumbnails
   MAX_FILE_SIZE=5242880

   # Node Environment
   NODE_ENV=development
   ```

4. **Set up MongoDB using Docker Compose (Recommended)**

   ```bash
   # Start MongoDB using Docker Compose
   docker-compose up -d mongodb

   # Verify MongoDB is running
   docker-compose ps

   # To view logs
   docker-compose logs mongodb

   # To stop MongoDB
   docker-compose down
   ```

   **Alternative: Local MongoDB Installation**
   If you prefer to use local MongoDB instead of Docker:

   ```bash
   # For Windows
   net start MongoDB

   # For macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

5. **Run the development server**

   **Option A: Using the convenience script (Recommended)**
   ```bash
   # For Linux/macOS
   ./start-dev.sh

   # For Windows
   start-dev.bat
   ```

   **Option B: Manual setup**
   ```bash
   # Start MongoDB first
   docker-compose up -d mongodb

   # Then start the Next.js server
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Quick Start Commands

```bash
# Start everything (MongoDB + Next.js)
./start-dev.sh

# Or manually
docker-compose up -d mongodb  # Start MongoDB
npm run dev                   # Start Next.js

# Stop services
docker-compose down           # Stop MongoDB
# Press Ctrl+C to stop Next.js
```

## Usage

### Getting Started

1. **Register a new account**:
   - Visit `/auth/register`
   - Choose between "User" or "Admin" role
   - Select a subscription plan (Default/Lite/Premium)

2. **Login**:
   - Visit `/auth/login`
   - Enter your credentials

### For Users

- **Browse Content**: Access the feed at `/user/feed`
- **Search & Filter**: Use the search bar and category filters
- **View Details**: Click on content cards to see full details
- **Manage Account**: Visit `/user/account` to update subscription

### For Admins

- **Upload Content**: Access the admin dashboard at `/admin/dashboard`
- **Manage Content**: View and delete uploaded content
- **Set Access Levels**: Choose who can view content (Everyone/Lite/Premium)

## File Structure

```
OTT_Platform_Prototype/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── content/           # Content management endpoints
│   │   ├── user/              # User management endpoints
│   │   └── upload/            # File upload endpoints
│   ├── auth/                  # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── admin/                 # Admin pages
│   │   └── dashboard/
│   ├── user/                  # User pages
│   │   ├── feed/
│   │   ├── content/[id]/
│   │   └── account/
│   └── layout.tsx
├── components/
│   ├── admin/                 # Admin components
│   ├── auth/                  # Authentication components
│   ├── user/                  # User components
│   └── shared/                # Shared components
├── lib/
│   ├── models/                # MongoDB models
│   ├── auth-context.tsx       # Authentication context
│   ├── auth.ts                # JWT utilities
│   ├── mongodb.ts             # Database connection
│   ├── middleware.ts          # Authentication middleware
│   ├── upload.ts              # File upload utilities
│   └── api.ts                 # API utilities
└── public/
    └── uploads/
        └── thumbnails/        # Uploaded thumbnails
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### User Management
- `PUT /api/user/subscription` - Update subscription plan

### Content Management
- `GET /api/content/feed` - Get user's content feed (with subscription filtering)
- `GET /api/content/[id]` - Get content details (with access control)
- `GET /api/content/search` - Search content
- `POST /api/content/admin/upload` - Admin: Upload content
- `GET /api/content/admin/manage` - Admin: Get all content
- `DELETE /api/content/admin/manage` - Admin: Delete content

### File Upload
- `POST /api/upload/thumbnail` - Upload thumbnail image

## Access Control Logic

### Subscription-Based Content Access
- **Default Plan**: Can only view content marked as "Everyone"
- **Lite Plan**: Can view "Everyone" and "Lite" content
- **Premium Plan**: Can view all content ("Everyone", "Lite", "Premium")

### Role-Based Routing
- **Users**: Redirected to `/user/feed` after login
- **Admins**: Redirected to `/admin/dashboard` after login
- **Unauthenticated**: Redirected to `/auth/login`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `NEXTAUTH_URL` | Next.js authentication URL | Yes |
| `NEXTAUTH_SECRET` | Next.js secret key | Yes |
| `UPLOAD_DIR` | Directory for file uploads | No |
| `MAX_FILE_SIZE` | Maximum file size for uploads | No |
| `NODE_ENV` | Environment mode | No |

## Development Notes

- The application uses **serverless functions** for API endpoints
- **MongoDB** stores user data, content metadata, and file paths
- **Thumbnails** are stored in the local filesystem (`/public/uploads/thumbnails/`)
- **JWT tokens** are stored in localStorage for client-side authentication
- **Formik** and **Yup** handle form validation and submission
- **HeroUI** provides a modern, responsive UI component library

## Future Enhancements

- Video streaming capabilities
- User profiles with preferences
- Content recommendations
- Payment integration for subscriptions
- Content rating and reviews
- Watch history
- Offline content download
- Multi-language support
- Content analytics for admins

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env.local`
   - Verify database permissions

2. **Authentication Issues**:
   - Clear browser localStorage
   - Check JWT_SECRET is set
   - Verify API endpoints are accessible

3. **File Upload Issues**:
   - Ensure upload directory exists and has write permissions
   - Check file size limits
   - Verify file type restrictions

4. **Build Errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes only.
