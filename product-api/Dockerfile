FROM openjdk:17-alpine

WORKDIR /app

COPY target/*.jar app.jar

ENV PORT=10000

ENTRYPOINT ["java","-jar","/app/app.jar"]

EXPOSE 10000