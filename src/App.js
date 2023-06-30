import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/login";
import RestaurantsList from "./components/restaurants-list";
import Restaurants from "./components/restaurants";
import AddReview from "./components/add-review";
import Test from "./components/test";

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return ( 
    <div>
      <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">

        <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
                restaurants
            </Link>
          </li>
          <li className="nav-item" >
            {user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (

              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
          <li className="nav-item">
            <Link to={"/test"} className="nav-link">
                Test
            </Link>
          </li>

        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"} element={<RestaurantsList/>} />
          <Route path="/restaurants" element={<RestaurantsList/>} />
          
          <Route path="/restaurants/:id/review" 
            element={<AddReview user={user} edit={false} />} />
            
          <Route path="/restaurants/:id/review/edit/:reviewId/:reviewText" 
            element={<AddReview user={user} edit={true}/>} />
          <Route path="/restaurants/:id/review/edit/:reviewId/" 
            element={<AddReview user={user} edit={true}/>} />
          
          <Route 
            path="/restaurants/:id"
            element={<Restaurants user={user} />}
            // render={(props) => (
            //   <Restaurants {...props} user={user} />
            // )}
          />

          <Route path="/login" 
            element = { <Login login={login} /> } />

          <Route path="/test"
            element = { <Test /> } />
        
        </Routes>

      </div>
      </Router>
    </div>
  );
}

export default App;
