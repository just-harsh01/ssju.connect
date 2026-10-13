#!/usr/bin/env python3
"""
Simple local development server for SSJU Connect.
Serves static files and prints your exact Phone URL.
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys

PORT = 3000

def get_phone_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    phone_ip = get_phone_ip()
    phone_url = f"http://{phone_ip}:{PORT}"
    local_url = f"http://localhost:{PORT}"

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print("  🎉 SSJU CONNECT IS LIVE!")
        print("=" * 60)
        print(f"  💻 On this PC:    {local_url}")
        print(f"  📱 ON YOUR PHONE:  {phone_url}")
        print("=" * 60)
        print("  (Make sure your phone is on the same Wi-Fi / Hotspot)")
        print("  Press Ctrl+C to stop.")
        print("=" * 60)
        try:
            webbrowser.open(local_url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == '__main__':
    run()
