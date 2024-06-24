FROM openjdk:17-jdk-slim

# Install curl, telnet, and iputils-ping
RUN apt-get update \
    && apt-get install -y curl telnet iputils-ping \
    && rm -rf /var/lib/apt/lists/*

# Expose port 8080 (assuming your StockService listens on this port)
EXPOSE 8080

# Add your application JAR file
ADD target/StockService-1.0.jar StockService-1.0.jar

# Set the entry point to run your application
ENTRYPOINT ["java", "-jar", "StockService-1.0.jar"]
