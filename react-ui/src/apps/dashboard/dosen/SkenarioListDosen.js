import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Alert
} from "@mui/material";
import {
  ExpandMore,
  Assessment,
  Visibility,
  PictureAsPdf,
  Close,
  Download,
  Star
} from "@mui/icons-material";
import axios from "axios";
import API from "../../../utils/host.config";
import toast from "react-hot-toast";
import swal from "sweetalert";
import useSWR from "swr";
import jsPDF from 'jspdf';
import { useEffect } from "react";
import generateCompleteSPTPDF, { generateSPTPDF } from "../component/generateSPTPDF";

// const generateSPTPDF = (sptData) => {
//   console.log('spt data ', sptData);
//   const doc = new jsPDF('p', 'mm', 'a4');

//   // Colors matching the official form
//   const headerBlue = [41, 98, 159];
//   const sectionBlue = [52, 84, 139];
//   const lightBlue = [173, 216, 230];
//   const yellow = [255, 193, 7];
//   const orange = [255, 152, 0];
//   const lightGray = [240, 240, 240];

//   // Helper functions
//   const addBlueHeader = (title, y, width = 190) => {
//     doc.setFillColor(...sectionBlue);
//     doc.rect(10, y, width, 6, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.text(title, 12, y + 4);
//     doc.setTextColor(0, 0, 0);
//     return y + 8;
//   };

//   const addCheckbox = (x, y, checked = false, size = 3) => {
//     doc.setLineWidth(0.4);
//     doc.setDrawColor(0, 0, 0);
//     doc.rect(x, y, size, size);
//     if (checked) {
//       doc.setFillColor(0, 0, 0);
//       doc.rect(x + 0.3, y + 0.3, size - 0.6, size - 0.6, 'F');
//     }
//   };

//   const addInputField = (x, y, width, height = 4) => {
//     doc.setLineWidth(0.3);
//     doc.setDrawColor(0, 0, 0);
//     doc.rect(x, y, width, height);
//   };

//   const addYellowBox = (x, y, width, height, text) => {
//     doc.setFillColor(...yellow);
//     doc.rect(x, y, width, height, 'F');
//     doc.setLineWidth(0.3);
//     doc.setDrawColor(0, 0, 0);
//     doc.rect(x, y, width, height);
//     doc.setTextColor(0, 0, 0);
//     doc.setFontSize(6);
//     doc.setFont('helvetica', 'bold');
//     doc.text(text, x + 1, y + 2.5);
//   };

//   // Start PDF Generation
//   let yPos = 8;

//   // === HEADER SECTION ===
//   // Main header background
//   doc.setFillColor(...lightBlue);
//   doc.rect(10, yPos, 190, 25, 'F');
//   doc.setLineWidth(0.5);
//   doc.setDrawColor(0, 0, 0);
//   doc.rect(10, yPos, 190, 25);

//   // Logo area
//   doc.setFillColor(255, 255, 255);
//   doc.rect(15, yPos + 3, 22, 19, 'F');
//   doc.rect(15, yPos + 3, 22, 19);
  
//   // Add logo placeholder
//   doc.setFillColor(41, 98, 159);
//   doc.circle(26, yPos + 8, 4, 'F');
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('LOGO', 23, yPos + 9);
  
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(5);
//   doc.text('KEMENTERIAN KEUANGAN', 16, yPos + 15);
//   doc.text('REPUBLIK INDONESIA', 16, yPos + 18);
//   doc.text('DIREKTORAT JENDERAL PAJAK', 16, yPos + 21);

//   // Ministry text (center)
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(10);
//   doc.setFont('helvetica', 'bold');
//   doc.text('KEMENTERIAN KEUANGAN', 105, yPos + 8, { align: 'center' });
//   doc.text('REPUBLIK INDONESIA', 105, yPos + 12, { align: 'center' });
//   doc.text('DIREKTORAT JENDERAL PAJAK', 105, yPos + 16, { align: 'center' });

//   // SPT Title section (right)
//   doc.setFillColor(255, 255, 255);
//   doc.rect(145, yPos + 3, 50, 13, 'F');
//   doc.rect(145, yPos + 3, 50, 13);
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(8);
//   doc.setFont('helvetica', 'bold');
//   doc.text('SPT TAHUNAN', 170, yPos + 7, { align: 'center' });
//   doc.text('PAJAK PENGHASILAN (PPh)', 170, yPos + 10, { align: 'center' });
//   doc.text('WAJIB PAJAK ORANG PRIBADI', 170, yPos + 13, { align: 'center' });

//   // INDUK and HALAMAN boxes
//   doc.setFillColor(...yellow);
//   doc.rect(145, yPos + 16, 25, 6, 'F');
//   doc.rect(145, yPos + 16, 25, 6);
//   doc.rect(170, yPos + 16, 25, 6, 'F');
//   doc.rect(170, yPos + 16, 25, 6);
//   doc.setFontSize(7);
//   doc.setFont('helvetica', 'bold');
//   doc.text('INDUK', 157.5, yPos + 19.5, { align: 'center' });
//   doc.text('HALAMAN 1', 182.5, yPos + 19.5, { align: 'center' });

//   yPos += 28;

//   // === FORM HEADER SECTION ===
//   // Create grid layout exactly like the image
//   doc.setLineWidth(0.5);
//   doc.setDrawColor(0, 0, 0);
  
//   // Main grid rectangle
//   doc.rect(10, yPos, 190, 20);
  
//   // Vertical dividers for main sections
//   doc.line(48, yPos, 48, yPos + 20); // After "TAHUN PAJAK/BAGIAN TAHUN PAJAK"
//   doc.line(76, yPos, 76, yPos + 20); // After "PERIODE"
//   doc.line(104, yPos, 104, yPos + 20); // After "STATUS"  
//   doc.line(152, yPos, 152, yPos + 20); // After "SUMBER PENGHASILAN"

//   // Header row (first 4mm)
//   doc.line(10, yPos + 4, 200, yPos + 4);
  
//   // Sub-divisions in PERIODE section
//   doc.line(62, yPos + 4, 62, yPos + 20);
  
//   // Headers
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('TAHUN PAJAK/BAGIAN TAHUN PAJAK', 12, yPos + 2.5);
//   doc.text('PERIODE', 58, yPos + 2.5);
//   doc.text('STATUS', 85, yPos + 2.5);
//   doc.text('SUMBER PENGHASILAN', 118, yPos + 2.5);
//   doc.text('METODE PEMBUKUAN', 165, yPos + 2.5);

//   // TAHUN PAJAK section content
//   addCheckbox(12, yPos + 6, true, 2.5);
//   doc.setFontSize(5);
//   doc.setFont('helvetica', 'normal');
//   doc.text('TAHUN PAJAK', 16, yPos + 7.5);
//   addCheckbox(12, yPos + 10, false, 2.5);
//   doc.text('BAGIAN TAHUN PAJAK', 16, yPos + 11.5);
  
//   // Year boxes
//   for (let i = 0; i < 4; i++) {
//     addInputField(12 + (i * 6), yPos + 14, 4, 4);
//   }
//   // Fill in 2023
//   doc.setFontSize(6);
//   doc.text('2', 13.5, yPos + 16.5);
//   doc.text('0', 19.5, yPos + 16.5);
//   doc.text('2', 25.5, yPos + 16.5);
//   doc.text('3', 31.5, yPos + 16.5);

