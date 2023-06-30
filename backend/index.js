import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

console.log(process.env.RESTREVIEWS_DB_URI);

// Connect to MongoDB
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        //poolSize: 50,
        wtimeout: 2500,
       useNewUrlParser: true,
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await RestaurantsDAO.injectDB(client); //initial refernce to restaurants in the database
        await ReviewsDAO.injectDB(client); //initial refernce to reviews in the database
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    })