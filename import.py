import json
import requests

MARKETS_FILE = 'exchanges/binance-markets.json'
ENDPOINT = 'http://localhost:3000/api/import'

markets = json.load(open(MARKETS_FILE))['markets']

for market in markets:
    currency = market['pair'][0]
    coin = market['pair'][1]
    if currency == 'USDT' or currency == 'BTC': # discard ETH and BNB markets
        r = requests.post(
            ENDPOINT,
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
                        'from': '2017-08-07 12:00',
                        'to': '2018-04-13 12:00'
                    }
                },
                'candleWriter': {
                    'enabled': True
                }
            })
        )
        if r.status_code != 200:
            print(coin + '/' + currency + ' could not be imported: ' + r.text)