//   // PERIODE section
//   doc.setFontSize(5);
//   doc.text('BULAN', 50, yPos + 6.5);
//   doc.text('BULAN', 64, yPos + 6.5);
//   doc.text('MULAI', 50, yPos + 9);
//   doc.text('AKHIR', 64, yPos + 9);
  
//   // Month boxes
//   for (let i = 0; i < 2; i++) {
//     addInputField(50 + (i * 5), yPos + 11, 4, 4);
//     addInputField(64 + (i * 5), yPos + 11, 4, 4);
//   }
  
//   // Add default months (01-12 for annual)
//   doc.setFontSize(6);
//   doc.text('0', 51.5, yPos + 13.5);
//   doc.text('1', 56.5, yPos + 13.5);
//   doc.text('1', 65.5, yPos + 13.5);
//   doc.text('2', 70.5, yPos + 13.5);

//   // STATUS section
//   addCheckbox(78, yPos + 6, sptData.tax_return_model === 'NORMAL', 2.5);
//   doc.text('NORMAL', 82, yPos + 7.5);
//   addCheckbox(78, yPos + 10, sptData.tax_return_model === 'PEMBETULAN', 2.5);
//   doc.text('PEMBETULAN', 82, yPos + 11.5);

//   // SUMBER PENGHASILAN section
//   const incomeData = sptData.income_summary || {};
//   addCheckbox(106, yPos + 6, incomeData.employment_income, 2.5);
//   doc.text('PEKERJAAN', 110, yPos + 7.5);
//   addCheckbox(106, yPos + 9, incomeData.business_income, 2.5);
//   doc.text('KEGIATAN USAHA', 110, yPos + 10.5);
//   addCheckbox(106, yPos + 12, incomeData.other_domestic_income, 2.5);
//   doc.text('PEKERJAAN BEBAS', 110, yPos + 13.5);

//   // METODE PEMBUKUAN section
//   addCheckbox(154, yPos + 6, sptData.bookkeeping_type?.includes('AKRUAL'), 2.5);
//   doc.text('PEMBUKUAN STELSEL AKRUAL', 158, yPos + 7.5);
//   addCheckbox(154, yPos + 9, sptData.bookkeeping_type?.includes('KAS'), 2.5);
//   doc.text('PEMBUKUAN STELSEL KAS', 158, yPos + 10.5);
//   addCheckbox(154, yPos + 12, sptData.bookkeeping_type?.includes('PENCATATAN'), 2.5);
//   doc.text('PENCATATAN', 158, yPos + 13.5);

//   yPos += 25;

//   // Bagian yang diperbaiki untuk A. IDENTITAS WAJIB PAJAK
// // Ganti bagian ini dalam fungsi generateSPTPDF

// // === A. IDENTITAS WAJIB PAJAK ===
// yPos = addBlueHeader('A. IDENTITAS WAJIB PAJAK', yPos);

// const identityData = sptData.taxpayer_identity || {};

// // Create a two-column layout
// doc.setFontSize(6);
// doc.setFont('helvetica', 'normal');

// // KOLOM KIRI (Left Column)
// let leftColumnY = yPos;

// // 1. NIK/NPWP
// doc.text('1. NIK/NPWP', 12, leftColumnY + 3);
// for (let i = 0; i < 16; i++) {
//   addInputField(12 + (i * 5.5), leftColumnY + 5, 4, 4);
//   if (identityData.nik && identityData.nik[i]) {
//     doc.setFontSize(5);
//     doc.text(identityData.nik[i], 13 + (i * 5.5), leftColumnY + 7.5);
//     doc.setFontSize(6);
//   }
// }
// leftColumnY += 10;

// // 2. NAMA
// doc.text('2. NAMA', 12, leftColumnY + 3);
// addInputField(12, leftColumnY + 5, 88, 4);
// if (identityData.name) {
//   doc.setFontSize(5);
//   doc.text(identityData.name.substring(0, 35), 14, leftColumnY + 7.5);
//   doc.setFontSize(6);
// }
// leftColumnY += 10;

// // 3. JENIS ID
// doc.text('3. JENIS ID', 12, leftColumnY + 3);
// addCheckbox(12, leftColumnY + 5, identityData.identity_type === 'KTP', 2.5);
// doc.setFontSize(5);
// doc.text('KTP', 16, leftColumnY + 6.5);
// addCheckbox(35, leftColumnY + 5, identityData.identity_type === 'KITAS', 2.5);
// doc.text('KITAS', 39, leftColumnY + 6.5);
// addCheckbox(60, leftColumnY + 5, identityData.identity_type === 'PASPOR', 2.5);
// doc.text('PASPOR', 64, leftColumnY + 6.5);
// doc.setFontSize(6);
// leftColumnY += 8;

// // 4. NO. ID
// doc.text('4. NO. ID', 12, leftColumnY + 3);
// addInputField(12, leftColumnY + 5, 88, 4);
// if (identityData.id_number) {
//   doc.setFontSize(5);
//   doc.text(identityData.id_number, 14, leftColumnY + 7.5);
//   doc.setFontSize(6);
// }
// leftColumnY += 10;

// // 5. NO. TELEPON
// doc.text('5. NO. TELEPON', 12, leftColumnY + 3);
// addInputField(12, leftColumnY + 5, 88, 4);
// if (identityData.mobile_phone) {
//   doc.setFontSize(5);
//   doc.text(identityData.mobile_phone, 14, leftColumnY + 7.5);
//   doc.setFontSize(6);
// }
// leftColumnY += 12;

// // KOLOM KANAN (Right Column)
// let rightColumnY = yPos;

// // 6. EMAIL (dipindah ke kanan)
// doc.text('6. EMAIL', 105, rightColumnY + 3);
// addInputField(105, rightColumnY + 5, 88, 4);
// if (identityData.email) {
//   doc.setFontSize(5);
//   doc.text(identityData.email, 107, rightColumnY + 7.5);
//   doc.setFontSize(6);
// }
// rightColumnY += 10;

// // 7. STATUS KEWAJIBAN PERPAJAKAN
// doc.text('7. STATUS KEWAJIBAN PERPAJAKAN  SUAMI DAN ISTRI', 105, rightColumnY + 3);
// addCheckbox(105, rightColumnY + 8, identityData.tax_obligation_status?.includes('PH'), 2);
// doc.setFontSize(5);
// doc.text('PISAH HARTA (PH)', 109, rightColumnY + 9.5);
// addCheckbox(155, rightColumnY + 8, identityData.tax_obligation_status?.includes('MT'), 2.5);
// doc.text('MEMILIH TERPISAH (MT)', 159, rightColumnY + 9.5);

// doc.setFontSize(4);
// doc.text('(Jika status kewajiban perpajakan Anda dengan', 105, rightColumnY + 12);
// doc.text('pasangan adalah PH atau MT, Anda diwajibkan', 105, rightColumnY + 14);
// doc.text('mengisi bagian ini dan Lampiran 4 Bagian B)', 105, rightColumnY + 16);
// doc.setFontSize(6);

// rightColumnY += 20;

// // 8. NIK/NPWP SUAMI/ISTRI
// doc.text('8. NIK/NPWP SUAMI/ISTRI', 105, rightColumnY + 3);
// for (let i = 0; i < 16; i++) {
//   addInputField(105 + (i * 5.5), rightColumnY + 5, 4, 4);
//   if (identityData.spouse_nik && identityData.spouse_nik[i]) {
//     doc.setFontSize(5);
//     doc.text(identityData.spouse_nik[i], 106 + (i * 5.5), rightColumnY + 7.5);
//     doc.setFontSize(6);
//   }
// }

