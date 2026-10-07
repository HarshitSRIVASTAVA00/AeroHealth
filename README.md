#AeroHealth Ultimate Advanced
Demo link :  https://harshitsrivastava00.github.io/AeroHealth/
🌌 Space-Grade Air Quality Intelligence & 3D Planetary Monitoring Platform
AeroHealth Ultimate Advanced is a cutting-edge web application that bridges NASA satellite telemetry (MODIS Terra/Aqua, Landsat 8/9, ISS) with localized environmental intelligence across 500+ Indian cities. Powered by an advanced frontend AI engine and interactive 3D visualizations, it transforms complex atmospheric data into actionable health insights.

🚀 Key Features
🌍 3D NASA Globe (NASAGlobe3D): An interactive Three.js planetary visualization featuring realistic earth textures, atmospheric scattering, orbit rings, and real-time tracking of satellite constellations with clickable metadata.

🧠 Ultra-Powerful AI Assistant (UltraPowerfulAI): A client-side natural language processing engine equipped with fuzzy matching, city aliases, and intent routing to answer complex queries, compare cities, and explain NASA science.

🔮 500+ Cities Prediction Engine (CityPredictionEngine): A responsive multi-tier filtering grid (Search, Region, Tier) capable of generating 7-day predictive air quality forecasts.

💚 Personalized Health Intelligence (HealthProfileManager): Biometric profile customization (age, respiratory conditions like asthma/COPD, activity levels) stored securely in localStorage to deliver tailored exposure warnings.

🛰️ Space-Grade Cosmic UI: A high-performance dark-mode interface featuring glassmorphism, glowing gradients (--aurora-cyan, --solar-gold), and hardware-accelerated animations.

🛠️ Project Structure
Plaintext
aerohealth-ultimate/
│
├── index.html                  # Main application markup & UI layout
├── globe.js                    # Three.js 3D NASA Globe class & shaders
├── prediction-engine.js        # 500+ Cities filtering & 7-day forecast generator
├── ultra-ai.js                 # NLP query router, NASA knowledge base & health profiles
├── data.js                     # INDIAN_CITIES_500 array & REGIONAL_DATA mapping
├── start.py                    # Python development server with CORS & emoji logging
└── README.md                   # Project documentation
⚙️ Installation & Running the Server
Make sure you have Python 3 installed on your system. No external pip packages are required as it uses Python's built-in standard library modules (http.server, socketserver).

Open your terminal in the project directory.

Run the development server script:

Bash
python start.py
The server will automatically start at http://localhost:5173 and pop open your default browser to index.html.

🧠 Example AI Queries to Try
Once the app is running, use the AI assistant or search bar to test queries like:

"Compare Delhi vs Mumbai air quality"

"7-day forecast for Bangalore"

"Top 10 cleanest cities in India"

"How does NASA's MODIS satellite monitor aerosol optical depth (AOD)?"

"Personalized health advice for asthma patients in Kolkata"

⚡ Tech Stack
Frontend: Vanilla ES6+ JavaScript, HTML5, CSS3 (Custom Glassmorphism Design System)

3D Rendering: Three.js (r128) & OrbitControls

Server: Python http.server with custom CORS injection & logging

Data Storage: Client-side localStorage for user health profiles
