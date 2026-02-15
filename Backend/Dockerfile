FROM node:22

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Remove --omit=dev for your development environment
# This ensures nodemon is installed
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 3000

# This is the default, but docker-compose will override 
# this with nodemon when you run in dev mode
CMD ["npm", "start"]