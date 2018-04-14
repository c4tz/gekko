import json
import requests

api = 'http://localhost:3000/api'

datasets = r = requests.post(
            api + '/scansets',
            headers = {
                'Content-Type': 'application/json'
            },
            data = json.dumps({})
        ).json()['datasets']

for dataset in datasets:
    r = requests.post(
        api + '/backtest',
        headers = {
            'Content-Type': 'application/json'
        },
        data = json.dumps({
            'gekkoConfig': {
                'watch': {
                    'exchange': dataset['exchange'],
                    'currency': dataset['currency'],
                    'asset': dataset['asset']
                },
                'paperTrader': {
                    'feeMaker': 0.1,
                    'feeTaker': 0.1,
                    'feeUsing': 'maker',
                    'slippage': 0.05,
                    'simulationBalance': {
                        'asset': 1,
                        'currency': 100
                    },
                    'reportRoundtrips': True,
                    'enabled': True
                },
                'tradingAdvisor': {
                    'enabled': True,
                    'method': 'multiRSI',
                    'candleSize': 1,
                    'historySize': 0
                },
                'multiRSI': {
                    '__empty': True
                },
                'backtest': {
                    'daterange': 'scan'
                },
                'performanceAnalyzer': {
                    'riskFreeReturn': 2,
                    'enabled': True
                },
                'valid': True
            },
            'data': {
                'candleProps': [
                    'close',
                    'start'
                ],
                'indicatorResults': True,
                'report': True,
                'roundtrips': True,
                'trades': True
            }
        })
    )
    print(r.json()['report'])

    
