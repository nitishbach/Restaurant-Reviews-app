exports = async function({ query, headers, body}, response) {
    
   
    const {restaurantsPerPage = 20, page = 0} = query;
    
    let filters = {}
        if (query.cuisine) {
          query = { "cuisine": { $eq: query.cuisine } }
        } else if (query.zipcode) {
          query = { "address.zipcode": { $eq: query.zipcode} }
        } else if (query.name) {
          query = { name: { $regex: query.name, $options:"i" } }
        }
        
        const collection = context.services.get("mongodb-atlas").db("sample_restaurants").collection("restaurants")
        let restaurantsList = await collection.find(query).skip(page*restaurantsPerPage).limit(restaurantsPerPage).toArray();
        restaurants.forEach(restaurant => {
          restaurant._id = restaurant._id.toString();
        })
        
    
        let responseData = {
          restaurants: restaurantsList,
          page: page.toString(),
          filters: query,
          entries_per_page: restaurantsPerPage.toString(),
          total_results: restaurantsList.length.toString(),
        }
    
    return responseData;
};
