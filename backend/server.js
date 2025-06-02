import express from 'express'
import cors from 'cors'
import movies from './api/movies.route.js'
import moviesController from "./api/movies.controller.js"
import reviewsController from "./api/reviews.controller.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/v1/movies", movies)

app.use('*', (req, res) => {
  res.status(404).json({ error: "not found" })
})

export default app 