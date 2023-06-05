# Use a Maven image to build the application
FROM maven:3.8.6-eclipse-temurin-17-alpine AS builder

# Set working directory
WORKDIR /app

# Copy the pom.xml file to the container
COPY pom.xml pom.xml

# Download the project dependencies and cache them in the Docker image
RUN mvn dependency:go-offline

# Copy the application source code to the container
COPY src ./src

# Build the application with the prod profile
RUN mvn clean package -Dspring.profiles.active=prod -Dmaven.test.skip=true

# Use a JRE image to run the application
FROM builder

# Set working directory
WORKDIR /app

# Copy the application JAR file from the Maven image to the JRE image
COPY --from=builder /app/target/*.jar /app/app.jar

# Expose port 8080 for the container
EXPOSE 8080

# Start the Spring Boot application with the prod profile
CMD ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
