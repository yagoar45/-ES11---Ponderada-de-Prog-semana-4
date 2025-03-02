# Dashboard de Telemetria do Data Lake (Supabase)

Este projeto consiste em um dashboard simples, desenvolvido com Next.js e Tailwind CSS, para monitorar a telemetria do Data Lake armazenado no banco de dados PostgreSQL do Supabase.

## Funcionalidades

O dashboard exibe as seguintes métricas em tempo real:

* **Total de Registros:** Número total de registros na tabela `curated_intelifalhas`.
* **Total de Colunas:** Número total de colunas na tabela `curated_intelifalhas`.
* **Registros nas Últimas 24 Horas:** Número de registros adicionados à tabela nas últimas 24 horas.
* **Últimos 10 Registros:** Exibição dos 10 registros mais recentes da tabela `curated_intelifalhas`.

## Tecnologias Utilizadas

* **Next.js:** Framework React para construção de aplicações web.
* **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
* **Supabase:** Plataforma de backend open-source que utiliza PostgreSQL como banco de dados.
* **`@supabase/supabase-js`:** Biblioteca JavaScript para interação com o Supabase.

## Arquitetura do Data Lake/Data Warehouse

O Data Lake/Data Warehouse é construído seguindo uma arquitetura em camadas, com as seguintes tabelas no banco de dados PostgreSQL do Supabase:

* **`raw_intelifalhas` (Camada Raw):**
    * Esta camada armazena os dados brutos, conforme recebidos das fontes originais.
    * O objetivo é preservar os dados originais sem modificações.
    * Esta camada serve como um arquivo histórico dos dados.
* **`staging_intelifalhas` (Camada Staging):**
    * Nesta camada, os dados são limpos, transformados e padronizados.
    * As transformações incluem:
        * Remoção de dados duplicados.
        * Tratamento de valores nulos.
        * Conversão de tipos de dados.
        * Padronização de formatos.
    * Esta camada prepara os dados para a camada final de consumo.
* **`curated_intelifalhas` (Camada Curated):**
    * Esta camada armazena os dados finais, prontos para análise e consumo pelo dashboard.
    * Os dados são agregados, modelados e otimizados para consultas eficientes.
    * Esta camada fornece uma visão consolidada e consistente dos dados.

## Transformações Empregadas

As seguintes transformações são aplicadas nos dados durante a transição da camada `staging_intelifalhas` para a camada `curated_intelifalhas`:

* **Agregação:** Os dados são agregados por período de tempo, tipo de falha ou outras dimensões relevantes.
* **Modelagem Dimensional:** Os dados são modelados em um esquema dimensional (estrela ou floco de neve) para facilitar a análise.
* **Cálculo de Métricas:** Métricas importantes, como taxa de falhas, tempo médio de reparo e custo de manutenção, são calculadas e armazenadas.
* **Otimização:** Os dados são indexados e particionados para otimizar o desempenho das consultas.

## Processo de ETL/ELT

O processo de extração, transformação e carga (ETL) ou extração, carga e transformação (ELT) é utilizado para mover os dados entre as camadas:

1.  **Extração:** Os dados brutos são extraídos das fontes originais e carregados na tabela `raw_intelifalhas`.
2.  **Transformação (Staging):** Os dados são limpos e transformados na tabela `staging_intelifalhas`.
3.  **Transformação (Curated):** Os dados são agregados, modelados e otimizados na tabela `curated_intelifalhas`.
4.  **Carga:** Os dados finais são carregados na tabela `curated_intelifalhas`, que é consumida pelo dashboard de telemetria.

Este processo garante a qualidade, consistência e eficiência dos dados utilizados para monitoramento e análise.

## Configuração do Supabase

1.  **Criação do Projeto:** Crie um novo projeto no Supabase.
2.  **Configuração do RLS:** Configure a Row Level Security (RLS) na tabela `curated_intelifalhas` para permitir o acesso de leitura ao dashboard. Para isso, siga os passos:
    * Vá para a seção "Authentication" -> "Policies" no painel do Supabase.
    * Crie uma nova política para a tabela `curated_intelifalhas`.
    * Defina o nome da política como "Dashboard - Telemetria".
    * Selecione a operação `SELECT`.
    * Defina a política para `public` (ou para um role específico, se necessário).
    * Na cláusula `using`, insira a condição `true` para permitir o acesso a todos os registros.
    * **Importante:** Se precisar de uma política mais restritiva, altere a cláusula `using` de acordo com suas necessidades.
3.  **Variáveis de Ambiente:** No Vercel, configure as seguintes variáveis de ambiente:
    * `SUPABASE_URL`: URL do seu projeto Supabase.
    * `SUPABASE_ANON_KEY`: Chave API anon\_key do seu projeto Supabase.

## Configuração do Dashboard

1.  **Clone o repositório:** Clone este repositório para sua máquina local.
2.  **Instale as dependências:** Execute `npm install` ou `yarn install` na raiz do projeto.
3.  **Execute o dashboard:** Execute `npm run dev` ou `yarn dev` para iniciar o servidor de desenvolvimento.
4.  **Acesse o dashboard:** Acesse o dashboard no seu navegador através do endereço `http://localhost:3000`.

## Consultas Nativas do PostgreSQL

O dashboard utiliza a função `supabase.rpc()` com a opção `is_raw: true` para executar consultas nativas do PostgreSQL, garantindo que nenhuma abstração ou modificação seja feita pela biblioteca Supabase.
