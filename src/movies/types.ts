
// 1. The movie title
// 2. The image/poster for the movie
// 3. The MPAA rating
// 4. The runtime length
// 5. The Rotten Tomatoes score, if available.
export interface Movie {
    title: string;
    poster: URL | undefined;
    mpaaRating: string;
    runtime: string;
    tomatoRating?: string;
}

export interface SearchResult {
    movies: Movie[]
    total: number
}

export interface RenderableSearchResult {
    data: SearchResult | undefined,
    loading: boolean,
    error?: any
}