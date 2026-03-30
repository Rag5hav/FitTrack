# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the jar file, skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render automatically uses PORT env variable, defaulting to 8080)
EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=render

# Command to run the application
ENTRYPOINT ["java","-jar","app.jar"]
