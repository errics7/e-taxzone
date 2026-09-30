import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import PortalLayout from "../component/Layout";
import LogoPolinema from "../../../assets/logopolinema.png";

const CONTACT_EMAIL = "etaxzone.storage@gmail.com";

const SECTIONS = [
  {
    title: "Pendahuluan",
    paragraphs: [
      "e-TAXZONE POLINEMA adalah aplikasi yang dimaksudkan untuk membantu pengguna dalam pengelolaan dan pengisian SPT Tahunan Badan secara elektronik.",
      "Aplikasi ini saat ini berada pada tahap pengembangan/simulasi. Ketentuan ini bersifat umum dan dapat berubah seiring perkembangan aplikasi.",
    ],
  },
  {
    title: "Penggunaan Layanan",
    paragraphs: [
      "Pengguna dapat menggunakan aplikasi sesuai dengan fitur yang tersedia dan aturan yang berlaku pada aplikasi.",
    ],
  },
  {
    title: "Akun Pengguna",
    paragraphs: [
      "Pengguna bertanggung jawab menjaga kerahasiaan kredensial akun dan atas seluruh aktivitas yang dilakukan menggunakan akun tersebut.",
    ],
  },
  {
    title: "Data dan Dokumen",
    paragraphs: [
      "Pengguna bertanggung jawab atas kebenaran dan keabsahan data serta dokumen yang dimasukkan atau diunggah melalui aplikasi.",
    ],
  },
  {
    title: "Penyimpanan Dokumen",
    paragraphs: [
      "Dokumen yang diunggah melalui aplikasi dapat disimpan menggunakan infrastruktur penyimpanan yang digunakan oleh e-TAXZONE.",
    ],
  },
  {
    title: "Google Drive",
    paragraphs: [
      "e-TAXZONE dapat menggunakan Google Drive sebagai infrastruktur untuk penyimpanan dan pengelolaan dokumen.",
      "Untuk keperluan tersebut, aplikasi menggunakan Google API. Pengguna tidak perlu memberikan password akun Google mereka kepada e-TAXZONE.",
    ],
  },
  {
    title: "Keamanan",
    paragraphs: [
      "e-TAXZONE menerapkan langkah-langkah teknis yang wajar untuk membantu melindungi data dan kredensial aplikasi. Namun, tidak ada sistem yang dapat dijamin sepenuhnya aman.",
    ],
  },
  {
    title: "Tanggung Jawab Pengguna",
    paragraphs: [
      "Pengguna bertanggung jawab atas informasi, data, dan dokumen yang disampaikan melalui aplikasi, serta tidak menyalahgunakan layanan.",
    ],
  },
  {
    title: "Ketersediaan Layanan",
    paragraphs: [
      "Ketersediaan aplikasi dapat dipengaruhi oleh pemeliharaan, gangguan teknis, infrastruktur, atau keadaan lainnya. Aplikasi tidak menjamin layanan selalu tersedia tanpa gangguan.",
    ],
  },
  {
    title: "Penghapusan Data",
    paragraphs: [
      "Data dan dokumen dapat dihapus sesuai dengan mekanisme dan kebijakan yang diterapkan oleh e-TAXZONE.",
    ],
  },
  {
    title: "Perubahan Ketentuan",
    paragraphs: [
      "Ketentuan layanan ini dapat diperbarui apabila terdapat perubahan pada aplikasi, fitur, atau kebijakan operasional.",
    ],
  },
  {
    title: "Hubungan dengan Google",
    paragraphs: [
      "e-TAXZONE bukan Google. Google Drive dan Google API adalah layanan pihak ketiga yang disediakan oleh Google.",
    ],
  },
  {
    title: "Kontak",
    paragraphs: ["Untuk pertanyaan mengenai ketentuan layanan:"],
    email: CONTACT_EMAIL,
  },
];

function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - e-TAXZONE POLINEMA</title>
      </Helmet>
      <PortalLayout>
        <div className="flex-1 flex flex-col items-center p-6">
          {/* Brand header (same as Login) */}
          <div className="flex items-center justify-center gap-2 mb-6 mt-2">
            <img
              src={LogoPolinema}
              alt="Polinema Logo"
              className="w-24 h-auto"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-blue-800">e-TAXZONE</span>{" "}
              <span className="text-yellow-500">POLINEMA</span>
            </h1>
          </div>

          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 sm:p-10 md:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Terms of Service
              </h2>
              <p className="text-sm font-medium text-blue-800 mt-1">
                e-TAXZONE POLINEMA
              </p>
            </div>

            <div className="space-y-8">
              {SECTIONS.map((section, index) => (
                <section key={section.title}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {index + 1}. {section.title}
                  </h3>
                  <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                    {section.paragraphs.map((text) => (
                      <p key={text}>{text}</p>
                    ))}
                    {section.items && (
                      <ul className="list-disc pl-6 space-y-1">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.email && (
                      <p>
                        <a
                          href={`mailto:${section.email}`}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          {section.email}
                        </a>
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <NavLink
                to="/login"
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Kembali ke Login
              </NavLink>
            </div>
          </div>
        </div>
      </PortalLayout>
    </>
  );
}

export default TermsOfService;
