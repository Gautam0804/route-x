RiskForge — Real-Time AI Fraud Detection & Risk Intelligence Platform
A production-oriented full-stack platform for transaction monitoring, risk scoring, fraud alerts, analyst investigations, and AI-assisted risk intelligence.

RiskForge is a full-stack risk intelligence platform designed to simulate how modern financial-risk systems can monitor transactions, identify suspicious activity, prioritize alerts, and support analyst-driven investigations.
The platform combines a React frontend, Node.js/Express API, PostgreSQL, Redis, and a separate Python/FastAPI ML service.
The goal of RiskForge is to demonstrate secure backend engineering, service separation, database design, ML integration, analyst workflows, and production-oriented system architecture.
🚀 Core Capabilities
🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Active/inactive account validation
- Token versioning and session invalidation
- Secure password change flow
📊 Risk Intelligence Dashboard
- Overall transaction monitoring
- Risk distribution
- Fraud-risk statistics
- Alert summaries
- Investigation metrics
- Recent suspicious activity
- Risk trend visualization
💳 Transaction Monitoring
- Transaction listing
- Transaction filtering
- Risk classification
- Suspicious transaction identification
- Transaction-level risk information
- Historical transaction analysis
🚨 Alert Center
- Risk-based alert generation
- Alert prioritization
- Severity classification
- Alert status tracking
- Analyst-focused alert workflow
🔎 Investigation Management
- Investigation listing
- Investigation status management
- Analyst investigation workflow
- Suspicious activity review
- Investigation lifecycle tracking
🤖 AI Investigator
- AI-assisted transaction investigation
- Risk-oriented analysis
- ML service integration
- Suspicious behavior insights
- Analyst decision support
📈 Analytics
- Transaction analytics
- Risk distribution
- Fraud-risk trends
- Operational metrics
- Dashboard visualizations
⚙️ Settings & Administration
- User account management
- Password management
- Security configuration
- Application settings
🏗️ System Architecture
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │   JavaScript + Vite  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js / Express  │
                    │      API Server      │
                    └──────┬─────────┬─────┘
                           │         │
                 ┌─────────┘         └──────────┐
                 ▼                              ▼
        ┌─────────────────┐            ┌─────────────────┐
        │   PostgreSQL    │            │      Redis      │
        │ Primary Database│            │ Cache / Runtime │
        └─────────────────┘            └─────────────────┘
                           │
                           │ ML Requests
                           ▼
                 ┌──────────────────────┐
                 │  Python / FastAPI    │
                 │     ML Service       │
                 │ Scikit-learn / Data │
                 └──────────────────────┘

Service Responsibilities
Service	Responsibility
React	Dashboard, authentication UI, transactions, alerts, investigations, analytics
Node.js / Express	REST APIs, authentication, authorization, business logic
PostgreSQL	Users, transactions, alerts, investigations, risk information
Redis	Caching, temporary runtime data, rate limiting infrastructure
Python / FastAPI	ML inference and risk analysis


🔄 Transaction Analysis Flow
Transaction
     │
     ▼
Node.js API
     │
     ├── Validate Request
     │
     ├── Apply Business Rules
     │
     └── Request ML Analysis
              │
              ▼
       Python ML Service
              │
              ▼
       Risk / Prediction
              │
              ▼
       Store Risk Data
              │
              ▼
        Generate Alert
              │
              ▼
       Analyst Dashboard

🎯 Risk Scoring
RiskForge currently classifies transaction risk using the following ranges:
Score	Classification
0–69	LOW / MEDIUM
70–89	HIGH
90–100	CRITICAL


Potential risk signals include:
- Transaction amount
- Transaction behavior
- Location
- Transaction type
- Historical patterns
- Anomalous activity
- Model-generated fraud probability
ML Disclaimer: RiskForge is currently a portfolio/development project. Its ML outputs should not be interpreted as a validated real-world financial fraud detection model. Production deployment would require representative data, rigorous model evaluation, calibration, monitoring, domain validation, and appropriate compliance controls.

🔐 Security
Security is treated as a core part of the architecture.
Implemented security mechanisms include:
- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- Protected API routes
- Token versioning
- Session invalidation after password changes
- Active account validation
- Helmet security headers
- CORS configuration
- API rate limiting
- Input validation
- Environment-based configuration
- No hardcoded production secrets
Secret Management
Sensitive configuration should be stored in environment variables.
DATABASE_URL=
JWT_SECRET=
REDIS_URL=
ML_SERVICE_URL=
CORS_ORIGINS=

