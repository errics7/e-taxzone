let HOST =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    //: "https://api.etaxzonepolinema.my.id";
    : "https://etaxzone-api.vercel.app";
    
const MODE = "perdagangan";

const getAuthHeaders = () => {
        const token = localStorage.getItem('xtoken') || sessionStorage.getItem('xtoken');
        return {
            'Authorization': `Bearer ${token}`
        };
    };

module.exports = {
  HOST,
  MODE,
  getAuthHeaders
};

// module.exports = {
//   HOST: "https://api-hidden-lms.vercel.app",
//   MODE: "perdagangan" / :"manufaktur"
// };