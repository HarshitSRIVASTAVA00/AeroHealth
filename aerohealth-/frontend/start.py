#!/usr/bin/env python3
"""
AeroHealth Ultimate Advanced - Frontend Development Server
Enhanced with 3D Globe, Ultra AI, 500+ Cities, Health Intelligence
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 5173
HOST = "localhost"

class EnhancedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Enhanced logging with emoji indicators
        if "GET" in args[0]:
            emoji = "📄" if ".html" in args[0] else "🎨" if any(ext in args[0] for ext in [".css", ".js"]) else "📊" if ".json" in args[0] else "📁"
        else:
            emoji = "🔄"

        print(f"{emoji} {format % args}")

def main():
    """Start the enhanced development server"""

    # Change to the frontend directory
    frontend_dir = Path(__file__).parent
    os.chdir(frontend_dir)

    print("🚀 Starting AeroHealth Ultimate Advanced Development Server...")
    print("="*80)
    print("🌌 ULTIMATE ADVANCED FEATURES:")
    print("  🌍 3D NASA Globe - Interactive Earth with satellite tracking")
    print("  🧠 Ultra AI - 500+ cities intelligence with comparisons") 
    print("  🔮 Prediction Engine - 7-day forecasts for any Indian city")
    print("  💚 Health Intelligence - Personalized recommendations")
    print("  🛰️ Enhanced Space Interface - Professional cosmic design")
    print("="*80)

    try:
        with socketserver.TCPServer((HOST, PORT), EnhancedHTTPRequestHandler) as httpd:
            server_url = f"http://{HOST}:{PORT}"

            print(f"🌐 Server running at: {server_url}")
            print(f"📁 Serving from: {frontend_dir}")
            print()
            print("🎯 QUICK ACCESS:")
            print(f"  🏠 Main App: {server_url}/index.html")
            print(f"  📚 Files: {server_url}/")
            print()
            print("🧠 AI EXAMPLES TO TRY:")
            print('  "Compare Delhi vs Mumbai air quality"')
            print('  "7-day forecast for Bangalore"') 
            print('  "Cleanest cities in India"')
            print('  "NASA satellites monitoring Chennai"')
            print('  "Health advice for asthma patients"')
            print()
            print("🌟 ADVANCED FEATURES:")
            print("  🌍 Click 'Activate 3D Globe' for interactive Earth")
            print("  🔮 Click '500+ Cities Grid' for prediction engine")
            print("  💚 Click 'Personalize Health' for custom recommendations")
            print()
            print("⚡ PERFORMANCE OPTIMIZED:")
            print("  📱 Mobile-first responsive design")
            print("  🎨 Hardware-accelerated animations") 
            print("  🚀 Lazy-loaded advanced features")
            print("  🔄 Intelligent caching and preloading")
            print()
            print("🛑 Press Ctrl+C to stop the server")
            print("="*80)

            # Auto-open browser
            try:
                webbrowser.open(f"{server_url}/index.html")
                print(f"🚀 Opening {server_url}/index.html in your browser...")
            except Exception as e:
                print(f"⚠️  Could not auto-open browser: {e}")
                print(f"🌐 Manually open: {server_url}/index.html")

            # Start server
            httpd.serve_forever()

    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use!")
            print("💡 Solutions:")
            print(f"  1. Kill the process using port {PORT}")
            print(f"  2. Use a different port: python start.py --port 3000")
            print(f"  3. Wait a moment and try again")
        else:
            print(f"❌ Server error: {e}")
        sys.exit(1)

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        print("👋 Thanks for using AeroHealth Ultimate Advanced!")
        sys.exit(0)

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
