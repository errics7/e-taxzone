import { Helmet } from "react-helmet";
import { Box, Typography } from "@mui/material";

import {
  ShieldOutlined,
  LockOutlined,
  SyncOutlined,
  WifiOutlined,
  ReportProblemOutlined,
  PersonOffOutlined,
  LinkOffOutlined,
  LockOpenOutlined,
} from "@mui/icons-material";

import DJP from "../assets/home.png";

/* =========================================================
   SECURITY ITEM
   ========================================================= */
function SecurityItem({
  icon,
  title,
  description,
  color,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        /*
         * Area item dibuat sedikit lebih lebar
         * agar hover putih terasa seperti panel.
         */
        padding: "13px 14px",
        margin: "0 -14px",
        borderRadius: "14px",
        cursor: "default",
        transition:
          "background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        "&:hover": {
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 6px 18px rgba(35, 55, 90, 0.08)",
          transform: "translateX(2px)",
        },
      }}
    >
      {/* =====================================================
          ICON
          ===================================================== */}
      <Box
        sx={{
          flexShrink: 0,
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          "& svg": {
            fontSize: "23px",
          },
        }}
      >
        {icon}
      </Box>

      {/* =====================================================
          TEXT
          ===================================================== */}
      <Box
        sx={{
          minWidth: 0,
          paddingTop: "1px",
        }}
      >
        <Typography
          sx={{
            fontFamily:
              '"Poppins", "Inter", Arial, sans-serif',
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#172A5C",
            marginBottom: "3px",
            letterSpacing: "-0.15px",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily:
              '"Poppins", "Inter", Arial, sans-serif',
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.45,
            color: "#4B5870",
            letterSpacing: "-0.05px",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   SECURITY CARD
   ========================================================= */

function SecurityCard({
  type,
  icon,
  title,
  description,
  children,
}) {
  const isSafe = type === "safe";

  return (
    <Box
      sx={{
        position: "absolute",

        /*
         * POSISI INI SUDAH KITA KUNCI
         * karena layout sebelumnya sudah pas.
         */
        top: isSafe ? "12%" : "44%",
        left: isSafe ? "51.5%" : "64%",
        width: "31%",
        boxSizing: "border-box",
        padding: "30px 30px 28px",
        borderRadius: "30px",

        /*
         * Border tipis seperti kaca
         */
        border:
          "1px solid rgba(255, 255, 255, 0.92)",

        /*
         * Glassmorphism
         */
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(247,249,253,0.76))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",

        /*
         * Shadow normal
         */
        boxShadow:
          "0 20px 50px rgba(40, 55, 90, 0.13)",

        /*
         * Praktik Aman di depan secara default
         */
        zIndex: isSafe ? 3 : 2,

        transition:
          "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), " +
          "box-shadow 0.4s ease",

        /*
         * Hover card
         */
        "&:hover": {
          zIndex: 20,

          boxShadow:
            "0 30px 70px rgba(35, 50, 85, 0.22)",

          transform: isSafe
            ? "translateY(-4px) rotate(-3deg) scale(1.025)"
            : "translateY(-4px) rotate(2deg) scale(1.025)",
        },
      }}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          paddingBottom: "19px",
          borderBottom:
            "1px solid rgba(30, 50, 90, 0.08)",
        }}
      >
        {/* HEADER ICON */}

        <Box
          sx={{
            flexShrink: 0,
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSafe
              ? "rgba(44, 210, 165, 0.14)"
              : "rgba(255, 90, 90, 0.12)",

            color: isSafe
              ? "#20C99A"
              : "#FF5B5B",

            "& svg": {
              fontSize: "29px",
            },
          }}
        >
          {icon}
        </Box>

        {/* HEADER TEXT */}

        <Box
          sx={{
            minWidth: 0,
            paddingTop: "1px",
          }}
        >
          <Typography
            sx={{
              fontFamily:
                '"Poppins", "Inter", Arial, sans-serif',
              fontSize: "23px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#17213F",
              marginBottom: "5px",
              letterSpacing: "-0.4px",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontFamily:
                '"Poppins", "Inter", Arial, sans-serif',
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.4,
              color: "#45516A",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          ITEMS
          ===================================================== */}

      <Box
        sx={{
          marginTop: "13px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* =========================================================
   HOME
   ========================================================= */

function HomeMhs() {
  return (
    <>
      <Helmet>
        <title>Home - Student Dashboard</title>
      </Helmet>

      {/* =====================================================
          MAIN CANVAS
          ===================================================== */}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1672 / 941",
          overflow: "hidden",
          margin: 0,
          padding: 0,
          marginTop: "0px",
        }}
      >
        {/* ===================================================
            BASE IMAGE
            =================================================== */}

        <Box
          component="img"
          src={DJP}
          alt="Informasi Coretax DJP"
          sx={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            margin: 0,
            padding: 0,
          }}
        />

        {/* ===================================================
            PRAKTIK AMAN
            =================================================== */}

        <SecurityCard
          type="safe"
          icon={<ShieldOutlined />}
          title="Praktik Aman"
          description="Lindungi akun dengan kebiasaan digital yang aman."
        >
          <SecurityItem
            icon={<LockOutlined />}
            color="#20C99A"
            title="Gunakan sandi kuat & aktifkan 2FA"
            description="Buat sandi unik, panjang, dan sulit ditebak."
          />

          <SecurityItem
            icon={<SyncOutlined />}
            color="#20C99A"
            title="Perbarui sistem & peramban"
            description="Pastikan OS dan browser selalu mutakhir."
          />

          <SecurityItem
            icon={<WifiOutlined />}
            color="#20C99A"
            title="Akses dari jaringan terpercaya"
            description="Gunakan jaringan, wifi atau VPN yang terpercaya."
          />
        </SecurityCard>

        {/* ===================================================
            HAL YANG DIHINDARI
            =================================================== */}

        <SecurityCard
          type="avoid"
          icon={<ReportProblemOutlined />}
          title="Hal yang Dihindari"
          description="Waspadai tindakan yang membahayakan akun."
        >
          <SecurityItem
            icon={<PersonOffOutlined />}
            color="#FF5B5B"
            title="Membagikan OTP / Kode Akses"
            description="Jangan berikan kode kepada siapa pun."
          />

          <SecurityItem
            icon={<LinkOffOutlined />}
            color="#FF5B5B"
            title="Mengklik tautan mencurigakan"
            description="Hindari tautan asing dari WhatsApp atau Email."
          />

          <SecurityItem
            icon={<LockOpenOutlined />}
            color="#FF5B5B"
            title="Meninggalkan perangkat terbuka"
            description="Selalu lock perangkat Anda saat tidak digunakan."
          />
        </SecurityCard>
      </Box>
    </>
  );
}

export default HomeMhs;