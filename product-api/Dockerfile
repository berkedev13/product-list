FROM maven:3.9.2-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV PORT=10000

ENTRYPOINT ["java","-jar","/app/app.jar"]

EXPOSE 10000