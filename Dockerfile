# 1. Usamos una imagen liviana de Node.js v20
FROM node:20-alpine

# 2. Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos desde el lockfile para tener una instalación reproducible
RUN npm ci

# 5. Copiamos el código de la API
COPY . .

# 6. Compilamos TypeScript a JavaScript en /dist
RUN npm run build

# 7. Exponemos el puerto usado por la API
ENV PORT=3000
EXPOSE 3000

# 8. Ejecutamos la versión compilada
CMD ["npm", "start"]
