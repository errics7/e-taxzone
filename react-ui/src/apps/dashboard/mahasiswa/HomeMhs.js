import { Helmet } from "react-helmet";
import DJP from "../assets/home.png";
import { Box } from "@mui/material";

function HomeMhs() {
  return (
    <>
      <Helmet>
        <title>Home - Student Dashboard</title>
      </Helmet>
      
      <Box 
        sx={{
          padding: 0,
          margin: 0,
          backgroundImage: `url(${DJP})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      />
    </>
  );
}

export default HomeMhs