FROM eclipse-temurin:21-jdk-jammy AS build

LABEL maintainer="Ádám Jakab"

RUN apt-get update
RUN apt-get install build-essential -y

WORKDIR /temp

COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY types.d.ts .
COPY vite.config.ts .
COPY lombok.config .

ADD frontend frontend
ADD src src

RUN ./mvnw clean package -Pproduction

FROM eclipse-temurin:21-jdk-jammy

WORKDIR /usr/src/application

COPY --from=build /temp/target/*.jar application.jar

RUN useradd -s /bin/bash spring
RUN chown -R spring .

USER spring

ENTRYPOINT ["/bin/bash", "-c", "java -jar application.jar"]
