import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import {Movie, SearchResult} from "./types";

const OMDB_API = 'http://www.omdbapi.com/'
// Add a request interceptor that adds the apiKey
axios.interceptors.request.use((config) => {
    config.params.apiKey = '7e5f6a77'
    return config;
});

export interface SearchInput {
    title: string
    // page: number
}

interface MovieResponse {
    Title: string,
    Poster: string,
    Rated: string,
    Runtime: string,
    Ratings: Rating[]
}

interface Rating {
    Source: string,
    Value: string,
}

export const executeSearch = async (input: SearchInput): Promise<SearchResult> =>
    search(input).then(searchResponse => {
        const total = Number(searchResponse.totalResults);
        const movieRequests = searchResponse.Search.map(movie => getMovie(movie.imdbID))
        return Promise.all(movieRequests).then(movies => {
            return {movies, total}
        })
    });


export interface MovieWithImdbID {
    imdbID: string;
}

interface MovieSearchResponse {
    Search: MovieWithImdbID[];
    totalResults: string;
}

const search = async ({title}: SearchInput): Promise<MovieSearchResponse> => axios.get<MovieSearchResponse>(OMDB_API, {
    headers: {'accept': 'application/json'},
    timeout: 3000,
    params: {s: title, type: 'movie', r: 'json'}
}).then(response => {
    if (responseIsOk(response)) {
        return response.data
    } else {
        throw new Error("Error executing Search")
    }
})

const getMovie = async (id: string): Promise<Movie> => axios.get<MovieResponse>(OMDB_API, {
    params: {i: id, type: 'movie', r: 'json'},
    headers: {'accept': 'application/json'},
    timeout: 3000,
}).then(response => {
    if (responseIsOk(response)) {
        return movieMarshaller(response.data)
    } else {
        throw new Error("Response Error")
    }
})


export const responseIsOk = (response: AxiosResponse) => response.status >= 200 && response.status < 300

export const movieMarshaller = (movieResponse: MovieResponse): Movie => {
    const {Title: title, Poster: posterUrl, Rated: mpaaRating, Ratings: ratings, Runtime: runtime} = movieResponse
    return {
        title,
        mpaaRating,
        runtime,
        poster: parsePosterUrl(posterUrl),
        tomatoRating: rottenTomatoRating(ratings)
    }
}
const rottenTomatoRating = (ratings: Rating[]): string | undefined => {
    const rottenTomatoRating = ratings.find(findRottenTomatoRating)
    return rottenTomatoRating ? rottenTomatoRating.Value : undefined
}
const findRottenTomatoRating = (rating: Rating) => rating.Source === 'Rotten Tomatoes'

export const parsePosterUrl = (url: string) => {
    try {
        return new URL(url);
    } catch (e) {
        return undefined
    }
}