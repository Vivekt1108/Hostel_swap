# HostelSwap 🏠

A comprehensive room and roommate exchange platform designed for hostel students to coordinate room swaps and find compatible roommates through an intuitive web interface.

## 🚀 Features

### Core Functionality
- **Room Exchange System**: Facilitate direct room swaps between students
- **Multi-Party Swaps**: Enable complex swap chains (A → B → C → A) 
- **Roommate Matching**: Help students find compatible roommates
- **Real-time Messaging**: Direct communication between students
- **Request Management**: Track and manage swap requests with status updates

### User Experience
- **Intuitive Dashboard**: Central hub showing current assignments and active swaps
- **Browse Interface**: Discover available swap opportunities 
- **Profile Management**: Customize preferences and availability settings
- **Mobile Responsive**: Optimized for all device types
- **Authentication**: Secure login system with student ID verification

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Shadcn/ui** components built on Radix UI
- **Tailwind CSS** for styling
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Vite** for fast development and builds

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon Database
- **Drizzle ORM** for type-safe database operations
- **Session-based authentication** with Bearer tokens
- **RESTful API** design with consistent error handling

## 📊 Data Models

The system manages five core entities:

- **Hostels**: Building information and metadata
- **Rooms**: Physical room details with capacity and floor information  
- **Students**: User profiles with authentication and preferences
- **Swap Requests**: Individual swap proposals with status tracking
- **Swap Chains**: Complex multi-party swap arrangements
- **Messages**: Communication system between students

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon Database account)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hostelswap.git
   cd hostelswap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed initial data (optional)
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 🚀 Development

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── README.md
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open database studio
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Development Guidelines
- Follow TypeScript strict mode
- Use Shadcn/ui components for consistency
- Implement proper error handling
- Write meaningful commit messages
- Test API endpoints thoroughly

## 🔑 Test Accounts

For development and testing purposes:

| Student ID | Password | Name | Role |
|------------|----------|------|------|
| CS21B047 | password123 | Rahul Sharma | Student |
| CS21B023 | password123 | Amit Kumar | Student |
| CS21B089 | password123 | Priya Kashyap | Student |

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/students/me` - Get current user info

### Core Features
- `GET /api/swap-requests` - List swap requests
- `POST /api/swap-requests` - Create swap request
- `PUT /api/swap-requests/:id` - Update swap request
- `GET /api/students` - List students
- `GET /api/rooms` - List available rooms
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

## 🔧 Configuration

### Database Schema
The application uses Drizzle ORM with PostgreSQL. Schema definitions are in `shared/schema.ts`.

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment mode (development/production)
- `SESSION_SECRET` - Secret for session encryption (optional)

## 🚀 Deployment

### Replit Deployment
This project is optimized for Replit deployment:

1. Import the repository to Replit
2. Set environment variables in Replit Secrets
3. Run the project using the configured workflow

### Manual Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting platform
4. Ensure database is accessible from production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add proper JSDoc comments for functions
- Ensure responsive design for UI components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from Shadcn/ui
- Icons from Lucide React
- Database hosting by Neon
- Development platform by Replit

## 📞 Support

For support, email support@hostelswap.com or join our Discord community.

---

**Made with ❤️ for hostel students everywhere**
