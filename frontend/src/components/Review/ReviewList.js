import React from "react";

const ReviewList = ({ reviews }) => {
  return (
    <div className="container container-fluid">
      <div className="reviews w-75 mt-5 ml-3">
        <h3>Other's Reviews:</h3>
        <hr />
        {reviews &&
          reviews.map((review) => (
            <div className="review-card my-3" key={review._id}>
              <figure className="avatar avatar-nav">
                <img
                  className="rounded-circle"
                  src={review.avatar && review.avatar}
                  alt={review.name}
                />
              </figure>
              <p className="review_user d-inline">{review.name}</p>
              <div className="rating-outer ml-2">
                <div
                  className="rating-inner"
                  style={{ width: `${(review.rating / 5) * 100}%` }}
                ></div>
              </div>
              <p className="review_comment ml-2 mt-2">{review.comment}</p>

              <hr />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReviewList;
