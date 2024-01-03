import pandas as pd
import requests
import os
from dotenv import load_dotenv
from pandas import json_normalize

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Obtém o token da variável de ambiente
token = os.getenv("TOKEN")

# Use o token conforme necessário no seu script
print(f"Token: {token}")

# Função para fazer uma solicitação à API e atualizar dados no arquivo Excel
def fetch_and_update_excel(api_url, headers):
    # Fazer uma solicitação GET à API com headers (incluindo o token)
    response = requests.get(api_url, headers=headers)
    
    # Verificar se a solicitação foi bem-sucedida (código de status 200)
    if response.status_code == 200:
        # Converter a resposta para JSON
        api_data = response.json()
        
        print(api_data)

        # Especificar o caminho do arquivo Excel
        excel_file_path = "api_data.xlsx"

        # Criar listas para cada coluna
        data_list = api_data.get('content', [])

        # Verificar se existem novos dados da API
        if data_list:
            # Converter a lista de dicionários para um DataFrame
            new_df = pd.json_normalize(data_list)

            # Salvar o DataFrame no novo arquivo Excel temporário
            temp_excel_file = "temp_api_data.xlsx"
            new_df.to_excel(temp_excel_file, index=False)
            
            # Excluir o arquivo Excel existente, se existir
            if os.path.exists(excel_file_path):
                os.remove(excel_file_path)
                print(f"Existing file {excel_file_path} deleted.")
            
            # Renomear o arquivo temporário para o arquivo final
            os.rename(temp_excel_file, excel_file_path)
            print(f"Data exported to {excel_file_path}")
        else:
            print("No new data from API.")
    else:
        print(f"Failed to fetch data from API. Status code: {response.status_code}")

api_url = 'http://localhost:8080/request?&size=100'
headers = {'Authorization': f'Bearer {token}'}
fetch_and_update_excel(api_url, headers)
