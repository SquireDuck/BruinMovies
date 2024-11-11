from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re  # Import regex for text parsing

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/theaters', methods=['GET'])
def get_theaters():
    url = 'https://www.imdb.com/showtimes/US/90024'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        # Fetch the webpage
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors

        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the main container for theaters
        theaters_list = soup.find('div', id='cinemas-at-list')
        if not theaters_list:
            return jsonify({"error": "Theater data not found"}), 500

        theaters = []
        # Loop through each theater
        theater_items = theaters_list.find_all("div", class_="list_item", itemtype="http://schema.org/MovieTheater")
        for theater_item in theater_items:
            theater_name = theater_item.find("h3", itemprop="name").get_text(strip=True)
            theater_address = theater_item.find("div", class_="address").get_text(" ", strip=True)

            # Collect movies for the current theater
            movies = []
            movie_items = theater_item.find_all("div", class_="list_item", itemtype="http://schema.org/Movie")
            for movie_item in movie_items:
                # Extract movie title
                title = movie_item.find("span", itemprop="name").get_text(strip=True)

                # Extract IMDb ID from the link
                link_tag = movie_item.find("a", href=True)
                imdb_id = None
                if link_tag:
                    href = link_tag["href"]
                    if "/title/" in href:
                        imdb_id = href.split("/title/")[1].split("/")[0]  # Extract the ID (e.g., tt0047313)

                # Extract movie image
                image_tag = movie_item.find("img")
                image_url = image_tag['src'] if image_tag else None

                # Extract additional details
                rating = movie_item.find("span", class_="rating_txt")
                rating_text = rating.get_text(strip=True) if rating else "N/A"

                # Extract numeric rating if available
                numeric_rating = re.search(r"(\d\.\d)/10", rating_text)
                clean_rating = numeric_rating.group(1) + "/10" if numeric_rating else "N/A"

                showtimes = movie_item.find("div", class_="showtimes").get_text(" ", strip=True)

                movies.append({
                    "title": title,
                    "rating": clean_rating,
                    "showtimes": showtimes,
                    "imdbId": imdb_id,
                    "image": image_url  # Include the movie image URL
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
        # Handle network errors
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

        # Title
        title_tag = soup.find("h1")
        title = title_tag.get_text(strip=True) if title_tag else "Title not found"

        # Rating
        rating_tag = soup.find("div", {"data-testid": "hero-rating-bar__aggregate-rating__score"})
        rating_text = rating_tag.get_text(strip=True) if rating_tag else "N/A"

        # Extract numeric rating if available
        numeric_rating = re.search(r"(\d\.\d)/10", rating_text)
        clean_rating = numeric_rating.group(1) + "/10" if numeric_rating else "N/A"

        # Description
        description_tag = soup.find("span", {"data-testid": "plot-xl"})
        description = description_tag.get_text(strip=True) if description_tag else "No description available."

        # Image
        image_tag = soup.find("img", {"class": "ipc-image"})
        image = image_tag['src'] if image_tag else None

        # Showtimes (static text as showtimes are not directly available on the movie page)
        showtimes = "No showtimes available on IMDb."

        return jsonify({
            "title": title,
            "rating": clean_rating,
            "description": description,
            "showtimes": showtimes,
            "image": image
        })

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return jsonify({"error": "Failed to fetch movie details"}), 500


if __name__ == '__main__':
    app.run(debug=True)