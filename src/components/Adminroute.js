import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Redirect, Route } from "react-router-dom";

const Adminroute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        user.email ==='mdmusaif.mm@gmail.com' || user.email ==='mdmusaif15@gmail.com'  ? <Component {...props} />: <Redirect to="/" />
      }
    />
  );
};

export default Adminroute;

// ,,