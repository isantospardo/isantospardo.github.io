#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

class SimpleLanguageHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        print(f"Requested path: {path}")
        
        # Check if it's a language route (exact match or starts with)
        if path in ['/en', '/es', '/gl', '/fr'] or path.startswith('/en/') or path.startswith('/es/') or path.startswith('/gl/') or path.startswith('/fr/'):
            print(f"Language route detected: {path} -> serving index.html")
            # Serve the main index.html file
            self.path = '/index.html'
            return super().do_GET()
        
        # For root path, serve index.html
        if path == '/':
            print("Root path -> serving index.html")
            self.path = '/index.html'
            return super().do_GET()
        
        # For all other paths, try to serve the file normally
        print(f"Regular file request: {path}")
        return super().do_GET()

if __name__ == "__main__":
    PORT = 8002
    
    # Kill any existing process on port 8002
    os.system("pkill -f 'python3.*8002'")
    
    with socketserver.TCPServer(("", PORT), SimpleLanguageHandler) as httpd:
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
