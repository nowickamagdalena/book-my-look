FROM maven:3.8.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY pom.xml pom.xml

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -Dspring.profiles.active=prod -Dmaven.test.skip=true

FROM builder

WORKDIR /app

COPY --from=builder /app/target/*.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
