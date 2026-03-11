import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import NotifUser from "./component/NotificationUsers";
import TableUser from "./component/TableUser";

function UserManagerAdmin(props) {
  const user = useSelector((state) => state.user.value);
  const authorize = user.authorize;

  return (
    <>
      <Helmet>
        <title>
          Pengelola Pengguna |{" "}
          {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>
      <NotifUser />
      <TableUser />
    </>
  );
}

export default UserManagerAdmin;
