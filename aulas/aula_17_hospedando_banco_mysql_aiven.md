# Aula 17 — Hospedando o Banco MySQL no Aiven com MySQL Workbench

## Antes de começar — relembrando o ambiente

Se a máquina foi reiniciada desde a última aula, repita os passos de sempre antes de continuar:

1. **Importe o banco de novo** no phpMyAdmin, aba **Importar**, usando `banco/estudio_tatuagem.sql` (processo completo nas Aulas 2 e 10). Isso é útil para confirmar que o SQL do projeto funciona corretamente antes de subir para o servidor real.
2. **Recrie o arquivo `.env`** dentro da pasta `backend` com as configurações locais do projeto:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=estudio_tatuagem
   ```
   Detalhes desse arquivo na Aula 5, Parte 1.
3. **Recrie e ative o ambiente virtual**, dentro da pasta `backend`:
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   Se der erro de política de execução ou de `pydantic-core`/Rust, o passo a passo de correção está na Aula 3.
4. **Reinstale as dependências e rode a API:**
   ```powershell
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

> **Importante:** nesta aula, não vamos usar `mysql` no terminal. Como todas as máquinas já têm o **MySQL Workbench** instalado, vamos usar essa ferramenta para conectar no banco remoto e importar o SQL do projeto. Isso deixa o processo mais visual e mais didático para alunos.

---

## O que vamos fazer nessa aula

1. Entender por que o banco precisa ser hospedado em um servidor real
2. Criar uma conta gratuita no Aiven
3. Criar um serviço MySQL no Aiven
4. Criar o banco `estudio_tatuagem` no servidor remoto
5. Conectar o MySQL Workbench no banco hospedado
6. Importar o arquivo SQL do projeto para o banco de produção
7. Ajustar o `.env` do backend para apontar pro banco remoto
8. Testar a API com o banco externo

---

## Parte 1 — Por que hospedar o banco em um servidor real

Até agora, o banco e a API estiveram rodando em ambiente local. Isso é ótimo para aprender e testar, mas não representa uma aplicação real.

Quando o sistema é hospedado em produção, o banco também precisa ficar em um servidor online, acessível pela API. O banco não pode continuar sendo apenas o `localhost` da máquina.

Duas coisas são fundamentais em um ambiente real:

- a API precisa conhecer o endereço do banco remoto
- o banco precisa ter sido criado e importado em um servidor real

Esse passo é importante porque, em qualquer projeto real, a aplicação não depende só do ambiente do programador — ela depende de infraestrutura e de configuração correta.

> **Atenção:** o front-end não importa o banco. A importação do SQL acontece no banco de dados, através do MySQL Workbench ou do cliente MySQL. O front-end só consome a API.

---

## Parte 2 — Criar uma conta gratuita no Aiven

Acesse:

```text
https://console.aiven.io/
```

Na página inicial:

1. Clique em **Sign up**
2. Crie a conta com e-mail e senha
3. Confirme o cadastro pelo e-mail
4. Faça login no painel

Se a conta for gratuita, o Aiven pode permitir a criação do serviço sem cartão, dependendo da disponibilidade do momento.

> **Importante:** não compartilhe sua senha do banco em aula. A senha deve ficar apenas no `.env` do aluno e no ambiente local do projeto.

---

## Parte 3 — Criar o serviço MySQL no Aiven

Depois de entrar no painel do Aiven:

1. Clique em **Create service**
2. Escolha o tipo de serviço **MySQL**
3. Defina um nome para o serviço, por exemplo:
   ```
   estudio-tatuagem
   ```
4. Escolha a região mais próxima
5. Selecione o plano gratuito ou o mais simples disponível
6. Clique em **Create service**

Aguarde alguns segundos até o serviço ficar ativo.

Quando o serviço estiver pronto, o painel vai mostrar:

- host
- porta
- usuário
- senha

Esses dados são as **credenciais do banco**. Eles serão usados pelo MySQL Workbench e também pelo backend para conectar na API.

> **Importante:** no Aiven, você cria a instância do MySQL e as credenciais. O banco em si e a importação do SQL serão feitos diretamente no MySQL Workbench.

---

## Parte 4 — Conectar o MySQL Workbench no banco do Aiven

Abra o **MySQL Workbench**.

Na parte de conexões:

