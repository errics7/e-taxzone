import React, {useState} from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from '@mui/icons-material/Menu';
import ToggleButton from '@mui/material/ToggleButton';
import CloseIcon from '@mui/icons-material/Close';

export default function NavigasiTopPerdagangan() {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const [visible, setVisible] = useState(false);
  
  function Login() {
    if (user.isAuth) {
      var lnk = "/";
      if (user.value.authorize === "mahasiswa") {
        lnk = "/home";
      } else if (user.value.authorize === "dosen") {
        lnk = "/dosen";
      } else if (user.value.authorize === "admin") {
        lnk = "/admin";
      }

      return (
        <NavLink
          to={lnk}
          className="text-white font-bold text-sm uppercase mr-3 ml-0"
        >
          Dashboard
        </NavLink>
      );
    }
    return (
      <NavLink
        to="/login"
        className="text-white font-bold text-sm uppercase mr-3 ml-0"
      >
        Login
      </NavLink>
    );
  }

  const active = "border-b-2 border-white";

  return (
    <header>
     <nav
        className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg
          bg-blue-800 
          text-white 
        "
      >
        <div className={`mx-auto container w-full flex md:flex-row items-center justify-between ${visible === true && "flex-col items-start justify-start"}`}>
          <div className="md:hidden block">
            <ToggleButton
              onClick={() => setVisible(prev => !prev)} 
              value="left" 
              aria-label="left aligned">
                {visible !== true ? <MenuIcon style={{color: 'white', outline: 'none'}} /> : <CloseIcon style={{color: 'white', outline: 'none'}} />}
            </ToggleButton>
          </div>
        
          <div className={`${visible !== true && "hidden"} w-full md:flex md:items-center md:w-auto`} >
            <ul
              className="
                pt-4
                text-base text-gray-700
                md:flex
                md:justify-between 
                md:pt-0"
            >
              <style
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n.dropdown:hover > .dropdown-content {\n\tdisplay: block;\n}\n.dropdown2:hover > .dropdown2-content {\n\tdisplay: block;\n}\n",
                  }}
                />
              <li className="md:m-2">
              <div className="dropdown md:p-1 w-full block relative hover:bg-blue-300 rounded">
                  <NavLink
                    to="/"
                    exact
                    isActive={() => ["/"].includes(pathname)}
                    activeClassName={active}
                    className="text-white font-bold text-sm uppercase"
                  >
                    Home
                  </NavLink>
                </div>
              </li>
              <li className="md:m-2 mt-5">
                  <div className="dropdown md:p-1 w-full block relative hover:bg-blue-300 rounded">
                  <button className="text-white font-bold text-sm uppercase ">
                    Informasi Umum
                  </button>
                  <ul className="dropdown-content absolute hidden text-slate-700 pt-2 px-2 -ml-3 w-44 z-50">
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-t"
                        to="/b/profil"
                      >
                        Profil
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                        to="/b/bagan-organisasi"
                      >
                        Bagan Organisasi
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-b"
                        to="/b/departemen-bagian"
                      >
                        Departemen Bagian
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="md:m-2 mt-5 mb-5">
                  <div className="dropdown2 md:p-1 md:inline-block relative hover:bg-blue-300 rounded">
                  <button className=" text-white font-bold text-sm uppercase ">
                    Sistem & prosedur
                  </button>
                  <ul className="dropdown2-content absolute hidden text-slate-700 -ml-2 pt-2 w-44 z-50">
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-t"
                        to="/b/prosedur-pembelian"
                      >
                        Prosedur Pembelian
                      </NavLink>
                    </li> 
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                        to="/b/prosedur-penggajian"
                      >
                        Prosedur Penggajian
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                        to="/b/prosedur-penjualan"
                      >
                        Prosedur Penjualan
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                        to="/b/prosedur-peneriamaan-kas"
                      >
                        Prosedur Penerimaan Kas
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                        to="/b/prosedur-pengeluaran-kas"
                      >
                        Prosedur Pengeluaran Kas
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-b"
                        to="/b/prosedur-penagihan-dan-penerimaan-piutang"
                      >
                        Prosedur Penagihan
                      </NavLink>
                    </li>
                  </ul>
                </div>
              
              </li>
            </ul>
          </div>

          <div>
            <Login />
          </div>
        </div>
    </nav>
  </header>
  
  );
}
