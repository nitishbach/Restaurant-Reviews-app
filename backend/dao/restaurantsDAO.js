import mongodb from 'mongodb';
const ObjectId = new mongodb.ObjectId;
let restaurants;

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return;
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
        } catch (e) {
            console.error(`Unable to establish a collection handle in restaurantsDAO: ${e}`);
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query;
        console.log("filters: " + JSON.stringify(filters));
        if (filters) {
            if ("name" in filters) {
                query = { name: { $regex: filters["name"], $options:"i" } };
                // query = { "name": { $eq: filters["name"] } };
                // query = { $text: { $name: filters["name]" ] } };
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } };
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } };
            }
        }

        let cursor;

        try {
            cursor = await restaurants
                .find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try {
            const restaurantsList = await displayCursor.toArray();
            // console.log("restaurantsList: ");
            const totalNumRestaurants = await restaurants.countDocuments(query);

            return { restaurantsList, totalNumRestaurants };
        } catch (e) { 
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }
    }

    static async getRestaurantById(id) {
        try {
            const pipeline = [
                {
                    $match: {
                        _id: new mongodb.ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ];
            return await restaurants.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getRestaurantById: ${e}`);
            throw e;
        }
    }

    static async getCuisines() {
        let cusines = [];
        try {
            cusines = await restaurants.distinct("cuisine");
            return cusines;
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`);
            return cusines;
        }
    }
}