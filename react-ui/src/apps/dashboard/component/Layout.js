import PortalLogin from "../assets/portal-login-bg.png";

const PortalLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${PortalLogin})`,
      }}
    >
      {children}
    </div>
  );
};

export default PortalLayout;