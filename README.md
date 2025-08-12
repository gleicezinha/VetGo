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

# ferramentas
Código do Visual Studio

https://code.visualstudio.com/Download

Pacote de Extensão para Java (Extensão do VS Code)

https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack

Spring Boot Extension Pack (Extensão do VS Code)

https://marketplace.visualstudio.com/items?itemName=pivotal.vscode-boot-dev-pack

XML (Extensão do VS Code)

https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml

# Git

https://git-scm.com/downloads

JDK 17

Para verificar se o JDK está instalado e configurado corretamente, digite no prompt de comando:

javac -version

Se necessário, realize a instalação e configuração:

Link para download: https://download.oracle.com/java/17/archive/jdk-17.0.10_windows-x64_bin.msi

Crie uma variável de ambiente JAVA_HOME definida para o diretório de instalação do JDK. Exemplo: “C:\Arquivos de Programas\Java\jdk-17”.
Adicione “%JAVA_HOME%\bin” na variável de ambiente PATH.

Tutorial de configuração: https://mkyong.com/java/how-to-set-java_home-on-windows-10/

# Especialista

Para verificar se o Maven está instalado e configurado corretamente, digite no prompt de comando:

mvn -version
Se necessário, realize a instalação e configuração:

Link para download: https://dlcdn.apache.org/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.zip
Adicione o diretório de instalação do Maven na variável de ambiente PATH. Exemplo: “C:\apache-maven\bin”.
Tutorial de instalação: https://mkyong.com/maven/how-to-install-maven-in-windows/
Node.js (e npm)
Versão 20 (LTS).

Para verificar a versão do Node.js, no prompt de comandos digite:

node --version
Link para download: https://nodejs.org/dist/v20.14.0/node-v20.14.0-x64.msi

## CLI Angular
Versão 17.

Para verificar a versão do Angular CLI, no prompt de comandos digite:

ng version
Tutorial de instalação: https://v17.angular.io/guide/setup-local

Para instalar o Angular CLI, no prompt de comandos digite:

npm i -g @angular/cli@17.3.8
