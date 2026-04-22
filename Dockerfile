# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml ./

# Install dependencies using frozen lockfile for deterministic builds
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN pnpm run build

# Stage 2: Serve the static files with a minimal Nginx image
FROM nginx:alpine-slim

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add a custom Nginx configuration to support SPA (Single Page Application) routing
# This ensures that deep links (e.g., /admin-dashboard) redirect to index.html
RUN echo $'\
server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]