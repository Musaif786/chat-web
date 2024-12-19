import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Redirect, Route } from "react-router-dom";

const Publicroute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        // user.email ==='mdmusaif15@gmail.com' || user.email ==='mdmusaif.mm@gmail.com'  ? <Component {...props} />: <Redirect to="/" />
        !user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default Publicroute;

// ,,