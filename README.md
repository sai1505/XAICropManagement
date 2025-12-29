# XCropAI 🌱

XCropAI is an AI-powered crop analysis and assistance platform designed to help users assess plant health using image-based analysis, ML insights, and actionable recommendations. The system combines a modern web client, a scalable backend, and Python-based ML services to deliver real-time diagnostics and analytics.

---

## ✨ Features

* 🌿 **Plant Health Analysis** using uploaded images
* 🔍 **Infection & Stress Detection** (early/mid/late stages)
* 📊 **Analytics Dashboard** with visual insights
* 🧠 **LLM-based Explanations** for easy understanding
* ☁️ **Cloud Storage & Auth** via Supabase
* 🧪 **Thermal / Enhanced Image Support**
* 🔐 **Secure Authentication** and role-based access
* ⚡ Fast, scalable API with FastAPI

---

## 🧱 Tech Stack

### Frontend (Client)

* **React.js**
* **Tailwind CSS**
* **Framer Motion** (animations)
* **ECharts / Charts** (visualization)

### Backend (Server)

* **FastAPI (Python)**
* **Uvicorn** (ASGI server)
* **PostgreSQL** (via Supabase)

### AI / ML

* **Python**
* **NumPy, OpenCV, SciPy**
* **Groq API** (LLM inference)

### Cloud & Auth

* **Supabase** (Auth, PostgreSQL, Storage)

---

## 📁 Project Structure

```
XCropAI/
│
├── client/             # React frontend application
│ ├── src/              # UI components, pages, logic
│ ├── public/           # Static assets
│ ├── .env              # Client-side environment variables
│ └── package.json      # Frontend dependencies & scripts
│
├── XCropAIService/     # FastAPI + ML backend
│ ├── api/              # API route definitions
│ ├── core/             # Core configs, settings, constants
│ ├── services/         # Business logic & ML services
│ ├── outputs/          # Generated outputs (reports/images)
│ ├── venv/             # Python virtual environment (git-ignored)
│ ├── .env              # Server-side environment variables
│ ├── main.py           # FastAPI app entry point
│ ├── run.py            # Custom runner / startup script
│ └── requirements.txt  # Python dependencies
│
└── README.md           # Project documentation
```

---

## 🔐 Environment Variables Setup

### Client (`client/.env`)

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Server (`XCropAIService/.env`)

```
GROQ_API_KEY=your_groq_api_key
```

> ⚠️ Never commit `.env` files to GitHub

---

## 🐍 Python Virtual Environment (Backend)

### Windows

```
python -m venv venv                # Create
venv\Scripts\activate              # Activate
pip install -r requirements.txt
```

### Linux / macOS

```
python3 -m venv venv               # Create
source venv/bin/activate           # Activate
pip install -r requirements.txt
```
---

## 🚀 Running the Project

### Frontend

```
cd client
npm install
npm run dev
```

### Backend

```
cd XCropAIService
(create virtual environment) ( # Create )
(activate virtual environment) ( # Activate )
python run.py
```

---

## 🗄️ Supabase Setup

* Create a project in Supabase
* Enable **Email/Auth Provider (Google)**
* Use **PostgreSQL** as the primary DB
* Set up **Storage Buckets** for images

📘 Official Docs:

* [https://supabase.com/docs](https://supabase.com/docs)
* [https://supabase.com/docs/guides/database/overview](https://supabase.com/docs/guides/database/overview)

---

## 📚 References

* React: [https://react.dev](https://react.dev)
* FastAPI: [https://fastapi.tiangolo.com](https://fastapi.tiangolo.com)
* Python: [https://docs.python.org/3/](https://docs.python.org/3/)
* Groq: [https://console.groq.com/docs](https://console.groq.com/docs)
* Supabase: [https://supabase.com/docs](https://supabase.com/docs)
* Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 🧩 Common Pitfalls / Notes

* Ensure correct **CORS** setup in FastAPI
* Match client API base URL with backend port
* Activate Python `venv` before running the server.
* Check Supabase RLS policies if data access fails

---

## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

**XCROP-A** – AI-driven agriculture, simplified 🌾
