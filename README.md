# 🚀 LeadFlow — Mini CRM & Lead Management System

LeadFlow is a full-stack web application designed to help administrators manage customer leads through a centralized dashboard.

The application allows administrators to create, view, update, search, and delete leads while tracking their status, maintaining follow-up notes, and scheduling follow-up dates.

Built using **React, Node.js, Express.js, MongoDB, and Mongoose**, LeadFlow demonstrates practical full-stack web development, REST API integration, database operations, and JWT-based authentication.

---

## ✨ Features

### 📊 Dashboard

- View the total number of leads.
- Track leads by status.
- Monitor new, contacted, and qualified leads.
- Access lead management features from a centralized dashboard.
- Use a dark-themed interface designed for a professional CRM experience.

### 👥 Lead Management

- Add new leads.
- View existing lead records.
- Update lead information.
- Delete leads.
- Store lead names, email addresses, and company names.
- Add notes to maintain important lead information.
- Schedule follow-up dates.

### 🔄 Lead Status Tracking

Manage leads using the following statuses:

- **New** — Newly added leads.
- **Contacted** — Leads that have been contacted.
- **Qualified** — Leads identified as potential business opportunities.
- **Lost** — Leads that are no longer active opportunities.

### 🔎 Search and Filtering

- Search leads by name.
- Search by email address.
- Search by company name.
- Search notes.
- Filter leads by status.

### 📝 Follow-Up Management

- Add notes to lead records.
- Set follow-up dates.
- Keep relevant information organized for future communication.

### 🔐 Authentication and Security

- Admin login.
- JWT-based authentication.
- Protected lead management API endpoints.
- Environment variables for sensitive configuration.
- Authentication checks before accessing protected lead data.

### 📱 User Interface

- Professional dark dashboard.
- Sidebar navigation.
- Lead statistics cards.
- Lead management table.
- Add and edit lead forms.
- Responsive styling.

---

## 🛠️ Technologies Used

### Frontend

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| JavaScript | Application logic and interactivity |
| HTML5 | Application structure |
| CSS3 | Styling and layout |
| Vite | Frontend development server and build tool |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | Backend framework and REST API |
| Mongoose | MongoDB object modeling |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing and verification |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

### Database

**MongoDB**

MongoDB stores lead information, including:

- Name
- Email
- Company
- Lead status
- Notes
- Follow-up date
- Creation and update timestamps

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Node.js and npm
- MongoDB Atlas

---

## 🏗️ Application Architecture

LeadFlow follows a full-stack architecture in which the React frontend communicates with the Express backend through HTTP requests.

```text
                  ┌──────────────────────┐
                  │       Admin          │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    React Frontend    │
                  │   Dashboard & Forms  │
                  └──────────┬───────────┘
                             │
                      HTTP / REST API
                             │
                             ▼
                  ┌──────────────────────┐
                  │    Express.js API    │
                  │   JWT Authentication │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │       Mongoose       │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │       MongoDB        │
                  └──────────────────────┘
```

---

## 📁 Project Structure

```text
mini-crm/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── Lead.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── leads.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔄 How the System Works

### 1. Admin Login

The administrator logs in using the configured admin credentials.

The backend validates the credentials and issues a JWT for authenticated requests.

### 2. Dashboard

After successful login, the administrator can access the LeadFlow dashboard and view lead statistics.

### 3. Add Leads

The administrator can create lead records by entering details such as name, email, company, notes, and follow-up date.

### 4. View and Search Leads

Existing leads can be viewed in the dashboard and searched using relevant information.

### 5. Update Lead Information

The administrator can edit lead details and update the lead's status as the business relationship progresses.

### 6. Manage Follow-Ups

Notes and follow-up dates help keep lead information organized.

### 7. Delete Leads

The administrator can remove lead records that are no longer required.

### 8. Database Integration

The backend uses Mongoose to interact with MongoDB and persist lead information.

---

## 🔌 REST API

The backend exposes REST API endpoints for authentication and lead management.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate the administrator |

### Leads

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | Retrieve all leads |
| GET | `/api/leads/:id` | Retrieve a lead by ID |
| POST | `/api/leads` | Create a new lead |
| PUT | `/api/leads/:id` | Update an existing lead |
| DELETE | `/api/leads/:id` | Delete a lead |

**Note:** Lead endpoints require a valid authentication token.

---

## 🗄️ Database Model

### Lead

The Lead model stores information about individual leads.

```text
Lead
├── name
├── email
├── company
├── status
├── notes
├── followUpDate
├── createdAt
└── updatedAt
```

### Field Descriptions

| Field | Description |
|---|---|
| `name` | Lead's name |
| `email` | Lead's email address |
| `company` | Company associated with the lead |
| `status` | Current lead status |
| `notes` | Additional information about the lead |
| `followUpDate` | Scheduled follow-up date |
| `createdAt` | Record creation timestamp |
| `updatedAt` | Last update timestamp |

The lead status can be `New`, `Contacted`, `Qualified`, or `Lost`.

---

## ⚙️ Installation and Setup

Follow these steps to run LeadFlow locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm, included with Node.js
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/ayesha-siddiqa-codes/leadflow-mini-crm.git
```

Navigate to the project directory:

```bash
cd leadflow-mini-crm
```

### 2. Configure the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Replace the example values with your own configuration.

**Important security practices:**

- Never upload your `.env` file to GitHub.
- Never share your MongoDB connection string.
- Use a strong, unique JWT secret.
- Use a strong admin password.
- Do not use real production credentials in public examples.

The `.env` file is excluded from Git using `.gitignore`.

### 4. Start the Backend

From the `backend` directory, run:

```bash
node server.js
```

The backend should start at:

```text
http://localhost:5000
```

The server should connect to MongoDB successfully before database operations can work.

### 5. Configure the Frontend

Open a second terminal from the project root.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

### 6. Start the Frontend

Run:

```bash
npm run dev
```

Vite will display a local development URL, typically:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

### 7. Log In

Use the administrator credentials configured in the backend environment variables.

Keep the backend and frontend terminals running while using the local application.

---

## 🔐 Security Notes

LeadFlow includes authentication and protected lead API routes.

For safer deployment:

- Keep environment variables private.
- Use HTTPS in production.
- Use strong administrator credentials.
- Keep dependencies updated.
- Configure CORS to allow only trusted frontend origins.
- Protect database access with appropriate MongoDB permissions.
- Use secure token-handling practices.
- Never commit passwords, API secrets, or database credentials.

The local development configuration should be reviewed and adjusted before production deployment.

---

## 🚀 Future Enhancements

Possible improvements for future versions include:

- Lead assignment to team members.
- Lead activity history.
- Email reminders for follow-ups.
- Dashboard analytics and charts.
- CSV export and import.
- Pagination for large lead lists.
- Advanced filtering and sorting.
- Role-based access control.
- Automated tests.
- Improved accessibility.
- Production deployment with custom domains.
- Automated deployment workflows.

---

## 🎯 Project Goals

LeadFlow was developed to demonstrate practical skills in:

- Full-stack web development.
- React application development.
- Node.js and Express backend development.
- REST API implementation.
- MongoDB database integration.
- CRUD operations.
- JWT-based authentication.
- Protected API routes.
- Environment variable management.
- Frontend and backend integration.
- Git and GitHub workflows.

---

## 👩‍💻 Author

**Ayesha Siddiqa**

Full Stack Web Developer — Beginner

GitHub: [@ayesha-siddiqa-codes](https://github.com/ayesha-siddiqa-codes)

---

## 📄 License

This project was created for educational, learning, and portfolio purposes.

A specific open-source license has not yet been selected.
