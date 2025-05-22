# MAL Anime Recommender

The MAL Anime Recommender is a small web application that selects an anime to watch based on a given MyAnimeList (MAL) username.


|   |   |
|---|---|
|<img width="300" height="242" src="https://github.com/khelta/mal-anime-recommender/raw/main/github-resources/readme_1.png">|<img width="300" height="317" src="https://github.com/khelta/mal-anime-recommender/raw/main/github-resources/readme_2.png">|

## Usage

Make sure to update the HOST_URL in the Dockerfile before building the image.

```
# Build command
docker build -t mal-anime-recommender .

# Run container
docker run -it --rm -p 3000:3000 --name mal-anime-recommender mal-anime-recommender
```
