
FROM node:18 AS build

# Install ping utility
RUN apt-get update && apt-get install -y  telnet iputils-ping

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install -g @angular/cli
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose port 4200
EXPOSE 4200

# Start the Angular application
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]

