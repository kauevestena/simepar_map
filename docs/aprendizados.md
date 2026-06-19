# Aprendizados do Projeto Simepar Map

Este documento registra o que foi aprendido durante o desenvolvimento do visualizador de mapa coroplético das temperaturas do Paraná.

## Raspagem de Dados (Scraping)
- O Simepar disponibiliza dados meteorológicos detalhados por município via URLs estruturadas pelo código IBGE.
- Os dados de temperatura atual estão presentes em tags HTML simples, mas as previsões de máxima e mínima para o dia são injetadas via scripts (Highcharts). Foi necessário usar expressões regulares para extrair esses valores dos blocos de script.
- Para evitar bloqueios por excesso de requisições, foi implementado um pequeno atraso (`time.sleep`) entre as consultas das 399 cidades.

## Manipulação de Dados Geoespaciais
- A malha de municípios do IBGE é bastante detalhada, resultando em arquivos grandes.
- Aprendi que a simplificação de coordenadas (redução de precisão decimal) é uma técnica eficaz para reduzir o tamanho do arquivo GeoJSON sem perda significativa de qualidade visual para um mapa estadual, facilitando o carregamento no navegador.

## Maplibre GL JS
- O Maplibre é uma alternativa robusta e de código aberto para visualização de mapas.
- A aplicação de rampas de cores contínuas (como Viridis) pode ser feita de forma eficiente usando expressões de interpolação (`interpolate`, `linear`) diretamente nas propriedades de pintura das camadas.
- O uso de `feature-state` permite interações de alta performance para efeitos de hover sem a necessidade de atualizar todo o GeoJSON.

## Automação com GitHub Actions
- O GitHub Actions é uma ferramenta poderosa para criar sites "vivos" mesmo sendo estáticos (serverless).
- A combinação de um script Python agendado via `cron` que atualiza um arquivo de dados no repositório permite que o frontend reflita informações quase em tempo real sem a necessidade de um backend dedicado.
