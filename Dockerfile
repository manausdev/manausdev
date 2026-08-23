# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including devDependencies required for the build)
COPY package*.json ./
RUN npm ci

# Copy source and produce the static export
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runner

# Nginx config tuned for the Next.js static export (SPA-style routing)
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml;

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA-style fallback for client-side routes (e.g. /devs/[username])
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

# Copy the static export from the builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