1. Clique no botão **+** para criar uma nova conexão
2. Preencha os dados:
   - **Connection Name:** `aiven`
   - **Hostname:** host do serviço Aiven
   - **Port:** porta do serviço Aiven
   - **Username:** normalmente `avnadmin`
   - **Password:** senha do banco
3. Clique em **Test Connection**
4. Se a conexão funcionar, clique em **OK**

Se der erro, confira:

- host
- porta
- usuário
- senha
- se o serviço está ativo no Aiven

> **Dica:** se a conexão falhar, o problema quase sempre é um dado digitado errado. A senha e o host são os campos mais comuns de erro.

---

## Parte 5 — Criar o banco no MySQL Workbench

Depois que a conexão com o Aiven funcionar:

1. Abra uma nova query no Workbench
2. Execute o seguinte SQL:

```sql
CREATE DATABASE IF NOT EXISTS `estudio_tatuagem`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `estudio_tatuagem`;
```

Esse passo é importante: o banco do projeto precisa ser criado no Workbench, e não pelo painel do Aiven. O Aiven fornece a instância e as credenciais; o banco em si é criado pelo aluno no próprio cliente MySQL.

> **Relembrando:** a instrução acima cria o banco que a API vai usar. Ele não aparece como um “botão de criar banco” no painel do Aiven, e sim como uma query executada no Workbench.

---

## Parte 6 — Importar o arquivo SQL para o banco do Aiven

Abra o **MySQL Workbench**.

Na parte de conexões:

1. Clique no botão **+** para criar uma nova conexão
2. Preencha os dados:
   - **Connection Name:** `aiven`
   - **Hostname:** host do serviço Aiven
   - **Port:** porta do serviço Aiven
   - **Username:** normalmente `avnadmin`
   - **Password:** senha do banco
3. Clique em **Test Connection**
4. Se a conexão funcionar, clique em **OK**

Se der erro, confira:

- host
- porta
- usuário
- senha
- se o serviço está ativo no Aiven

> **Dica:** se a conexão falhar, o problema quase sempre é um dado digitado errado. A senha e o host são os campos mais comuns de erro.

---

## Parte 6 — Importar o arquivo SQL para o banco do Aiven

Com a conexão criada e funcionando:

1. Clique em **Server**
2. Selecione **Data Import**
3. Escolha **Import from Self-Contained File**
4. Clique no botão para localizar o arquivo SQL:
   ```text
   C:\Users\SeuUsuario\Downloads\apifastmysql\banco\estudio_tatuagem.sql
   ```
5. No campo **Default Target Schema**, escolha:
   ```
   estudio_tatuagem
   ```
6. Clique em **Start Import**

Aguarde a execução. O Workbench vai importar as tabelas e os dados iniciais do projeto.

> **Observação importante:** o banco precisa já ter sido criado no Workbench com a query acima. O painel do Aiven não cria o banco na prática — ele cria a instância do MySQL e as credenciais. O banco e o import são feitos a partir do cliente MySQL.

---

## Script completo para criar o banco do zero no Workbench

Se o aluno quiser recriar tudo do zero, pode usar esse script completo diretamente no MySQL Workbench, sem depender do painel do Aiven para criar o banco. Ele cria o banco, cria as tabelas, define as chaves primárias e já insere os dados iniciais.

```sql
CREATE DATABASE IF NOT EXISTS `estudio_tatuagem`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `estudio_tatuagem`;

DROP TABLE IF EXISTS `agendamento`;
DROP TABLE IF EXISTS `tatuador_estilo`;
DROP TABLE IF EXISTS `tatuador`;
DROP TABLE IF EXISTS `cliente`;
DROP TABLE IF EXISTS `estilo`;
DROP TABLE IF EXISTS `senioridade`;

CREATE TABLE `senioridade` (
  `idsenioridade` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  PRIMARY KEY (`idsenioridade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `senioridade` (`idsenioridade`, `nome`) VALUES
(1, 'Júnior'),
(2, 'Pleno'),
(3, 'Sênior');

