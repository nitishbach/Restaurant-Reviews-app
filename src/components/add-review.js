import React, { useState } from "react";
import RestaurantDataService from "../services/restaurants";
import { Link, useParams, useLocation} from "react-router-dom";

const AddReview = props => {

  let initialReviewState = ""

  let editing = props.edit;

  // console.log(editing);

  const { id } = useParams();
  const { reviewId } = useParams();
  const { reviewText } = useParams();
  // let canceled = false;
  // const  location = useLocation();

  // const { state } = location;
  // console.log(
  //   "msg: " + state
  // );

  // // if (state && currentReview) {
  //   editing = true;
  //   initialReviewState = state.currentReview.text
    
  // }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: id
    };

    if (editing) {
      // console.log(currentReview);
      data.review_id = reviewId;
      RestaurantDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      RestaurantDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  // const cancel = () => {
  //   setSubmitted(true);
  //   setCanceled(true);
  //   console.log("canceled");

  // }


  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/restaurants/" + id} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
            <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
                placeholder = {editing ? reviewText : "Enter review"}
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button> 
            <Link to={"/restaurants/" + id} className="btn btn-success">
              Cancel
            </Link>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;