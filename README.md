# VetGo
Estagio Supervisionado
# Atualizando seu repositório local
O código produzido em sala de aula, e compartilhado neste repositório, pode ser atualizado em seu repositório local com o comando:

git pull

No entanto, se você fez alterações no seu repositório local, o comando acima pode gerar conflitos. Para evitar lidar com isso, você pode forçar uma atualização com o repositório remoto por meio dos comandos:

git fetch origin

git reset --hard origin/main

O primeiro comando recebe as atualizações mais recentes do repositório remoto, e o segundo descarta todas as alterações locais e atualizações com o histórico mais recente do repositório remoto (branch main).

# Como iniciar a aplicação
# Back-end
Um aplicativo back-end pode ser iniciado pelo Spring Boot Dashboard ou com o Maven.

No Spring Boot Dashboard, clique em “Run” na aplicação “vetgoapi”.

Se optar pelo Maven, sem prompt de comandos, a partir do diretório ./vetgoapi:

um. Para iniciar a aplicação com o Maven:

mvn spring-boot:run
Ou

b. Para compilar o pacote e depois executar o JAR gerado:

mvn package
java -jar target\sgcmapi.jar
A aplicação vai iniciar no endereço https://localhost:9000/ , com acesso local à base de dados MySQL, por meio da porta padrão 3306, além de usuário e senha "root".

# Front-end
As dependências do projeto não são compartilhadas no repositório. Para instalar as dependências, a partir do diretório ./vetgoapp, sem prompt de comandos, digite:

npm install

Para iniciar o aplicativo, a partir do diretório ./vetgoapp, execute o comando:

##ng serve

A aplicação vai iniciar no endereço http://localhost:4200 .

