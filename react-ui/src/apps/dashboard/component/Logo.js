import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// material
import { Box } from "@mui/material";
// import logoPoltek from "../../dashboard/assets/OOPEDIA.png";
// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/">
      <center>
         <h1 className="text-2xl font-bold text-yellow-400 mb-2 mt-8">
            e-<span className="text-yellow-400">TAXZONE</span>
          </h1>
      </center>
    </RouterLink>
  );
}
