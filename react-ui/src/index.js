import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppRoute from "./AppRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <AppRoute />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