CREATE TABLE `estilo` (
  `idestilo` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(50) NOT NULL,
  PRIMARY KEY (`idestilo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `estilo` (`idestilo`, `descricao`) VALUES
(1, 'Blackwork'),
(2, 'Aquarela'),
(3, 'Realismo'),
(4, 'Old School');

CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `datacadastro` date DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `uf` char(2) DEFAULT NULL,
  PRIMARY KEY (`idcliente`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `cliente` (`idcliente`, `nome`, `cpf`, `telefone`, `datacadastro`, `cidade`, `uf`) VALUES
(1, 'Ana Silva', '44444444444', '11988880001', '2024-01-15', 'São Paulo', 'SP'),
(2, 'Bruno Costa', '55555555555', '31988880002', '2024-03-22', 'Belo Horizonte', 'MG');

CREATE TABLE `tatuador` (
  `idtatuador` int(11) NOT NULL AUTO_INCREMENT,
  `nometatuador` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `datacontratacao` date DEFAULT NULL,
  `idsenioridade` int(11) NOT NULL,
  PRIMARY KEY (`idtatuador`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `idsenioridade` (`idsenioridade`),
  CONSTRAINT `tatuador_ibfk_1`
    FOREIGN KEY (`idsenioridade`) REFERENCES `senioridade` (`idsenioridade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tatuador` (`idtatuador`, `nometatuador`, `cpf`, `email`, `telefone`, `datacontratacao`, `idsenioridade`) VALUES
(1, 'Lucas Mendes', '11111111111', 'lucas@estudio.com', '11999990001', '2020-03-01', 3),
(2, 'Carla Souza', '22222222222', 'carla@estudio.com', '11999990002', '2022-06-15', 2),
(3, 'Pedro Lima', '33333333333', 'pedro@estudio.com', '11999990003', '2024-01-10', 1);

CREATE TABLE `agendamento` (
  `idagendamento` int(11) NOT NULL AUTO_INCREMENT,
  `idcliente` int(11) NOT NULL,
  `idtatuador` int(11) NOT NULL,
  `dataagendamento` date NOT NULL,
  `horaagendamento` time NOT NULL,
  `descricaotatuagem` text DEFAULT NULL,
  `desenhoaprovado` varchar(255) DEFAULT NULL,
  `valortatuagem` decimal(10,2) DEFAULT NULL,
  `status` enum('pendente','confirmado','concluido','cancelado') NOT NULL DEFAULT 'pendente',
  PRIMARY KEY (`idagendamento`),
  KEY `idcliente` (`idcliente`),
  KEY `idtatuador` (`idtatuador`),
  CONSTRAINT `agendamento_ibfk_1`
    FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `agendamento_ibfk_2`
    FOREIGN KEY (`idtatuador`) REFERENCES `tatuador` (`idtatuador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `agendamento` (`idagendamento`, `idcliente`, `idtatuador`, `dataagendamento`, `horaagendamento`, `descricaotatuagem`, `desenhoaprovado`, `valortatuagem`, `status`) VALUES
(1, 1, 1, '2025-05-10', '14:00:00', 'Mandala no braço', NULL, 350.00, 'pendente'),
(2, 2, 2, '2025-05-11', '10:00:00', 'Rosa aquarela no ombro', NULL, 200.00, 'pendente');

CREATE TABLE `tatuador_estilo` (
  `idtatuador` int(11) NOT NULL,
  `idestilo` int(11) NOT NULL,
  `dataestilo` date DEFAULT NULL,
  PRIMARY KEY (`idtatuador`,`idestilo`),
  KEY `idestilo` (`idestilo`),
  CONSTRAINT `tatuador_estilo_ibfk_1`
    FOREIGN KEY (`idtatuador`) REFERENCES `tatuador` (`idtatuador`),
  CONSTRAINT `tatuador_estilo_ibfk_2`
    FOREIGN KEY (`idestilo`) REFERENCES `estilo` (`idestilo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tatuador_estilo` (`idtatuador`, `idestilo`, `dataestilo`) VALUES
(1, 1, '2020-03-01'),
(1, 3, '2021-05-10'),
(2, 2, '2022-06-15'),
(3, 4, '2024-01-10');
```

> **Leitura do roteiro:** esse script cria o banco do zero e já resolve o problema mais comum do MySQL: falta de `PRIMARY KEY` e `AUTO_INCREMENT` em um dump gerado no MariaDB/XAMPP.

---

## Parte 7 — O erro mais comum: dump gerado em MariaDB/XAMPP

Se o aluno tentar importar o dump original do projeto e receber erro como:

```text
Unable to create or change a table without a primary key
```

ou algo do tipo:

```text
sql_require_primary_key
```

isso significa que o arquivo SQL foi gerado em um ambiente mais permissivo, como MariaDB no XAMPP, e o MySQL do Aiven é mais exigente.

### O que precisa ajustar

As tabelas do SQL precisam ter:

- `PRIMARY KEY`
- `AUTO_INCREMENT` no campo de ID
- relacionamentos com `FOREIGN KEY`

### Exemplo corrigido

Antes:

```sql
CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL
);
```

Depois:

```sql
CREATE TABLE `cliente` (
  `idcliente` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idcliente`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

> **Importante:** esse ajuste é necessário porque MySQL 8 e MariaDB não tratam a criação de tabelas exatamente da mesma forma.

Se o aluno ainda estiver com o dump original, pode ser necessário ajustar o SQL antes de importar. O recomendado é usar uma versão do dump já adaptada para MySQL.

---

## Parte 8 — Validando se o banco foi importado

Depois do import, teste no Workbench:

```sql
SHOW TABLES;
SELECT * FROM cliente LIMIT 5;
```

Se aparecer lista de tabelas e registros, o banco foi importado corretamente.

Também vale olhar no navegador lateral do Workbench:

- Schemas
- estudio_tatuagem
- Tables

Você deve ver algo como:

- `agendamento`
- `cliente`
- `estilo`
- `senioridade`
- `tatuador`
- `tatuador_estilo`

Se essas tabelas aparecerem, a etapa de banco remoto foi concluída com sucesso.

---

## Parte 9 — Ajustando o `.env` do backend para conectar no Aiven

No arquivo `.env` do backend, a configuração local:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=estudio_tatuagem
```

deve virar algo assim:

```env
DB_HOST=mysql-3928030-cintia-e857.i.aivencloud.com
DB_USER=avnadmin
DB_PASSWORD=sua_senha
DB_NAME=estudio_tatuagem
DB_PORT=16930
```

> O aluno deve trocar pelos valores reais do banco criado no Aiven.

Se o projeto estiver usando uma variável específica, o padrão é a mesma ideia: trocar `localhost` pelo host do banco remoto, incluir a porta correta do serviço MySQL e colocar `DB_USER`, `DB_PASSWORD` e `DB_NAME` corretos.

> **Importante:** no Aiven, a porta do MySQL normalmente não é `3306`. O MySQL Workbench mostra a porta real do serviço, e esse valor deve entrar no `.env` para a API conectar corretamente.

---

## Parte 10 — Ajustando a conexão no backend para usar a porta do banco remoto

No arquivo `backend/database.py`, a conexão deve incluir também a porta do MySQL. O código correto é este:

```python
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()


def conectar():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", "3306"))
    )
```

> **O detalhe que resolve o problema:** sem a `DB_PORT`, o MySQL usa `3306` por padrão. Mas no Aiven a porta normalmente é outra, e a API tenta se conectar na porta errada e cai em erro de conexão.

Depois de ajustar o `.env` e o `database.py`, rode a API localmente:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Depois acesse:

```text
http://localhost:8000/docs
```

Teste rotas simples, como:

- `GET /clientes`
- `GET /tatuadores`
- `GET /senioridade`

Se a API conseguir listar os dados, a conexão com o banco remoto funcionou corretamente.

---

## Erros comuns

- **`Connection failed` no MySQL Workbench**
  Verifique host, porta, usuário e senha.

- **`Unknown database`**
  O banco ainda não foi criado no Aiven.

- **`Access denied`**
  Usuário ou senha incorreta.

- **`Import completed with errors`**
  O SQL foi executado, mas houve problemas em alguma tabela. Examine o log e ajuste o dump.

- **`Unable to create or change a table without a primary key`**
  O arquivo SQL precisa ser ajustado para MySQL, adicionando `PRIMARY KEY` e `AUTO_INCREMENT` nos IDs.

---

## Estrutura do projeto até agora

Nenhum arquivo novo foi criado nessa aula do ponto de vista da API. A aula 17 é sobre infraestrutura:

- criar o serviço no Aiven
- criar o banco remoto
- importar o SQL
- ajustar o `.env`
- validar a API conectando no banco externo

A estrutura da pasta do projeto continua igual.

---

## Próxima aula

Na próxima etapa, os alunos vão aprender a hospedar a API em um servidor real e também a configurar o frontend para consumir a API em ambiente externo, deixando a aplicação pronta para acesso público.