// // Set yPos to the maximum of both columns
// yPos = Math.max(leftColumnY + 12, rightColumnY + 12);
//   // === B. IKHTISAR PENGHASILAN NETO ===
//   yPos = addBlueHeader('B. IKHTISAR PENGHASILAN NETO', yPos);
  
//   // Question 1 with yellow number box
//   addYellowBox(12, yPos, 6, 4, '1');
  
//   // Question 1a
//   doc.setFillColor(...lightGray);
//   doc.rect(20, yPos, 6, 4, 'F');
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('a', 22, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('APAKAH ANDA MENERIMA PENGHASILAN DALAM NEGERI DARI PEKERJAAN?', 28, yPos + 2.5);
  
//   // Amount field on the right
//   addInputField(160, yPos, 35, 4);
//   if (incomeData.employment_income_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(incomeData.employment_income_amount).toLocaleString('id-ID'), 162, yPos + 2.5);
//   }
  
//   yPos += 6;
//   addCheckbox(28, yPos, !incomeData.employment_income, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, incomeData.employment_income, 2.5);
//   doc.text('Ya. (Isi Lampiran 1 Bagian D lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
  
//   yPos += 8;

//   // Question 1b with light blue background
//   doc.setFillColor(...lightGray);
//   doc.rect(20, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('b', 22, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('1) APAKAH ANDA MENERIMA PENGHASILAN DALAM NEGERI DARI USAHA DAN/ATAU PEKERJAAN', 28, yPos + 2.5);
//   yPos += 4;
//   doc.text('BEBAS?', 28, yPos + 2.5);
  
//   // Amount field
//   addInputField(160, yPos - 4, 35, 4);
//   if (incomeData.business_net_income_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(incomeData.business_net_income_amount).toLocaleString('id-ID'), 162, yPos - 1.5);
//   }
  
//   yPos += 6;
//   addCheckbox(28, yPos, !incomeData.business_income, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan 1c)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, incomeData.business_income, 2.5);
//   doc.text('Ya. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
  
//   yPos += 8;

//   // Question 2) OPPT
//   doc.setFontSize(5);
//   doc.text('2) APAKAH ANDA TERMASUK WAJIB PAJAK ORANG PRIBADI YANG MEMILIKI PEREDARAN BRUTO', 28, yPos);
//   yPos += 3;
//   doc.text('TERTENTU ATAU ORANG PRIBADI PENGUSAHA TERTENTU (OPPT)?', 28, yPos);
//   yPos += 5;
//   addCheckbox(28, yPos, false, 2.5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, false, 2.5);
//   doc.text('Ya, saya termasuk Wajib Pajak Orang Pribadi yang memiliki peredaran bruto tertentu yang dikenai pajak', 32, yPos + 1.5);
//   yPos += 3;
//   doc.text('bersifat final. (isi Lampiran 3B Bagian A, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, false, 2.5);
//   doc.text('Ya, saya termasuk Orang Pribadi OPPT. (isi Lampiran 3B Bagian B, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
  
//   yPos += 8;

//   // Question 3) Norma
//   doc.text('3) APAKAH ANDA MENGGUNAKAN NORMA DALAM MENGHITUNG PENGHASILAN NETO?', 28, yPos);
//   yPos += 5;
//   addCheckbox(28, yPos, false, 2.5);
//   doc.text('Tidak, saya menyelenggarakan pembukuan. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, false, 2.5);
//   doc.text('Tidak, saya hanya menerima penghasilan dari usaha yang dikenakan pajak bersifat final dan', 32, yPos + 1.5);
//   yPos += 3;
//   doc.text('tidak menyelenggarakan pembukuan. (Lanjut ke pertanyaan 1c)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, false, 2.5);
//   doc.text('Ya, saya berhak menggunakan Norma Penghitungan Penghasilan Neto.', 32, yPos + 1.5);
//   yPos += 3;
//   doc.text('(Isi Lampiran 3B Bagian C, Lampiran 3A-4 Bagian A, lalu ke pertanyaan 1c)', 32, yPos + 1.5);

//   yPos += 8;

//   // Question 4) Business sector
//   doc.text('4) ANDA MENYELENGGARAKAN PEMBUKUAN, SEBUTKAN SEKTOR USAHA YANG ANDA LAKUKAN', 28, yPos);
//   yPos += 5;
//   addCheckbox(28, yPos, incomeData.business_sector === 'dagang', 2.5);
//   doc.text('Dagang. (Isi Lampiran 3A-1, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, incomeData.business_sector === 'jasa', 2.5);
//   doc.text('Jasa. (Isi Lampiran 3A-2, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, incomeData.business_sector === 'industri', 2.5);
//   doc.text('Industri. (Isi Lampiran 3A-3, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

//   yPos += 8;

//   // Question 5) Net income amount
//   doc.text('5) PENGHASILAN NETO DARI USAHA DAN/ATAU PEKERJAAN BEBAS', 28, yPos);
//   addInputField(160, yPos, 35, 4);
  
//   yPos += 8;

//   // Question 1c
//   doc.setFillColor(...lightGray);
//   doc.rect(20, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('c', 22, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('APAKAH ANDA MENERIMA PENGHASILAN DALAM NEGERI LAINNYA?', 28, yPos + 2.5);
  
//   // Amount field
//   addInputField(160, yPos, 35, 4);
//   if (incomeData.other_domestic_income_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(incomeData.other_domestic_income_amount).toLocaleString('id-ID'), 162, yPos + 2.5);
//   }
  
//   yPos += 6;
//   addCheckbox(28, yPos, !incomeData.other_domestic_income, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, incomeData.other_domestic_income, 2.5);
//   doc.text('Ya. (Isi Lampiran 3A-4 Bagian B, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
  
//   yPos += 8;

//   // Question 1d
//   doc.setFillColor(...lightGray);
//   doc.rect(20, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('d', 22, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('APAKAH ANDA MENERIMA PENGHASILAN LUAR NEGERI?', 28, yPos + 2.5);
  
//   // Amount field
//   addInputField(160, yPos, 35, 4);
//   if (incomeData.foreign_income_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(incomeData.foreign_income_amount).toLocaleString('id-ID'), 162, yPos + 2.5);
//   }
  
//   yPos += 6;
//   addCheckbox(28, yPos, !incomeData.foreign_income, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(28, yPos, incomeData.foreign_income, 2.5);
//   doc.text('Ya. (Isi Lampiran 2 Bagian C, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

//   // Check if we need a new page
//   if (yPos > 220) {
//     doc.addPage();
//     yPos = 20;
//   }

//   yPos += 15;

//   // === C. PENGHITUNGAN PPh TERUTANG ===
//   yPos = addBlueHeader('C. PENGHITUNGAN PPh TERUTANG', yPos);

//   const taxCalcData = sptData.income_tax_calculation || {};

//   // Question 2 with yellow box
//   addYellowBox(12, yPos, 6, 4, '2');
//   doc.setFontSize(6);
//   doc.text('PENGHASILAN NETO SETAHUN', 20, yPos + 2.5);
  
//   // Formula
//   doc.text('( 1a + 1b + 1c + 1d )', 100, yPos + 2.5);
//   addInputField(155, yPos, 40, 4);
//   if (taxCalcData.net_income_year) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(taxCalcData.net_income_year).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }
  
//   yPos += 8;

//   // Question 3 with yellow box
//   addYellowBox(12, yPos, 6, 4, '3');
//   doc.text('APAKAH TERDAPAT PENGURANG PENGHASILAN NETO SEPERTI KOMPENSASI KERUGIAN ATAU', 20, yPos + 2.5);
//   yPos += 4;
//   doc.text('ZAKAT/SUMBANGAN KEAGAMAAN YANG BERSIFAT WAJIB YANG DIBAYAR SELAIN YANG TELAH', 20, yPos + 2.5);
//   yPos += 4;
//   doc.text('DIPERHITUNGKAN DALAM FORMULIR SPT DAN/ATAU BPA?', 20, yPos + 2.5);
  
//   yPos += 6;
//   addCheckbox(20, yPos, !taxCalcData.net_income_deduction, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 24, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(20, yPos, taxCalcData.net_income_deduction, 2.5);
//   doc.text('Ya. (Isi Lampiran 5 Bagian A dan/atau Bagian B, lalu ke pertanyaan selanjutnya)', 24, yPos + 1.5);

//   yPos += 8;

//   // Continue with numbered items 4-9
//   const taxItems = [
//     { num: '4', text: 'PENGHASILAN NETO SETELAH PENGURANG PENGHASILAN NETO', formula: '( 2 - 3 )', value: taxCalcData.net_income_after_deduction },
//     { num: '5', text: 'PENGHASILAN TIDAK KENA PAJAK', formula: '', value: taxCalcData.tax_exemptions_amount },
//     { num: '6', text: 'PENGHASILAN KENA PAJAK', formula: '( 4 - 5 )', value: taxCalcData.taxable_income },
//     { num: '7', text: 'PPh TERUTANG', formula: '', value: taxCalcData.income_tax_payable }
//   ];

//   taxItems.forEach(item => {
//     addYellowBox(12, yPos, 6, 4, item.num);
//     doc.setFontSize(6);
//     doc.text(item.text, 20, yPos + 2.5);
//     if (item.formula) {
//       doc.text(item.formula, 100, yPos + 2.5);
//     }
//     addInputField(155, yPos, 40, 4);
//     if (item.value) {
//       doc.setFontSize(5);
//       doc.text('Rp ' + parseInt(item.value).toLocaleString('id-ID'), 157, yPos + 2.5);
//     }
//     yPos += 8;
//   });

//   // Question 8 with yellow box
//   addYellowBox(12, yPos, 6, 4, '8');
//   doc.setFontSize(6);
//   doc.text('APAKAH TERDAPAT PENGURANG PPh TERUTANG?', 20, yPos + 2.5);
//   yPos += 6;
//   addCheckbox(20, yPos, !taxCalcData.income_tax_deduction, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 24, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(20, yPos, taxCalcData.income_tax_deduction, 2.5);
//   doc.text('Ya. (Isi Lampiran 5 Bagian C, lalu ke pertanyaan selanjutnya)', 24, yPos + 1.5);

//   yPos += 8;

//   // Question 9 with yellow box
//   addYellowBox(12, yPos, 6, 4, '9');
//   doc.setFontSize(6);
//   doc.text('PPh TERUTANG SETELAH PENGURANG PPh TERUTANG', 20, yPos + 2.5);
//   doc.text('( 7 - 8 )', 100, yPos + 2.5);
//   addInputField(155, yPos, 40, 4);
//   if (taxCalcData.income_tax_after_deduction) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(taxCalcData.income_tax_after_deduction).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 15;

//   // === D. KREDIT PAJAK ===
//   yPos = addBlueHeader('D. KREDIT PAJAK', yPos);

//   const creditData = sptData.income_tax_credit || {};

//   // Question 10 with yellow box
//   addYellowBox(12, yPos, 12, 4, '10');
  
//   // Question 10a
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('a', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('APAKAH TERDAPAT PPh YANG TELAH DIPOTONG/DIPUNGUT OLEH PIHAK LAIN?', 32, yPos + 2.5);
  
//   // Amount field
//   addInputField(155, yPos, 40, 4);
//   if (creditData.withheld_income_tax_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(creditData.withheld_income_tax_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }
  
//   yPos += 6;
//   addCheckbox(32, yPos, !creditData.withheld_income_tax, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 36, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(32, yPos, creditData.withheld_income_tax, 2.5);
//   doc.text('Ya. (Isi Lampiran 1 Bagian E, lalu ke pertanyaan selanjutnya)', 36, yPos + 1.5);
  
//   yPos += 8;

//   // Question 10b
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('b', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('ANGSURAN PPh PASAL 25', 32, yPos + 2.5);
//   addInputField(155, yPos, 40, 4);
//   if (creditData.installment_article_25_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(creditData.installment_article_25_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 8;

//   // Question 10c
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('c', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('STP PPh PASAL 25 (HANYA POKOK PAJAK)', 32, yPos + 2.5);
//   addInputField(155, yPos, 40, 4);
//   if (creditData.notice_tax_collection_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(creditData.notice_tax_collection_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 8;

//   // Question 10d
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('d', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('APAKAH ANDA MENERIMA PENGEMBALIAN/PENGURANGAN KREDIT PPh LUAR NEGERI YANG', 32, yPos + 2.5);
//   yPos += 4;
//   doc.text('TELAH DIKREDITKAN?', 32, yPos + 2.5);

//   // Amount field
//   addInputField(155, yPos - 4, 40, 4);
//   if (creditData.foreign_tax_credit_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(creditData.foreign_tax_credit_amount).toLocaleString('id-ID'), 157, yPos - 1.5);
//   }

//   yPos += 6;
//   addCheckbox(32, yPos, !creditData.foreign_tax_credit, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 36, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(32, yPos, creditData.foreign_tax_credit, 2.5);
//   doc.text('Ya. (Isi dengan jumlah pengembalian/pengurangan kredit PPh luar negeri)', 36, yPos + 1.5);

//   yPos += 15;

//   // Check if we need a new page
//   if (yPos > 200) {
//     doc.addPage();
//     yPos = 20;
//   }

//   // === E. KURANG/LEBIH BAYAR ===
//   yPos = addBlueHeader('E. KURANG/LEBIH BAYAR', yPos);

//   const paymentData = sptData.underpayment_overpayment || {};

//   // Question 11 with yellow box
//   addYellowBox(12, yPos, 12, 4, '11');
//   doc.setFontSize(6);
//   doc.text('PPh YANG KURANG (LEBIH) DIBAYAR', 26, yPos + 2.5);
//   doc.text('( 9 - 10a - 10b - 10c + 10d )', 100, yPos + 2.5);
//   addInputField(155, yPos, 40, 4);
//   if (paymentData.underpayment_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(paymentData.underpayment_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 8;

//   // Question 12 with yellow box
//   addYellowBox(12, yPos, 12, 4, '12');
//   doc.setFontSize(6);
//   doc.text('APAKAH LEBIH BAYAR PADA ANGKA 11 MOHON DIKEMBALIKAN?', 26, yPos + 2.5);
  
//   yPos += 6;
//   addCheckbox(26, yPos, !paymentData.approval_letter, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak, lebih bayar dipindahbukukan untuk pembayaran pajak tahun berikutnya', 30, yPos + 1.5);
//   yPos += 4;
//   addCheckbox(26, yPos, paymentData.approval_letter, 2.5);
//   doc.text('Ya. (Isi bagian F)', 30, yPos + 1.5);

//   yPos += 8;

//   // Question 13 with yellow box
//   addYellowBox(12, yPos, 12, 4, '13');
//   doc.setFontSize(6);
//   doc.text('PPh YANG HARUS DIBAYAR SENDIRI', 26, yPos + 2.5);
//   addInputField(155, yPos, 40, 4);
//   if (paymentData.final_payment_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(paymentData.final_payment_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 15;

//   // === F. RESTITUSI (if applicable) ===
//   if (sptData.refund_data && paymentData.approval_letter) {
//     yPos = addBlueHeader('F. RESTITUSI', yPos);

//     const refundData = sptData.refund_data;
    
//     doc.setFontSize(6);
//     doc.text('Metode Pengembalian:', 15, yPos + 3);
//     addInputField(60, yPos, 120, 4);
//     doc.setFontSize(5);
//     doc.text(refundData.refund_method || '', 62, yPos + 2.5);
    
//     yPos += 8;
    
//     doc.setFontSize(6);
//     doc.text('Bank/Rekening:', 15, yPos + 3);
//     addInputField(60, yPos, 120, 4);
//     doc.setFontSize(5);
//     doc.text(refundData.bank_account || '', 62, yPos + 2.5);
    
//     yPos += 12;
//   }

//   // === G. ANGSURAN PPh PASAL 25 ===
//   yPos = addBlueHeader('G. ANGSURAN PPh PASAL 25', yPos);

//   const installmentData = sptData.income_tax_installment || {};

//   // Question 14 with yellow box
//   addYellowBox(12, yPos, 12, 4, '14');
//   doc.setFontSize(6);
//   doc.text('PENGHITUNGAN ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA', 26, yPos + 2.5);

//   yPos += 8;

//   // 14a
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('a', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('APAKAH ANDA MEMPUNYAI KEWAJIBAN MENYETOR ANGSURAN PPh PASAL 25?', 32, yPos + 2.5);
  
//   yPos += 6;
//   addCheckbox(32, yPos, !installmentData.article_25_obligation, 2.5);
//   doc.setFontSize(5);
//   doc.text('Tidak', 36, yPos + 1.5);
//   addCheckbox(60, yPos, installmentData.article_25_obligation, 2.5);
//   doc.text('Ya', 64, yPos + 1.5);
  
//   addInputField(155, yPos, 40, 4);
//   if (installmentData.article_25_amount) {
//     doc.text('Rp ' + parseInt(installmentData.article_25_amount).toLocaleString('id-ID'), 157, yPos + 1.5);
//   }

//   yPos += 8;

//   // 14b
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('b', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('WAJIB PAJAK PENGUSAHA TERTENTU', 32, yPos + 2.5);
  
//   addInputField(155, yPos, 40, 4);
//   if (installmentData.specific_entrepreneur_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(installmentData.specific_entrepreneur_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 8;

//   // 14c
//   doc.setFillColor(...lightGray);
//   doc.rect(26, yPos, 6, 4, 'F');
//   doc.setFontSize(6);
//   doc.setFont('helvetica', 'bold');
//   doc.text('c', 28, yPos + 2.5);
  
//   doc.setFont('helvetica', 'normal');
//   doc.text('ANGSURAN OPPT', 32, yPos + 2.5);
  
//   addInputField(155, yPos, 40, 4);
//   if (installmentData.oppt_installment_amount) {
//     doc.setFontSize(5);
//     doc.text('Rp ' + parseInt(installmentData.oppt_installment_amount).toLocaleString('id-ID'), 157, yPos + 2.5);
//   }

//   yPos += 15;

//   // === H. TRANSAKSI LAINNYA ===
//   yPos = addBlueHeader('H. TRANSAKSI LAINNYA', yPos);

//   const otherData = sptData.other_transactions || {};

//   doc.setFontSize(6);
  
//   const otherTransactions = [
//     { text: '1. Harta pada akhir tahun:', field: 'assets_end_year', amount: 'assets_end_year_amount' },
//     { text: '2. Kewajiban pada akhir tahun:', field: 'debt_end_year', amount: 'debt_end_year_amount' },
//     { text: '3. PPh yang bersifat final:', field: 'final_income_tax', amount: 'final_income_tax_amount' },
//     { text: '4. Penghasilan yang dikecualikan:', field: 'excluded_income', amount: 'excluded_income_amount' },
//     { text: '5. Penyusutan/Amortisasi:', field: 'depreciation_amortization', amount: '' },
//     { text: '6. Biaya representasi/jamuan:', field: 'entertainment_expense', amount: '' },
//     { text: '7. Dividen:', field: 'dividend_income', amount: '' }
//   ];

//   otherTransactions.forEach(item => {
//     doc.text(item.text, 15, yPos + 3);
//     addCheckbox(80, yPos, otherData[item.field], 2.5);
//     doc.setFontSize(5);
//     doc.text('Ya', 84, yPos + 1.5);
//     addCheckbox(100, yPos, !otherData[item.field], 2.5);
//     doc.text('Tidak', 104, yPos + 1.5);
    
//     if (item.amount && otherData[item.amount]) {
//       addInputField(155, yPos, 40, 4);
//       doc.text('Rp ' + parseInt(otherData[item.amount]).toLocaleString('id-ID'), 157, yPos + 2.5);
//     }
    
//     yPos += 8;
//   });

//   yPos += 10;

//   // === PERNYATAAN DAN TANDA TANGAN ===
//   yPos = addBlueHeader('PERNYATAAN', yPos);

//   const statementData = sptData.statement_data || {};

//   // Declaration text
//   const declarationText = 'Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi-sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, saya menyatakan bahwa apa yang telah saya beritahukan di atas beserta lampiran-lampirannya adalah benar, lengkap dan jelas.';
  
//   doc.setFontSize(6);
//   const lines = doc.splitTextToSize(declarationText, 170);
//   doc.text(lines, 15, yPos + 2);
//   yPos += lines.length * 3 + 8;

//   // Check for new page for signature section
//   if (yPos > 180) {
//     doc.addPage();
//     yPos = 20;
//   }

//   // Signature section with border
//   doc.setLineWidth(0.5);
//   doc.rect(10, yPos, 190, 35);

//   // PENANDA TANGAN section
//   doc.setFontSize(6);
//   doc.text('PENANDA TANGAN', 15, yPos + 5);
//   addCheckbox(15, yPos + 7, true, 2.5);
//   doc.setFontSize(5);
//   doc.text('WAJIB PAJAK', 19, yPos + 8.5);
//   addCheckbox(70, yPos + 7, false, 2.5);
//   doc.text('WAKIL/KUASA', 74, yPos + 8.5);

//   // Date section
//   doc.setFontSize(6);
//   doc.text('TANGGAL', 125, yPos + 5);
//   doc.text('BULAN', 145, yPos + 5);
//   doc.text('TAHUN', 170, yPos + 5);

//   // Date input boxes
//   const currentDate = new Date();
//   const day = currentDate.getDate().toString().padStart(2, '0');
//   const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//   const year = currentDate.getFullYear().toString();

//   // Day boxes
//   addInputField(125, yPos + 7, 4, 4);
//   addInputField(130, yPos + 7, 4, 4);
//   doc.setFontSize(5);
//   doc.text(day[0], 126.5, yPos + 9.5);
//   doc.text(day[1], 131.5, yPos + 9.5);

//   // Month boxes
//   addInputField(145, yPos + 7, 4, 4);
//   addInputField(150, yPos + 7, 4, 4);
//   doc.text(month[0], 146.5, yPos + 9.5);
//   doc.text(month[1], 151.5, yPos + 9.5);

//   // Year boxes
//   addInputField(170, yPos + 7, 4, 4);
//   addInputField(175, yPos + 7, 4, 4);
//   addInputField(180, yPos + 7, 4, 4);
//   addInputField(185, yPos + 7, 4, 4);
//   doc.text(year[0], 171.5, yPos + 9.5);
//   doc.text(year[1], 176.5, yPos + 9.5);
//   doc.text(year[2], 181.5, yPos + 9.5);
//   doc.text(year[3], 186.5, yPos + 9.5);

//   yPos += 15;

//   // NIK/NPWP section
//   doc.setFontSize(6);
//   doc.text('NIK/NPWP', 15, yPos + 2);

//   // NIK boxes
//   for (let i = 0; i < 16; i++) {
//     addInputField(15 + (i * 10), yPos + 4, 8, 4);
//     if (identityData.nik && identityData.nik[i]) {
//       doc.setFontSize(5);
//       doc.text(identityData.nik[i], 17 + (i * 10), yPos + 6.5);
//     }
//   }

//   yPos += 10;

//   // NAMA LENGKAP
//   doc.setFontSize(6);
//   doc.text('NAMA LENGKAP', 15, yPos + 2);
//   addInputField(50, yPos, 100, 4);
//   if (identityData.name || sptData.user?.name) {
//     doc.setFontSize(5);
//     doc.text((identityData.name || sptData.user?.name || '').substring(0, 30), 52, yPos + 2.5);
//   }

//   // TANDA TANGAN
//   doc.setFontSize(6);
//   doc.text('TANDA TANGAN', 155, yPos + 2);
//   addInputField(155, yPos + 4, 40, 8);
//   if (statementData.signature) {
//     doc.setFontSize(4);
//     doc.text('Digital: ' + statementData.signature.substring(0, 12) + '...', 157, yPos + 7);
//   }

//   yPos += 15;

//   // Footer - Status and submission info
//   doc.setFontSize(5);
//   doc.setTextColor(100, 100, 100);
//   doc.text('Tanggal Pengajuan: ' + (sptData.submission_date ? new Date(sptData.submission_date).toLocaleDateString('id-ID') : ''), 15, yPos + 3);
//   yPos += 3;
//   doc.text('Status: ' + (sptData.status || ''), 15, yPos + 3);
//   yPos += 3;
//   if (sptData.processed_date) {
//     doc.text('Tanggal Diproses: ' + new Date(sptData.processed_date).toLocaleDateString('id-ID'), 15, yPos + 3);
//   }
//   yPos += 3;
//   if (sptData.reference_number) {
//     doc.text('No. Referensi: ' + sptData.reference_number, 15, yPos + 3);
//   }

//   // Reset text color
//   doc.setTextColor(0, 0, 0);

//   return doc;
// };
function SptListDosen() {
  const state = useSelector((state) => state);
  const authorize = state.user.value.authorize;
  const refresh = useSelector((state) => state.counter.value);

  const [selectedSpt, setSelectedSpt] = useState(null);
  const [gradeDialog, setGradeDialog] = useState(false);
  const [detailDialog, setDetailDialog] = useState(false);
  const [pdfPreviewDialog, setPdfPreviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false);

  const [gradeData, setGradeData] = useState({
    criteria: {
      completeness: 0,
      accuracy: 0,
      presentation: 0,
      understanding: 0
    },
    feedback: '',
    completeness_comment: '',
    accuracy_comment: '',
    presentation_comment: '',
    understanding_comment: ''
  });

  useEffect(() => {
    if (detailDialog && selectedSpt) {
      generatePDF();
    }
  }, [detailDialog, selectedSpt]);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const doc = generateCompleteSPTPDF(selectedSpt);
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fixed API endpoint - keep /api/v2 prefix as it exists in your backend
  const { data, error, mutate } = useSWR(
    `${API.HOST}/api/v2/dosen/spt-tahunan/for-grading?status=all&refresh=${refresh}`,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((response) => {
        return response.data;
      }),
    {
      refreshWhenOffline: true,
      loadingTimeout: 60000,
      onLoadingSlow: () => {
        toast.error("Koneksi lambat, harap tunggu...", {
          duration: 3500,
          icon: "⚠️",
        });
      },
      onError: (err) => {
        console.error('SWR Error:', err);
        toast.error("Gagal memuat data SPT");
      }
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'info';
      case 'approved': return 'success'; // Added approved status
      case 'graded': return 'success';
      case 'needs_revision': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted': return 'Menunggu Penilaian';
      case 'approved': return 'Siap Dinilai'; // Added approved status
      case 'graded': return 'Sudah Dinilai';
      case 'needs_revision': return 'Perlu Revisi';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const handleViewDetail = async (sptId) => {
    setLoading(true);
    try {
      // Fixed API endpoint - keep /api/v2 prefix
      const response = await axios.get(`${API.HOST}/api/v2/dosen/spt-tahunan/${sptId}/for-grading`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      });
      setSelectedSpt(response.data.data);
      setDetailDialog(true);
    } catch (error) {
      console.error('Error loading SPT detail:', error);
      toast.error("Gagal memuat detail SPT");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdfPreview = (spt) => {
    setSelectedSpt(spt);
    setPdfPreviewDialog(true);
  };

  const handleDownloadPdf = async (sptId, userName) => {
    try {
      toast.loading("Mengunduh PDF...");
      // Keep /api/v2 prefix
      const response = await axios.get(`${API.HOST}/api/v2/spt-tahunan/${sptId}/download`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SPT_${userName || sptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("PDF berhasil diunduh");
    } catch (error) {
      toast.dismiss();
      console.error('Error downloading PDF:', error);
      toast.error("Gagal mengunduh PDF");
    }
  };

  const handleGrade = (spt) => {
    setSelectedSpt(spt);
    if (spt.grade) {
      setGradeData({
        criteria: {
          completeness: spt.grade.criteria?.completeness || 0,
          accuracy: spt.grade.criteria?.accuracy || 0,
          presentation: spt.grade.criteria?.presentation || 0,
          understanding: spt.grade.criteria?.understanding || 0
        },
        feedback: spt.grade.feedback || '',
        completeness_comment: spt.grade.completeness_comment || '',
        accuracy_comment: spt.grade.accuracy_comment || '',
        presentation_comment: spt.grade.presentation_comment || '',
        understanding_comment: spt.grade.understanding_comment || ''
      });
    } else {
      setGradeData({
        criteria: {
          completeness: 0,
          accuracy: 0,
          presentation: 0,
          understanding: 0
        },
        feedback: '',
        completeness_comment: '',
        accuracy_comment: '',
        presentation_comment: '',
        understanding_comment: ''
      });
    }
    setGradeDialog(true);
  };


  const handleSubmitGrade = async () => {
    // Validation checks
    const { completeness, accuracy, presentation, understanding } = gradeData.criteria;

    if (calculateOverallScore() === 0) {
      toast.error("Mohon berikan penilaian terlebih dahulu");
      return;
    }

    if (!completeness && !accuracy && !presentation && !understanding) {
      toast.error("Minimal satu kriteria harus memiliki nilai lebih dari 0");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API.HOST}/api/v2/dosen/spt-tahunan/${selectedSpt.id}/grade`,
        gradeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("xtoken")}`,
            "Content-Type": "application/json"
          },
        }
      );

      toast.success("Penilaian berhasil disimpan");
      setGradeDialog(false);
      resetGradeData();
      mutate();

    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal menyimpan penilaian";
      toast.error(errorMessage);
      console.error('Grade submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset grade data
  const resetGradeData = () => {
    setGradeData({
      criteria: { completeness: 0, accuracy: 0, presentation: 0, understanding: 0 },
      feedback: '',
      completeness_comment: '',
      accuracy_comment: '',
      presentation_comment: '',
      understanding_comment: ''
    });
  };

  // Helper function to set quick grades
  const setQuickGrade = (score) => {
    setGradeData(prev => ({
      ...prev,
      criteria: {
        completeness: score,
        accuracy: score,
        presentation: score,
        understanding: score
      }
    }));
  };

  // Helper function to update criteria
  const updateCriteria = (criterion, value) => {
    setGradeData(prev => ({
      ...prev,
      criteria: { ...prev.criteria, [criterion]: (value || 0) * 20 }
    }));
  };

  // Helper function to update comments
  const updateComment = (field, value) => {
    setGradeData(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to get completion status
  const getCompletionStatus = (value) => value ? 'Terisi' : 'Kosong';

  // Student Info Component
  const StudentInfo = ({ spt }) => (
    <Box mb={3} p={2} bgcolor="background.default" borderRadius={1}>
      <Typography variant="subtitle1" gutterBottom>Informasi Mahasiswa</Typography>
      <Grid container spacing={2}>
        {[
          ['Nama', spt?.user?.name || spt?.taxpayer_identity?.name],
          ['NIK', spt?.taxpayer_identity?.nik],
          ['Email', spt?.user?.email || spt?.taxpayer_identity?.email],
          ['Status Kewajiban', spt?.taxpayer_identity?.tax_obligation_status]
        ].map(([label, value]) => (
          <Grid item xs={6} key={label}>
            <Typography variant="body2" color="textSecondary">{label}</Typography>
            <Typography variant="body1" fontWeight="medium">{value || 'N/A'}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const GradeSection = ({
    title,
    color,
    description,
    dataDisplay,
    criterion,
    score,
    comment,
    onScoreChange,
    onCommentChange,
    placeholder
  }) => (
    <Box mb={3} p={2} border={1} borderColor="grey.300" borderRadius={1}>
      <Typography variant="subtitle1" gutterBottom sx={{ color: `${color}.main`, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {description}
      </Typography>

      <Box mb={2} p={1} bgcolor="grey.50" borderRadius={1}>
        <Typography variant="caption" color="textSecondary">Data Saat Ini:</Typography>
        <Typography variant="body2">{dataDisplay}</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="body2" gutterBottom>
          {title.split('(')[0].trim()}: {score}/100
        </Typography>
        <Rating
          value={score / 20}
          onChange={(_, newValue) => onScoreChange(criterion, newValue)}
          max={5}
          icon={<Star fontSize="inherit" />}
          sx={{ mb: 1 }}
        />
      </Box>

      <TextField
        fullWidth
        size="small"
        label={`Komentar ${title.split('.')[1]?.trim() || title}`}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder={placeholder}
        multiline
        rows={2}
      />
    </Box>
  );

  // Quick Grade Buttons Component
  const QuickGradeButtons = ({ onQuickGrade }) => (
    <Box mb={3}>
      <Typography variant="body2" gutterBottom>Penilaian Cepat:</Typography>
      <Box display="flex" gap={1} flexWrap="wrap">
        {[
          { label: 'Sangat Baik (90)', score: 90, color: 'success' },
          { label: 'Baik (80)', score: 80, color: 'primary' },
          { label: 'Cukup (70)', score: 70, color: 'warning' },
          { label: 'Reset', score: 0, color: 'inherit' }
        ].map(({ label, score, color }) => (
          <Button
            key={score}
            size="small"
            variant="outlined"
            onClick={() => onQuickGrade(score)}
            color={color}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  // Final Score Display Component
  const FinalScoreDisplay = ({ score, criteria }) => (
    <Box mb={3} p={3} bgcolor="primary.light" borderRadius={1}>
      <Typography variant="h6" color="primary.contrastText" textAlign="center" gutterBottom>
        Nilai Akhir: {score}/100
      </Typography>
      <Box display="flex" justifyContent="center" mb={2}>
        <Rating
          value={score / 20}
          readOnly
          max={5}
          icon={<Star fontSize="inherit" />}
          sx={{ color: 'primary.contrastText' }}
        />
      </Box>
      <Typography variant="body2" color="primary.contrastText" textAlign="center">
        Identitas: {criteria.completeness} | Perhitungan: {criteria.accuracy} |
        Transaksi: {criteria.presentation} | Pemahaman: {criteria.understanding}
      </Typography>
    </Box>
  );


  const calculateOverallScore = () => {
    const { completeness, accuracy, presentation, understanding } = gradeData.criteria;
    return Math.round((completeness + accuracy + presentation + understanding) / 4);
  };

  const renderDetailSection = (title, data) => {
    if (!data) return null;

    return (
      <Accordion key={title}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Terjadi kesalahan: {error.message || "Gagal memuat data SPT"}
        </Alert>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Debug info: {error.response?.data?.message || error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="relative min-h-1/2 px-2">
      <Helmet>
        <title>
          Penilaian SPT Tahunan | {authorize.charAt(0).toUpperCase() + authorize.slice(1)}
        </title>
      </Helmet>

      <Box mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Daftar SPT Tahunan untuk Dinilai
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Berikut adalah daftar SPT Tahunan yang telah dibuat oleh mahasiswa
        </Typography>
      </Box>

      {!data && !error && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {/* Handle both possible response structures */}
      {data && (
        (() => {
          // Check if data has nested structure or direct array
          const sptArray = data.data?.data || data.data || [];

          if (sptArray.length === 0) {
            return (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  Tidak ada SPT yang perlu dinilai
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Pastikan mahasiswa sudah submit SPT dengan status 'approved'
                </Typography>
              </Box>
            );
          }

          return (
            <>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Ditemukan {sptArray.length} SPT untuk dinilai
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {sptArray.map((spt) => (
                  <Grid item xs={12} md={6} lg={4} key={spt.id}>
                    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="h6" component="h2">
                            SPT {spt.tax_year}
                          </Typography>
                          <Chip
                            label={getStatusText(spt.status)}
                            color={getStatusColor(spt.status)}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Mahasiswa:</strong> {spt.user?.name || 'N/A'}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Email:</strong> {spt.user?.email || 'N/A'}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          <strong>Tanggal Submit:</strong> {spt.submission_date ? new Date(spt.submission_date).toLocaleDateString('id-ID') : '-'}
                        </Typography>

                        {spt.grade && (
                          <Box mt={2} p={2} bgcolor="success.light" borderRadius={1} sx={{ color: 'success.contrastText' }}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              ✅ Nilai: {Math.round(spt.grade.score)}/100 ({spt.grade.letter_grade})
                            </Typography>
                            <Rating
                              value={spt.grade.score / 20}
                              readOnly
                              size="small"
                              icon={<Star fontSize="inherit" />}
                              sx={{ color: 'success.contrastText' }}
                            />
                            {spt.grade.graded_date && (
                              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Dinilai: {new Date(spt.grade.graded_date).toLocaleDateString('id-ID')}
                              </Typography>
                            )}
                          </Box>
                        )}

                        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetail(spt.id)}
                            disabled={loading}
                          >
                            Preview SPT
                          </Button>
                          {/* <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PictureAsPdf />}
                            onClick={() => handleViewPdfPreview(spt)}
                            color="secondary"
                          >
                            Preview
                          </Button> */}
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Assessment />}
                            onClick={() => handleGrade(spt)}
                            color={spt.grade ? "success" : "primary"}
                            disabled={loading}
                          >
                            {spt.grade ? 'Edit Nilai' : 'Beri Nilai'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          );
        })()
      )}

      {/* Show loading state */}
      {!data && !error && (
        <Box display="flex" flexDirection="column" alignItems="center" py={4}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="textSecondary">
            Memuat data SPT...
          </Typography>
        </Box>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => {
          setDetailDialog(false);
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
          }
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '95vh',
            height: '95vh'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              SPT Tahunan PPh - {selectedSpt?.tax_year}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {selectedSpt && (
                <Chip
                  label={getStatusText(selectedSpt.status)}
                  color={getStatusColor(selectedSpt.status)}
                  size="small"
                />
              )}
              <IconButton
                onClick={() => {
                  setDetailDialog(false);
                  if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                    setPdfUrl(null);
                  }
                }}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          {selectedSpt && (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Info bar */}
              <Box sx={{
                p: 2,
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="textSecondary">Nama</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {selectedSpt.user?.name || selectedSpt.user_name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="textSecondary">Email</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {selectedSpt.user?.email || selectedSpt.user_email || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="textSecondary">Status</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {getStatusText(selectedSpt.status)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* PDF Viewer */}
              <Box sx={{ flex: 1, position: 'relative' }}>
                {isGenerating ? (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <CircularProgress />
                    <Typography variant="body2" color="textSecondary">
                      Generating PDF...
                    </Typography>
                  </Box>
                ) : pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block'
                    }}
                    title={`SPT Tahunan ${selectedSpt.tax_year}`}
                  />
                ) : (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <Typography variant="body2" color="textSecondary">
                      Failed to generate PDF
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={gradeDialog}
        onClose={() => setGradeDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: '90vh' } }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedSpt?.grade ? 'Edit Penilaian' : 'Berikan Penilaian'} - SPT {selectedSpt?.tax_year}
            </Typography>
            <IconButton onClick={() => setGradeDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          <Box>
            <StudentInfo spt={selectedSpt} />

            <Typography variant="h6" gutterBottom>Kriteria Penilaian SPT Tahunan</Typography>

            <GradeSection
              title="A. Kelengkapan Identitas Wajib Pajak (25%)"
              color="primary"
              description="Penilaian: NIK, Nama, Jenis Identitas, No. HP, Email, Status Kewajiban Pajak, NIK Pasangan"
              dataDisplay={`✓ NIK: ${getCompletionStatus(selectedSpt?.taxpayer_identity?.nik)} | ✓ Nama: ${getCompletionStatus(selectedSpt?.taxpayer_identity?.name)} | ✓ HP: ${getCompletionStatus(selectedSpt?.taxpayer_identity?.mobile_phone)} | ✓ Email: ${getCompletionStatus(selectedSpt?.taxpayer_identity?.email)}`}
              criterion="completeness"
              score={gradeData.criteria.completeness}
              comment={gradeData.completeness_comment}
              onScoreChange={updateCriteria}
              onCommentChange={(value) => updateComment('completeness_comment', value)}
              placeholder="Contoh: Data identitas lengkap dan valid"
            />

            <GradeSection
              title="B. Keakuratan Penghasilan & Perhitungan (25%)"
              color="warning"
              description="Penilaian: Ringkasan Penghasilan, Perhitungan PPh, Kredit Pajak, Kurang/Lebih Bayar"
              dataDisplay={`Pekerjaan: ${selectedSpt?.income_summary?.employment_income ? 'Ya' : 'Tidak'} | Usaha: ${selectedSpt?.income_summary?.business_income ? 'Ya' : 'Tidak'} | PTKP: ${selectedSpt?.income_tax_calculation?.tax_exemptions || 'TK/0'}`}
              criterion="accuracy"
              score={gradeData.criteria.accuracy}
              comment={gradeData.accuracy_comment}
              onScoreChange={updateCriteria}
              onCommentChange={(value) => updateComment('accuracy_comment', value)}
              placeholder="Contoh: Perhitungan PPh sudah tepat sesuai ketentuan"
            />

            <GradeSection
              title="C. Kelengkapan Transaksi & Lampiran (25%)"
              color="info"
              description="Penilaian: Transaksi Lainnya, Lampiran, Angsuran PPh 25, Restitusi"
              dataDisplay={`Harta: ${selectedSpt?.other_transactions?.assets_end_year ? 'Ya' : 'Tidak'} | Utang: ${selectedSpt?.other_transactions?.debt_end_year ? 'Ya' : 'Tidak'} | PPh Final: ${selectedSpt?.other_transactions?.final_income_tax ? 'Ya' : 'Tidak'}`}
              criterion="presentation"
              score={gradeData.criteria.presentation}
              comment={gradeData.presentation_comment}
              onScoreChange={updateCriteria}
              onCommentChange={(value) => updateComment('presentation_comment', value)}
              placeholder="Contoh: Transaksi tercatat dengan baik, lampiran sesuai"
            />

            <GradeSection
              title="D. Pemahaman Peraturan & Pernyataan (25%)"
              color="success"
              description="Penilaian: Konsep PTKP, Status Pajak, Pernyataan & Tanda Tangan Digital"
              dataDisplay={`TT Digital: ${selectedSpt?.statement_data?.signature ? 'Valid' : 'Tidak Valid'} | Pernyataan: ${selectedSpt?.statement_data?.declaration ? 'Ya' : 'Tidak'}`}
              criterion="understanding"
              score={gradeData.criteria.understanding}
              comment={gradeData.understanding_comment}
              onScoreChange={updateCriteria}
              onCommentChange={(value) => updateComment('understanding_comment', value)}
              placeholder="Contoh: Memahami PTKP dengan baik, pernyataan lengkap"
            />

            <QuickGradeButtons onQuickGrade={setQuickGrade} />

            <FinalScoreDisplay score={calculateOverallScore()} criteria={gradeData.criteria} />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Feedback Umum untuk Mahasiswa"
              value={gradeData.feedback}
              onChange={(e) => updateComment('feedback', e.target.value)}
              placeholder="Berikan feedback konstruktif kepada mahasiswa tentang pengisian SPT..."
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setGradeDialog(false)} disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={handleSubmitGrade}
            variant="contained"
            disabled={calculateOverallScore() === 0 || loading}
            startIcon={loading ? <CircularProgress size={16} /> : <Assessment />}
          >
            {loading ? 'Menyimpan...' : 'Simpan Penilaian'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SptListDosen;