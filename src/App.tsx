import * as React from "react";
import "./styles.css";
import {SearchBox} from "./components/SearchBox";
import {RenderableSearchResult, SearchResult} from "./movies/types";
import {ResultTable} from "./components/ResultTable";
import {executeSearch} from "./movies/omdbapi";

// Structure the code however you'd like.
// Display a search box with a submit button.
// When a search term is entered and the submit button is clicked:
// Fetch movies whose title matches the search term from the open movie database (http://www.omdbapi.com/) using API Key 60f47463
// If you encounter problems with the provided API key, please register for your own.
// Display each of the results in a list/table that should show (any order/format - be creative!):
// 1. The movie title
// 2. The image/poster for the movie
// 3. The MPAA rating
// 4. The runtime length
// 5. The Rotten Tomatoes score, if available.
export const App = () => {
    const [searchResult, setSearchResult] = React.useState({loading: false} as RenderableSearchResult)

    const search = async (title: string) => {
        setSearchResult({loading: true} as RenderableSearchResult);
        executeSearch({title})
            .then((data: SearchResult) => setSearchResult({data, loading: false}))
            .catch(reason => setSearchResult({data: undefined, loading: false, error: reason}))
    }
    return (
        <div className="App">
            <header className="App-header">
                {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                <h1>Movie Search</h1>
            </header>
            <SearchBox search={search}/>
            <div className='container'><SearchResults {...searchResult}/></div>
            <Footer/>
        </div>
    );
}


export const SearchResults = (searchResult: RenderableSearchResult) => {
    const {data, loading, error} = searchResult;
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error</div>
    } else {
        return data ? <ResultTable {...data}/> : <div>Please Search for A movie</div>
    }
}

export const Footer = () => <footer>@Author: <a href="https://twitter.com/ColinHarrington">Colin Harrington</a> | https://www.github.com/ColinHarrington</footer>

export default App