FROM openjdk:17-jdk-alpine
COPY target/*.jar /app.jar
WORKDIR /
ENV TZ=Asia/Shanghai
ENTRYPOINT [ "java", "-jar", "app.jar" ]
