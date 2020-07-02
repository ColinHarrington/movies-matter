import React from 'react';
import {Movie, SearchResult} from "../movies/types";

export const ResultTable = ({total, movies}: SearchResult) => {
    return <div>
        <span>{total} results</span>
        <ul>
            {movies.map((movie) => {
                return <li><MovieDetail {...movie}/></li>
            })}
        </ul>
    </div>
}

// 1. The movie title
// 2. The image/poster for the movie
// 3. The MPAA rating
// 4. The runtime length
// 5. The Rotten Tomatoes score, if available.
export const MovieDetail = ({title, runtime, poster, tomatoRating, mpaaRating}: Movie) => {
    const posterPath = poster ? poster.toString() : 'default.png';
    return <div className="movie">
        <img src={posterPath} alt="Poster"/>
        <div className="movieDetails">
        <h3>{title}</h3>
        <li>Rating: {mpaaRating}</li>
        <li>Runtime: {runtime}</li>
        <TomatoRating rating={tomatoRating}/>
        </div>
    </div>
}

interface RottenParams {
    rating: string | undefined;
}

export const TomatoRating = ({rating}: RottenParams) => rating ? <div>Rotten Tomatoes Rating: {rating} </div> : null
