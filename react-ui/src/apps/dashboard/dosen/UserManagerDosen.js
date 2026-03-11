import React from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import NotifUser from "../admin/users/component/NotificationUsers";
import TableUserMahasiswa from "../admin/users/component/TableUserMahasiswa";

function UserManagerDosen(props) {
  const user = useSelector((state) => state.user.value);
  const authorize = user.authorize;

  return (
    <>
      <Helmet>
        <title>
          Pengelola Mahasiswa |{" "}
          {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>
      <NotifUser />
      <TableUserMahasiswa />
    </>
  );
}

export default UserManagerDosen;
