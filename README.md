# Simepar Map - Temperaturas do Paraná

Visualizador em mapa coroplético das temperaturas atuais e previstas (máxima e mínima) de todos os 399 municípios do estado do Paraná, utilizando dados raspados do Simepar.

## Funcionalidades

- **Mapa Coroplético**: Visualização das temperaturas através de uma rampa de cores contínua (Viridis).
- **Três Temas**:
  - Temperatura Atual
  - Temperatura Máxima (prevista para o dia)
  - Temperatura Mínima (prevista para o dia)
- **Interatividade**: Ao passar o mouse sobre um município, ele é destacado e exibe seu nome e temperatura.
- **Atualização Automática**: Os dados são atualizados a cada hora via GitHub Actions.

## Tecnologias Utilizadas

- **Frontend**: [Maplibre GL JS](https://maplibre.org/)
- **Linguagem de Script**: Python (BeautifulSoup4, Requests) para raspagem de dados.
- **Dados Geográficos**: Malha de municípios do IBGE (simplificada).
- **Automação**: GitHub Actions.
- **Hospedagem**: GitHub Pages.

## Estrutura do Repositório

- `index.html`: Página principal com o mapa.
- `parana.geojson`: Dados geográficos dos municípios com as temperaturas embutidas.
- `scrape_simepar.py`: Script Python responsável por coletar os dados do Simepar.
- `.github/workflows/update_data.yml`: Configuração da automação de atualização.
- `docs/`: Documentação adicional e aprendizados.

## Como Executar Localmente

1. Clone o repositório.
2. Certifique-se de ter o Python instalado para rodar o scraper se desejar atualizar os dados manualmente:
   ```bash
   pip install beautifulsoup4 requests
   python scrape_simepar.py
   ```
3. Abra o arquivo `index.html` em um servidor local (necessário para carregar o GeoJSON):
   ```bash
   python -m http.server 8000
   ```
4. Acesse `http://localhost:8000`.

## Licença

Este projeto é destinado a fins educacionais. Os dados meteorológicos são de propriedade do Simepar.
