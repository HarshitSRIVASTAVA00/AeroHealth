# 🌌 AeroHealth

**[Live Demo](https://harshitsrivastava00.github.io/AeroHealth/)**

**Space-Grade Air Quality Intelligence & 3D Planetary Monitoring Platform**

AeroHealth Ultimate Advanced is a cutting-edge web application that bridges NASA satellite telemetry (MODIS Terra/Aqua, Landsat 8/9, ISS) with localized environmental intelligence across 500+ Indian cities. Powered by an advanced frontend AI engine and interactive 3D visualizations, it transforms complex atmospheric data into actionable health insights.

## 🚀 Key Features

*   **🌍 3D NASA Globe (NASAGlobe3D):** An interactive Three.js planetary visualization featuring realistic earth textures, atmospheric scattering, orbit rings, and real-time tracking of satellite constellations with clickable metadata.
*   **🧠 Ultra-Powerful AI Assistant (UltraPowerfulAI):** A client-side natural language processing engine equipped with fuzzy matching, city aliases, and intent routing to answer complex queries, compare cities, and explain NASA science.
*   **🔮 500+ Cities Prediction Engine (CityPredictionEngine):** A responsive multi-tier filtering grid (Search, Region, Tier) capable of generating 7-day predictive air quality forecasts.
*   **💚 Personalized Health Intelligence (HealthProfileManager):** Biometric profile customization (age, respiratory conditions like asthma/COPD, activity levels) stored securely in `localStorage` to deliver tailored exposure warnings.
*   **🛰️ Space-Grade Cosmic UI:** A high-performance dark-mode interface featuring glassmorphism, glowing gradients (`--aurora-cyan`, `--solar-gold`), and hardware-accelerated animations.

## 🛠️ Project Structure

```text
aerohealth-ultimate/
├── index.html           # Main application markup & UI layout
├── globe.js             # Three.js 3D NASA Globe class & shaders
├── prediction-engine.js # 500+ Cities filtering & 7-day forecast generator
├── ultra-ai.js          # NLP query router, NASA knowledge base & health profiles
├── data.js              # INDIAN_CITIES_500 array & REGIONAL_DATA mapping
├── start.py             # Python development server with CORS & emoji logging
└── README.md            # Project documentation
