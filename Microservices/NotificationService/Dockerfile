FROM openjdk:17-jdk-slim

# Install curl, telnet, and iputils-ping
RUN apt-get update \
    && apt-get install -y curl telnet iputils-ping \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8084

# Add your application JAR file
ADD target/NotificationService-1.0.jar NotificationService-1.0.jar

# Set the entry point to run your application
ENTRYPOINT ["java", "-jar", "NotificationService-1.0.jar"]
