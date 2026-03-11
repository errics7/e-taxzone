import React, { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import API from "../../../utils/host.config";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Button, CircularProgress, IconButton } from "@mui/material";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UpdateDetailPengguna from "./UpdateDetailPengguna";
import UpdatePasswordPengguna from "./UpdatePasswordPengguna";
import { sett } from "../../../redux/userSlice";
import jsPDF from 'jspdf';

function MyAccount(props) {
  const dispatch = useDispatch();
  const stateUser = useSelector((state) => state.user);
  const counter = useSelector((state) => state.counter); //counter refresh
  const [showUpdate, setShowUpdate] = useState(false);
  const [showChPass, setChPass] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [taxpayerData, setTaxpayerData] = useState(null);
  const [loadingTaxpayer, setLoadingTaxpayer] = useState(false);
  const fileInputRef = useRef(null);

  const { data, error, mutate } = useSWR(
    `${API.HOST}/api/v2/myaccount/show/${stateUser.value._id}#${counter.value}`,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((res) => res.data),
    {
      refreshWhenOffline: true,
      loadingTimeout: 60000, //default 3000ms
      onLoadingSlow: () =>
        toast.error("Koneksi Anda Buruk", {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          error: {
            duration: 5000,
          },
          icon: "⚠️",
        }),
    }
  );

  // Helper function to get auth headers
  const getAuthHeaders = () => ({
    'Authorization': 'Bearer ' + localStorage.getItem('xtoken'),
    'Content-Type': 'application/json'
  });

  // Fetch taxpayer profile data
  const fetchTaxpayerProfile = async () => {
    try {
      setLoadingTaxpayer(true);
      const response = await fetch(`${API.HOST}/api/v2/taxpayer/profile`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      if (result.success) {
        setTaxpayerData(result.data);
      }
    } catch (error) {
      console.error('Error fetching taxpayer profile:', error);
      toast.error("Gagal memuat data pajak", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
        },
        duration: 3000,
      });
    } finally {
      setLoadingTaxpayer(false);
    }
  };

  // Generate NPWP number from NIK (simplified logic)
  const generateNPWPFromNIK = (nik) => {
    if (!nik) return "00.000.000.0-000.000";
    
    // Simple transformation: take first 9 digits and add formatting
    const digits = nik.replace(/\D/g, '').substring(0, 15);
    if (digits.length >= 15) {
      return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}.${digits.substring(8, 9)}-${digits.substring(9, 12)}.${digits.substring(12, 15)}`;
    }
    return "00.000.000.0-000.000";
  };

  // Generate NPWP Card PDF
  const generateNPWPCard = () => {
    if (!taxpayerData) {
      toast.error("Data pajak belum tersedia", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
        },
        duration: 3000,
      });
      return;
    }

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98] // Credit card size
    });

    // Card background (light gray gradient)
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, 85.6, 53.98, 'F');

    // Top header (gray)
    pdf.setFillColor(200, 200, 200);
    pdf.rect(0, 0, 85.6, 8, 'F');

    // NPWP Logo area (white box)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(3, 1, 12, 6, 'F');
    
    // NPWP Text
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 139); // Navy blue
    pdf.text('npwp', 4, 5);

    // KPP PRATAMA text (top right)
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('KPP PRATAMA KOTABUMI', 55, 5);

    // Main yellow section
    pdf.setFillColor(255, 215, 0); // Gold/Yellow
    pdf.rect(0, 8, 85.6, 30, 'F');

    // NPWP Number (large, prominent)
    const npwpNumber = generateNPWPFromNIK(taxpayerData.nik);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(npwpNumber, 3, 18);

    // Name (bold, uppercase)
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(taxpayerData.full_name.toUpperCase(), 3, 32);

    // ID number (small, top right of yellow section)
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(taxpayerData.nik.substring(0, 13), 65, 12);

    // Bottom white section
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 38, 85.6, 15.98, 'F');


    // Address (right side of QR code)
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('JL. AK. GANI RT. 001 RW. 008', 18, 42);
    pdf.text('AIR RINGKIH REBANG TANGKAS', 18, 45);
    pdf.text('KAB. WAY KANAN LAMPUNG', 18, 48);

    // Government logos (bottom right)
    // Logo 1 (blue circle)
    pdf.setFillColor(0, 0, 139);
    pdf.circle(74, 47, 3, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.circle(74, 47, 1.5, 'F');

    // Logo 2 (orange square)
    pdf.setFillColor(255, 165, 0);
    pdf.rect(78, 44, 6, 6, 'F');
    pdf.setFillColor(255, 255, 255);
    pdf.rect(79.5, 45.5, 3, 3, 'F');

    // Date (bottom left)
    const currentDate = new Date().toLocaleDateString('id-ID');
    pdf.setFontSize(5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(currentDate, 3, 52);

    // Save the PDF
    pdf.save(`NPWP_${taxpayerData.full_name.replace(/\s+/g, '_')}.pdf`);
    
    toast.success("Kartu NPWP berhasil diunduh", {
      style: {
        minWidth: "250px",
        border: "1px solid #10B981",
        padding: "16px",
        color: "#000",
      },
      duration: 3000,
    });
  };

  // Load taxpayer data on component mount
  useEffect(() => {
    fetchTaxpayerProfile();
  }, []);

  // Fungsi untuk menangani klik pada tombol upload foto
  const handlePhotoButtonClick = () => {
    fileInputRef.current.click();
  };

  // Fungsi untuk menangani upload foto
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau GIF", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
        },
        duration: 3000,
      });
      return;
    }

    // Validasi ukuran file (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maksimal 5MB)", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
        },
        duration: 3000,
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await axios.post(
        `${API.HOST}/api/v2/update-profile-photo`,
        formData,
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('xtoken'),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        console.log('response data ', response.data)
        toast.success("Foto profil berhasil diperbarui", {
          style: {
            minWidth: "250px",
            border: "1px solid #10B981",
            padding: "16px",
            color: "#000",
          },
          duration: 3000,
        });

        // Update state user with new image URL
        const updatedUser = {
          ...stateUser.value,
          img_url: response.data.img_url
        };
        dispatch(sett(updatedUser));
        
        // Refresh data
        mutate();
      } else {
        toast.error(response.data.message || "Gagal memperbarui foto profil", {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
          },
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Terjadi kesalahan saat memperbarui foto profil", {
        style: {
          minWidth: "250px",
          border: "1px solid #FF4C4D",
          padding: "16px",
          color: "#000",
        },
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  // Mendapatkan URL gambar profil
  const getProfileImageUrl = () => {
    if (data && data.akun && data.akun.img_url) {
      return `${API.HOST}${data.akun.img_url}`;
    }
    if (stateUser.value.img_url && stateUser.value.img_url.startsWith('/assets')) {
      return `${API.HOST}${stateUser.value.img_url}`;
    }
    return stateUser.value.img_url || 'https://res.cloudinary.com/miewtech/image/upload/v1623974364/defuser_ivetsc.png';
  };

  if (error) return "Failed to load...";

  return (
    <div className="bg-white shadow-md border rounded flex flex-col -mt-16">
      <Helmet>
        <title>Account Saya | Polinema</title>
      </Helmet>
      <h1 className="text-left m-3 ml-6 font-bold border-b pb-3">Akun Saya</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 w-64 p-5 m-3 bg-slate-200">
          <span className="mb-3 inline-block">Preview</span>
          {/* Left Preview */}
          <div className="w-52 mx-auto rounded bg-white text-slate-600 min-h-20v relative">
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <CircularProgress size={40} style={{ color: 'white' }} />
              </div>
            )}
            <LazyLoadImage
              alt="profile-virtualtour"
              effect="blur"
              src={getProfileImageUrl()}
              width="100%"
            />
            <div className="absolute bottom-2 right-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <IconButton 
                color="primary" 
                onClick={handlePhotoButtonClick}
                style={{ 
                  backgroundColor: 'white', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)' 
                }}
                size="small"
                disabled={uploading}
              >
                <PhotoCameraIcon />
              </IconButton>
            </div>
          </div>

        </div>
        
        <div className="flex-1 m-3 relative">
          {!data && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <CircularProgress />
            </div>
          )}
          <span className="inline-block w-full bg-gradient-to-r from-slate-200 font-semibold text-left p-3">
            Detail Account
          </span>
          <div className="text-left">
            {/* content list*/}
            <div className="w-full my-2">
              <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                <div className="flex-none w-1/5 p-3 text-left font-medium">
                  <div className="flex justify-between">
                    <p>Nama Lengkap </p>
                    <p>:</p>
                  </div>
                </div>
                <div className="grow p-3">
                  {data && data.akun.nama
                    ? data.akun.nama
                    : stateUser.value.nama}
                </div>
              </div>
              <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                <div className="flex-none w-1/5 p-3 text-left font-medium">
                  <div className="flex justify-between">
                    {stateUser.value.authorize === "mahasiswa" ? (
                      <p>NIM</p>
                    ) : (
                      <p>NIP </p>
                    )}
                    <p>:</p>
                  </div>
                </div>
                <div className="grow p-3">
                  {data && data.akun.nim ? data.akun.nim : stateUser.value.nim}
                </div>
              </div>
              <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                <div className="flex-none w-1/5 p-3 text-left font-medium">
                  <div className="flex justify-between">
                    <p>Email </p>
                    <p>:</p>
                  </div>
                </div>
                <div className="grow p-3">
                  {data && data.akun.email ? (
                    data.akun.email
                  ) : stateUser.value.email === "" ? (
                    <div className="opacity-40">Email belum diatur</div>
                  ) : (
                    stateUser.value.email
                  )}
                </div>
              </div>
              <div className="flex items-start cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                <div className="flex-none w-1/5 p-3 text-left font-medium">
                  <div className="flex justify-between">
                    <p>Tempat, Tanggal Lahir</p>
                    <p>:</p>
                  </div>
                </div>
                <div className="grow p-3 flex items-start">
                  {data && data.akun.ttl ? (
                    data.akun.ttl
                  ) : (
                    <p className="opacity-40">Tanggal Lahir belum diatur</p>
                  )}
                </div>
              </div>
              <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                <div className="flex-none w-1/5 p-3 text-left font-medium">
                  <div className="flex justify-between">
                    <p>Alamat </p>
                    <p>:</p>
                  </div>
                </div>
                <div className="grow p-3">
                  {data && data.akun.alamat ? (
                    data.akun.alamat
                  ) : (
                    <p className="opacity-40">Alamat belum diatur</p>
                  )}
                </div>
              </div>
              <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                <div className="flex-none w-1/5 p-3 text-left font-medium">
                  <div className="flex justify-between">
                    <p>Nomor Telephone </p>
                    <p>:</p>
                  </div>
                </div>
                <div className="grow p-3">
                  {data && data.akun.no_tlfn ? (
                    data.akun.no_tlfn
                  ) : (
                    <p className="opacity-40">Nomor Telphone belum diatur</p>
                  )}
                </div>
              </div>

              {/* NPWP Information Section */}
              {taxpayerData && (
                <>
                  <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                    <div className="flex-none w-1/5 p-3 text-left font-medium">
                      <div className="flex justify-between">
                        <p>NPWP </p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="grow p-3">
                      {generateNPWPFromNIK(taxpayerData.nik)}
                    </div>
                  </div>
                  <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                    <div className="flex-none w-1/5 p-3 text-left font-medium">
                      <div className="flex justify-between">
                        <p>NIK </p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="grow p-3">
                      {taxpayerData.nik}
                    </div>
                  </div>
                  <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                    <div className="flex-none w-1/5 p-3 text-left font-medium">
                      <div className="flex justify-between">
                        <p>Status Pernikahan </p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="grow p-3">
                      {taxpayerData.marital_status}
                    </div>
                  </div>
                  <div className="flex items-start md:items-center cursor-pointer my-1 hover:bg-blue-50 rounded border-b">
                    <div className="flex-none w-1/5 p-3 text-left font-medium">
                      <div className="flex justify-between">
                        <p>Jenis Pekerjaan </p>
                        <p>:</p>
                      </div>
                    </div>
                    <div className="grow p-3">
                      {taxpayerData.type_of_work}
                    </div>
                  </div>
                </>
              )}

              {/* update */}
              <div className="sm:flex bg-gradient-to-r from-slate-200 sm:items-center px-2 py-2 mt-10">
                &nbsp;
              </div>
              <div className="relative flex flex-col items-start space-y-2 mt-3">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<PermContactCalendarIcon />}
                  onClick={() => {
                    setShowUpdate(true);
                  }}
                >
                  Perbarui Akun
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<SyncLockIcon />}
                  onClick={() => {
                    setChPass(true);
                  }}
                >
                  Ganti Password
                </Button>
                {taxpayerData && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<AssignmentIcon />}
                    onClick={generateNPWPCard}
                  >
                    Unduh Kartu NPWP
                  </Button>
                )}
              </div>
              {/* end update */}
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      {showUpdate && (
        <UpdateDetailPengguna
          detailUser={data?.akun}
          stateUser={stateUser.value}
          close={() => setShowUpdate(false)}
        />
      )}
      {showChPass && (
        <UpdatePasswordPengguna
          data={stateUser.value}
          close={() => setChPass(false)}
        />
      )}
    </div>
  );
}

export default MyAccount;