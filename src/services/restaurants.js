import http from "../http-common";

class RestaurantDataService {
    getAll(page = 0) {
        console.log("IN GET ALL RESTAURANTS DATA SERVICE -----------------------------------------------------");
        // return http.get();
        return http.get(`/restaurants`);
    }

    get(id) {
        return http.get(`/restaurant?id=${id}`);
      }

    find(query, by = "name", page = 0) {
        return http.get(`restaurants?${by}=${query}&page=${page}`);
    }

    createReview(data) {
        return http.post("/review_new", data);
    }

    updateReview(data) {
        return http.put("/review_edit", data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review_delete?id=${id}`, {data: {user_id: userId}});
    }

    getCuisines(id) {
        return http.get(`/cuisines`);
    } 
}

export default new RestaurantDataService();