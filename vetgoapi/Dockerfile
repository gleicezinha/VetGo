# Use a imagem do Maven para build
FROM maven:3.9.3-eclipse-temurin-20 AS build

# Defina o diretório de trabalho
WORKDIR /home/app

# Copie os arquivos do projeto
COPY . .

# Limpa dependências locais do Maven
RUN mvn dependency:purge-local-repository -DreResolve=true

# Build do projeto
RUN mvn clean install -DskipTests

# Segunda fase: apenas a aplicação pronta
FROM eclipse-temurin:20-jre-alpine

WORKDIR /home/app

# Copie o jar gerado do build
COPY --from=build /home/app/target/*.jar app.jar

# Expõe a porta que a aplicação vai rodar
EXPOSE 9000

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]