Never commit real credentials, API keys, database passwords, or JWT secrets to GitHub.
🗄️ Database
RiskForge uses PostgreSQL as its primary relational database.
The database manages core entities such as:
- Users
- Transactions
- Alerts
- Investigations
- Risk information
- Authentication state
PostgreSQL provides structured relational storage for the platform's transactional and analytical workflows.
⚡ Redis
Redis is used as supporting runtime infrastructure for:
- Caching
- Temporary risk-related information
- Rate limiting
- Session-related infrastructure
- Future event-processing capabilities
🧠 AI / Machine Learning
The ML layer is implemented as a separate Python/FastAPI service.
Technologies
- Python
- FastAPI
- scikit-learn
- Pandas
- NumPy
The separation between the Node.js backend and Python ML service allows the ML layer to evolve independently from the core application API.
🛠️ Tech Stack
Frontend
- React
- JavaScript
- Vite
- React Router
- Axios
- Lucide React
- CSS
Backend
- Node.js
- Express.js
- PostgreSQL
- Redis
- JWT
- bcrypt
- Helmet
- CORS
- Express Rate Limit
- Morgan
Machine Learning
- Python
- FastAPI
- scikit-learn
- Pandas
- NumPy
Infrastructure
- Docker
- Docker Compose
- PostgreSQL
- Redis
📁 Project Structure
RiskForge/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── alerts/
│       │   ├── analytics/
│       │   ├── common/
│       │   ├── dashboard/
│       │   └── investigations/
│       │
│       ├── context/
│       ├── hooks/
│       │
│       ├── pages/
│       │   ├── alerts/
│       │   ├── analytics/
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── investigations/
│       │   ├── settings/
│       │   └── transactions/
│       │
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── db/
│       │   ├── migrations/
│       │   └── seed.js
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
├── ml-service/
│   ├── main.py
│   └── requirements.txt
│
├── docker/
│   └── docker-compose.yml
│
└── README.md

⚙️ Environment Configuration
Backend
Create:
server/.env

Example:
NODE_ENV=development
PORT=5000

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5433/riskforge

JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=1d

REDIS_URL=redis://localhost:6379

ML_SERVICE_URL=http://localhost:8000

CORS_ORIGINS=http://localhost:5173

Frontend
Create:
client/.env

Example:
VITE_API_URL=http://localhost:5000/api

Use your own secure credentials and environment-specific configuration.
🚀 Local Development
1. Clone the Repository
git clone <YOUR_REPOSITORY_URL>
cd RiskForge

2. Start PostgreSQL and Redis
docker compose -f docker/docker-compose.yml up -d

Verify the containers:
docker ps

3. Start the Backend
cd server
npm install

Seed the database:
node src/db/seed.js

Start the development server:
npm run dev

Backend:
http://localhost:5000

4. Start the ML Service
Open another terminal:
cd ml-service

Create a virtual environment:
python -m venv venv

Activate it on Windows:
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Start FastAPI:
uvicorn main:app --reload --port 8000

ML service:
http://localhost:8000

5. Start the Frontend
Open another terminal:
cd client
npm install
npm run dev

Frontend:
http://localhost:5173

🔌 API Overview
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PATCH /api/auth/change-password

Transactions
GET /api/transactions

Alerts
GET /api/alerts

Dashboard
GET /api/dashboard

Analytics
GET /api/analytics

Investigations
GET   /api/investigations
PATCH /api/investigations/:id/status

AI Investigator
POST /api/ai-investigator

Health
GET /api/health

🧪 Testing Strategy
RiskForge is structured to support testing across multiple layers.
Frontend
- Component testing
- Integration testing
- Authentication flow testing
- Dashboard workflow testing
Backend
- Unit testing
- API testing
- Authentication testing
- Authorization testing
- Validation testing
ML Service
- Prediction validation
- API endpoint testing
- Input validation
- Model behavior testing
🗺️ Roadmap
Future improvements include:
- [ ] Real-time transaction streaming
- [ ] WebSocket-based live alerts
- [ ] Kafka event processing
- [ ] Explainable AI / model explanations
- [ ] Automated model retraining
- [ ] Feature store
- [ ] Model monitoring
- [ ] Model drift detection
- [ ] Automated case management
- [ ] SIEM integrations
- [ ] Notification system
- [ ] Multi-tenant architecture
- [ ] CI/CD pipeline
- [ ] Cloud-native deployment
- [ ] Advanced anomaly detection
- [ ] Real-world dataset evaluation
- [ ] Improved model calibration
🎯 Engineering Focus
RiskForge focuses on demonstrating practical software engineering rather than building a simple CRUD application.
Key engineering areas include:
- Full-stack system architecture
- REST API design
- Authentication and authorization
- Role-based access control
- Relational database design
- Redis integration
- Microservice-oriented architecture
- ML service integration
- Security fundamentals
- API validation
- Rate limiting
- Docker-based development
- Analyst-oriented workflows
- Scalable project structure
- Separation of responsibilities
📌 Project Status
Active Development
RiskForge is being developed as a portfolio project focused on demonstrating production-oriented full-stack engineering, backend architecture, security, data systems, and AI/ML integration.
🔮 Vision
The long-term goal of RiskForge is to evolve into a realistic risk intelligence platform capable of supporting:
Transaction Ingestion
        ↓
Risk Analysis
        ↓
ML Prediction
        ↓
Alert Generation
        ↓
Investigation
        ↓
Analyst Decision
        ↓
Continuous Monitoring

The project is designed to demonstrate how modern financial-risk systems can combine software engineering, data infrastructure, machine learning, and security into one cohesive platform.
👨‍💻 Author
Gautam Yadav
Software Engineer | Full-Stack Development | Java | DSA | AI/ML
📄 License
This project is intended for educational, portfolio, and demonstration purposes.
Built with code, curiosity & chai ☕
