# Conference Call Bio Service

A web application that streamlines virtual meeting introductions by automatically sharing participant bios ahead of time. Built with Node.js, Express, PostgreSQL, and React.

## Features

- **User Registration & Authentication** - Email-based signup with JWT tokens
- **Bio Management** - Create and edit professional bios with profile photos
- **Public Bio Pages** - Shareable URLs for professional profiles
- **API Integration** - Lookup bios by email addresses for meeting platforms
- **Privacy First** - Email addresses stay private while enabling platform queries
- **Fast Performance** - API responses under 300ms for up to 100 users
- **Mobile Responsive** - Works on all devices

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)

### Production Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd cc-bio
```

2. Update environment variables in `.env`:
```bash
# Change the JWT secret for production
JWT_SECRET=your-secure-production-secret

# Update email configuration if needed
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

3. Start with Docker Compose:
```bash
docker-compose up -d
```

4. Run database migrations:
```bash
docker-compose exec web npm run migrate
```

5. Access the application at `http://localhost:3000`

### Development Setup

1. Install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

2. Start PostgreSQL (using Docker):
```bash
docker run --name bio-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=bios -p 5432:5432 -d postgres:14
```

3. Run database migrations:
```bash
npm run migrate
```

4. Start development servers:
```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:3000`
- Frontend development server on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/verify` - Verify JWT token

### Bio Management
- `GET /bios/my-bio` - Get current user's bio
- `POST /bios/my-bio` - Create/update bio (supports file upload)
- `GET /bios/:userId` - Get public bio by user ID

### Public API
- `POST /api/bios/lookup` - Lookup bios by email addresses
- `GET /api/bio/:userId` - Public HTML bio page

### Example API Usage

Lookup bios by email addresses:
```bash
curl -X POST http://localhost:3000/api/bios/lookup \
  -H "Content-Type: application/json" \
  -d '{"emails": ["user@example.com", "colleague@company.com"]}'
```

Response:
```json
{
  "lookup": {
    "user@example.com": {
      "bio_url": "http://localhost:3000/bio/123e4567-e89b-12d3-a456-426614174000",
      "has_bio": true
    },
    "colleague@company.com": {
      "bio_url": null,
      "has_bio": false
    }
  },
  "total_requested": 2,
  "total_found": 1
}
```

## Project Structure

```
cc-bio/
├── server/                 # Backend Node.js application
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication middleware
│   ├── db/               # Database connection and helpers
│   ├── migrations/       # Database schema and migrations
│   └── index.js          # Express server entry point
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React context providers
│   │   └── globals.css   # Tailwind CSS styles
│   ├── package.json
│   └── vite.config.js
├── uploads/              # User uploaded files (profile photos)
├── docker-compose.yml    # Docker services configuration
├── Dockerfile           # Application container build
└── package.json         # Root package configuration
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- File upload validation and size limits
- CORS protection
- Helmet security headers
- SQL injection protection with parameterized queries

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `DATABASE_URL` | PostgreSQL connection string | postgres://user:pass@localhost:5432/bios |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `MAX_FILE_SIZE` | Max upload file size in bytes | 5242880 (5MB) |
| `EMAIL_HOST` | SMTP host for emails | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | SMTP username | |
| `EMAIL_PASS` | SMTP password | |

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts with email and hashed passwords
- `bios` - Professional bio information linked to users

See `server/migrations/init.sql` for the complete schema.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details.