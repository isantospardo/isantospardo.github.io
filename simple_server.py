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
    
    # Try to kill any existing process on port 8002
    os.system("pkill -f 'python3.*8002'")
    
    # Try different ports if 8002 is busy
    ports_to_try = [8002, 8003, 8004, 8005, 8006]
    httpd = None
    
    for port in ports_to_try:
        try:
            print(f"Trying port {port}...")
            httpd = socketserver.TCPServer(("", port), SimpleLanguageHandler)
            PORT = port
            print(f"Successfully bound to port {port}")
            break
        except OSError as e:
            if e.errno == 98:  # Address already in use
                print(f"Port {port} is already in use, trying next port...")
                continue
            else:
                raise e
    
    if httpd is None:
        print("Could not find an available port. Please check for running servers.")
        exit(1)
    
    with httpd:
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
