#!/usr/bin/env python3
"""Serve this directory over HTTPS with a self-signed cert (needed for camera/mic access from LAN devices)."""
import http.server
import ssl
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8090
CERT_DIR = Path(__file__).parent / "certs"

http.server.SimpleHTTPRequestHandler.extensions_map['.css'] = 'text/css'
httpd = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), http.server.SimpleHTTPRequestHandler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(certfile=CERT_DIR / "cert.pem", keyfile=CERT_DIR / "key.pem")
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)

print(f"Serving HTTPS on 0.0.0.0:{PORT}")
httpd.serve_forever()
