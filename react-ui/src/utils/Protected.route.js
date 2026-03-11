import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({
  allowed = [""],
  component: Component,
  ...rest
}) => {
  const user = useSelector((state) => state.user);

  // check user is Logged in
  function isLoggedIn() {
    // console.log("aut", user);
    if (user.isAuth) {
      if (allowed.includes(user.value.authorize)) {
        // console.log("Akses allowed");
        return true;
      } else {
        // console.log("Akses Terbatas");
        return false;
      }
    } else {
      return user.isAuth;
    }
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};