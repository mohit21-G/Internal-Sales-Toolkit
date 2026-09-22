# Internal Sales Toolkit

A modern, production-grade Revenue & Sales Operations Dashboard with Next.js 15 frontend and FastAPI AI backend.

---

## 📁 Project Architecture & Folder Structure

The project is cleanly separated into two independent folders:

```text
Internal sales toolkit/
├── frontend/                          # 🌐 Client-side Next.js Application
│   ├── src/
│   │   ├── app/                      # App Router (Dashboard, Leads, Deals, Resources, etc.)
│   │   ├── components/               # shadcn/ui & custom UI components
│   │   ├── context/                  # sales-store React context
│   │   ├── services/                 # Centralized api.ts service with types
│   │   └── lib/                      # Mock data, constants & utilities
│   ├── public/                       # Static public assets
│   ├── .env.local                    # NEXT_PUBLIC_API_URL & NEXT_PUBLIC_API_KEY
│   ├── package.json                  # Frontend dependencies & scripts
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.ts            # Tailwind CSS configuration
│   └── next.config.ts                # Next.js configuration
│
├── backend/                           # ⚙️ Server-side FastAPI Application
│   ├── api/                          # API routers (v1 endpoints)
│   ├── core/                         # Auth middleware, config, security
│   ├── schemas/                      # Pydantic data validation models
│   ├── services/                     # Groq LLM client & AI email engine
│   ├── tests/                        # Pytest automated API test cases
│   ├── main.py                       # FastAPI application entry point
│   ├── requirements.txt              # Python package dependencies
│   ├── .env                          # Backend environment variables & API keys
│   └── Dockerfile                    # Containerization setup
│
├── package.json                       # Monorepo root scripts
└── README.md                          # Project documentation
```

---

## 🛠️ Frontend Tech Stack

|| Technology / Library | Role and Usage |
|| :--- | :--- |
|| **Next.js 15 (App Router)** | React 19 based full-stack web framework with Turbopack and high-performance file-based routing. |
|| **TypeScript** | Type-safe coding and data models (Leads, Deals, Proposals, Customers, Email requests). |
|| **Tailwind CSS** | Utility-first CSS framework for modern, responsive, and custom SaaS dashboard design. |
|| **shadcn/ui + Radix UI** | Accessible and premium UI components (Dialog, Tabs, DropdownMenu, Popover, Card, Badge, Tooltip). |
|| **Lucide React** | Clean and modern SVG icons. |
|| **Recharts** | Interactive revenue charts, pipeline stage visualization, and sales analytics. |
|| **Sonner** | Modern and smooth toast notifications (on adding Leads, changing Deals, copying Emails). |
|| **next-themes** | Easy switching between Dark Mode and Light Mode with local storage preservation. |
|| **React Context API (`sales-store.tsx`)** | Global state management - to handle backend connectivity status and CRM data. |
|| **Fetch API + Custom Service (`api.ts`)** | Secure connection with backend using `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_KEY`. |

---

## ⚙️ Backend Tech Stack

|| Technology / Library | Role and Usage |
|| :--- | :--- |
|| **FastAPI** | Python based extremely fast and modern web framework that provides automatic OpenAPI documentation. |
|| **Uvicorn** | High-performance ASGI web server that hosts and runs the FastAPI application. |
|| **Pydantic v2** | Strict validation and parsing of request and response data. |
|| **Groq SDK (`groq-python`)** | Ultra-fast AI LLM inference engine that generates customized sales outreach emails. |
|| **API Key Authentication** | Security of endpoints via `X-API-Key` header (to prevent unauthorized access). |
|| **CORSMiddleware** | To securely allow cross-origin requests with frontend (`http://localhost:3000`). |
|| **Pytest & HTTPX** | For automated unit and integration testing of backend endpoints. |
|| **Docker** | `Dockerfile` and `docker-compose.yml` for production containerization. |

---

## 🚀 How to Run the Project

### 1. Run Backend
```bash
cd backend
# Create virtual environment if needed
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Start backend server on port 8000
python -m uvicorn main:app --port 8000 --host 127.0.0.1 --reload
```
* Backend Health: `http://127.0.0.1:8000/api/v1/health`
* Backend API Docs: `http://127.0.0.1:8000/docs`

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
* Dashboard URL: `http://localhost:3000`

---

## 🧪 Build & Test Verification
```bash
# Build frontend
npm run build:frontend

# Run backend tests
cd backend && pytest
```
