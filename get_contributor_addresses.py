import os
import requests
import pandas as pd
from pandas import json_normalize
import glob
import ast
from tqdm import tqdm

DAOS = [
    dict(
        name='OlympusDAO',
        url='https://olympusdao.finance',
        treasuries=[dict(network_id='1', address='0xee1520f94f304e8D551Cbf310Fe214212e3cA34a'), ]
    ),
    dict(
        name='Yearn',
        url='https://yearn.finance/#/home',
        treasuries=[]
    ),
    dict(
        name='RomeDAO',
        url='https://romedao.finance/',
        treasuries=[dict(network_id='1285', address='0xfbAD41e4Dd040BC80c89FcC6E90d152A746139aF'), ]
    ),
    dict(
        name='DeveloperDAO',
        url='https://developerdao.com',
        treasuries=[dict(network_id='1', address='0x7128f5ff32eD07Ce12E6a9deBE32BB40F9884b3C'), ]
    ),
    dict(
        name='NounsDAO',
        url='https://nouns.wtf',
        treasuries=[dict(network_id='1', address='0x0BC3807Ec262cB779b38D65b38158acC3bfedE10'), ]
    ),
    dict(
        name='BanklessDAO',
        url='https://linktr.ee/Bankless',
        treasuries=[dict(network_id='1', address='0xf26d1Bb347a59F6C283C53156519cC1B1ABacA51'), ]
    ),
]

BASE_COVALENT_URL = 'https://api.covalenthq.com/v1/'
API_PATH = 'transactions_v2/'
API_KEY = ''

def get_request_path_for_address(address, network_id='1') -> str:
    return f'{BASE_COVALENT_URL}{network_id}/address/{address}/{API_PATH}?key={API_KEY}&page-size=1000'

def download_treasury_transactions():
    success_count = 0
    for dao in DAOS:
        dao_name = dao['name']

        for treasury in dao['treasuries']:
            address = treasury['address']
            network_id = treasury['network_id']
            data_fname = f'data/{dao_name}/{dao_name}_treasury_transactions_{address}.csv'

            if os.path.exists(data_fname):
                continue
            else:
                try:
                    os.mkdir(f'data/{dao_name}/')
                except OSError as error:
                    pass

            request_path = get_request_path_for_address(address, network_id)
            response = requests.get(request_path)

            if response.status_code == 200:
                data = response.json()['data']['items']
                df = json_normalize(data)
#                 df = df[df.from_address == address]

                if len(df):
                    df.to_csv(data_fname)
                    success_count += 1


    print(f'done - successfully stored transactions from {success_count} addresses')

def get_transfers_from_log_events(log_events: str):
    events = ast.literal_eval(log_events)
    transfers = []

    for event in events:
        try:
            if 'transfer' in event['decoded']['name'].lower():
                transfers.append(event)
        except TypeError as err:
            pass
    return transfers

def get_receiving_addresses_of_transfers(transfers):
    addresses = []
    for transfer in transfers:
        params = transfer['decoded']['params']
        for param in params:
            if param['name'] == 'to':
                addresses.append(param['value'])

    return addresses


def get_contributors_from_treasury_transactions():
    data_files = glob.glob('data/*/*_treasury_transactions_*.csv')
    for data_file in data_files:
        dao_name = data_file.split('_')[0].split('/')[1]
        print('parsing transactions for', dao_name, 'from file', data_file)
        df = pd.read_csv(data_file)

        contributors = []

        for log_events in tqdm(df.log_events):
            transfers = get_transfers_from_log_events(log_events)
            receiving_addresses = get_receiving_addresses_of_transfers(transfers)

            if receiving_addresses:
                contributors.extend(receiving_addresses)

        if contributors:
            contributors = list(set(contributors))
            contributors_fname = f'public/data/{dao_name}/{dao_name}_contributors.csv'
            col_name = f'{dao_name}_contributors'

            if os.path.exists(contributors_fname):
                df_contributors = pd.read_csv(contributors_fname)
            else:
                df_contributors = pd.DataFrame({col_name: []})
                try:
                    os.mkdir(f'public/data/{dao_name}/')
                except OSError as error:
                    pass

            df_contributors[col_name] = list(set(list(df_contributors[col_name]) + contributors))
            df_contributors.to_csv(contributors_fname, index=False)




if __name__ == '__main__':
    download_treasury_transactions()
    get_contributors_from_treasury_transactions()




