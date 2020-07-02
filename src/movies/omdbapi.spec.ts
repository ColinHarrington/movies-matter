import {movieMarshaller, parsePosterUrl, responseIsOk} from "./omdbapi";
import {AxiosResponse} from "axios";

describe("omdbapi.ts", () => {
    describe("parsePosterUrl", () => {
        test.each([
            ["null", undefined],
            ["", undefined],
            ["amazon.com", undefined],
            ["http://example.com/img.png", new URL("http://example.com/img.png")]
        ])('parsePosterUrl(%s) === %p', (url: string, expected: URL | undefined) => {
            expect(parsePosterUrl(url)).toEqual(expected)
        })
    })

    describe("responseIsOk", () => {
        test.each([
            [200, true],
            [201, true],
            [204, true],
            [400, false],
            [404, false],
            [301, false],
            [302, false],
            [500, false]

        ])('responseIsOk(%s) === %p', (status: number, expected: boolean) => {
            expect(responseIsOk({status} as AxiosResponse)).toEqual(expected)
        })
    })


    describe('movieMarshaller', () => {
        const theMatrix = {
            "Title": "The Matrix",
            "Year": "1999",
            "Rated": "R",
            "Released": "31 Mar 1999",
            "Runtime": "136 min",
            "Genre": "Action, Sci-Fi",
            "Director": "Lana Wachowski, Lilly Wachowski",
            "Writer": "Lilly Wachowski, Lana Wachowski",
            "Actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving",
            "Plot": "Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. Morpheus awakens Neo to the real world, a ravaged wasteland where most of humanity have been captured by a race of machines that live off of the humans' body heat and electrochemical energy and who imprison their minds within an artificial reality known as the Matrix. As a rebel against the machines, Neo must return to the Matrix and confront the agents: super-powerful computer programs devoted to snuffing out Neo and the entire human rebellion.",
            "Language": "English",
            "Country": "USA",
            "Awards": "Won 4 Oscars. Another 37 wins & 50 nominations.",
            "Poster": "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
            "Ratings": [
                {"Source": "Internet Movie Database", "Value": "8.7/10"},
                {"Source": "Rotten Tomatoes", "Value": "88%"},
                {"Source": "Metacritic", "Value": "73/100"}
            ],
            "Metascore": "73",
            "imdbRating": "8.7",
            "imdbVotes": "1,616,945",
            "imdbID": "tt0133093",
            "Type": "movie",
            "DVD": "21 Sep 1999",
            "BoxOffice": "N/A",
            "Production": "Warner Bros. Pictures",
            "Website": "N/A",
            "Response": "True"
        }

        test("theMatrix is marshalled to a Movie", () => {
            const movie = movieMarshaller(theMatrix)

            expect(movie.title).toEqual("The Matrix")
            expect(movie.poster?.toString()).toEqual("https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg")
            expect(movie.mpaaRating).toEqual("R")
            expect(movie.runtime).toEqual("136 min")
            expect(movie.tomatoRating).toEqual("88%")
        });

        test("theMatrix without tomatoes", () => {
            const withoutTomatoes = {
                ...theMatrix,
                "Ratings": [
                    {"Source": "Internet Movie Database", "Value": "8.7/10"},
                    {"Source": "Metacritic", "Value": "73/100"}
                ]
            }
            const movie = movieMarshaller(withoutTomatoes)

            expect(movie.tomatoRating).toBeUndefined()
        });
    });

})