import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let movies 

export default class MoviesDAO{ 
    static async injectDB(conn){ 
        if(movies){ 
            return
        }
        try{ 
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
					.collection('movies')
        } 
        catch(e){
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}){
        let query 
        if(filters){ 
            if("title" in filters){ 
                query = { $text: { $search: filters['title']}}
            }else if("rated" in filters){ 
                query = { "rated": { $eq: filters['rated']}} 
            }                                
        }

        let cursor 
        try{
			cursor = await movies
					.find(query)
					.limit(moviesPerPage)
					.skip(moviesPerPage * page)           
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return {moviesList, totalNumMovies}
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0}
        }
    }

    static async getMovieById(id) {
        try {
            return await movies.findOne({ _id: new ObjectId(id) })
        } catch (e) {
            console.error(`Unable to get movie by ID: ${e}`)
            return null
        }
    }

    static async getRatings() {
        let ratings = []
        try {
            ratings = await movies.distinct("rated")
            return ratings
        } catch (e) {
            console.error(`Unable to get ratings: ${e}`)
            return ratings
        }
    }
}