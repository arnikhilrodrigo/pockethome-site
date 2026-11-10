"""Dev server for the Pocket Home page, with caching switched off.

python -m http.server sends Last-Modified and answers conditional requests with
304, so browsers happily keep serving an old v2.css, v2.js or hero.jpg long
after the file on disk has changed. That cost us several rounds of "this looks
broken" when the file was in fact already correct.

This serves the same directory but tells the browser never to store anything,
so a plain refresh always shows the current build.

    python serve.py [port]        # default 5520
"""

import functools
import http.server
import socketserver
import sys
import os

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5520
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_header(self, keyword, value):
        # drop the validators that let a browser ask for, and get, a 304
        if keyword.lower() in ("last-modified", "etag"):
            return
        super().send_header(keyword, value)

    def _strip_validators(self):
        # send_head() answers 304 from If-Modified-Since before any of our
        # headers are written, so the request has to lose them first
        for h in ("If-Modified-Since", "If-None-Match"):
            if h in self.headers:
                del self.headers[h]

    def do_GET(self):
        self._strip_validators()
        super().do_GET()

    def do_HEAD(self):
        self._strip_validators()
        super().do_HEAD()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    handler = functools.partial(NoCacheHandler, directory=ROOT)
    with Server(("127.0.0.1", PORT), handler) as httpd:
        print(f"Pocket Home v2 (no-cache) -> http://localhost:{PORT}")
        print(f"serving {ROOT}")
        httpd.serve_forever()
