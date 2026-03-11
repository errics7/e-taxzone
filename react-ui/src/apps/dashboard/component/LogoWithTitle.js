import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// material
import { Box, Typography } from "@mui/material";
import logoPoltek from "../../../assets/logopolinema.png";
// ----------------------------------------------------------------------

LogoWithTitle.propTypes = {
    sx: PropTypes.object,
};

const Circle = ({ bgcolor }) => {
    return (
        <Box
            sx={{
                width: 15,
                height: 15,
                bgcolor: bgcolor,
                borderRadius: '50%',
            }}
        />
    );
};

export default function LogoWithTitle({ sx }) {
    return (
        <RouterLink to="/">
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.1 }}>
                    <Circle bgcolor={'#2F1C6E'} />
                    <Circle bgcolor={'#2D70AE'} />

                </Box>
                <Typography sx={{ color: '#000', fontSize: 15 }} variant="h4">OOPedia</Typography>
            </Box>
        </RouterLink>
    );
}
