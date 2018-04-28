import json
import requests
import datetime

from time import sleep

import ccxt

MARKETS_FILE = 'exchanges/binance-markets.json'
HOST = 'http://localhost:3000/api'
BATCH_SIZE = 5

binance = ccxt.binance()

markets = json.load(open(MARKETS_FILE))['markets']
real_markets = binance.load_markets()

def get_first_candle_date(pair: str):
    timestamp = binance.fetch_ohlcv(pair, since=978307200, limit=1)[0][0] / 1000
    date_obj =  datetime.datetime.fromtimestamp(timestamp)
    return date_obj.strftime('%Y-%m-%d %H:%M')

def get_now_str():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M')

def wait_for_imports(imports: list):
    done = 0
    while done < BATCH_SIZE:
        done = 0
        running = requests.get(HOST + '/imports').json()
        for item in running:
            if item['id'] in imports and item.get('done', False):
                done += 1
        sleep(1)

imports = []
count = 0
for market in markets:
    currency = market['pair'][0]
    coin = market['pair'][1]
    pair = coin + '/' + currency
    if not pair in real_markets:
        continue
    if currency == 'USDT' or currency == 'BTC': # discard ETH and BNB markets
        r = requests.post(
            HOST + '/import',
            headers = {
                'Content-Type': 'application/json'
            },
            data = json.dumps({
                'watch': {
                    'exchange': 'binance',
                    'currency': currency,
                    'asset': coin
                },
                'importer': {
                    'daterange': {
                        'from': get_first_candle_date(pair),
                        'to': get_now_str()
                    }
                },
                'candleWriter': {
                    'enabled': True
                }
            })
        )
        if r.status_code != 200:
            print(coin + '/' + currency + ' could not be imported: ' + r.text)
            continue
        imports.append(r.json()['id'])
        count += 1
        if count >= BATCH_SIZE:
            wait_for_imports(imports)
            imports = []
            count = 0
