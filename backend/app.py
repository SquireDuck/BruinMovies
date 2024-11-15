from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
CORS(app)

def get_higher_quality_image(url):
    if url and "._V1_" in url:
        base_url = url.split("._V1_")[0]
        return f"{base_url}._V1_QL75_UX380_CR0,0,380,562_.jpg"
    return url

def get_highest_quality_image(url):
    if url and "._V1_" in url:
        base_url = url.split("._V1_")[0]
        return f"{base_url}._V1_QL200_UX2500_CR0,0,2500,3697_.jpg"
    return url

@app.route('/api/theaters', methods=['GET'])
def get_theaters():
    url = 'https://www.imdb.com/showtimes/US/90024'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        theaters_list = soup.find('div', id='cinemas-at-list')
        if not theaters_list:
            return jsonify({"error": "Theater data not found"}), 500

        theaters = []
        theater_items = theaters_list.find_all("div", class_="list_item", itemtype="http://schema.org/MovieTheater")
        for theater_item in theater_items:
            theater_name = theater_item.find("h3", itemprop="name").get_text(strip=True)
            theater_address = theater_item.find("div", class_="address").get_text(" ", strip=True)

            movies = []
            movie_items = theater_item.find_all("div", class_="list_item", itemtype="http://schema.org/Movie")
            for movie_item in movie_items:
                title = movie_item.find("span", itemprop="name").get_text(strip=True)

                link_tag = movie_item.find("a", href=True)
                imdb_id = None
                if link_tag:
                    href = link_tag["href"]
                    if "/title/" in href:
                        imdb_id = href.split("/title/")[1].split("/")[0]

                image_tag = movie_item.find("img")
                image_url = image_tag['src'] if image_tag else None
                image_url = get_higher_quality_image(image_url)

                rating = movie_item.find("span", class_="rating_txt")
                rating_text = rating.get_text(strip=True) if rating else "N/A"

                numeric_rating = re.search(r"(\d\.\d)/10", rating_text)
                clean_rating = numeric_rating.group(1) + "/10" if numeric_rating else "N/A"

                showtimes = movie_item.find("div", class_="showtimes").get_text(" ", strip=True)

                movies.append({
                    "title": title,
                    "rating": clean_rating,
                    "showtimes": showtimes,
                    "imdbId": imdb_id,
                    "image": image_url
                })

            theaters.append({
                "name": theater_name,
                "address": theater_address,
                "movies": movies
            })

        return jsonify({
            "count": len(theaters),
            "theaters": theaters
        })

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return jsonify({"error": "Failed to fetch data from IMDb"}), 500

@app.route('/api/movie/<imdb_id>', methods=['GET'])
def get_movie_details(imdb_id):
    url = f'https://www.imdb.com/title/{imdb_id}/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        title = soup.find("h1").get_text(strip=True)
        
        # Rating selector
        rating_element = soup.select_one('div[data-testid="hero-rating-bar__aggregate-rating__score"] span:first-child')
        rating = rating_element.get_text(strip=True) if rating_element else "N/A"
        
        if rating != "N/A":
            rating += "/10"
        
        # Number of ratings
        num_ratings_element = soup.select_one('div[data-testid="hero-rating-bar__aggregate-rating__score"] ~ div.sc-d541859f-3')
        num_ratings = num_ratings_element.get_text(strip=True) if num_ratings_element else "N/A"
        
        # Description selector
        description_element = soup.select_one('p[data-testid="plot"] span[data-testid="plot-xl"]')
        if not description_element:
            description_element = soup.select_one('p[data-testid="plot"] span[data-testid="plot-l"]')
        if not description_element:
            description_element = soup.select_one('p[data-testid="plot"] span[data-testid="plot-xs_to_m"]')
        description = description_element.get_text(strip=True) if description_element else "No description available."
        
        image_tag = soup.find("img", class_="ipc-image")
        image = image_tag['src'] if image_tag else None
        image = get_highest_quality_image(image)

        # Updated genres selector
        genre_elements = soup.select('div.ipc-chip-list__scroller a.ipc-chip span.ipc-chip__text')
        genres = [genre.get_text(strip=True) for genre in genre_elements] if genre_elements else []

        # Release year
        year_element = soup.select_one('a[href*="/releaseinfo"]')
        year = year_element.get_text(strip=True) if year_element else "N/A"

        return jsonify({
            "title": title,
            "rating": rating,
            "numRatings": num_ratings,
            "description": description,
            "image": image,
            "genres": genres,
            "year": year
        })

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return jsonify({"error": "Failed to fetch movie details from IMDb"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)