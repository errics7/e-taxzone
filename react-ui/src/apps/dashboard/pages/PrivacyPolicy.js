import React from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import PortalLayout from "../component/Layout";
import LogoPolinema from "../../../assets/logopolinema.png";

const CONTACT_EMAIL = "E-mail Admin belum tersedia";

const SECTIONS = [
  {
    title: "Pendahuluan",
    paragraphs: [
      "e-TAXZONE POLINEMA adalah aplikasi yang digunakan untuk membantu pengguna dalam pengelolaan dan pengisian SPT Tahunan Badan secara elektronik.",
    ],
  },
  {
    title: "Data yang Diproses",
    paragraphs: [
      "Aplikasi dapat memproses informasi yang diperlukan untuk penggunaan aplikasi, termasuk:",
    ],
    items: [
      "informasi akun pengguna;",
      "informasi wajib pajak/perusahaan;",
      "data SPT Tahunan;",
      "data yang dimasukkan pengguna ke dalam formulir;",
      "dokumen yang diunggah melalui fitur lampiran.",
    ],
  },
  {
    title: "Penggunaan Data",
    paragraphs: ["Data digunakan untuk:"],
    items: [
      "menyediakan fungsi aplikasi e-TAXZONE;",
      "menyimpan dan mengelola data SPT;",
      "menyediakan fitur pengelolaan dokumen;",
      "menjaga keamanan dan keandalan aplikasi.",
    ],
  },
  {
    title: "Penyimpanan Dokumen",
    paragraphs: [
      "Dokumen yang diunggah melalui aplikasi dapat disimpan pada media penyimpanan yang digunakan oleh sistem e-TAXZONE.",
      "Metadata dokumen dapat disimpan pada database aplikasi untuk mendukung pengelolaan dokumen.",
    ],
  },
  {
    title: "Penggunaan Google Drive",
    paragraphs: [
      "e-TAXZONE menggunakan Google Drive sebagai salah satu media penyimpanan dokumen aplikasi.",
      "Akses Google Drive dilakukan oleh backend aplikasi menggunakan Google API.",
      "Pengguna tidak perlu memberikan password akun Google mereka kepada e-TAXZONE.",
    ],
  },
  {
    title: "Google User Data",
    paragraphs: [
      "Akses terhadap Google Drive digunakan untuk menyediakan fungsi penyimpanan dan pengelolaan dokumen yang merupakan bagian dari aplikasi e-TAXZONE.",
      "Data Google yang diakses oleh aplikasi tidak digunakan untuk tujuan di luar fungsi aplikasi yang dijelaskan dalam kebijakan ini.",
    ],
  },
  {
    title: "Keamanan Data",
    paragraphs: [
      "Kredensial OAuth dan token akses yang digunakan untuk integrasi Google Drive dikelola pada sisi backend dan tidak disimpan pada frontend aplikasi.",
    ],
  },
  {
    title: "Akses dan Pengelolaan Dokumen",
    paragraphs: [
      "Dokumen dikelola melalui aplikasi sesuai dengan hak akses pengguna dan mekanisme pengelolaan data yang diterapkan oleh sistem.",
    ],
  },
  {
    title: "Penghapusan Data",
    paragraphs: [
      "Data dan dokumen dapat dihapus sesuai dengan mekanisme penghapusan yang tersedia pada aplikasi dan kebijakan pengelolaan data e-TAXZONE.",
    ],
  },
  {
    title: "Perubahan Kebijakan",
    paragraphs: [
      "Kebijakan privasi ini dapat diperbarui apabila terdapat perubahan pada aplikasi, fitur, atau cara pengelolaan data.",
    ],
  },
  {
    title: "Kontak",
    paragraphs: ["Untuk pertanyaan mengenai privasi dan penggunaan data:"],
    email: CONTACT_EMAIL,
  },
];

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - e-TAXZONE POLINEMA</title>
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
                Privacy Policy
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

export default PrivacyPolicy;
