import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// material
import { Box } from "@mui/material";
import LogoPolinema from "../../../assets/logopolinema.png";
// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 10
        }}
      >
        <img
          src={LogoPolinema}
          alt="Polinema Logo"
          style={{ width: 56 }}
        />

        <span
          style={{
            color: "#FFA500",
            fontWeight: "bold",
            fontSize: "22px"
          }}
        >
          e-TAXZONE
        </span>
      </div>
    </RouterLink>
  );
}