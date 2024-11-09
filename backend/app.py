# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    url = 'https://www.imdb.com/user/ur174609609/watchlist/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
                      ' Chrome/129.0.0.0 Safari/537.36'
    }
    result = requests.get(url, headers=headers)

    soup = BeautifulSoup(result.content, 'html.parser')
    movieData = soup.find('script', id='__NEXT_DATA__')

    movieList = []

    if movieData:
        jsonData = json.loads(movieData.string)
        try:
            movies = jsonData['props']['pageProps']['mainColumnData']['predefinedList'][
                'titleListItemSearch']['edges']
        except KeyError:
            return jsonify({"error": "Unexpected JSON structure"}), 500

        for movie in movies:
            list_item = movie.get('listItem', {})
            title = list_item.get('titleText', {}).get('text', 'N/A')
            year = list_item.get('releaseYear', {}).get('year', 'N/A')
            rate = list_item.get('ratingsSummary', {}).get('aggregateRating', None)

            movieList.append({
                'title': title,
                'year': year,
                'rating': rate
            })
    else:
        return jsonify({"error": "Failed to retrieve movie data"}), 500

    return jsonify({
        'count': len(movieList),
        'movies': movieList
    })

if __name__ == '__main__':
    app.run(debug=True)
