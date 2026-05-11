FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S ironman && adduser -S ironman -G ironman

COPY --from=build /app/target/*.jar /app/app.jar

RUN chown -R ironman:ironman /app

EXPOSE 8888

USER ironman

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
