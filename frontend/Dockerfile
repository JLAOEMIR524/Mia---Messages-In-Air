# --- Build-Stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# WICHTIG: Vite backt VITE_*-Variablen zur BUILD-Zeit fest ein,
# nicht zur Laufzeit. Die Backend-URL muss also hier rein.
ARG VITE_API_URL=https://api.mia.jlaoemir.at
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Serve-Stage ---
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]