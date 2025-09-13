#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

class LanguageHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Check if it's a language route
        if path.startswith('/en') or path.startswith('/es') or path.startswith('/gl') or path.startswith('/fr'):
            # Serve the main index.html file
            self.path = '/index.html'
            return super().do_GET()
        
        # For root path, serve index.html
        if path == '/':
            self.path = '/index.html'
            return super().do_GET()
        
        # For all other paths, try to serve the file normally
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8000
    
    # Kill any existing process on port 8000
    os.system("pkill -f 'python3 -m http.server'")
    
    with socketserver.TCPServer(("", PORT), LanguageHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"Language routes:")
        print(f"  English: http://localhost:{PORT}/en")
        print(f"  Spanish: http://localhost:{PORT}/es") 
        print(f"  Galician: http://localhost:{PORT}/gl")
        print(f"  French: http://localhost:{PORT}/fr")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
