import jsPDF from 'jspdf';

const PDFHelpers = {
    // Colors matching the official form
    colors: {
        headerBlue: [41, 98, 159],
        sectionBlue: [52, 84, 139],
        lightBlue: [173, 216, 230],
        yellow: [255, 193, 7],
        orange: [255, 152, 0],
        lightGray: [240, 240, 240]
    },

    // Responsive page dimensions
    getPageDimensions: () => {
        const orientation = 'p';
        const format = 'a4';
        return {
            orientation,
            format,
            width: 210, // A4 width in mm
            height: 297, // A4 height in mm
            margin: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        };
    },

    // Responsive font sizes
    getFontSizes: () => ({
        tiny: 4,
        small: 5,
        normal: 6,
        medium: 7,
        large: 8,
        xlarge: 10,
        header: 12
    }),

    // Dynamic width calculation based on content
    calculateColumnWidths: (headers, totalWidth = 190) => {
        const baseWidth = totalWidth / headers.length;
        return headers.map((header, index) => {
            // Adjust width based on header text length
            const textLength = header.length;
            if (textLength > 20) return baseWidth * 1.5;
            if (textLength > 15) return baseWidth * 1.2;
            if (textLength < 8) return baseWidth * 0.8;
            return baseWidth;
        });
    },

    addBlueHeader: (doc, title, y, width = 190) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const adjustedWidth = Math.min(width, pageWidth - 20);

        doc.setFillColor(...PDFHelpers.colors.sectionBlue);
        doc.rect(10, y, adjustedWidth, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(PDFHelpers.getFontSizes().medium);
        doc.setFont('helvetica', 'bold');

        // Text truncation for responsive design
        const maxLength = Math.floor(adjustedWidth / 3);
        const displayTitle = title.length > maxLength ? title.substring(0, maxLength - 3) + '...' : title;
        doc.text(displayTitle, 12, y + 4);

        doc.setTextColor(0, 0, 0);
        return y + 8;
    },

    addCheckbox: (doc, x, y, checked = false, size = 3) => {
        // Ensure checkbox is within page bounds
        const pageWidth = doc.internal.pageSize.getWidth();
        if (x + size > pageWidth - 10) {
            x = pageWidth - 10 - size;
        }

        doc.setLineWidth(0.4);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFillColor(0, 0, 0);
            doc.rect(x + 0.3, y + 0.3, size - 0.6, size - 0.6, 'F');
        }
    },

    addInputField: (doc, x, y, width, height = 4) => {
        // Responsive width adjustment
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = pageWidth - x - 10;
        const adjustedWidth = Math.min(width, maxWidth);

        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, adjustedWidth, height);
        return adjustedWidth;
    },

    addYellowBox: (doc, x, y, width, height, text) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const adjustedWidth = Math.min(width, pageWidth - x - 10);

        doc.setFillColor(...PDFHelpers.colors.yellow);
        doc.rect(x, y, adjustedWidth, height, 'F');
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, adjustedWidth, height);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(PDFHelpers.getFontSizes().small);
        doc.setFont('helvetica', 'bold');
        doc.text(text, x + 1, y + 2.5);
    },

    addResponsiveText: (doc, text, x, y, maxWidth = 170, fontSize = 6) => {
        doc.setFontSize(fontSize);

        // Split text if it exceeds max width
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line, index) => {
            doc.text(line, x, y + (index * (fontSize * 0.5)));
        });

        return y + (lines.length * (fontSize * 0.5));
    },

    addTableHeader: (doc, headers, startX, y, columnWidths) => {
        let currentX = startX;
        const pageWidth = doc.internal.pageSize.getWidth();

        headers.forEach((header, index) => {
            // Ensure we don't exceed page width
            if (currentX + columnWidths[index] > pageWidth - 10) {
                columnWidths[index] = pageWidth - 10 - currentX;
            }

            doc.setFillColor(...PDFHelpers.colors.lightGray);
            doc.rect(currentX, y, columnWidths[index], 6, 'F');
            doc.setLineWidth(0.3);
            doc.rect(currentX, y, columnWidths[index], 6);
            doc.setFontSize(PDFHelpers.getFontSizes().tiny);
            doc.setFont('helvetica', 'bold');

            // Responsive text fitting
            const maxTextWidth = columnWidths[index] - 2;
            const truncatedHeader = header.length > 15 ? header.substring(0, 12) + '...' : header;
            doc.text(truncatedHeader, currentX + 1, y + 3.5);

            currentX += columnWidths[index];
        });
        return y + 6;
    },

    addTableRow: (doc, data, startX, y, columnWidths, rowHeight = 6) => {
        let currentX = startX;
        const pageWidth = doc.internal.pageSize.getWidth();

        data.forEach((item, index) => {
            // Ensure we don't exceed page width
            if (currentX + columnWidths[index] > pageWidth - 10) {
                columnWidths[index] = pageWidth - 10 - currentX;
            }

            doc.setLineWidth(0.3);
            doc.rect(currentX, y, columnWidths[index], rowHeight);
            doc.setFontSize(PDFHelpers.getFontSizes().tiny);
            doc.setFont('helvetica', 'normal');

            if (item) {
                const text = item.toString();
                const maxChars = Math.floor(columnWidths[index] / 2);
                const displayText = text.length > maxChars ? text.substring(0, maxChars - 3) + '...' : text;
                doc.text(displayText, currentX + 1, y + 3);
            }
            currentX += columnWidths[index];
        });
        return y + rowHeight;
    },

    formatCurrency: (amount) => {
        if (!amount || amount === "-1") return "";
        const numAmount = parseInt(amount);
        if (isNaN(numAmount)) return "";
        return 'Rp ' + numAmount.toLocaleString('id-ID');
    },

    getCurrentDate: () => {
        const currentDate = new Date();
        return {
            day: currentDate.getDate().toString().padStart(2, '0'),
            month: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
            year: currentDate.getFullYear().toString()
        };
    },

    // Check if content fits on current page
    checkPageBreak: (doc, currentY, requiredHeight = 20) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = PDFHelpers.getPageDimensions().margin.bottom;

        if (currentY + requiredHeight > pageHeight - margin) {
            doc.addPage();
            return 20; // Return new Y position
        }
        return currentY;
    }
};

const generateSPTPDF = (sptData) => {
    console.log('spt data ', sptData);
    const pageDim = PDFHelpers.getPageDimensions();
    const doc = new jsPDF(pageDim.orientation, 'mm', pageDim.format);
    const fonts = PDFHelpers.getFontSizes();

    // Colors matching the official form
    const headerBlue = [41, 98, 159];
    const sectionBlue = [52, 84, 139];
    const lightBlue = [173, 216, 230];
    const yellow = [255, 193, 7];
    const orange = [255, 152, 0];
    const lightGray = [240, 240, 240];

    // Helper functions
    const addBlueHeader = (title, y, width = 190) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const adjustedWidth = Math.min(width, pageWidth - 20);

        doc.setFillColor(...sectionBlue);
        doc.rect(10, y, adjustedWidth, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(fonts.medium);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 12, y + 4);
        doc.setTextColor(0, 0, 0);
        return y + 8;
    };

    const addCheckbox = (x, y, checked = false, size = 3) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        if (x + size > pageWidth - 10) {
            x = pageWidth - 10 - size;
        }

        doc.setLineWidth(0.4);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, size, size);
        if (checked) {
            doc.setFillColor(0, 0, 0);
            doc.rect(x + 0.3, y + 0.3, size - 0.6, size - 0.6, 'F');
        }
    };

    const addInputField = (x, y, width, height = 4) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = pageWidth - x - 10;
        const adjustedWidth = Math.min(width, maxWidth);

        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, adjustedWidth, height);
        return adjustedWidth;
    };

    const addYellowBox = (x, y, width, height, text) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const adjustedWidth = Math.min(width, pageWidth - x - 10);

        doc.setFillColor(...yellow);
        doc.rect(x, y, adjustedWidth, height, 'F');
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, adjustedWidth, height);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(fonts.small);
        doc.setFont('helvetica', 'bold');
        doc.text(text, x + 1, y + 2.5);
    };

    // Start PDF Generation
    let yPos = pageDim.margin.top;

    // === HEADER SECTION ===
    // Main header background - responsive width
    const headerWidth = doc.internal.pageSize.getWidth() - 20;
    doc.setFillColor(...lightBlue);
    doc.rect(10, yPos, headerWidth, 25, 'F');
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPos, headerWidth, 25);

    // Logo area - proportional sizing
    const logoWidth = Math.min(22, headerWidth * 0.12);
    const logoHeight = 19;
    doc.setFillColor(255, 255, 255);
    doc.rect(15, yPos + 3, logoWidth, logoHeight, 'F');
    doc.rect(15, yPos + 3, logoWidth, logoHeight);

    // Add logo placeholder - responsive positioning
    const logoX = 15 + (logoWidth / 2);
    const logoY = yPos + 8;
    doc.setFillColor(41, 98, 159);
    doc.circle(logoX, logoY, Math.min(4, logoWidth / 5), 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGO', logoX - 6, logoY + 1);

    // Ministry text - responsive positioning
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(fonts.tiny);
    const ministryX = 15 + logoWidth + 5;
    doc.text('KEMENTERIAN KEUANGAN', ministryX, yPos + 15);
    doc.text('REPUBLIK INDONESIA', ministryX, yPos + 18);
    doc.text('DIREKTORAT JENDERAL PAJAK', ministryX, yPos + 21);

    // Center ministry text - responsive
    const centerX = doc.internal.pageSize.getWidth() / 2;
    doc.setFontSize(fonts.large);
    doc.setFont('helvetica', 'bold');
    doc.text('KEMENTERIAN KEUANGAN', centerX, yPos + 8, { align: 'center' });
    doc.text('REPUBLIK INDONESIA', centerX, yPos + 12, { align: 'center' });
    doc.text('DIREKTORAT JENDERAL PAJAK', centerX, yPos + 16, { align: 'center' });

    // SPT Title section - responsive positioning
    const rightBoxWidth = Math.min(50, headerWidth * 0.25);
    const rightBoxX = 10 + headerWidth - rightBoxWidth;
    doc.setFillColor(255, 255, 255);
    doc.rect(rightBoxX, yPos + 3, rightBoxWidth, 13, 'F');
    doc.rect(rightBoxX, yPos + 3, rightBoxWidth, 13);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(fonts.medium);
    doc.setFont('helvetica', 'bold');

    const rightCenterX = rightBoxX + (rightBoxWidth / 2);
    doc.text('SPT TAHUNAN', rightCenterX, yPos + 7, { align: 'center' });
    doc.text('PPh ORANG PRIBADI', rightCenterX, yPos + 10, { align: 'center' });
    doc.text('WAJIB PAJAK', rightCenterX, yPos + 13, { align: 'center' });

    // INDUK and HALAMAN boxes - responsive
    const boxWidth = rightBoxWidth / 2;
    doc.setFillColor(...yellow);
    doc.rect(rightBoxX, yPos + 16, boxWidth, 6, 'F');
    doc.rect(rightBoxX, yPos + 16, boxWidth, 6);
    doc.rect(rightBoxX + boxWidth, yPos + 16, boxWidth, 6, 'F');
    doc.rect(rightBoxX + boxWidth, yPos + 16, boxWidth, 6);
    doc.setFontSize(fonts.normal);
    doc.setFont('helvetica', 'bold');
    doc.text('INDUK', rightBoxX + (boxWidth / 2), yPos + 19.5, { align: 'center' });
    doc.text('HALAMAN 1', rightBoxX + boxWidth + (boxWidth / 2), yPos + 19.5, { align: 'center' });

    yPos += 28;

    // === FORM HEADER SECTION ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 25);

    const formHeaderWidth = headerWidth;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPos, formHeaderWidth, 20);

    // Responsive vertical dividers
    const sectionWidths = [38, 28, 28, 48, 48]; // Proportional widths
    let currentX = 10;

    sectionWidths.forEach((width, index) => {
        if (index < sectionWidths.length - 1) {
            currentX += width;
            doc.line(currentX, yPos, currentX, yPos + 20);
        }
    });

    // Header row
    doc.line(10, yPos + 4, 10 + formHeaderWidth, yPos + 4);

    // Sub-divisions in PERIODE section
    doc.line(62, yPos + 4, 62, yPos + 20);

    // Headers with responsive font size
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('TAHUN PAJAK/BAGIAN TAHUN PAJAK', 12, yPos + 2.5);
    doc.text('PERIODE', 58, yPos + 2.5);
    doc.text('STATUS', 85, yPos + 2.5);
    doc.text('SUMBER PENGHASILAN', 118, yPos + 2.5);
    doc.text('METODE PEMBUKUAN', 165, yPos + 2.5);

    // TAHUN PAJAK section content
    addCheckbox(12, yPos + 6, true, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.setFont('helvetica', 'normal');
    doc.text('TAHUN PAJAK', 16, yPos + 7.5);
    addCheckbox(12, yPos + 10, false, 2.5);
    doc.text('BAGIAN TAHUN PAJAK', 16, yPos + 11.5);

    // Year boxes
    for (let i = 0; i < 4; i++) {
        addInputField(12 + (i * 6), yPos + 14, 4, 4);
    }
    // Fill in 2024
    doc.setFontSize(fonts.small);
    doc.text('2', 13.5, yPos + 16.5);
    doc.text('0', 19.5, yPos + 16.5);
    doc.text('2', 25.5, yPos + 16.5);
    doc.text('4', 31.5, yPos + 16.5);

    // PERIODE section
    doc.setFontSize(fonts.tiny);
    doc.text('BULAN', 50, yPos + 6.5);
    doc.text('BULAN', 64, yPos + 6.5);
    doc.text('MULAI', 50, yPos + 9);
    doc.text('AKHIR', 64, yPos + 9);

    // Month boxes
    for (let i = 0; i < 2; i++) {
        addInputField(50 + (i * 5), yPos + 11, 4, 4);
        addInputField(64 + (i * 5), yPos + 11, 4, 4);
    }

    // Add default months (01-12 for annual)
    doc.setFontSize(fonts.small);
    doc.text('0', 51.5, yPos + 13.5);
    doc.text('1', 56.5, yPos + 13.5);
    doc.text('1', 65.5, yPos + 13.5);
    doc.text('2', 70.5, yPos + 13.5);

    // STATUS section
    addCheckbox(78, yPos + 6, sptData.tax_return_model === 'NORMAL', 2.5);
    doc.text('NORMAL', 82, yPos + 7.5);
    addCheckbox(78, yPos + 10, sptData.tax_return_model === 'PEMBETULAN', 2.5);
    doc.text('PEMBETULAN', 82, yPos + 11.5);

    // SUMBER PENGHASILAN section
    const incomeData = sptData.income_summary || {};
    addCheckbox(106, yPos + 6, incomeData.employment_income, 2.5);
    doc.text('PEKERJAAN', 110, yPos + 7.5);
    addCheckbox(106, yPos + 9, incomeData.business_income, 2.5);
    doc.text('KEGIATAN USAHA', 110, yPos + 10.5);
    addCheckbox(106, yPos + 12, incomeData.other_domestic_income, 2.5);
    doc.text('PEKERJAAN BEBAS', 110, yPos + 13.5);

    // METODE PEMBUKUAN section
    addCheckbox(154, yPos + 6, sptData.bookkeeping_type?.includes('AKRUAL'), 2.5);
    doc.text('PEMBUKUAN STELSEL AKRUAL', 158, yPos + 7.5);
    addCheckbox(154, yPos + 9, sptData.bookkeeping_type?.includes('KAS'), 2.5);
    doc.text('PEMBUKUAN STELSEL KAS', 158, yPos + 10.5);
    addCheckbox(154, yPos + 12, sptData.bookkeeping_type?.includes('PENCATATAN'), 2.5);
    doc.text('PENCATATAN', 158, yPos + 13.5);

    yPos += 25;

    // === A. IDENTITAS WAJIB PAJAK ===
    yPos = addBlueHeader('A. IDENTITAS WAJIB PAJAK', yPos);

    const identityData = sptData.taxpayer_identity || {};

    // Create a responsive two-column layout
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'normal');

    // KOLOM KIRI (Left Column)
    let leftColumnY = yPos;
    const columnWidth = (headerWidth - 10) / 2;

    // 1. NIK/NPWP
    doc.text('1. NIK/NPWP', 12, leftColumnY + 3);
    const nikBoxSize = Math.min(5.5, columnWidth / 16);
    for (let i = 0; i < 16; i++) {
        const boxX = 12 + (i * nikBoxSize);
        if (boxX + nikBoxSize <= 12 + columnWidth) {
            addInputField(boxX, leftColumnY + 5, nikBoxSize - 0.5, 4);
            if (identityData.nik && identityData.nik[i]) {
                doc.setFontSize(fonts.tiny);
                doc.text(identityData.nik[i], boxX + 1, leftColumnY + 7.5);
                doc.setFontSize(fonts.small);
            }
        }
    }
    leftColumnY += 10;

    // 2. NAMA
    doc.text('2. NAMA', 12, leftColumnY + 3);
    const nameFieldWidth = addInputField(12, leftColumnY + 5, columnWidth, 4);
    if (identityData.name) {
        doc.setFontSize(fonts.tiny);
        const maxNameLength = Math.floor(nameFieldWidth / 2.5);
        const displayName = identityData.name.length > maxNameLength ?
            identityData.name.substring(0, maxNameLength - 3) + '...' : identityData.name;
        doc.text(displayName, 14, leftColumnY + 7.5);
        doc.setFontSize(fonts.small);
    }
    leftColumnY += 10;

    // 3. JENIS ID
    doc.text('3. JENIS ID', 12, leftColumnY + 3);
    addCheckbox(12, leftColumnY + 5, identityData.identity_type === 'KTP', 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('KTP', 16, leftColumnY + 6.5);
    addCheckbox(35, leftColumnY + 5, identityData.identity_type === 'KITAS', 2.5);
    doc.text('KITAS', 39, leftColumnY + 6.5);
    addCheckbox(60, leftColumnY + 5, identityData.identity_type === 'PASPOR', 2.5);
    doc.text('PASPOR', 64, leftColumnY + 6.5);
    doc.setFontSize(fonts.small);
    leftColumnY += 8;

    // 4. NO. ID
    doc.text('4. NO. ID', 12, leftColumnY + 3);
    const idFieldWidth = addInputField(12, leftColumnY + 5, columnWidth, 4);
    if (identityData.id_number) {
        doc.setFontSize(fonts.tiny);
        const maxIdLength = Math.floor(idFieldWidth / 2.5);
        const displayId = identityData.id_number.length > maxIdLength ?
            identityData.id_number.substring(0, maxIdLength - 3) + '...' : identityData.id_number;
        doc.text(displayId, 14, leftColumnY + 7.5);
        doc.setFontSize(fonts.small);
    }
    leftColumnY += 10;

    // 5. NO. TELEPON
    doc.text('5. NO. TELEPON', 12, leftColumnY + 3);
    const phoneFieldWidth = addInputField(12, leftColumnY + 5, columnWidth, 4);
    if (identityData.mobile_phone) {
        doc.setFontSize(fonts.tiny);
        const maxPhoneLength = Math.floor(phoneFieldWidth / 2.5);
        const displayPhone = identityData.mobile_phone.length > maxPhoneLength ?
            identityData.mobile_phone.substring(0, maxPhoneLength - 3) + '...' : identityData.mobile_phone;
        doc.text(displayPhone, 14, leftColumnY + 7.5);
        doc.setFontSize(fonts.small);
    }
    leftColumnY += 12;

    // KOLOM KANAN (Right Column)
    let rightColumnY = yPos;
    const rightColumnX = 12 + columnWidth + 5;

    // 6. EMAIL (dipindah ke kanan)
    doc.text('6. EMAIL', rightColumnX, rightColumnY + 3);
    const emailFieldWidth = addInputField(rightColumnX, rightColumnY + 5, columnWidth, 4);
    if (identityData.email) {
        doc.setFontSize(fonts.tiny);
        const maxEmailLength = Math.floor(emailFieldWidth / 2.5);
        const displayEmail = identityData.email.length > maxEmailLength ?
            identityData.email.substring(0, maxEmailLength - 3) + '...' : identityData.email;
        doc.text(displayEmail, rightColumnX + 2, rightColumnY + 7.5);
        doc.setFontSize(fonts.small);
    }
    rightColumnY += 10;

    // 7. STATUS KEWAJIBAN PERPAJAKAN
    doc.text('7. STATUS KEWAJIBAN PERPAJAKAN  SUAMI DAN ISTRI', rightColumnX, rightColumnY + 3);
    addCheckbox(rightColumnX, rightColumnY + 8, identityData.tax_obligation_status?.includes('PH'), 2);
    doc.setFontSize(fonts.tiny);
    doc.text('PISAH HARTA (PH)', rightColumnX + 4, rightColumnY + 9.5);
    addCheckbox(rightColumnX + 50, rightColumnY + 8, identityData.tax_obligation_status?.includes('MT'), 2.5);
    doc.text('MEMILIH TERPISAH (MT)', rightColumnX + 54, rightColumnY + 9.5);

    doc.setFontSize(fonts.tiny);
    doc.text('(Jika status kewajiban perpajakan Anda dengan', rightColumnX, rightColumnY + 12);
    doc.text('pasangan adalah PH atau MT, Anda diwajibkan', rightColumnX, rightColumnY + 14);
    doc.text('mengisi bagian ini dan Lampiran 4 Bagian B)', rightColumnX, rightColumnY + 16);
    doc.setFontSize(fonts.small);

    rightColumnY += 20;

    // 8. NIK/NPWP SUAMI/ISTRI
    doc.text('8. NIK/NPWP SUAMI/ISTRI', rightColumnX, rightColumnY + 3);
    const spouseNikBoxSize = Math.min(5.5, columnWidth / 16);
    for (let i = 0; i < 16; i++) {
        const boxX = rightColumnX + (i * spouseNikBoxSize);
        if (boxX + spouseNikBoxSize <= rightColumnX + columnWidth) {
            addInputField(boxX, rightColumnY + 5, spouseNikBoxSize - 0.5, 4);
            if (identityData.spouse_nik && identityData.spouse_nik[i]) {
                doc.setFontSize(fonts.tiny);
                doc.text(identityData.spouse_nik[i], boxX + 1, rightColumnY + 7.5);
                doc.setFontSize(fonts.small);
            }
        }
    }

    // Set yPos to the maximum of both columns
    yPos = Math.max(leftColumnY + 12, rightColumnY + 12);

    // === B. IKHTISAR PENGHASILAN NETO ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 30);
    yPos = addBlueHeader('B. IKHTISAR PENGHASILAN NETO', yPos);

    // Question 1 with yellow number box
    addYellowBox(12, yPos, 6, 4, '1');

    // Question 1a
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, 6, 4, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('a', 22, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('APAKAH ANDA MENERIMA PENGHASILAN DALAM NEGERI DARI PEKERJAAN?', 28, yPos + 2.5);

    // Amount field on the right
    const amountFieldWidth = Math.min(35, headerWidth * 0.18);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (incomeData.employment_income_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(incomeData.employment_income_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 6;
    addCheckbox(28, yPos, !incomeData.employment_income, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, incomeData.employment_income, 2.5);
    doc.text('Ya. (Isi Lampiran 1 Bagian D lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

    yPos += 8;

    // Question 1b with light blue background
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('b', 22, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('1) APAKAH ANDA MENERIMA PENGHASILAN DALAM NEGERI DARI USAHA DAN/ATAU PEKERJAAN', 28, yPos + 2.5);
    yPos += 4;
    doc.text('BEBAS?', 28, yPos + 2.5);

    // Amount field
    addInputField(headerWidth - amountFieldWidth + 5, yPos - 4, amountFieldWidth, 4);
    if (incomeData.business_net_income_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(incomeData.business_net_income_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos - 1.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 6;
    addCheckbox(28, yPos, !incomeData.business_income, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan 1c)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, incomeData.business_income, 2.5);
    doc.text('Ya. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);

    yPos += 8;

    // Question 2) OPPT
    doc.setFontSize(fonts.tiny);
    doc.text('2) APAKAH ANDA TERMASUK WAJIB PAJAK ORANG PRIBADI YANG MEMILIKI PEREDARAN BRUTO', 28, yPos);
    yPos += 3;
    doc.text('TERTENTU ATAU ORANG PRIBADI PENGUSAHA TERTENTU (OPPT)?', 28, yPos);
    yPos += 5;
    addCheckbox(28, yPos, false, 2.5);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, false, 2.5);
    doc.text('Ya, saya termasuk Wajib Pajak Orang Pribadi yang memiliki peredaran bruto tertentu yang dikenai pajak', 32, yPos + 1.5);
    yPos += 3;
    doc.text('bersifat final. (isi Lampiran 3B Bagian A, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, false, 2.5);
    doc.text('Ya, saya termasuk Orang Pribadi OPPT. (isi Lampiran 3B Bagian B, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

    yPos += 8;

    // Question 3) Norma
    doc.text('3) APAKAH ANDA MENGGUNAKAN NORMA DALAM MENGHITUNG PENGHASILAN NETO?', 28, yPos);
    yPos += 5;
    addCheckbox(28, yPos, false, 2.5);
    doc.text('Tidak, saya menyelenggarakan pembukuan. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, false, 2.5);
    doc.text('Tidak, saya hanya menerima penghasilan dari usaha yang dikenakan pajak bersifat final dan', 32, yPos + 1.5);
    yPos += 3;
    doc.text('tidak menyelenggarakan pembukuan. (Lanjut ke pertanyaan 1c)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, false, 2.5);
    doc.text('Ya, saya berhak menggunakan Norma Penghitungan Penghasilan Neto.', 32, yPos + 1.5);
    yPos += 3;
    doc.text('(Isi Lampiran 3B Bagian C, Lampiran 3A-4 Bagian A, lalu ke pertanyaan 1c)', 32, yPos + 1.5);

    yPos += 8;

    // Question 4) Business sector
    doc.text('4) ANDA MENYELENGGARAKAN PEMBUKUAN, SEBUTKAN SEKTOR USAHA YANG ANDA LAKUKAN', 28, yPos);
    yPos += 5;
    addCheckbox(28, yPos, incomeData.business_sector === 'dagang', 2.5);
    doc.text('Dagang. (Isi Lampiran 3A-1, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, incomeData.business_sector === 'jasa', 2.5);
    doc.text('Jasa. (Isi Lampiran 3A-2, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, incomeData.business_sector === 'industri', 2.5);
    doc.text('Industri. (Isi Lampiran 3A-3, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

    yPos += 8;

    // Question 5) Net income amount
    doc.text('5) PENGHASILAN NETO DARI USAHA DAN/ATAU PEKERJAAN BEBAS', 28, yPos);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);

    yPos += 8;

    // Question 1c
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('c', 22, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('APAKAH ANDA MENERIMA PENGHASILAN DALAM NEGERI LAINNYA?', 28, yPos + 2.5);

    // Amount field
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (incomeData.other_domestic_income_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(incomeData.other_domestic_income_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 6;
    addCheckbox(28, yPos, !incomeData.other_domestic_income, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, incomeData.other_domestic_income, 2.5);
    doc.text('Ya. (Isi Lampiran 3A-4 Bagian B, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

    yPos += 8;

    // Question 1d
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('d', 22, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('APAKAH ANDA MENERIMA PENGHASILAN LUAR NEGERI?', 28, yPos + 2.5);

    // Amount field
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (incomeData.foreign_income_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(incomeData.foreign_income_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 6;
    addCheckbox(28, yPos, !incomeData.foreign_income, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 32, yPos + 1.5);
    yPos += 4;
    addCheckbox(28, yPos, incomeData.foreign_income, 2.5);
    doc.text('Ya. (Isi Lampiran 2 Bagian C, lalu ke pertanyaan selanjutnya)', 32, yPos + 1.5);

    // Check if we need a new page
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 20);

    yPos += 15;

    // === C. PENGHITUNGAN PPh TERUTANG ===
    yPos = addBlueHeader('C. PENGHITUNGAN PPh TERUTANG', yPos);

    const taxCalcData = sptData.income_tax_calculation || {};

    // Question 2 with yellow box
    addYellowBox(12, yPos, 6, 4, '2');
    doc.setFontSize(fonts.small);
    doc.text('PENGHASILAN NETO SETAHUN', 20, yPos + 2.5);

    // Formula
    doc.text('( 1a + 1b + 1c + 1d )', 100, yPos + 2.5);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (taxCalcData.net_income_year) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(taxCalcData.net_income_year);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 8;

    // Question 3 with yellow box
    addYellowBox(12, yPos, 6, 4, '3');
    doc.text('APAKAH TERDAPAT PENGURANG PENGHASILAN NETO SEPERTI KOMPENSASI KERUGIAN ATAU', 20, yPos + 2.5);
    yPos += 4;
    doc.text('ZAKAT/SUMBANGAN KEAGAMAAN YANG BERSIFAT WAJIB YANG DIBAYAR SELAIN YANG TELAH', 20, yPos + 2.5);
    yPos += 4;
    doc.text('DIPERHITUNGKAN DALAM FORMULIR SPT DAN/ATAU BPA?', 20, yPos + 2.5);

    yPos += 6;
    addCheckbox(20, yPos, !taxCalcData.net_income_deduction, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 24, yPos + 1.5);
    yPos += 4;
    addCheckbox(20, yPos, taxCalcData.net_income_deduction, 2.5);
    doc.text('Ya. (Isi Lampiran 5 Bagian A dan/atau Bagian B, lalu ke pertanyaan selanjutnya)', 24, yPos + 1.5);

    yPos += 8;

    // Continue with numbered items 4-9
    const taxItems = [
        { num: '4', text: 'PENGHASILAN NETO SETELAH PENGURANG PENGHASILAN NETO', formula: '( 2 - 3 )', value: taxCalcData.net_income_after_deduction },
        { num: '5', text: 'PENGHASILAN TIDAK KENA PAJAK', formula: '', value: taxCalcData.tax_exemptions_amount },
        { num: '6', text: 'PENGHASILAN KENA PAJAK', formula: '( 4 - 5 )', value: taxCalcData.taxable_income },
        { num: '7', text: 'PPh TERUTANG', formula: '', value: taxCalcData.income_tax_payable }
    ];

    taxItems.forEach(item => {
        addYellowBox(12, yPos, 6, 4, item.num);
        doc.setFontSize(fonts.small);
        doc.text(item.text, 20, yPos + 2.5);
        if (item.formula) {
            doc.text(item.formula, 100, yPos + 2.5);
        }
        addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
        if (item.value) {
            doc.setFontSize(fonts.tiny);
            const formattedAmount = PDFHelpers.formatCurrency(item.value);
            doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
            doc.setFontSize(fonts.small);
        }
        yPos += 8;
    });

    // Question 8 with yellow box
    addYellowBox(12, yPos, 6, 4, '8');
    doc.setFontSize(fonts.small);
    doc.text('APAKAH TERDAPAT PENGURANG PPh TERUTANG?', 20, yPos + 2.5);
    yPos += 6;
    addCheckbox(20, yPos, !taxCalcData.income_tax_deduction, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 24, yPos + 1.5);
    yPos += 4;
    addCheckbox(20, yPos, taxCalcData.income_tax_deduction, 2.5);
    doc.text('Ya. (Isi Lampiran 5 Bagian C, lalu ke pertanyaan selanjutnya)', 24, yPos + 1.5);

    yPos += 8;

    // Question 9 with yellow box
    addYellowBox(12, yPos, 6, 4, '9');
    doc.setFontSize(fonts.small);
    doc.text('PPh TERUTANG SETELAH PENGURANG PPh TERUTANG', 20, yPos + 2.5);
    doc.text('( 7 - 8 )', 100, yPos + 2.5);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (taxCalcData.income_tax_after_deduction) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(taxCalcData.income_tax_after_deduction);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 15;

    // === D. KREDIT PAJAK ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 30);
    yPos = addBlueHeader('D. KREDIT PAJAK', yPos);

    const creditData = sptData.income_tax_credit || {};

    // Question 10 with yellow box
    addYellowBox(12, yPos, 12, 4, '10');

    // Question 10a
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('a', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('APAKAH TERDAPAT PPh YANG TELAH DIPOTONG/DIPUNGUT OLEH PIHAK LAIN?', 32, yPos + 2.5);

    // Amount field
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (creditData.withheld_income_tax_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(creditData.withheld_income_tax_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 6;
    addCheckbox(32, yPos, !creditData.withheld_income_tax, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 36, yPos + 1.5);
    yPos += 4;
    addCheckbox(32, yPos, creditData.withheld_income_tax, 2.5);
    doc.text('Ya. (Isi Lampiran 1 Bagian E, lalu ke pertanyaan selanjutnya)', 36, yPos + 1.5);

    yPos += 8;

    // Question 10b
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('b', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('ANGSURAN PPh PASAL 25', 32, yPos + 2.5);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (creditData.installment_article_25_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(creditData.installment_article_25_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 8;

    // Question 10c
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('c', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('STP PPh PASAL 25 (HANYA POKOK PAJAK)', 32, yPos + 2.5);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (creditData.notice_tax_collection_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(creditData.notice_tax_collection_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 8;

    // Question 10d
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('d', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('APAKAH ANDA MENERIMA PENGEMBALIAN/PENGURANGAN KREDIT PPh LUAR NEGERI YANG', 32, yPos + 2.5);
    yPos += 4;
    doc.text('TELAH DIKREDITKAN?', 32, yPos + 2.5);

    // Amount field
    addInputField(headerWidth - amountFieldWidth + 5, yPos - 4, amountFieldWidth, 4);
    if (creditData.foreign_tax_credit_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(creditData.foreign_tax_credit_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos - 1.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 6;
    addCheckbox(32, yPos, !creditData.foreign_tax_credit, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak. (Lanjut ke pertanyaan selanjutnya)', 36, yPos + 1.5);
    yPos += 4;
    addCheckbox(32, yPos, creditData.foreign_tax_credit, 2.5);
    doc.text('Ya. (Isi dengan jumlah pengembalian/pengurangan kredit PPh luar negeri)', 36, yPos + 1.5);

    yPos += 15;

    // Check if we need a new page
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 30);

    // === E. KURANG/LEBIH BAYAR ===
    yPos = addBlueHeader('E. KURANG/LEBIH BAYAR', yPos);

    const paymentData = sptData.underpayment_overpayment || {};

    // Question 11 with yellow box
    addYellowBox(12, yPos, 12, 4, '11');
    doc.setFontSize(fonts.small);
    doc.text('PPh YANG KURANG (LEBIH) DIBAYAR', 26, yPos + 2.5);
    doc.text('( 9 - 10a - 10b - 10c + 10d )', 100, yPos + 2.5);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (paymentData.underpayment_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(paymentData.underpayment_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 8;

    // Question 12 with yellow box
    addYellowBox(12, yPos, 12, 4, '12');
    doc.setFontSize(fonts.small);
    doc.text('APAKAH LEBIH BAYAR PADA ANGKA 11 MOHON DIKEMBALIKAN?', 26, yPos + 2.5);

    yPos += 6;
    addCheckbox(26, yPos, !paymentData.approval_letter, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak, lebih bayar dipindahbukukan untuk pembayaran pajak tahun berikutnya', 30, yPos + 1.5);
    yPos += 4;
    addCheckbox(26, yPos, paymentData.approval_letter, 2.5);
    doc.text('Ya. (Isi bagian F)', 30, yPos + 1.5);

    yPos += 8;

    // Question 13 with yellow box
    addYellowBox(12, yPos, 12, 4, '13');
    doc.setFontSize(fonts.small);
    doc.text('PPh YANG HARUS DIBAYAR SENDIRI', 26, yPos + 2.5);
    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (paymentData.final_payment_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(paymentData.final_payment_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 15;

    // === F. RESTITUSI (if applicable) ===
    if (sptData.refund_data && paymentData.approval_letter) {
        yPos = addBlueHeader('F. RESTITUSI', yPos);

        const refundData = sptData.refund_data;

        doc.setFontSize(fonts.small);
        doc.text('Metode Pengembalian:', 15, yPos + 3);
        const refundMethodWidth = Math.min(120, headerWidth * 0.6);
        addInputField(60, yPos, refundMethodWidth, 4);
        doc.setFontSize(fonts.tiny);
        doc.text(refundData.refund_method || '', 62, yPos + 2.5);

        yPos += 8;

        doc.setFontSize(fonts.small);
        doc.text('Bank/Rekening:', 15, yPos + 3);
        addInputField(60, yPos, refundMethodWidth, 4);
        doc.setFontSize(fonts.tiny);
        doc.text(refundData.bank_account || '', 62, yPos + 2.5);

        yPos += 12;
    }

    // === G. ANGSURAN PPh PASAL 25 ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 30);
    yPos = addBlueHeader('G. ANGSURAN PPh PASAL 25', yPos);

    const installmentData = sptData.income_tax_installment || {};

    // Question 14 with yellow box
    addYellowBox(12, yPos, 12, 4, '14');
    doc.setFontSize(fonts.small);
    doc.text('PENGHITUNGAN ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA', 26, yPos + 2.5);

    yPos += 8;

    // 14a
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('a', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('APAKAH ANDA MEMPUNYAI KEWAJIBAN MENYETOR ANGSURAN PPh PASAL 25?', 32, yPos + 2.5);

    yPos += 6;
    addCheckbox(32, yPos, !installmentData.article_25_obligation, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('Tidak', 36, yPos + 1.5);
    addCheckbox(60, yPos, installmentData.article_25_obligation, 2.5);
    doc.text('Ya', 64, yPos + 1.5);

    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (installmentData.article_25_amount) {
        const formattedAmount = PDFHelpers.formatCurrency(installmentData.article_25_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 1.5);
    }

    yPos += 8;

    // 14b
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('b', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('WAJIB PAJAK PENGUSAHA TERTENTU', 32, yPos + 2.5);

    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (installmentData.specific_entrepreneur_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(installmentData.specific_entrepreneur_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 8;

    // 14c
    doc.setFillColor(...lightGray);
    doc.rect(26, yPos, 6, 4, 'F');
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('c', 28, yPos + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.text('ANGSURAN OPPT', 32, yPos + 2.5);

    addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
    if (installmentData.oppt_installment_amount) {
        doc.setFontSize(fonts.tiny);
        const formattedAmount = PDFHelpers.formatCurrency(installmentData.oppt_installment_amount);
        doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    yPos += 15;

    // === H. TRANSAKSI LAINNYA ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 30);
    yPos = addBlueHeader('H. TRANSAKSI LAINNYA', yPos);

    const otherData = sptData.other_transactions || {};

    doc.setFontSize(fonts.small);

    const otherTransactions = [
        { text: '1. Harta pada akhir tahun:', field: 'assets_end_year', amount: 'assets_end_year_amount' },
        { text: '2. Kewajiban pada akhir tahun:', field: 'debt_end_year', amount: 'debt_end_year_amount' },
        { text: '3. PPh yang bersifat final:', field: 'final_income_tax', amount: 'final_income_tax_amount' },
        { text: '4. Penghasilan yang dikecualikan:', field: 'excluded_income', amount: 'excluded_income_amount' },
        { text: '5. Penyusutan/Amortisasi:', field: 'depreciation_amortization', amount: '' },
        { text: '6. Biaya representasi/jamuan:', field: 'entertainment_expense', amount: '' },
        { text: '7. Dividen:', field: 'dividend_income', amount: '' }
    ];

    otherTransactions.forEach(item => {
        doc.text(item.text, 15, yPos + 3);
        addCheckbox(80, yPos, otherData[item.field], 2.5);
        doc.setFontSize(fonts.tiny);
        doc.text('Ya', 84, yPos + 1.5);
        addCheckbox(100, yPos, !otherData[item.field], 2.5);
        doc.text('Tidak', 104, yPos + 1.5);

        if (item.amount && otherData[item.amount]) {
            addInputField(headerWidth - amountFieldWidth + 5, yPos, amountFieldWidth, 4);
            const formattedAmount = PDFHelpers.formatCurrency(otherData[item.amount]);
            doc.text(formattedAmount, headerWidth - amountFieldWidth + 7, yPos + 2.5);
        }

        doc.setFontSize(fonts.small);
        yPos += 8;
    });

    yPos += 10;

    // === PERNYATAAN DAN TANDA TANGAN ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 50);
    yPos = addBlueHeader('PERNYATAAN', yPos);

    const statementData = sptData.statement_data || {};

    // Declaration text
    const declarationText = 'Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi-sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, saya menyatakan bahwa apa yang telah saya beritahukan di atas beserta lampiran-lampirannya adalah benar, lengkap dan jelas.';

    doc.setFontSize(fonts.small);
    const maxDeclarationWidth = headerWidth - 10;
    const lines = doc.splitTextToSize(declarationText, maxDeclarationWidth);
    doc.text(lines, 15, yPos + 2);
    yPos += lines.length * 3 + 8;

    // Check for new page for signature section
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 40);

    // Signature section with border
    doc.setLineWidth(0.5);
    doc.rect(10, yPos, headerWidth, 35);

    // PENANDA TANGAN section
    doc.setFontSize(fonts.small);
    doc.text('PENANDA TANGAN', 15, yPos + 5);
    addCheckbox(15, yPos + 7, true, 2.5);
    doc.setFontSize(fonts.tiny);
    doc.text('WAJIB PAJAK', 19, yPos + 8.5);
    addCheckbox(70, yPos + 7, false, 2.5);
    doc.text('WAKIL/KUASA', 74, yPos + 8.5);

    // Date section - responsive positioning
    const dateX = headerWidth * 0.6;
    doc.setFontSize(fonts.small);
    doc.text('TANGGAL', dateX, yPos + 5);
    doc.text('BULAN', dateX + 20, yPos + 5);
    doc.text('TAHUN', dateX + 40, yPos + 5);

    // Date input boxes
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();

    // Day boxes
    addInputField(dateX, yPos + 7, 4, 4);
    addInputField(dateX + 5, yPos + 7, 4, 4);
    doc.setFontSize(fonts.tiny);
    doc.text(day[0], dateX + 1.5, yPos + 9.5);
    doc.text(day[1], dateX + 6.5, yPos + 9.5);

    // Month boxes
    addInputField(dateX + 20, yPos + 7, 4, 4);
    addInputField(dateX + 25, yPos + 7, 4, 4);
    doc.text(month[0], dateX + 21.5, yPos + 9.5);
    doc.text(month[1], dateX + 26.5, yPos + 9.5);

    // Year boxes
    addInputField(dateX + 40, yPos + 7, 4, 4);
    addInputField(dateX + 45, yPos + 7, 4, 4);
    addInputField(dateX + 50, yPos + 7, 4, 4);
    addInputField(dateX + 55, yPos + 7, 4, 4);
    doc.text(year[0], dateX + 41.5, yPos + 9.5);
    doc.text(year[1], dateX + 46.5, yPos + 9.5);
    doc.text(year[2], dateX + 51.5, yPos + 9.5);
    doc.text(year[3], dateX + 56.5, yPos + 9.5);

    yPos += 15;

    // NIK/NPWP section
    doc.setFontSize(fonts.small);
    doc.text('NIK/NPWP', 15, yPos + 2);

    // NIK boxes - responsive sizing
    const signatureNikBoxSize = Math.min(10, headerWidth / 20);
    for (let i = 0; i < 16; i++) {
        const boxX = 15 + (i * signatureNikBoxSize);
        if (boxX + signatureNikBoxSize <= 15 + headerWidth - 20) {
            addInputField(boxX, yPos + 4, signatureNikBoxSize - 1, 4);
            if (identityData.nik && identityData.nik[i]) {
                doc.setFontSize(fonts.tiny);
                doc.text(identityData.nik[i], boxX + 2, yPos + 6.5);
                doc.setFontSize(fonts.small);
            }
        }
    }

    yPos += 10;

    // NAMA LENGKAP
    doc.setFontSize(fonts.small);
    doc.text('NAMA LENGKAP', 15, yPos + 2);
    const nameSignatureWidth = Math.min(100, headerWidth * 0.5);
    addInputField(50, yPos, nameSignatureWidth, 4);
    if (identityData.name || sptData.user?.name) {
        doc.setFontSize(fonts.tiny);
        const maxNameSignatureLength = Math.floor(nameSignatureWidth / 2.5);
        const displayName = (identityData.name || sptData.user?.name || '').substring(0, maxNameSignatureLength);
        doc.text(displayName, 52, yPos + 2.5);
        doc.setFontSize(fonts.small);
    }

    // TANDA TANGAN - responsive positioning
    const signatureX = 50 + nameSignatureWidth + 5;
    const signatureWidth = Math.min(40, headerWidth - signatureX + 10);
    doc.text('TANDA TANGAN', signatureX, yPos + 2);
    addInputField(signatureX, yPos + 4, signatureWidth, 8);
    if (statementData.signature) {
        doc.setFontSize(fonts.tiny);
        const maxSigLength = Math.floor(signatureWidth / 2);
        const displaySig = 'Digital: ' + statementData.signature.substring(0, maxSigLength - 10) + '...';
        doc.text(displaySig, signatureX + 2, yPos + 7);
        doc.setFontSize(fonts.small);
    }

    yPos += 15;

    // Footer - Status and submission info
    doc.setFontSize(fonts.tiny);
    doc.setTextColor(100, 100, 100);
    doc.text('Tanggal Pengajuan: ' + (sptData.submission_date ? new Date(sptData.submission_date).toLocaleDateString('id-ID') : ''), 15, yPos + 3);
    yPos += 3;
    doc.text('Status: ' + (sptData.status || ''), 15, yPos + 3);
    yPos += 3;
    if (sptData.processed_date) {
        doc.text('Tanggal Diproses: ' + new Date(sptData.processed_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }
    yPos += 3;
    if (sptData.reference_number) {
        doc.text('No. Referensi: ' + sptData.reference_number, 15, yPos + 3);
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    return doc;
};

const addLampiran2 = (doc, sptData) => {
    // Add new page for Lampiran 2
    doc.addPage();
    let yPos = PDFHelpers.getPageDimensions().margin.top;

    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 20; // 10mm margins on each side
    const fonts = PDFHelpers.getFontSizes();

    // Helper function to calculate responsive column widths
    const calculateColumnWidths = (columns, totalWidth) => {
        const totalWeight = columns.reduce((sum, col) => sum + col.weight, 0);
        return columns.map(col => (col.weight / totalWeight) * totalWidth);
    };

    // Helper function to add responsive table with text wrapping
    const addResponsiveTable = (headers, data, yPosition, maxRows = null) => {
        let currentY = yPosition;

        // Define column configurations with weights (relative widths)
        let columnConfig;
        if (headers.length === 6) { // Final Tax table
            columnConfig = [
                { weight: 1, minWidth: 8 },   // NO
                { weight: 5, minWidth: 25 },  // PEMOTONG/PEMUNGUT
                { weight: 1.5, minWidth: 10 }, // KODE
                { weight: 5, minWidth: 30 },  // JENIS PENGHASILAN
                { weight: 3, minWidth: 20 },  // DASAR PENGENAAN
                { weight: 3, minWidth: 20 }   // PPh TERUTANG
            ];
        } else if (headers.length === 5) { // Non-taxable table
            columnConfig = [
                { weight: 1, minWidth: 8 },   // NO
                { weight: 2, minWidth: 12 },  // KODE
                { weight: 6, minWidth: 35 },  // JENIS PENGHASILAN
                { weight: 6, minWidth: 35 },  // SUMBER PENGHASILAN
                { weight: 3, minWidth: 25 }   // PENGHASILAN BRUTO
            ];
        } else { // Foreign income table
            columnConfig = [
                { weight: 0.8, minWidth: 6 },  // NO
                { weight: 3, minWidth: 18 },   // SUMBER
                { weight: 2, minWidth: 12 },   // TANGGAL
                { weight: 3, minWidth: 18 },   // JENIS
                { weight: 2.5, minWidth: 15 }, // NETO RUPIAH
                { weight: 4, minWidth: 25 },   // PAJAK LUAR NEGERI
                { weight: 2.5, minWidth: 15 }  // KREDIT PAJAK
            ];
        }

        const columnWidths = calculateColumnWidths(columnConfig, usableWidth);

        // Add table header with text wrapping
        const headerHeight = 8;
        doc.setFillColor(...PDFHelpers.colors.lightBlue);
        doc.rect(10, currentY, usableWidth, headerHeight, 'F');
        doc.setLineWidth(0.3);
        doc.setDrawColor(0, 0, 0);
        doc.rect(10, currentY, usableWidth, headerHeight);

        let xPos = 10;
        doc.setFontSize(fonts.tiny);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        headers.forEach((header, index) => {
            // Draw vertical lines
            if (index > 0) {
                doc.line(xPos, currentY, xPos, currentY + headerHeight);
            }

            // Split and center text in header
            const headerLines = doc.splitTextToSize(header, columnWidths[index] - 2);
            const lineHeight = 2.5;
            const totalTextHeight = headerLines.length * lineHeight;
            const startY = currentY + (headerHeight - totalTextHeight) / 2 + lineHeight;

            headerLines.forEach((line, lineIndex) => {
                const textY = startY + (lineIndex * lineHeight);
                doc.text(line, xPos + columnWidths[index] / 2, textY, { align: 'center' });
            });

            xPos += columnWidths[index];
        });

        currentY += headerHeight;

        // Add table rows
        const rowsToShow = maxRows || data.length || 1;
        const rowHeight = 8;

        for (let i = 0; i < rowsToShow; i++) {
            const item = data[i];

            // Check if we need a new page
            if (currentY + rowHeight > pageWidth - 30) {
                doc.addPage();
                currentY = 30;
            }

            // Draw row background (alternating colors for readability)
            if (i % 2 === 1) {
                doc.setFillColor(248, 248, 248);
                doc.rect(10, currentY, usableWidth, rowHeight, 'F');
            }

            // Draw row border
            doc.setDrawColor(0, 0, 0);
            doc.rect(10, currentY, usableWidth, rowHeight);

            xPos = 10;
            doc.setFontSize(fonts.tiny);
            doc.setFont('helvetica', 'normal');

            // Populate row data based on table type
            let rowData = [];
            if (headers.length === 6) { // Final Tax table
                if (item) {
                    rowData = [
                        (i + 1).toString(),
                        '', // Will be filled with sub-fields
                        item.code || '',
                        item.income_type || '',
                        PDFHelpers.formatCurrency(item.tax_base),
                        PDFHelpers.formatCurrency(item.tax_amount)
                    ];
                } else {
                    rowData = [(i + 1).toString(), '', '', '', '', ''];
                }
            } else if (headers.length === 5) { // Non-taxable table
                if (item) {
                    rowData = [
                        (i + 1).toString(),
                        item.code || '',
                        item.income_type || '',
                        '', // Will be filled with sub-fields
                        PDFHelpers.formatCurrency(item.gross_income)
                    ];
                } else {
                    rowData = [(i + 1).toString(), '', '', '', ''];
                }
            } else { // Foreign income table
                if (item) {
                    rowData = [
                        (i + 1).toString(),
                        '', // Will be filled with sub-fields
                        item.transaction_date || '',
                        item.income_type || '',
                        PDFHelpers.formatCurrency(item.net_income_rupiah),
                        (item.foreign_tax_amount || '') + ' / ' + PDFHelpers.formatCurrency(item.foreign_tax_rupiah),
                        PDFHelpers.formatCurrency(item.tax_credit)
                    ];
                } else {
                    rowData = [(i + 1).toString(), '', '', '', '', '', ''];
                }
            }

            // Fill each cell with proper text wrapping
            rowData.forEach((cellData, cellIndex) => {
                if (cellIndex > 0) {
                    doc.line(xPos, currentY, xPos, currentY + rowHeight);
                }

                if (cellData && cellData.toString().trim() !== '') {
                    const cellLines = doc.splitTextToSize(cellData.toString(), columnWidths[cellIndex] - 2);
                    const lineHeight = 2.2;

                    cellLines.forEach((line, lineIndex) => {
                        if (lineIndex < 2) { // Limit to 2 lines per cell to prevent overflow
                            const textY = currentY + 2.5 + (lineIndex * lineHeight);
                            const textX = cellIndex === 0 ? xPos + columnWidths[cellIndex] / 2 : xPos + 1; // Center number, left-align others
                            const alignment = cellIndex === 0 ? { align: 'center' } : {};
                            doc.text(line, textX, textY, alignment);
                        }
                    });
                }

                xPos += columnWidths[cellIndex];
            });

            // Add sub-fields for specific columns
            doc.setFontSize(fonts.tiny - 1);
            if (headers.length === 6) { // Final Tax table
                const subFieldX = 10 + columnWidths[0] + 1;
                doc.text('NIK/NPWP: ' + (item?.tin || ''), subFieldX, currentY + 4.5);
                doc.text('NAMA: ' + (item?.name || ''), subFieldX, currentY + 6.5);
            } else if (headers.length === 5) { // Non-taxable table
                const subFieldX = 10 + columnWidths[0] + columnWidths[1] + columnWidths[2] + 1;
                doc.text('NIK/NPWP: ' + (item?.source_tin || ''), subFieldX, currentY + 4.5);
                doc.text('NAMA: ' + (item?.source_name || ''), subFieldX, currentY + 6.5);
            } else { // Foreign income table
                const subFieldX = 10 + columnWidths[0] + 1;
                doc.text('NAMA: ' + (item?.source_name || ''), subFieldX, currentY + 4.5);
                doc.text('NEGARA: ' + (item?.country || ''), subFieldX, currentY + 6.5);
            }

            currentY += rowHeight;
        }

        return currentY;
    };

    // === LAMPIRAN 2 HEADER SECTION ===
    const headerHeight = 35;
    doc.setFillColor(...PDFHelpers.colors.lightBlue);
    doc.rect(10, yPos, usableWidth, headerHeight, 'F');
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPos, usableWidth, headerHeight);

    // Left side info - PERHATIAN
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PERHATIAN', 12, yPos + 4);

    const instructionText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK UNTUK MELAPORKAN PENGHASILAN YANG DIKENAKAN PAJAK PENGHASILAN BERSIFAT FINAL, PENGHASILAN YANG TIDAK TERMASUK OBJEK PAJAK, DAN PENGHASILAN NETO LUAR NEGERI';
    const maxInstructionWidth = usableWidth * 0.35; // Reduced to give more space for other elements

    doc.setFontSize(fonts.tiny);
    doc.setFont('helvetica', 'normal');
    const instructionLines = doc.splitTextToSize(instructionText, maxInstructionWidth);
    instructionLines.forEach((line, index) => {
        if (index < 4) { // Limit to prevent overflow
            doc.text(line, 12, yPos + 7 + (index * 2.3));
        }
    });

    // Legend section - responsive positioning
    const legendX = 10 + (usableWidth * 0.38);
    const legendWidth = usableWidth * 0.32;
    doc.setFontSize(fonts.tiny);
    doc.setFont('helvetica', 'bold');
    const legendItems = [
        'A. PENGHASILAN YANG DIKENAKAN PAJAK PENGHASILAN BERSIFAT FINAL',
        'B. PENGHASILAN YANG TIDAK TERMASUK OBJEK PAJAK',
        'C. PENGHASILAN NETO LUAR NEGERI'
    ];

    legendItems.forEach((item, index) => {
        const itemLines = doc.splitTextToSize(item, legendWidth);
        itemLines.forEach((line, lineIndex) => {
            doc.text(line, legendX, yPos + 6 + (index * 6) + (lineIndex * 2.5));
        });
    });

    // LAMPIRAN 2 box - increased width for better visibility
    const lampBoxWidth = Math.min(50, usableWidth * 0.25);
    const lampBoxX = pageWidth - 10 - lampBoxWidth;
    doc.setFillColor(...PDFHelpers.colors.yellow);
    doc.rect(lampBoxX, yPos + 3, lampBoxWidth, 12, 'F');
    doc.rect(lampBoxX, yPos + 3, lampBoxWidth, 12);
    doc.setFontSize(fonts.medium);
    doc.setFont('helvetica', 'bold');
    doc.text('LAMPIRAN 2', lampBoxX + (lampBoxWidth / 2), yPos + 10, { align: 'center' });

    // NIK/NPWP section - increased width for better visibility
    const taxpayerData = sptData.taxpayer_identity || {};
    doc.setFontSize(fonts.tiny);
    doc.setFont('helvetica', 'normal');
    doc.text('NIK/NPWP', lampBoxX, yPos + 18);

    const availableNikWidth = lampBoxWidth - 2;
    const nikBoxSize = Math.max(2.2, availableNikWidth / 16); // Increased minimum size
    for (let i = 0; i < 16; i++) {
        const boxX = lampBoxX + (i * nikBoxSize);
        if (boxX + nikBoxSize <= pageWidth - 12) {
            PDFHelpers.addInputField(doc, boxX, yPos + 19.5, nikBoxSize - 0.1, 3); // Increased height
            if (taxpayerData.nik && taxpayerData.nik[i]) {
                doc.setFontSize(fonts.tiny);
                doc.text(taxpayerData.nik[i], boxX + 0.3, yPos + 21.5);
            }
        }
    }

    // Tax Year - increased width and better positioning
    doc.setFontSize(fonts.tiny);
    doc.text('TAHUN PAJAK', lampBoxX, yPos + 25); // Moved below NIK/NPWP
    const taxYear = sptData.tax_year?.toString() || '2024';
    const yearBoxSize = Math.max(3, lampBoxWidth / 6); // Increased minimum size

    for (let i = 0; i < 4; i++) {
        const boxX = lampBoxX + (i * yearBoxSize);
        if (boxX + yearBoxSize <= pageWidth - 12) {
            PDFHelpers.addInputField(doc, boxX, yPos + 26.5, yearBoxSize - 0.1, 3); // Increased height
            if (taxYear[i]) {
                doc.setFontSize(fonts.tiny);
                doc.text(taxYear[i], boxX + 0.4, yPos + 28.5);
            }
        }
    }

    yPos += headerHeight + 10; // Increased spacing to accommodate the repositioned tax year section

    // Parse detail data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l2Data = detailData.l2_data || {};

    // === A. PENGHASILAN YANG DIKENAKAN PAJAK PENGHASILAN BERSIFAT FINAL ===
    yPos = PDFHelpers.addBlueHeader(doc, 'A. PENGHASILAN YANG DIKENAKAN PAJAK PENGHASILAN BERSIFAT FINAL', yPos);

    const finalTaxHeaders = ['NO', 'PEMOTONG/PEMUNGUT PPh', 'KODE', 'JENIS PENGHASILAN', 'DASAR PENGENAAN PAJAK', 'PPh TERUTANG'];
    const finalTaxData = l2Data.final_tax_income || [];
    yPos = addResponsiveTable(finalTaxHeaders, finalTaxData, yPos, 15);

    // JUMLAH TABEL A
    PDFHelpers.addYellowBox(doc, pageWidth - 28, yPos, 18, 4, 'JUMLAH TABEL A');
    yPos += 6;
    doc.setFontSize(fonts.tiny);
    doc.text('PINDAHKAN JUMLAH TABEL A KOLOM (5) KE INDUK BAGIAN I ANGKA 1a HURUF c', 12, yPos);

    yPos += 12;

    // === B. PENGHASILAN YANG TIDAK TERMASUK OBJEK PAJAK ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 30);
    yPos = PDFHelpers.addBlueHeader(doc, 'B. PENGHASILAN YANG TIDAK TERMASUK OBJEK PAJAK', yPos);

    const nonTaxableHeaders = ['NO', 'KODE', 'JENIS PENGHASILAN', 'SUMBER PENGHASILAN', 'PENGHASILAN BRUTO'];
    const nonTaxableData = l2Data.non_taxable_income || [];
    yPos = addResponsiveTable(nonTaxableHeaders, nonTaxableData, yPos, 8);

    // JUMLAH TABEL B
    PDFHelpers.addYellowBox(doc, pageWidth - 32, yPos, 22, 4, 'JUMLAH TABEL B');
    yPos += 6;
    doc.setFontSize(fonts.tiny);
    doc.text('PINDAHKAN JUMLAH TABEL B KE INDUK BAGIAN I ANGKA 1a HURUF d', 12, yPos);

    yPos += 12;

    // === C. PENGHASILAN NETO LUAR NEGERI ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 40);
    yPos = PDFHelpers.addBlueHeader(doc, 'C. PENGHASILAN NETO LUAR NEGERI', yPos);

    const foreignIncomeHeaders = [
        'NO', 'SUMBER/PEMBERI PENGHASILAN', 'TANGGAL TRANSAKSI', 'JENIS PENGHASILAN',
        'PENGHASILAN NETO (RUPIAH)', 'PAJAK PENGHASILAN YANG TERUTANG/DIBAYAR/DIPOTONG DI LUAR NEGERI',
        'KREDIT PAJAK YANG DAPAT DIPERHITUNGKAN'
    ];
    const foreignIncomeData = l2Data.foreign_income || [];
    yPos = addResponsiveTable(foreignIncomeHeaders, foreignIncomeData, yPos, 8);

    // JUMLAH TABEL C - Three responsive yellow boxes
    const box1X = 10 + (usableWidth * 0.6);
    const box2X = 10 + (usableWidth * 0.75);
    const box3X = 10 + (usableWidth * 0.9);
    const boxWidth = Math.min(12, usableWidth * 0.08);

    [
        { x: box1X, label: 'C.5' },
        { x: box2X, label: 'C.6' },
        { x: box3X, label: 'C.10' }
    ].forEach(box => {
        if (box.x + boxWidth <= pageWidth - 10) {
            doc.setFillColor(...PDFHelpers.colors.yellow);
            doc.rect(box.x, yPos, boxWidth, 4, 'F');
            doc.rect(box.x, yPos, boxWidth, 4);
            doc.setFontSize(fonts.tiny);
            doc.setFont('helvetica', 'bold');
            doc.text(box.label, box.x + boxWidth / 2, yPos + 2.5, { align: 'center' });
        }
    });

    yPos += 8;
    doc.setFontSize(fonts.tiny);
    doc.setFont('helvetica', 'normal');

    const footerLines = [
        'PINDAHKAN JUMLAH TABEL C KOLOM (5) KE INDUK BAGIAN I ANGKA 1 HURUF d',
        'PINDAHKAN JUMLAH TABEL C KOLOM (10) KE LAMPIRAN 1 BAGIAN E BARIS 17 KOLOM (6)'
    ];

    footerLines.forEach((line, index) => {
        const lineWidth = usableWidth - 4;
        const wrappedLines = doc.splitTextToSize(line, lineWidth);
        wrappedLines.forEach((wrappedLine, wrappedIndex) => {
            doc.text(wrappedLine, 12, yPos + (index * 6) + (wrappedIndex * 3));
        });
    });

    // Footer for Lampiran 2
    yPos += 15;
    doc.setFontSize(fonts.tiny);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 2 - PENGHASILAN FINAL, NON-OBJEK PAJAK, DAN LUAR NEGERI', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);
};

const createLampiran3Header = (doc, lampiranCode, title, subtitle, perhatianText, taxpayerData, taxYear = '2023') => {
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 15;

    // === MAIN HEADER CONTAINER ===
    const headerHeight = 40;
    doc.setFillColor(173, 216, 230); // Light blue background
    doc.rect(10, yPos, pageWidth - 20, headerHeight, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.rect(10, yPos, pageWidth - 20, headerHeight);

    // === CALCULATE LAYOUT SECTIONS WITH BETTER PROPORTIONS ===
    const margin = 3;
    const perhatianWidth = 75;  // Reduced width
    const lampiranWidth = 55;   // Increased width
    const centerWidth = pageWidth - 20 - perhatianWidth - lampiranWidth - (margin * 4);

    // === LEFT SECTION - PERHATIAN ===
    const perhatianX = 10 + margin;

    // PERHATIAN title
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PERHATIAN', perhatianX, yPos + 6);

    // PERHATIAN content with proper line spacing
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    const lines = [
        'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG',
        'MENYELENGGARAKAN PEMBUKUAN DENGAN',
        'STELSEL KAS ATAU AKRUAL DI SEKTOR DAGANG'
    ];

    lines.forEach((line, index) => {
        doc.text(line, perhatianX, yPos + 10 + (index * 3));
    });

    // === CENTER SECTION - TITLE ===
    const centerX = perhatianX + perhatianWidth + margin;
    const titleCenterX = centerX + (centerWidth / 2);

    // Main title
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(title, titleCenterX, yPos + 18, { align: 'center' });

    // Subtitle
    if (subtitle) {
        doc.setFontSize(6);
        doc.text(subtitle, titleCenterX, yPos + 28, { align: 'center' });
    }

    // === RIGHT SECTION - LAMPIRAN BOX ===
    const lampiranX = centerX + centerWidth + margin;

    // Yellow lampiran code box - better positioned
    const codeBoxHeight = 10;
    doc.setFillColor(255, 193, 7); // Yellow
    doc.rect(lampiranX, yPos + 3, lampiranWidth, codeBoxHeight, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(lampiranX, yPos + 3, lampiranWidth, codeBoxHeight);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(lampiranCode, lampiranX + (lampiranWidth / 2), yPos + 9, { align: 'center' });

    // === NIK/NPWP SECTION - IMPROVED LAYOUT ===
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('NIK/NPWP', lampiranX + 1, yPos + 16);

    // NIK boxes - better spacing and alignment
    const nikStartY = yPos + 18;
    const nikBoxWidth = (lampiranWidth - 4) / 16;  // Better spacing
    const nikBoxHeight = 4;

    for (let i = 0; i < 16; i++) {
        const boxX = lampiranX + 2 + (i * nikBoxWidth);
        doc.setFillColor(255, 255, 255);
        doc.rect(boxX, nikStartY, nikBoxWidth - 0.1, nikBoxHeight, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(boxX, nikStartY, nikBoxWidth - 0.1, nikBoxHeight);

        // Fill NIK digits if available
        if (taxpayerData.nik && taxpayerData.nik[i]) {
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text(
                taxpayerData.nik[i],
                boxX + (nikBoxWidth / 2) - 0.05,
                nikStartY + 2.8,
                { align: 'center' }
            );
        }
    }

    // === TAHUN PAJAK SECTION - IMPROVED LAYOUT ===
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('TAHUN PAJAK', lampiranX + 1, yPos + 26);

    // Year boxes - better proportions and alignment
    const yearStartY = yPos + 28;
    const yearBoxWidth = (lampiranWidth - 4) / 4;  // Better spacing
    const yearBoxHeight = 5;

    for (let i = 0; i < 4; i++) {
        const boxX = lampiranX + 2 + (i * yearBoxWidth);
        doc.setFillColor(255, 255, 255);
        doc.rect(boxX, yearStartY, yearBoxWidth - 0.1, yearBoxHeight, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(boxX, yearStartY, yearBoxWidth - 0.1, yearBoxHeight);

        // Fill year digits
        if (taxYear[i]) {
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.text(
                taxYear[i],
                boxX + (yearBoxWidth / 2) - 0.05,
                yearStartY + 3.5,
                { align: 'center' }
            );
        }
    }

    // === VERTICAL SEPARATORS - BETTER POSITIONING ===
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);

    // Separator after PERHATIAN
    const sep1X = perhatianX + perhatianWidth + (margin / 2);
    doc.line(sep1X, yPos + 4, sep1X, yPos + headerHeight - 4);

    // Separator before LAMPIRAN
    const sep2X = centerX + centerWidth + (margin / 2);
    doc.line(sep2X, yPos + 4, sep2X, yPos + headerHeight - 4);

    // Reset drawing properties
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.setTextColor(0, 0, 0);

    return yPos + headerHeight + 10;
};

const addLampiran3A1 = (doc, sptData) => {
    doc.addPage();

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3a1Data = detailData.l3a1_data || {};
    const profitLossData = l3a1Data.profit_loss || [];
    const financialPosition = l3a1Data.financial_position || {};
    const taxpayerData = sptData.taxpayer_identity || {};

    // Function to check if we need a new page
    const checkPageBreak = (requiredHeight) => {
        if (yPos + requiredHeight > pageHeight - 20) {
            doc.addPage();
            yPos = 15;
            return true;
        }
        return false;
    };

    const perhatianText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG MENYELENGGARAKAN PEMBUKUAN DENGAN STELSEL KAS ATAU AKRUAL DI SEKTOR DAGANG';
    yPos = createLampiran3Header(
        doc,
        'LAMPIRAN 3A-1',
        'REKONSILIASI LAPORAN KEUANGAN',
        '(DAGANG)',
        perhatianText,
        taxpayerData
    );

    // const pageWidth = doc.internal.pageSize.width;
    // const pageHeight = doc.internal.pageSize.height;

    // === A.1 LAPORAN LABA RUGI ===
    checkPageBreak(50);

    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, pageWidth - 20, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('A.1 LAPORAN LABA RUGI', 12, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 7;

    // Table header
    const headers = [
        'KODE', 'NAMA AKUN', 'NILAI', 'TIDAK OBJEK', 'PPh FINAL',
        'OBJEK PAJAK', 'FISKAL +', 'FISKAL -', 'KODE', 'FISKAL'
    ];

    // More responsive column widths
    const totalTableWidth = pageWidth - 20;
    const colWidths = [
        totalTableWidth * 0.06,  // KODE
        totalTableWidth * 0.26,  // NAMA AKUN (wider)
        totalTableWidth * 0.08,  // NILAI
        totalTableWidth * 0.08,  // TIDAK OBJEK
        totalTableWidth * 0.08,  // PPh FINAL
        totalTableWidth * 0.08,  // OBJEK PAJAK
        totalTableWidth * 0.08,  // FISKAL +
        totalTableWidth * 0.08,  // FISKAL -
        totalTableWidth * 0.06,  // KODE
        totalTableWidth * 0.14   // FISKAL
    ];

    // Draw header
    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');

    for (let i = 0; i < headers.length; i++) {
        doc.rect(currentX, yPos, colWidths[i], 6, 'F');
        doc.rect(currentX, yPos, colWidths[i], 6);

        const textX = currentX + (colWidths[i] / 2);
        const headerText = headers[i];

        // Better text wrapping for headers
        if (headerText.length > 8 && colWidths[i] < 15) {
            const words = headerText.split(' ');
            if (words.length > 1) {
                doc.text(words[0], textX, yPos + 2.5, { align: 'center' });
                doc.text(words.slice(1).join(' '), textX, yPos + 4.5, { align: 'center' });
            } else {
                // Split long single words
                const mid = Math.ceil(headerText.length / 2);
                doc.text(headerText.substring(0, mid), textX, yPos + 2.5, { align: 'center' });
                doc.text(headerText.substring(mid), textX, yPos + 4.5, { align: 'center' });
            }
        } else {
            doc.text(headerText, textX, yPos + 3.5, { align: 'center' });
        }
        currentX += colWidths[i];
    }
    yPos += 6;

    // Draw data rows with proper page breaks
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'normal');

    profitLossData.forEach((item, index) => {
        if (item.checked !== false) {
            // Check for page break before each row
            if (checkPageBreak(4)) {
                // Redraw header on new page
                doc.setFillColor(220, 220, 220);
                doc.setFontSize(5);
                doc.setFont('helvetica', 'bold');

                currentX = 10;
                for (let i = 0; i < headers.length; i++) {
                    doc.rect(currentX, yPos, colWidths[i], 6, 'F');
                    doc.rect(currentX, yPos, colWidths[i], 6);
                    const textX = currentX + (colWidths[i] / 2);
                    const headerText = headers[i];

                    if (headerText.length > 8 && colWidths[i] < 15) {
                        const words = headerText.split(' ');
                        if (words.length > 1) {
                            doc.text(words[0], textX, yPos + 2.5, { align: 'center' });
                            doc.text(words.slice(1).join(' '), textX, yPos + 4.5, { align: 'center' });
                        } else {
                            const mid = Math.ceil(headerText.length / 2);
                            doc.text(headerText.substring(0, mid), textX, yPos + 2.5, { align: 'center' });
                            doc.text(headerText.substring(mid), textX, yPos + 4.5, { align: 'center' });
                        }
                    } else {
                        doc.text(headerText, textX, yPos + 3.5, { align: 'center' });
                    }
                    currentX += colWidths[i];
                }
                yPos += 6;

                doc.setFontSize(4.5);
                doc.setFont('helvetica', 'normal');
            }

            currentX = 10;
            const rowData = [
                item.accountCode || '',
                item.accountName || '',
                item.amount || '',
                item.nonTaxableFiscal || '',
                item.subjectToFiscalTax || '',
                item.bookFiscal || '',
                item.positiveFiscalCorrection || '',
                item.negativeFiscalCorrection || '',
                item.correctionCode || '',
                item.fiscalAmount || ''
            ];

            for (let i = 0; i < rowData.length; i++) {
                // Alternate row colors
                if (index % 2 === 0) {
                    doc.setFillColor(248, 248, 248);
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                doc.rect(currentX, yPos, colWidths[i], 4, 'F');
                doc.rect(currentX, yPos, colWidths[i], 4);

                if (rowData[i]) {
                    const text = rowData[i].toString();
                    const maxLen = Math.floor(colWidths[i] / 0.8);
                    const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;

                    if (i === 0 || i === 8) { // Center align for code columns
                        doc.text(displayText, currentX + (colWidths[i] / 2), yPos + 2.5, { align: 'center' });
                    } else if (i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7 || i === 9) { // Right align for numbers
                        doc.text(displayText, currentX + colWidths[i] - 0.5, yPos + 2.5, { align: 'right' });
                    } else {
                        doc.text(displayText, currentX + 0.5, yPos + 2.5);
                    }
                }
                currentX += colWidths[i];
            }
            yPos += 4;
        }
    });

    yPos += 10;

    // === A.2 LAPORAN POSISI KEUANGAN ===
    checkPageBreak(100);

    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, pageWidth - 20, 8, 'F');
    doc.rect(10, yPos, pageWidth - 20, 8);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('A.2 LAPORAN POSISI KEUANGAN (NERACA)', 12, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    yPos += 10;

    // Left side - Assets (Better responsive layout)
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('ASET LANCAR', 12, yPos + 3);

    const leftColumnWidth = (pageWidth - 30) / 2;
    const codeColWidth = leftColumnWidth * 0.18;
    const nameColWidth = leftColumnWidth * 0.62;
    const amountColWidth = leftColumnWidth * 0.20;

    doc.setFillColor(220, 220, 220);
    doc.rect(10, yPos + 5, codeColWidth, 6, 'F');
    doc.rect(10, yPos + 5, codeColWidth, 6);
    doc.rect(10 + codeColWidth, yPos + 5, nameColWidth, 6, 'F');
    doc.rect(10 + codeColWidth, yPos + 5, nameColWidth, 6);
    doc.rect(10 + codeColWidth + nameColWidth, yPos + 5, amountColWidth, 6, 'F');
    doc.rect(10 + codeColWidth + nameColWidth, yPos + 5, amountColWidth, 6);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('KODE', 10 + (codeColWidth / 2), yPos + 8.5, { align: 'center' });
    doc.text('AKUN', 12 + codeColWidth, yPos + 8.5);
    doc.text('JUMLAH', 10 + codeColWidth + nameColWidth + (amountColWidth / 2), yPos + 8.5, { align: 'center' });

    // Right side - Liabilities (Better responsive layout)
    const rightColumnStart = 15 + leftColumnWidth;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('LIABILITAS JANGKA PENDEK', rightColumnStart, yPos + 3);

    doc.setFillColor(220, 220, 220);
    doc.rect(rightColumnStart, yPos + 5, codeColWidth, 6, 'F');
    doc.rect(rightColumnStart, yPos + 5, codeColWidth, 6);
    doc.rect(rightColumnStart + codeColWidth, yPos + 5, nameColWidth, 6, 'F');
    doc.rect(rightColumnStart + codeColWidth, yPos + 5, nameColWidth, 6);
    doc.rect(rightColumnStart + codeColWidth + nameColWidth, yPos + 5, amountColWidth, 6, 'F');
    doc.rect(rightColumnStart + codeColWidth + nameColWidth, yPos + 5, amountColWidth, 6);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('KODE', rightColumnStart + (codeColWidth / 2), yPos + 8.5, { align: 'center' });
    doc.text('AKUN', rightColumnStart + codeColWidth + 2, yPos + 8.5);
    doc.text('JUMLAH', rightColumnStart + codeColWidth + nameColWidth + (amountColWidth / 2), yPos + 8.5, { align: 'center' });

    let leftY = yPos + 11;
    let rightY = yPos + 11;

    // Draw asset rows with page break check
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');

    const leftSideData = financialPosition.leftSide || [];
    leftSideData.forEach((item, index) => {
        if (leftY > pageHeight - 30) {
            doc.addPage();
            leftY = 15;
            rightY = 15;
        }

        if (index % 2 === 0) {
            doc.setFillColor(248, 248, 248);
        } else {
            doc.setFillColor(255, 255, 255);
        }

        doc.rect(10, leftY, codeColWidth, 5, 'F');
        doc.rect(10, leftY, codeColWidth, 5);
        doc.rect(10 + codeColWidth, leftY, nameColWidth, 5, 'F');
        doc.rect(10 + codeColWidth, leftY, nameColWidth, 5);
        doc.rect(10 + codeColWidth + nameColWidth, leftY, amountColWidth, 5, 'F');
        doc.rect(10 + codeColWidth + nameColWidth, leftY, amountColWidth, 5);

        doc.text(item.accountCode || '', 10 + (codeColWidth / 2), leftY + 3.5, { align: 'center' });

        const accountName = item.accountName || '';
        const maxNameLen = Math.floor(nameColWidth / 1.8);
        const displayName = accountName.length > maxNameLen ? accountName.substring(0, maxNameLen - 2) + '..' : accountName;
        doc.text(displayName, 12 + codeColWidth, leftY + 3.5);

        if (item.amount) {
            doc.text(item.amount.toString(), 10 + codeColWidth + nameColWidth + amountColWidth - 2, leftY + 3.5, { align: 'right' });
        }

        leftY += 5;
    });

    // Draw liability rows with page break check
    const rightSideData = financialPosition.rightSide || [];
    rightSideData.forEach((item, index) => {
        if (rightY > pageHeight - 30) {
            doc.addPage();
            rightY = 15;
        }

        if (index % 2 === 0) {
            doc.setFillColor(248, 248, 248);
        } else {
            doc.setFillColor(255, 255, 255);
        }

        doc.rect(rightColumnStart, rightY, codeColWidth, 5, 'F');
        doc.rect(rightColumnStart, rightY, codeColWidth, 5);
        doc.rect(rightColumnStart + codeColWidth, rightY, nameColWidth, 5, 'F');
        doc.rect(rightColumnStart + codeColWidth, rightY, nameColWidth, 5);
        doc.rect(rightColumnStart + codeColWidth + nameColWidth, rightY, amountColWidth, 5, 'F');
        doc.rect(rightColumnStart + codeColWidth + nameColWidth, rightY, amountColWidth, 5);

        doc.text(item.accountCode || '', rightColumnStart + (codeColWidth / 2), rightY + 3.5, { align: 'center' });

        const accountName = item.accountName || '';
        const maxNameLen = Math.floor(nameColWidth / 1.8);
        const displayName = accountName.length > maxNameLen ? accountName.substring(0, maxNameLen - 2) + '..' : accountName;
        doc.text(displayName, rightColumnStart + codeColWidth + 2, rightY + 3.5);

        if (item.amount) {
            doc.text(item.amount.toString(), rightColumnStart + codeColWidth + nameColWidth + amountColWidth - 2, rightY + 3.5, { align: 'right' });
        }

        rightY += 5;
    });

    yPos = Math.max(leftY, rightY) + 10;

    // Check space for audit section
    checkPageBreak(60);

    // Audit section - Fixed layout
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN KEUANGAN', 12, yPos);

    const financialInfo = financialPosition.financialData || {};
    const isAudited = financialInfo.finantialStatement === 'diaudit';

    yPos += 5;
    const checkboxSize = 3;
    const auditedX = 50;
    const notAuditedX = 120;

    // DIAUDIT checkbox
    doc.rect(auditedX, yPos - checkboxSize, checkboxSize, checkboxSize);
    if (isAudited) {
        doc.setFillColor(0, 0, 0);
        doc.rect(auditedX + 0.3, yPos - checkboxSize + 0.3, checkboxSize - 0.6, checkboxSize - 0.6, 'F');
        doc.setFillColor(255, 255, 255);
    }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('DIAUDIT', auditedX + checkboxSize + 2, yPos);

    // TIDAK DIAUDIT checkbox
    doc.rect(notAuditedX, yPos - checkboxSize, checkboxSize, checkboxSize);
    if (!isAudited) {
        doc.setFillColor(0, 0, 0);
        doc.rect(notAuditedX + 0.3, yPos - checkboxSize + 0.3, checkboxSize - 0.6, checkboxSize - 0.6, 'F');
        doc.setFillColor(255, 255, 255);
    }
    doc.text('TIDAK DIAUDIT', notAuditedX + checkboxSize + 2, yPos);

    yPos += 12;

    // Professional details - Better responsive layout
    checkPageBreak(25);

    const profBoxWidth = (pageWidth - 30) / 2;
    const profBoxHeight = 18;

    // NPWP KANTOR AKUNTAN PUBLIK
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, profBoxWidth, profBoxHeight, 'F');
    doc.rect(10, yPos, profBoxWidth, profBoxHeight);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NPWP KANTOR AKUNTAN PUBLIK', 12, yPos + 4);
    doc.setTextColor(0, 0, 0);

    const npwpBoxWidth = (profBoxWidth - 4) / 15;
    for (let i = 0; i < 15; i++) {
        doc.rect(12 + (i * npwpBoxWidth), yPos + 5, npwpBoxWidth * 0.9, 3);
    }
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('NAMA KANTOR AKUNTAN PUBLIK', 12, yPos + 10);
    doc.rect(12, yPos + 11, profBoxWidth - 4, 6);

    // NPWP KONSULTAN PAJAK
    const rightProfStart = 15 + profBoxWidth;
    doc.setFillColor(52, 84, 139);
    doc.rect(rightProfStart, yPos, profBoxWidth, profBoxHeight, 'F');
    doc.rect(rightProfStart, yPos, profBoxWidth, profBoxHeight);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NPWP KONSULTAN PAJAK', rightProfStart + 2, yPos + 4);
    doc.setTextColor(0, 0, 0);

    for (let i = 0; i < 15; i++) {
        doc.rect(rightProfStart + 2 + (i * npwpBoxWidth), yPos + 5, npwpBoxWidth * 0.9, 3);
    }
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('NAMA KONSULTAN PAJAK', rightProfStart + 2, yPos + 10);
    doc.rect(rightProfStart + 2, yPos + 11, profBoxWidth - 4, 6);

    // Footer
    yPos += 25;
    if (yPos > pageHeight - 15) {
        doc.addPage();
        yPos = 15;
    }

    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3A-1 - REKONSILIASI LAPORAN KEUANGAN (DAGANG)', 15, yPos);
    doc.setTextColor(0, 0, 0);
};

const addLampiran3A2 = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3a2Data = detailData.l3a2_data || {};
    const profitLossData = l3a2Data.profitLoss || [];
    const assetsData = l3a2Data.assets || [];
    const liabilitiesData = l3a2Data.liabilitiesAndEquity || [];
    const taxpayerData = sptData.taxpayer_identity || {};

    // === HEADER ===
    const perhatianText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG MENYELENGGARAKAN PEMBUKUAN DENGAN STELSEL KAS ATAU AKRUAL DI SEKTOR DAGANG';
    yPos = createLampiran3Header(
        doc,
        'LAMPIRAN 3A-2',
        'REKONSILIASI LAPORAN KEUANGAN',
        '(JASA)',
        perhatianText,
        taxpayerData
    );

    // === A.1 LAPORAN LABA RUGI ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text('A.1 LAPORAN LABA RUGI', 12, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 7;

    // Table header for profit/loss
    const headers = [
        'KODE\nAKUN', 'NAMA AKUN', 'NILAI\nKOMERSIAL', 'TIDAK\nTERMASUK\nOBJEK PAJAK', 'DIKENAKAN\nPPh FINAL',
        'OBJEK PAJAK\nTIDAK FINAL', 'PENYESUAIAN\nFISKAL POSITIF', 'PENYESUAIAN\nFISKAL NEGATIF', 'KODE\nPENYESUAIAN\nFISKAL', 'NILAI FISKAL'
    ];
    const colWidths = [10, 30, 15, 15, 15, 15, 15, 15, 10, 15];

    // Draw header
    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');

    for (let i = 0; i < headers.length; i++) {
        doc.rect(currentX, yPos, colWidths[i], 6, 'F');
        doc.rect(currentX, yPos, colWidths[i], 6);
        const headerLines = headers[i].split('\n');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + 1, yPos + 2 + (lineIndex * 1.5));
        });
        currentX += colWidths[i];
    }
    yPos += 6;

    // Draw profit/loss data rows
    profitLossData.forEach(item => {
        currentX = 10;

        const rowData = [
            item.accountCode || '',
            item.accountName || '',
            item.amount || '',
            item.nonTaxableObject || '',
            item.subjectToFinalTax || '',
            item.nonFinal || '',
            item.positiveFiscalCorrection || '',
            item.negativeFiscalCorrection || '',
            item.correctionCode || '',
            item.fiscalAmount || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidths[i], 4, 'F');
            doc.rect(currentX, yPos, colWidths[i], 4);

            doc.setFontSize(2.5);
            doc.setFont('helvetica', 'normal');
            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxLen = Math.floor(colWidths[i] / 1.2);
                const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                doc.text(displayText, currentX + 0.5, yPos + 2.5);
            }
            currentX += colWidths[i];
        }
        yPos += 4;
    });

    // Add note for profit/loss
    yPos += 2;
    doc.setFontSize(2.5);
    doc.setTextColor(100, 100, 100);
    doc.text('PINDAHKAN LABA RUGI SEBELUM PAJAK KOLOM (10) KE INDUK BAGIAN B ANGKA 1 HURUF b', 12, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // === A.2 LAPORAN POSISI KEUANGAN (NERACA) ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text('A.2 LAPORAN POSISI KEUANGAN (NERACA)', 12, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 7;

    // Left side - Assets
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('ASET LANCAR', 12, yPos + 2);

    // Asset header
    doc.setFillColor(220, 220, 220);
    doc.rect(10, yPos + 4, 12, 4, 'F');
    doc.rect(10, yPos + 4, 12, 4);
    doc.rect(22, yPos + 4, 68, 4, 'F');
    doc.rect(22, yPos + 4, 68, 4);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('KODE', 11, yPos + 6.5);
    doc.text('AKUN', 23, yPos + 6.5);

    // Right side - Liabilities
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('LIABILITAS JANGKA PENDEK', 110, yPos + 2);

    // Liability header
    doc.setFillColor(220, 220, 220);
    doc.rect(108, yPos + 4, 12, 4, 'F');
    doc.rect(108, yPos + 4, 12, 4);
    doc.rect(120, yPos + 4, 68, 4, 'F');
    doc.rect(120, yPos + 4, 68, 4);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('KODE', 109, yPos + 6.5);
    doc.text('AKUN', 121, yPos + 6.5);

    let leftY = yPos + 8;
    let rightY = yPos + 8;

    // Draw asset rows
    assetsData.forEach(item => {
        doc.setFillColor(255, 255, 255);
        doc.rect(10, leftY, 12, 3, 'F');
        doc.rect(10, leftY, 12, 3);
        doc.rect(22, leftY, 68, 3, 'F');
        doc.rect(22, leftY, 68, 3);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'normal');
        doc.text(item.accountCode || '', 10.5, leftY + 2);

        const accountName = item.accountName || '';
        const maxNameLen = Math.floor(68 / 1.2);
        const displayName = accountName.length > maxNameLen ? accountName.substring(0, maxNameLen - 2) + '..' : accountName;
        doc.text(displayName, 22.5, leftY + 2);

        if (item.amount) {
            doc.text(item.amount.toString(), 88, leftY + 2, { align: 'right' });
        }

        leftY += 3;
    });

    // Draw liability rows
    liabilitiesData.forEach(item => {
        doc.setFillColor(255, 255, 255);
        doc.rect(108, rightY, 12, 3, 'F');
        doc.rect(108, rightY, 12, 3);
        doc.rect(120, rightY, 68, 3, 'F');
        doc.rect(120, rightY, 68, 3);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'normal');
        doc.text(item.accountCode || '', 108.5, rightY + 2);

        const accountName = item.accountName || '';
        const maxNameLen = Math.floor(68 / 1.2);
        const displayName = accountName.length > maxNameLen ? accountName.substring(0, maxNameLen - 2) + '..' : accountName;
        doc.text(displayName, 120.5, rightY + 2);

        if (item.amount) {
            doc.text(item.amount.toString(), 186, rightY + 2, { align: 'right' });
        }

        rightY += 3;
    });

    yPos = Math.max(leftY, rightY) + 8;

    // Audit section
    doc.setFontSize(4);
    doc.text('LAPORAN KEUANGAN', 12, yPos);

    // DIAUDIT checkbox
    doc.rect(60, yPos - 2, 2, 2);
    doc.setFontSize(3);
    doc.text('DIAUDIT', 63, yPos);

    // TIDAK DIAUDIT checkbox
    doc.rect(85, yPos - 2, 2, 2);
    doc.setFillColor(0, 0, 0);
    doc.rect(85.2, yPos - 1.8, 1.6, 1.6, 'F'); // Default to "TIDAK DIAUDIT" for service sector
    doc.setFillColor(255, 255, 255);
    doc.text('TIDAK DIAUDIT', 88, yPos);

    yPos += 10;

    // Professional details section
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 90, 12, 'F');
    doc.rect(10, yPos, 90, 12);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NPWP KANTOR AKUNTAN PUBLIK', 12, yPos + 3);
    doc.setTextColor(0, 0, 0);

    // NPWP boxes for accounting firm
    for (let i = 0; i < 15; i++) {
        doc.rect(12 + (i * 5), yPos + 4, 4, 2);
    }
    doc.setFontSize(3);
    doc.text('NAMA KANTOR AKUNTAN PUBLIK', 12, yPos + 8);
    doc.rect(12, yPos + 9, 85, 2);

    // NPWP KONSULTAN PAJAK section
    doc.setFillColor(52, 84, 139);
    doc.rect(110, yPos, 90, 12, 'F');
    doc.rect(110, yPos, 90, 12);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NPWP KONSULTAN PAJAK', 112, yPos + 3);
    doc.setTextColor(0, 0, 0);

    // NPWP boxes for tax consultant
    for (let i = 0; i < 15; i++) {
        doc.rect(112 + (i * 5), yPos + 4, 4, 2);
    }
    doc.setFontSize(3);
    doc.text('NAMA KONSULTAN PAJAK', 112, yPos + 8);
    doc.rect(112, yPos + 9, 85, 2);

    // Footer
    yPos += 18;
    doc.setFontSize(3);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3A-2 - REKONSILIASI LAPORAN KEUANGAN (JASA)', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran3A3 = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3a3Data = detailData.l3a3_data || {};
    const profitLossData = l3a3Data.profitLoss || [];
    const assetsData = l3a3Data.assets || [];
    const liabilitiesData = l3a3Data.liabilitiesAndEquity || [];
    const taxpayerData = sptData.taxpayer_identity || {};

    // Debug: Log data to check if it's loaded correctly

    const perhatianText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG MENYELENGGARAKAN PEMBUKUAN DENGAN STELSEL KAS ATAU AKRUAL DI SEKTOR DAGANG';
    yPos = createLampiran3Header(
        doc,
        'LAMPIRAN 3A-3',
        'REKONSILIASI LAPORAN KEUANGAN',
        '(INDUSTRI)',
        perhatianText,
        taxpayerData
    );


    // === A.1 LAPORAN LABA RUGI ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text('A.1 LAPORAN LABA RUGI', 12, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 7;

    // Table header for profit/loss
    const headers = [
        'KODE\nAKUN', 'NAMA AKUN', 'NILAI\nKOMERSIAL', 'TIDAK\nTERMASUK\nOBJEK PAJAK', 'DIKENAKAN\nPPh FINAL',
        'OBJEK PAJAK\nTIDAK FINAL', 'PENYESUAIAN\nFISKAL POSITIF', 'PENYESUAIAN\nFISKAL NEGATIF', 'KODE\nPENYESUAIAN\nFISKAL', 'NILAI FISKAL'
    ];
    const colWidths = [10, 30, 15, 15, 15, 15, 15, 15, 10, 15];

    // Draw header
    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Ensure text is black

    for (let i = 0; i < headers.length; i++) {
        doc.rect(currentX, yPos, colWidths[i], 6, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[i], 6);
        const headerLines = headers[i].split('\n');
        headerLines.forEach((line, lineIndex) => {
            doc.setTextColor(0, 0, 0); // Reset text color for each line
            doc.text(line, currentX + 1, yPos + 2 + (lineIndex * 1.5));
        });
        currentX += colWidths[i];
    }
    yPos += 6;

    // Industry-specific account rows based on the image
    const industryAccounts = [
        // PENJUALAN section
        { code: '4002', name: 'PENJUALAN DOMESTIK', section: 'PENJUALAN' },
        { code: '4003', name: 'PENJUALAN EKSPOR', section: 'PENJUALAN' },
        { code: '4004', name: 'PENJUALAN BRUTO', section: 'PENJUALAN' },
        { code: '', name: 'DIKURANGI:', section: 'PENJUALAN' },
        { code: '4011', name: 'RETUR', section: 'PENJUALAN' },
        { code: '4012', name: 'POTONGAN PENJUALAN', section: 'PENJUALAN' },
        { code: '4020', name: 'PENJUALAN BERSIH', section: 'PENJUALAN' },

        // BIAYA BAHAN BAKU section
        { code: '5040', name: 'BIAYA BAHAN BAKU', section: 'HPP' },
        { code: '5050', name: 'BIAYA TENAGA KERJA LANGSUNG', section: 'HPP' },
        { code: '', name: 'BIAYA OVERHEAD PABRIK:', section: 'HPP' },
        { code: '5051', name: 'BIAYA TENAGA KERJA TIDAK LANGSUNG', section: 'HPP' },
        { code: '5052', name: 'BIAYA PEMELIHARAAN DAN PERBAIKAN MESIN', section: 'HPP' },
        { code: '5058', name: 'BIAYA PENYUSUTAN DAN AMORTISASI', section: 'HPP' },
        { code: '5058', name: 'BIAYA UTILITAS', section: 'HPP' },
        { code: '5059', name: 'BIAYA PABRIKASI LAINNYA', section: 'HPP' },
        { code: '5070', name: 'JUMLAH BIAYA PABRIKASI', section: 'HPP' },
        { code: '5080', name: 'JUMLAH BIAYA PRODUKSI', section: 'HPP' },

        // PERSEDIAAN section
        { code: '5095', name: 'PERSEDIAAN AWAL BARANG DALAM PROSES', section: 'HPP' },
        { code: '5096', name: 'DIKURANGI: PERSEDIAAN AKHIR BARANG DALAM PROSES', section: 'HPP' },
        { code: '5009', name: 'DIKURANGI: PERSEDIAAN AKHIR BARANG JADI', section: 'HPP' },
        { code: '5020', name: 'JUMLAH HARGA POKOK PENJUALAN', section: 'HPP' },
        { code: '4300', name: 'LABA KOTOR', section: 'HPP' },

        // BEBAN USAHA section
        { code: '5111', name: 'BEBAN GAJI, TUNJANGAN, BONUS, HONORARIUM, THR, DLL', section: 'BEBAN' },
        { code: '5113', name: 'BEBAN TRANSPORTASI', section: 'BEBAN' },
        { code: '5114', name: 'BEBAN PENYUSUTAN DAN AMORTISASI', section: 'BEBAN' },
        { code: '5115', name: 'BEBAN SEWA', section: 'BEBAN' },
        { code: '5116', name: 'BEBAN BUNGA', section: 'BEBAN' },
        { code: '5117', name: 'BEBAN SEHUBUNGAN DENGAN JASA', section: 'BEBAN' },
        { code: '5118', name: 'BEBAN PIUTANG TIDAK TERTAGIH', section: 'BEBAN' },
        { code: '5320', name: 'BEBAN PROMOSI/PEMASARAN', section: 'BEBAN' },
        { code: '5321', name: 'BEBAN ENTERTAINMENT', section: 'BEBAN' },
        { code: '5322', name: 'BEBAN UMUM DAN ADMINISTRASI', section: 'BEBAN' },
        { code: '5399', name: 'BEBAN USAHA LAINNYA', section: 'BEBAN' },
        { code: '5600', name: 'JUMLAH BEBAN USAHA', section: 'BEBAN' },
        { code: '4800', name: 'LABA (RUGI) SEBELUM PAJAK', section: 'BEBAN' }
    ];

    // Draw all industry account rows
    industryAccounts.forEach(account => {
        // Find matching data from profitLossData
        const dataItem = profitLossData.find(item => item.accountCode === account.code) || {};

        currentX = 10;
        const rowData = [
            account.code,
            account.name,
            dataItem.amount || '',
            dataItem.nonTaxableObject || '',
            dataItem.subjectToFinalTax || '',
            dataItem.nonFinal || '',
            dataItem.positiveFiscalCorrection || '',
            dataItem.negativeFiscalCorrection || '',
            dataItem.correctionCode || '',
            dataItem.fiscalAmount || ''
        ];

        // Highlight certain rows (summary rows)
        const isSummaryRow = ['PENJUALAN BRUTO', 'PENJUALAN BERSIH', 'JUMLAH BIAYA PABRIKASI',
            'JUMLAH BIAYA PRODUKSI', 'JUMLAH HARGA POKOK PENJUALAN',
            'LABA KOTOR', 'JUMLAH BEBAN USAHA', 'LABA (RUGI) SEBELUM PAJAK'].includes(account.name);

        // Draw each cell
        for (let i = 0; i < rowData.length; i++) {
            // Set background color
            if (isSummaryRow) {
                doc.setFillColor(240, 240, 240);
            } else {
                doc.setFillColor(255, 255, 255);
            }

            // Draw cell with background
            doc.rect(currentX, yPos, colWidths[i], 4, 'F');

            // Draw cell border
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidths[i], 4);

            // Set text properties and draw text
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(2.5);
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxLen = Math.floor(colWidths[i] / 1.2);
                const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                doc.text(displayText, currentX + 0.5, yPos + 2.5);
            }
            currentX += colWidths[i];
        }
        yPos += 4;
    });

    // Add note for profit/loss
    yPos += 2;
    doc.setFontSize(2.5);
    doc.setTextColor(100, 100, 100);
    doc.text('PINDAHKAN LABA RUGI SEBELUM PAJAK KOLOM (10) KE INDUK BAGIAN B ANGKA 1 HURUF b', 12, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // === A.2 LAPORAN POSISI KEUANGAN (NERACA) ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.text('A.2 LAPORAN POSISI KEUANGAN (NERACA)', 12, yPos + 3.5);
    doc.setTextColor(0, 0, 0);
    yPos += 7;

    // Define specific industry balance sheet accounts as shown in the image
    const balanceSheetAccounts = {
        assets: [
            // ASET LANCAR
            { code: '1101', name: 'KAS DAN SETARA KAS', section: 'ASET LANCAR' },
            { code: '1200', name: 'INVESTASI', section: 'ASET LANCAR' },
            { code: '1312', name: 'PIUTANG USAHA - PIHAK KETIGA', section: 'ASET LANCAR' },
            { code: '1313', name: 'PIUTANG USAHA - PIHAK YANG MEMPUNYAI HUBUNGAN ISTIMEWA', section: 'ASET LANCAR' },
            { code: '1314', name: 'PIUTANG LAINNYA - PIHAK KETIGA', section: 'ASET LANCAR' },
            { code: '1315', name: 'PIUTANG LAINNYA - PIHAK YANG MEMPUNYAI HUBUNGAN ISTIMEWA', section: 'ASET LANCAR' },
            { code: '1316', name: 'DIKURANGI: CADANGAN PIUTANG TAK TERTAGIH', section: 'ASET LANCAR' },
            { code: '1402', name: 'PERSEDIAAN BAHAN BAKU', section: 'ASET LANCAR' },
            { code: '1403', name: 'PERSEDIAAN BARANG DALAM PROSES', section: 'ASET LANCAR' },
            { code: '1404', name: 'PERSEDIAAN BARANG JADI', section: 'ASET LANCAR' },
            { code: '1421', name: 'BEBAN DIBAYAR DI MUKA', section: 'ASET LANCAR' },
            { code: '1422', name: 'UANG MUKA', section: 'ASET LANCAR' },
            { code: '1471', name: 'PAJAK DIBAYAR DI MUKA', section: 'ASET LANCAR' },
            { code: '1490', name: 'ASET LANCAR LAINNYA', section: 'ASET LANCAR' },

            // ASET TIDAK LANCAR
            { code: '1521', name: 'PIUTANG JANGKA PANJANG', section: 'ASET TIDAK LANCAR' },
            { code: '1523', name: 'TANAH DAN BANGUNAN', section: 'ASET TIDAK LANCAR' },
            { code: '1524', name: 'DIKURANGI: AKUMULASI PENYUSUTAN', section: 'ASET TIDAK LANCAR' },
            { code: '1525', name: 'PERALATAN', section: 'ASET TIDAK LANCAR' },
            { code: '1526', name: 'DIKURANGI: AKUMULASI PENYUSUTAN', section: 'ASET TIDAK LANCAR' },
            { code: '1527', name: 'MESIN', section: 'ASET TIDAK LANCAR' },
            { code: '1528', name: 'DIKURANGI: AKUMULASI PENYUSUTAN', section: 'ASET TIDAK LANCAR' },
            { code: '1529', name: 'ASET TETAP LAINNYA', section: 'ASET TIDAK LANCAR' },
            { code: '1530', name: 'DIKURANGI: AKUMULASI PENYUSUTAN', section: 'ASET TIDAK LANCAR' },
            { code: '1541', name: 'INVESTASI PADA PERUSAHAAN ASOSIASI', section: 'ASET TIDAK LANCAR' },
            { code: '1598', name: 'INVESTASI JANGKA PANJANG LAINNYA', section: 'ASET TIDAK LANCAR' },
            { code: '1640', name: 'ASET TAK BERWUJUD - NET', section: 'ASET TIDAK LANCAR' },
            { code: '1691', name: 'ASET PAJAK TANGGUHAN', section: 'ASET TIDAK LANCAR' },
            { code: '1698', name: 'ASET TIDAK LANCAR LAINNYA', section: 'ASET TIDAK LANCAR' },
            { code: '1700', name: 'JUMLAH ASET', section: 'TOTAL' }
        ],
        liabilities: [
            // LIABILITAS JANGKA PENDEK
            { code: '2102', name: 'UTANG USAHA - PIHAK KETIGA', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2103', name: 'UTANG USAHA - PIHAK YANG MEMPUNYAI HUBUNGAN ISTIMEWA', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2111', name: 'UTANG BUNGA', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2141', name: 'UTANG PAJAK', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2142', name: 'UTANG DIVIDEN', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2149', name: 'BEBAN YANG MASIH HARUS DIBAYAR', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2201', name: 'UTANG BANK JANGKA PENDEK', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2202', name: 'UTANG JANGKA PANJANG YANG JATUH TEMPO DALAM SATU TAHUN', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2203', name: 'UANG MUKA', section: 'LIABILITAS JANGKA PENDEK' },
            { code: '2230', name: 'LIABILITAS JANGKA PENDEK LAINNYA', section: 'LIABILITAS JANGKA PENDEK' },

            // LIABILITAS JANGKA PANJANG
            { code: '2301', name: 'UTANG BANK JANGKA PANJANG', section: 'LIABILITAS JANGKA PANJANG' },
            { code: '2302', name: 'UTANG JANGKA PANJANG - PIHAK KETIGA', section: 'LIABILITAS JANGKA PANJANG' },
            { code: '2304', name: 'UTANG JANGKA PANJANG - PIHAK YANG MEMPUNYAI HUBUNGAN ISTIMEWA', section: 'LIABILITAS JANGKA PANJANG' },
            { code: '2321', name: 'LIABILITAS PAJAK TANGGUHAN', section: 'LIABILITAS JANGKA PANJANG' },
            { code: '2390', name: 'LIABILITAS JANGKA PANJANG LAINNYA', section: 'LIABILITAS JANGKA PANJANG' },
            { code: '2900', name: 'JUMLAH LIABILITAS', section: 'TOTAL LIABILITAS' },

            // EKUITAS
            { code: '3102', name: 'MODAL SAHAM', section: 'EKUITAS' },
            { code: '3120', name: 'TAMBAHAN MODAL DISETOR', section: 'EKUITAS' },
            { code: '3200', name: 'SALDO LABA', section: 'EKUITAS' },
            { code: '3298', name: 'EKUITAS LAINNYA', section: 'EKUITAS' },
            { code: '3299', name: 'JUMLAH EKUITAS', section: 'EKUITAS' },
            { code: '3300', name: 'JUMLAH LIABILITAS DAN EKUITAS', section: 'FINAL TOTAL' }
        ]
    };

    // Left column header - Assets
    doc.setFillColor(220, 220, 220);
    doc.rect(10, yPos, 8, 4, 'F');
    doc.rect(10, yPos, 8, 4);
    doc.rect(18, yPos, 62, 4, 'F');
    doc.rect(18, yPos, 62, 4);

    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('KODE', 11, yPos + 2.5);
    doc.text('AKUN', 20, yPos + 2.5);

    // Right column header - Liabilities
    doc.setFillColor(220, 220, 220);
    doc.rect(110, yPos, 8, 4, 'F');
    doc.rect(110, yPos, 8, 4);
    doc.rect(118, yPos, 62, 4, 'F');
    doc.rect(118, yPos, 62, 4);

    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('KODE', 111, yPos + 2.5);
    doc.text('AKUN', 120, yPos + 2.5);

    yPos += 6;

    let leftY = yPos;
    let rightY = yPos;

    // Draw assets (left column)
    balanceSheetAccounts.assets.forEach(account => {
        const dataItem = assetsData.find(item => item.accountCode === account.code) || {};

        doc.setFillColor(255, 255, 255);
        doc.rect(10, leftY, 8, 3, 'F');
        doc.rect(10, leftY, 8, 3);
        doc.rect(18, leftY, 62, 3, 'F');
        doc.rect(18, leftY, 62, 3);

        // Reset text color to black
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'normal');

        doc.text(account.code, 10.5, leftY + 2);

        const accountName = account.name;
        const maxNameLen = Math.floor(62 / 1.2);
        const displayName = accountName.length > maxNameLen ? accountName.substring(0, maxNameLen - 2) + '..' : accountName;
        doc.text(displayName, 18.5, leftY + 2);

        // Add amount if available
        if (dataItem.amount) {
            doc.text(dataItem.amount.toString(), 78, leftY + 2, { align: 'right' });
        }

        leftY += 3;
    });

    // Draw liabilities (right column)
    balanceSheetAccounts.liabilities.forEach(account => {
        const dataItem = liabilitiesData.find(item => item.accountCode === account.code) || {};

        doc.setFillColor(255, 255, 255);
        doc.rect(110, rightY, 8, 3, 'F');
        doc.rect(110, rightY, 8, 3);
        doc.rect(118, rightY, 62, 3, 'F');
        doc.rect(118, rightY, 62, 3);

        // Reset text color to black
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'normal');

        doc.text(account.code, 110.5, rightY + 2);

        const accountName = account.name;
        const maxNameLen = Math.floor(62 / 1.2);
        const displayName = accountName.length > maxNameLen ? accountName.substring(0, maxNameLen - 2) + '..' : accountName;
        doc.text(displayName, 118.5, rightY + 2);

        // Add amount if available
        if (dataItem.amount) {
            doc.text(dataItem.amount.toString(), 178, rightY + 2, { align: 'right' });
        }

        rightY += 3;
    });

    yPos = Math.max(leftY, rightY) + 8;

    // Audit section
    doc.setTextColor(0, 0, 0); // Ensure text is black
    doc.setFontSize(4);
    doc.text('LAPORAN KEUANGAN', 12, yPos);

    // DIAUDIT checkbox
    doc.setFillColor(255, 255, 255);
    doc.rect(60, yPos - 2, 2, 2, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(60, yPos - 2, 2, 2);
    doc.setFontSize(3);
    doc.text('DIAUDIT', 63, yPos);

    // TIDAK DIAUDIT checkbox (checked by default for industry)
    doc.setFillColor(255, 255, 255);
    doc.rect(85, yPos - 2, 2, 2, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(85, yPos - 2, 2, 2);
    // Check mark for "TIDAK DIAUDIT"
    doc.setFillColor(0, 0, 0);
    doc.rect(85.2, yPos - 1.8, 1.6, 1.6, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setTextColor(0, 0, 0);
    doc.text('TIDAK DIAUDIT', 88, yPos);

    yPos += 10;

    // Professional details section
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 90, 12, 'F');
    doc.rect(10, yPos, 90, 12);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NPWP KANTOR AKUNTAN PUBLIK', 12, yPos + 3);
    doc.setTextColor(0, 0, 0);

    // NPWP boxes for accounting firm
    for (let i = 0; i < 15; i++) {
        doc.rect(12 + (i * 5), yPos + 4, 4, 2);
    }
    doc.setFontSize(3);
    doc.text('NAMA KANTOR AKUNTAN PUBLIK', 12, yPos + 8);
    doc.rect(12, yPos + 9, 85, 2);

    // NPWP KONSULTAN PAJAK section
    doc.setFillColor(52, 84, 139);
    doc.rect(110, yPos, 90, 12, 'F');
    doc.rect(110, yPos, 90, 12);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('NPWP KONSULTAN PAJAK', 112, yPos + 3);
    doc.setTextColor(0, 0, 0);

    // NPWP boxes for tax consultant
    for (let i = 0; i < 15; i++) {
        doc.rect(112 + (i * 5), yPos + 4, 4, 2);
    }
    doc.setFontSize(3);
    doc.text('NAMA KONSULTAN PAJAK', 112, yPos + 8);
    doc.rect(112, yPos + 9, 85, 2);

    // Footer
    yPos += 18;
    doc.setFontSize(3);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3A-3 - REKONSILIASI LAPORAN KEUANGAN (INDUSTRI)', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran3A4 = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3a4Data = detailData.l3a4_data || {};
    const businessIncome = l3a4Data.businessIncome?.entries || [];
    const otherDomesticIncome = l3a4Data.otherDomesticIncome?.entries || [];
    const taxpayerData = sptData.taxpayer_identity || {};

    // Debug: Log data to check if it's loaded correctly
    console.log('L3A4 Data:', l3a4Data);
    console.log('Business Income:', businessIncome);
    console.log('Other Domestic Income:', otherDomesticIncome);

    // === RESPONSIVE HEADER ===
    const pageWidth = 190;
    const headerHeight = 25;

    doc.setFillColor(173, 216, 230);
    doc.rect(10, yPos, pageWidth, headerHeight, 'F');
    doc.rect(10, yPos, pageWidth, headerHeight);

    // Left section - PERHATIAN
    const leftSectionWidth = pageWidth * 0.35;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PERHATIAN', 12, yPos + 5);

    doc.setFontSize(4);
    doc.setFont('helvetica', 'normal');
    doc.text('LAMPIRAN INI HARUS DIISI OLEH WAJIB PAJAK', 12, yPos + 8);
    doc.text('YANG MENYELENGGARAKAN PENCATATAN', 12, yPos + 11);
    doc.text('DAN/ATAU MEMILIKI PENGHASILAN NETO', 12, yPos + 14);
    doc.text('DALAM NEGERI LAINNYA', 12, yPos + 17);

    // Center section - Main titles
    const centerStart = 10 + leftSectionWidth;
    const centerWidth = pageWidth * 0.45;
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');

    // Split long text into multiple lines for better readability
    const centerText1 = 'A. PENGHASILAN NETO DALAM NEGERI';
    const centerText2 = 'DARI USAHA DAN/ATAU PEKERJAAN';
    const centerText3 = 'BEBAS BERDASARKAN PENCATATAN';
    const centerText4 = 'B. PENGHASILAN NETO DALAM NEGERI LAINNYA';

    doc.text(centerText1, centerStart + (centerWidth / 2), yPos + 6, { align: 'center' });
    doc.text(centerText2, centerStart + (centerWidth / 2), yPos + 10, { align: 'center' });
    doc.text(centerText3, centerStart + (centerWidth / 2), yPos + 14, { align: 'center' });
    doc.text(centerText4, centerStart + (centerWidth / 2), yPos + 18, { align: 'center' });

    // Right section - LAMPIRAN box and fields
    const rightStart = centerStart + centerWidth;
    const rightWidth = pageWidth * 0.2;

    // LAMPIRAN 3A-4 box
    doc.setFillColor(255, 193, 7);
    doc.rect(rightStart + 5, yPos + 2, rightWidth - 10, 8, 'F');
    doc.rect(rightStart + 5, yPos + 2, rightWidth - 10, 8);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('LAMPIRAN 3A-4', rightStart + (rightWidth / 2), yPos + 7, { align: 'center' });

    // NIK/NPWP
    doc.setFontSize(4);
    doc.text('NIK/NPWP', rightStart + 5, yPos + 13);
    const nikBoxWidth = (rightWidth - 10) / 16;
    for (let i = 0; i < 16; i++) {
        doc.rect(rightStart + 5 + (i * nikBoxWidth), yPos + 14, nikBoxWidth - 0.2, 3);
        if (taxpayerData.nik && taxpayerData.nik[i]) {
            doc.setFontSize(3);
            doc.text(taxpayerData.nik[i], rightStart + 5.2 + (i * nikBoxWidth), yPos + 16);
        }
    }

    // TAHUN PAJAK
    doc.setFontSize(4);
    doc.text('TAHUN PAJAK', rightStart + 5, yPos + 20);
    const taxYear = l3a4Data.header?.fiscalYear || '2023';
    const yearBoxWidth = (rightWidth - 10) / 4;
    for (let i = 0; i < 4; i++) {
        doc.rect(rightStart + 5 + (i * yearBoxWidth), yPos + 21, yearBoxWidth - 0.2, 3);
        if (taxYear[i]) {
            doc.setFontSize(3);
            doc.text(taxYear[i], rightStart + 5.5 + (i * yearBoxWidth), yPos + 23);
        }
    }

    yPos += headerHeight + 5;

    // === TABLE A ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, pageWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('A. PENGHASILAN NETO DALAM NEGERI DARI USAHA DAN/ATAU PEKERJAAN BEBAS BERDASARKAN PENCATATAN', 12, yPos + 4);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Improved Table A with better proportions
    const headersA = [
        'NO', 'NAMA TEMPAT KEGIATAN\nUSAHA (TKU)', 'JENIS USAHA/\nPEKERJAAN BEBAS', 'PEREDARAN\nBRUTO', 'NORMA\n(%)', 'PENGHASILAN\nNETO'
    ];
    const colWidthsA = [12, 45, 45, 35, 20, 33]; // Better proportions

    // Draw header for Table A with improved readability
    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    for (let i = 0; i < headersA.length; i++) {
        doc.rect(currentX, yPos, colWidthsA[i], 8, 'F'); // Increased height
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsA[i], 8);

        // Column numbers
        doc.setFontSize(3);
        doc.text(`(${i + 1})`, currentX + (colWidthsA[i] / 2), yPos + 1.5, { align: 'center' });

        // Header text with better font size
        const headerLines = headersA[i].split('\n');
        doc.setFontSize(4);
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidthsA[i] / 2), yPos + 4 + (lineIndex * 2), { align: 'center' });
        });
        currentX += colWidthsA[i];
    }
    yPos += 8;

    // Draw 15 rows for Table A with better readability
    for (let rowNum = 1; rowNum <= 15; rowNum++) {
        currentX = 10;

        // Check if we have data for this row
        const dataItem = businessIncome[rowNum - 1] || {};

        const rowData = [
            rowNum.toString(),
            dataItem.businessLocation || dataItem.location || '',
            dataItem.businessType || dataItem.type || '',
            dataItem.grossRevenue || dataItem.gross_revenue || dataItem.amount || '',
            dataItem.normaPercentage || dataItem.norma_percentage || '',
            dataItem.netIncome || dataItem.net_income || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            const rowHeight = 5; // Increased row height
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidthsA[i], rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidthsA[i], rowHeight);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(4); // Increased font size
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxWidth = colWidthsA[i] - 2;

                // Better text wrapping and alignment
                if (i === 0) { // Number column - center aligned
                    doc.text(text, currentX + (colWidthsA[i] / 2), yPos + 3, { align: 'center' });
                } else if (i >= 3) { // Numeric columns - right aligned
                    doc.text(text, currentX + colWidthsA[i] - 1, yPos + 3, { align: 'right' });
                } else { // Text columns - left aligned with wrapping
                    const lines = doc.splitTextToSize(text, maxWidth);
                    if (lines.length > 1) {
                        doc.setFontSize(3.5); // Slightly smaller for wrapped text
                    }
                    doc.text(lines[0], currentX + 1, yPos + 3);
                }
            }
            currentX += colWidthsA[i];
        }
        yPos += 5;
    }

    // JUMLAH TABEL A with improved layout
    doc.setFillColor(255, 193, 7);
    doc.rect(10 + 12 + 45 + 45, yPos, 35, 5, 'F'); // PEREDARAN BRUTO column
    doc.rect(10 + 12 + 45 + 45, yPos, 35, 5);
    doc.rect(10 + 12 + 45 + 45 + 35 + 20, yPos, 33, 5, 'F'); // PENGHASILAN NETO column
    doc.rect(10 + 12 + 45 + 45 + 35 + 20, yPos, 33, 5);

    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('JUMLAH TABEL A', 12, yPos + 3);
    doc.text('A.4', 10 + 12 + 45 + 45 + 17.5, yPos + 3, { align: 'center' });
    doc.text('A.6', 10 + 12 + 45 + 45 + 35 + 20 + 16.5, yPos + 3, { align: 'center' });

    // Fill totals if available
    const totalGrossRevenue = l3a4Data.businessIncome?.totalGrossIncome ||
        l3a4Data.businessIncome?.total_gross_income || '';
    const totalNetIncome = l3a4Data.businessIncome?.totalNetIncome ||
        l3a4Data.businessIncome?.total_net_income || '';

    if (totalGrossRevenue) {
        doc.setFontSize(4);
        doc.setFont('helvetica', 'normal');
        doc.text(totalGrossRevenue.toString(), 10 + 12 + 45 + 45 + 34, yPos + 3, { align: 'right' });
    }
    if (totalNetIncome) {
        doc.setFontSize(4);
        doc.setFont('helvetica', 'normal');
        doc.text(totalNetIncome.toString(), 10 + 12 + 45 + 45 + 35 + 20 + 32, yPos + 3, { align: 'right' });
    }

    yPos += 7;

    // Note for Table A
    doc.setFontSize(3.5);
    doc.setTextColor(100, 100, 100);
    doc.text('PINDAHKAN JUMLAH TABEL A.6 KE INDUK BAGIAN B ANGKA 1 HURUF b', 12, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;

    // === TABLE B ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, pageWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('B. PENGHASILAN NETO DALAM NEGERI LAINNYA', 12, yPos + 4);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Improved Table B
    const headersB = [
        'NO', 'KODE', 'JENIS PENGHASILAN', 'PENGHASILAN NETO'
    ];
    const colWidthsB = [12, 25, 108, 45]; // Better proportions

    // Draw header for Table B
    currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    for (let i = 0; i < headersB.length; i++) {
        doc.rect(currentX, yPos, colWidthsB[i], 8, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsB[i], 8);

        // Column numbers
        doc.setFontSize(3);
        doc.text(`(${i + 1})`, currentX + (colWidthsB[i] / 2), yPos + 1.5, { align: 'center' });

        // Header text
        doc.setFontSize(4);
        doc.text(headersB[i], currentX + (colWidthsB[i] / 2), yPos + 5, { align: 'center' });
        currentX += colWidthsB[i];
    }
    yPos += 8;

    // Draw rows for Table B with improved readability
    for (let rowNum = 1; rowNum <= 20; rowNum++) {
        currentX = 10;

        // Check if we have data for this row
        const dataItem = otherDomesticIncome[rowNum - 1] || {};

        const rowData = [
            rowNum.toString(),
            dataItem.code || '',
            dataItem.incomeType || dataItem.income_type || '',
            dataItem.amount || dataItem.net_income || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            const rowHeight = 5;
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidthsB[i], rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidthsB[i], rowHeight);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(4); // Increased font size
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxWidth = colWidthsB[i] - 2;

                if (i === 0) { // Number column
                    doc.text(text, currentX + (colWidthsB[i] / 2), yPos + 3, { align: 'center' });
                } else if (i === 1) { // Code column - center aligned
                    doc.text(text, currentX + (colWidthsB[i] / 2), yPos + 3, { align: 'center' });
                } else if (i === 3) { // Amount column - right aligned
                    doc.text(text, currentX + colWidthsB[i] - 1, yPos + 3, { align: 'right' });
                } else { // Description column - left aligned with wrapping
                    const lines = doc.splitTextToSize(text, maxWidth);
                    if (lines.length > 1) {
                        doc.setFontSize(3.5);
                    }
                    doc.text(lines[0], currentX + 1, yPos + 3);
                }
            }
            currentX += colWidthsB[i];
        }
        yPos += 5;
    }

    // JUMLAH TABEL B with improved layout
    doc.setFillColor(255, 193, 7);
    doc.rect(10 + 12 + 25 + 108, yPos, 45, 5, 'F');
    doc.rect(10 + 12 + 25 + 108, yPos, 45, 5);

    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('JUMLAH TABEL B', 12, yPos + 3);
    doc.text('B', 10 + 12 + 25 + 108 + 22.5, yPos + 3, { align: 'center' });

    // Fill total if available
    const totalOtherIncome = l3a4Data.otherDomesticIncome?.totalNetIncome ||
        l3a4Data.otherDomesticIncome?.total_net_income || '';
    if (totalOtherIncome) {
        doc.setFontSize(4);
        doc.setFont('helvetica', 'normal');
        doc.text(totalOtherIncome.toString(), 10 + 12 + 25 + 108 + 44, yPos + 3, { align: 'right' });
    }

    yPos += 7;

    // Note for Table B
    doc.setFontSize(3.5);
    doc.setTextColor(100, 100, 100);
    doc.text('PINDAHKAN JUMLAH TABEL B KE INDUK BAGIAN B ANGKA 1 HURUF c', 12, yPos);
    doc.setTextColor(0, 0, 0);

    // Footer
    yPos += 10;
    doc.setFontSize(4);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3A-4 - PENGHASILAN NETO DARI USAHA DAN PEKERJAAN BEBAS', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 4);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran3B = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3bData = detailData.l3b_data || {};
    const taxpayerData = sptData.taxpayer_identity || {};

    // Debug: Log data to check if it's loaded correctly
    // console.log('L3B Data:', l3bData);

    // // === HEADER ===
    // doc.setFillColor(173, 216, 230);
    // doc.rect(10, yPos, 190, 18, 'F');
    // doc.rect(10, yPos, 190, 18);

    // // PERHATIAN text
    // doc.setFontSize(4);
    // doc.setFont('helvetica', 'bold');
    // doc.setTextColor(0, 0, 0);
    // doc.text('PERHATIAN', 12, yPos + 4);
    // doc.setFontSize(2.5);
    // doc.setFont('helvetica', 'normal');
    // doc.text('LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG BERKEWAJIBAN', 12, yPos + 7);
    // doc.text('MELAPORKAN RINCIAN REKAPITULASI PEREDARAN BRUTO', 12, yPos + 9);

    // // Center title
    // doc.setFontSize(8);
    // doc.setFont('helvetica', 'bold');
    // doc.text('REKAPITULASI PEREDARAN BRUTO', 105, yPos + 10, { align: 'center' });

    // // LAMPIRAN 3B box
    // doc.setFillColor(255, 193, 7);
    // doc.rect(165, yPos + 2, 33, 8, 'F');
    // doc.rect(165, yPos + 2, 33, 8);
    // doc.setFontSize(6);
    // doc.setFont('helvetica', 'bold');
    // doc.setTextColor(0, 0, 0);
    // doc.text('LAMPIRAN 3B', 181.5, yPos + 7, { align: 'center' });

    // // NIK/NPWP
    // doc.setFontSize(3);
    // doc.text('NIK/NPWP', 165, yPos + 12);
    // for (let i = 0; i < 16; i++) {
    //     doc.rect(165 + (i * 1.5), yPos + 13, 1.3, 2);
    //     if (taxpayerData.nik && taxpayerData.nik[i]) {
    //         doc.text(taxpayerData.nik[i], 165.2 + (i * 1.5), yPos + 14.2);
    //     }
    // }

    // // TAHUN PAJAK
    // doc.text('TAHUN PAJAK', 165, yPos + 16);
    // const taxYear = '2023';
    // for (let i = 0; i < 4; i++) {
    //     doc.rect(165 + (i * 1.8), yPos + 17, 1.6, 2);
    //     doc.text(taxYear[i], 165.3 + (i * 1.8), yPos + 18.2);
    // }

    // yPos += 25;

    const perhatianText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG BERKEWAJIBAN MELAPORKAN RINCIAN REKAPITULASI PEREDARAN BRUTO';
    yPos = createLampiran3Header(
        doc,
        'LAMPIRAN 3B',
        'REKAPITULASI PEREDARAN BRUTO',
        '',
        perhatianText,
        taxpayerData
    );
    // === DAFTAR TEMPAT KEGIATAN USAHA (TKU) ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('DAFTAR TEMPAT KEGIATAN USAHA (TKU)', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // TKU Table header - separate rows for numbers and text
    const tkuHeaders = ['NO', 'ID TKU', 'NAMA TKU', 'ALAMAT', 'KELURAHAN/DESA', 'KECAMATAN', 'KOTA/KABUPATEN', 'PROVINSI'];
    const tkuWidths = [8, 15, 25, 35, 25, 25, 25, 25];

    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // First row - Column numbers
    for (let i = 0; i < tkuHeaders.length; i++) {
        doc.rect(currentX, yPos, tkuWidths[i], 2.5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, tkuWidths[i], 2.5);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (tkuWidths[i] / 2), yPos + 1.5, { align: 'center' });
        currentX += tkuWidths[i];
    }
    yPos += 2.5;

    // Second row - Header text
    currentX = 10;
    for (let i = 0; i < tkuHeaders.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, tkuWidths[i], 2.5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, tkuWidths[i], 2.5);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(tkuHeaders[i], currentX + (tkuWidths[i] / 2), yPos + 1.5, { align: 'center' });
        currentX += tkuWidths[i];
    }
    yPos += 2.5;

    // Draw 3 empty rows for TKU
    for (let rowNum = 1; rowNum <= 3; rowNum++) {
        currentX = 10;

        for (let i = 0; i < tkuWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, tkuWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, tkuWidths[i], 3);

            if (i === 0) { // First column (NO)
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2.5);
                doc.setFont('helvetica', 'normal');
                doc.text(rowNum.toString(), currentX + 2, yPos + 2);
            }
            currentX += tkuWidths[i];
        }
        yPos += 3;
    }

    yPos += 5;

    // === A. REKAPITULASI PEREDARAN BRUTO UNTUK WAJIB PAJAK ORANG PRIBADI YANG MEMILIKI PEREDARAN BRUTO TERTENTU YANG DIKENAI PAJAK BERSIFAT FINAL ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('A. REKAPITULASI PEREDARAN BRUTO UNTUK WAJIB PAJAK ORANG PRIBADI YANG MEMILIKI PEREDARAN BRUTO TERTENTU YANG DIKENAI PAJAK BERSIFAT FINAL', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // Section A Table header - separate rows for numbers and text
    const monthHeaders = ['NO', 'NAMA TKU', 'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER', 'JUMLAH'];
    const monthWidths = [8, 22, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 18];

    currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // First row - Column numbers
    for (let i = 0; i < monthHeaders.length; i++) {
        doc.rect(currentX, yPos, monthWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, monthWidths[i], 3);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (monthWidths[i] / 2), yPos + 2, { align: 'center' });
        currentX += monthWidths[i];
    }
    yPos += 3;

    // Second row - Header text
    currentX = 10;
    for (let i = 0; i < monthHeaders.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, monthWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, monthWidths[i], 3);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(monthHeaders[i], currentX + (monthWidths[i] / 2), yPos + 2, { align: 'center' });
        currentX += monthWidths[i];
    }
    yPos += 3;

    // Draw 3 data rows for Section A
    for (let rowNum = 1; rowNum <= 3; rowNum++) {
        currentX = 10;

        for (let i = 0; i < monthWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, monthWidths[i], 4, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, monthWidths[i], 4);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(2.5);
            doc.setFont('helvetica', 'normal');

            if (i === 0) { // First column (NO)
                doc.text(rowNum.toString(), currentX + (monthWidths[i] / 2), yPos + 2.5, { align: 'center' });
            }
            currentX += monthWidths[i];
        }
        yPos += 4;
    }

    // Summary rows for Section A - more compact
    const summaryRowsA = [
        'a. JUMLAH PEREDARAN BRUTO',
        'b. AKUMULASI PEREDARAN BRUTO',
        'c. PEREDARAN BRUTO TIDAK KENA PAJAK',
        'd. PEREDARAN BRUTO KENA PAJAK',
        'e. JUMLAH PPh FINAL TERUTANG (0,5% x d)',
        'f. JUMLAH PPh FINAL YANG DISETOR SENDIRI',
        'g. JUMLAH PPh FINAL YANG DIPOTONG/DIPUNGUT PIHAK LAIN',
        'h. SELISIH (e-f-g)',
        'i. SELISIH PADA SPT YANG DIBETULAN',
        'j. SELISIH KARENA PEMBETULAN (h-i)'
    ];

    summaryRowsA.forEach((label, index) => {
        currentX = 10;

        // First two columns merged for label
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, monthWidths[0] + monthWidths[1], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, monthWidths[0] + monthWidths[1], 4);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'normal');
        doc.text(label, currentX + 1, yPos + 2.5);

        currentX += monthWidths[0] + monthWidths[1];

        // Monthly columns
        for (let i = 2; i < monthWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, monthWidths[i], 4, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, monthWidths[i], 4);

            // Add sample data for demonstration - row c (index 2)
            if (index === 2 && i === 8) { // July column for "PEREDARAN BRUTO TIDAK KENA PAJAK"
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2);
                doc.text('500.000.000', currentX + (monthWidths[i] / 2), yPos + 2.5, { align: 'center' });
            }
            if (index === 2 && i === 14) { // Total column
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2);
                doc.text('500.000.000', currentX + (monthWidths[i] / 2), yPos + 2.5, { align: 'center' });
            }

            currentX += monthWidths[i];
        }
        yPos += 4;
    });

    yPos += 2;

    // Note for Section A - more compact
    doc.setFontSize(2);
    doc.setTextColor(0, 0, 0);
    doc.text('PINDAHKAN HURUF f. JUMLAH PPh FINAL YANG DISETOR SENDIRI KOLOM (15) KE LAMPIRAN 2 BAGIAN A DENGAN KODE 28-421-29 JENIS PENGHASILAN "PENGHASILAN YANG DIKENAKAN PAJAK BERSIFAT FINAL SESUAI PERATURAN PEMERINTAH NOMOR 55 TAHUN 2022 DISETOR SENDIRI"', 12, yPos);
    yPos += 3;
    doc.text('PINDAHKAN HURUF g. JUMLAH PPh FINAL YANG DIPOTONG/DIPUNGUT PIHAK LAIN PADA KOLOM (15) SAMPAI (15) KE LAMPIRAN 2 BAGIAN A SESUAI DENGAN BUKTI PEMOTONGAN/PEMUNGUTAN PPh', 12, yPos);
    yPos += 5;

    // === B. REKAPITULASI PEREDARAN BRUTO UNTUK WAJIB PAJAK ORANG PRIBADI PENGUSAHA TERTENTU (OPPT) ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('B. REKAPITULASI PEREDARAN BRUTO UNTUK WAJIB PAJAK ORANG PRIBADI PENGUSAHA TERTENTU (OPPT)', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // METODE PEMBUKUAN section
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPos, 190, 3, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPos, 190, 3);

    doc.setFontSize(2.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('METODE PEMBUKUAN', 12, yPos + 2);
    doc.text('1. PENCATATAN', 65, yPos + 2);
    doc.text('2. PEMBUKUAN STELSEL KAS ATAU PEMBUKUAN STELSEL AKRUAL', 120, yPos + 2);
    yPos += 4;

    // Section B Table header - separate rows for numbers and text
    currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // First row - Column numbers
    for (let i = 0; i < monthHeaders.length; i++) {
        doc.rect(currentX, yPos, monthWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, monthWidths[i], 3);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (monthWidths[i] / 2), yPos + 2, { align: 'center' });
        currentX += monthWidths[i];
    }
    yPos += 3;

    // Second row - Header text
    currentX = 10;
    for (let i = 0; i < monthHeaders.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, monthWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, monthWidths[i], 3);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(monthHeaders[i], currentX + (monthWidths[i] / 2), yPos + 2, { align: 'center' });
        currentX += monthWidths[i];
    }
    yPos += 3;

    // Draw 3 data rows for Section B
    for (let rowNum = 1; rowNum <= 3; rowNum++) {
        currentX = 10;

        for (let i = 0; i < monthWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, monthWidths[i], 4, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, monthWidths[i], 4);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(2.5);
            doc.setFont('helvetica', 'normal');

            if (i === 0) { // First column (NO)
                doc.text(rowNum.toString(), currentX + (monthWidths[i] / 2), yPos + 2.5, { align: 'center' });
            }
            currentX += monthWidths[i];
        }
        yPos += 4;
    }

    // Summary rows for Section B
    const summaryRowsB = [
        'JUMLAH PEREDARAN BRUTO',
        'JUMLAH PPh'
    ];

    summaryRowsB.forEach((label) => {
        currentX = 10;

        // First two columns merged for label
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, monthWidths[0] + monthWidths[1], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, monthWidths[0] + monthWidths[1], 4);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'normal');
        doc.text(label, currentX + 1, yPos + 2.5);

        currentX += monthWidths[0] + monthWidths[1];

        // Monthly columns
        for (let i = 2; i < monthWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, monthWidths[i], 4, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, monthWidths[i], 4);
            currentX += monthWidths[i];
        }
        yPos += 4;
    });

    yPos += 3;

    // Note for Section B
    doc.setFontSize(1.8);
    doc.setTextColor(0, 0, 0);
    doc.text('APABILA METODE PEMBUKUAN ADALAH 1. PENCATATAN, PINDAHKAN SELURUH DATA PADA MASING-MASING TKU DARI KOLOM (3) SAMPAI KOLOM (15) PADA TABEL 1 KE TABEL 2, LAMPIRAN 3A: BARIS JUMLAH PPh PADA KOLOM (3) SAMPAI KOLOM (15) DIKURANGKAN DENGAN PPh YANG C. BARIS JUMLAH PPh SESUAI DENGAN KOLOM MASING-MASING', 12, yPos);

    // Continue to next page for Section C
    doc.addPage();
    yPos = 20;

    // === C. REKAPITULASI PEREDARAN BRUTO UNTUK PENGGUNA NORMA PENGHITUNGAN PENGHASILAN NETO (NPPPN) ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('C. REKAPITULASI PEREDARAN BRUTO UNTUK PENGGUNA NORMA PENGHITUNGAN PENGHASILAN NETO (NPPPN)', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // Section C Table header - separate rows for numbers and text
    const sectionCHeaders = ['NO', 'NAMA TKU', 'JENIS USAHA/\nPEKERJAAN BEBAS', 'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER', 'JUMLAH'];
    const sectionCWidths = [6, 20, 20, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 12];

    currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // First row - Column numbers
    for (let i = 0; i < sectionCHeaders.length; i++) {
        doc.rect(currentX, yPos, sectionCWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, sectionCWidths[i], 3);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (sectionCWidths[i] / 2), yPos + 2, { align: 'center' });
        currentX += sectionCWidths[i];
    }
    yPos += 3;

    // Second row - Header text
    currentX = 10;
    for (let i = 0; i < sectionCHeaders.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, sectionCWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, sectionCWidths[i], 3);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');

        // Handle multi-line headers
        const headerLines = sectionCHeaders[i].split('\n');
        if (headerLines.length > 1) {
            headerLines.forEach((line, lineIndex) => {
                doc.text(line, currentX + (sectionCWidths[i] / 2), yPos + 1.5 + (lineIndex * 1), { align: 'center' });
            });
        } else {
            doc.text(sectionCHeaders[i], currentX + (sectionCWidths[i] / 2), yPos + 2, { align: 'center' });
        }
        currentX += sectionCWidths[i];
    }
    yPos += 3;

    // Draw 5 empty rows for Section C
    for (let rowNum = 1; rowNum <= 5; rowNum++) {
        currentX = 10;

        for (let i = 0; i < sectionCWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, sectionCWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, sectionCWidths[i], 3);

            if (i === 0) { // First column (NO)
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2);
                doc.setFont('helvetica', 'normal');
                doc.text(rowNum.toString(), currentX + 2, yPos + 2);
            }
            currentX += sectionCWidths[i];
        }
        yPos += 3;
    }

    // Summary rows for Section C
    const summaryRowsC = [
        'JUMLAH PEREDARAN BRUTO',
        'JUMLAH PPh'
    ];

    summaryRowsC.forEach((label) => {
        currentX = 10;

        // First three columns merged for label
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, sectionCWidths[0] + sectionCWidths[1] + sectionCWidths[2], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, sectionCWidths[0] + sectionCWidths[1] + sectionCWidths[2], 3);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2);
        doc.setFont('helvetica', 'normal');
        doc.text(label, currentX + 0.5, yPos + 2);

        currentX += sectionCWidths[0] + sectionCWidths[1] + sectionCWidths[2];

        // Monthly columns
        for (let i = 3; i < sectionCWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, sectionCWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, sectionCWidths[i], 3);
            currentX += sectionCWidths[i];
        }
        yPos += 3;
    });

    yPos += 5;

    // Final note
    doc.setFontSize(1.8);
    doc.setTextColor(0, 0, 0);
    doc.text('PINDAHKAN NAMA TKU KOLOM (2), JENIS USAHA/PEKERJAAN BEBAS KOLOM (3), DAN JUMLAH PEREDARAN BRUTO KOLOM (16) KE LAMPIRAN 3A-4 BAGIAN A DAN JUMLAH PPh KOLOM (16) KE INDUK BAGIAN D ANGKA 10 HURUF b', 12, yPos);

    // Footer
    yPos += 10;
    doc.setFontSize(3);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3B - REKAPITULASI PEREDARAN BRUTO', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran3C = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3cData = detailData.l3c_data || {};
    const tangibleAssets = l3cData.tangibleAssets || [];
    const buildings = l3cData.buildings || [];
    const intangibleAssets = l3cData.intangibleAssets || [];
    const taxpayerData = sptData.taxpayer_identity || {};

    const perhatianText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG MENYELENGGARAKAN BIAYA PENYUSUTAN DAN/ATAU AMORTISASI';
    yPos = createLampiran3Header(
        doc,
        'LAMPIRAN 3C',
        'DAFTAR PENYUSUTAN DAN',
        'AMORTISASI FISKAL',
        perhatianText,
        taxpayerData
    );

    // === MAIN TABLE ===
    // Table headers
    const headers = [
        'KODE\nHARTA', 'KELOMPOK / JENIS HARTA', 'BULAN/TAHUN\nPEROLEHAN', 'HARGA PEROLEHAN\n(RUPIAH)',
        'NILAI SISA BUKU FISKAL\nAWAL TAHUN\n(RUPIAH)', 'METODE\nPENYUSUTAN/AMORTISASI\nKOMERSIAL',
        'FISKAL', 'PENYUSUTAN/AMORTISASI\nFISKAL PADA TAHUN INI\n(RUPIAH)', 'KETERANGAN'
    ];
    const colWidths = [12, 35, 18, 20, 20, 20, 15, 25, 25];

    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // First row - Column numbers
    for (let i = 0; i < headers.length; i++) {
        doc.rect(currentX, yPos, colWidths[i], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[i], 3);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (colWidths[i] / 2), yPos + 2, { align: 'center' });
        currentX += colWidths[i];
    }
    yPos += 3;

    // Second row - Header text
    currentX = 10;
    for (let i = 0; i < headers.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, colWidths[i], 8, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[i], 8);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');

        // Handle multi-line headers
        const headerLines = headers[i].split('\n');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidths[i] / 2), yPos + 2 + (lineIndex * 1.5), { align: 'center' });
        });
        currentX += colWidths[i];
    }
    yPos += 8;

    // === I. HARTA BERWUJUD ===
    // Section header
    currentX = 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 4, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 4);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('I. HARTA BERWUJUD', currentX + 2, yPos + 2.5);

    // Empty cells for other columns
    currentX += colWidths[0] + colWidths[1];
    for (let i = 2; i < colWidths.length; i++) {
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, colWidths[i], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[i], 4);
        currentX += colWidths[i];
    }
    yPos += 4;

    // A. KELOMPOK 1
    const kelompokSections = [
        { title: 'A. KELOMPOK 1', items: 3 },
        { title: 'B. KELOMPOK 2', items: 3 },
        { title: 'C. KELOMPOK 3', items: 3 },
        { title: 'D. KELOMPOK 4', items: 3 },
        { title: 'E. KELOMPOK LAINNYA', items: 3 }
    ];

    kelompokSections.forEach(section => {
        // Section header
        currentX = 10;
        doc.setFillColor(250, 250, 250);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, currentX + 2, yPos + 2);

        // Empty cells for other columns
        currentX += colWidths[0] + colWidths[1];
        for (let i = 2; i < colWidths.length; i++) {
            doc.setFillColor(250, 250, 250);
            doc.rect(currentX, yPos, colWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidths[i], 3);
            currentX += colWidths[i];
        }
        yPos += 3;

        // Items for this section
        for (let itemNum = 1; itemNum <= section.items; itemNum++) {
            currentX = 10;

            // Find data for this item
            const dataItem = tangibleAssets.find(item =>
                item.assetType && item.assetType.includes(section.title.split('.')[0])
            ) || {};

            const rowData = [
                dataItem.codeOfAsset || '',
                `${itemNum}. ........................................`,
                dataItem.monthYearAcquisition || '',
                dataItem.costOfAcquisition || '',
                dataItem.fiscalBookAtBeginning || '',
                dataItem.commercialDepreciation || '',
                dataItem.fiscalDepreciation || '',
                dataItem.fiscalDepreciationThisYear || '',
                dataItem.notes || ''
            ];

            for (let i = 0; i < rowData.length; i++) {
                doc.setFillColor(255, 255, 255);
                doc.rect(currentX, yPos, colWidths[i], 3, 'F');
                doc.setDrawColor(0, 0, 0);
                doc.rect(currentX, yPos, colWidths[i], 3);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2);
                doc.setFont('helvetica', 'normal');

                if (rowData[i]) {
                    const text = rowData[i].toString();
                    const maxLen = Math.floor(colWidths[i] / 1.2);
                    const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                    doc.text(displayText, currentX + 0.5, yPos + 2);
                }
                currentX += colWidths[i];
            }
            yPos += 3;
        }
    });

    // === II. BANGUNAN ===
    currentX = 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 4, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 4);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('II. BANGUNAN', currentX + 2, yPos + 2.5);

    // Empty cells for other columns
    currentX += colWidths[0] + colWidths[1];
    for (let i = 2; i < colWidths.length; i++) {
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, colWidths[i], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[i], 4);
        currentX += colWidths[i];
    }
    yPos += 4;

    // Building sections
    const buildingSections = [
        { title: 'A. PERMANEN', items: 3 },
        { title: 'B. TIDAK PERMANEN', items: 3 }
    ];

    buildingSections.forEach(section => {
        // Section header
        currentX = 10;
        doc.setFillColor(250, 250, 250);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, currentX + 2, yPos + 2);

        // Empty cells for other columns
        currentX += colWidths[0] + colWidths[1];
        for (let i = 2; i < colWidths.length; i++) {
            doc.setFillColor(250, 250, 250);
            doc.rect(currentX, yPos, colWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidths[i], 3);
            currentX += colWidths[i];
        }
        yPos += 3;

        // Items for this section
        for (let itemNum = 1; itemNum <= section.items; itemNum++) {
            currentX = 10;

            // Find data for this item
            const dataItem = buildings.find(item =>
                item.category && item.category.includes(section.title.toLowerCase().includes('permanen') ? 'permanent' : 'temporary')
            ) || {};

            const rowData = [
                dataItem.codeOfAsset || '',
                `${itemNum}. ........................................`,
                dataItem.monthYearAcquisition || '',
                dataItem.costOfAcquisition || '',
                dataItem.fiscalBookAtBeginning || '',
                dataItem.commercialDepreciation || '',
                dataItem.fiscalDepreciation || '',
                dataItem.fiscalDepreciationThisYear || '',
                dataItem.notes || ''
            ];

            for (let i = 0; i < rowData.length; i++) {
                doc.setFillColor(255, 255, 255);
                doc.rect(currentX, yPos, colWidths[i], 3, 'F');
                doc.setDrawColor(0, 0, 0);
                doc.rect(currentX, yPos, colWidths[i], 3);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2);
                doc.setFont('helvetica', 'normal');

                if (rowData[i]) {
                    const text = rowData[i].toString();
                    const maxLen = Math.floor(colWidths[i] / 1.2);
                    const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                    doc.text(displayText, currentX + 0.5, yPos + 2);
                }
                currentX += colWidths[i];
            }
            yPos += 3;
        }
    });

    // Summary rows for Section I & II
    const summaryRows = [
        'A. JUMLAH PENYUSUTAN FISKAL',
        'B. JUMLAH PENYUSUTAN KOMERSIAL',
        'C. SELISIH PENYUSUTAN (A-B)'
    ];

    summaryRows.forEach(label => {
        currentX = 10;

        // First two columns merged for label
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(label, currentX + 1, yPos + 2);

        currentX += colWidths[0] + colWidths[1];

        // Other columns
        for (let i = 2; i < colWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidths[i], 3);
            currentX += colWidths[i];
        }
        yPos += 3;
    });

    // === III. HARTA TIDAK BERWUJUD ===
    currentX = 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 4, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 4);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(3);
    doc.setFont('helvetica', 'bold');
    doc.text('III. HARTA TIDAK BERWUJUD', currentX + 2, yPos + 2.5);

    // Empty cells for other columns
    currentX += colWidths[0] + colWidths[1];
    for (let i = 2; i < colWidths.length; i++) {
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, colWidths[i], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[i], 4);
        currentX += colWidths[i];
    }
    yPos += 4;

    // Intangible asset sections
    const intangibleSections = [
        { title: 'A. KELOMPOK 1', items: 1 },
        { title: 'B. KELOMPOK 2', items: 1 },
        { title: 'C. KELOMPOK 3', items: 1 },
        { title: 'D. KELOMPOK 4', items: 1 },
        { title: 'E. KELOMPOK LAINNYA', items: 1 }
    ];

    intangibleSections.forEach(section => {
        // Section header
        currentX = 10;
        doc.setFillColor(250, 250, 250);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, currentX + 2, yPos + 2);

        // Empty cells for other columns
        currentX += colWidths[0] + colWidths[1];
        for (let i = 2; i < colWidths.length; i++) {
            doc.setFillColor(250, 250, 250);
            doc.rect(currentX, yPos, colWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidths[i], 3);
            currentX += colWidths[i];
        }
        yPos += 3;

        // Items for this section
        for (let itemNum = 1; itemNum <= section.items; itemNum++) {
            currentX = 10;

            // Find data for this item
            const dataItem = intangibleAssets.find(item =>
                item.assetType && item.assetType.includes(section.title.split('.')[0])
            ) || {};

            const rowData = [
                dataItem.codeOfAsset || '',
                `${itemNum}. ........................................`,
                dataItem.monthYearAcquisition || '',
                dataItem.costOfAcquisition || '',
                dataItem.fiscalBookAtBeginning || '',
                dataItem.commercialAmortization || '',
                dataItem.fiscalAmortization || '',
                dataItem.fiscalAmortizationThisYear || '',
                dataItem.notes || ''
            ];

            for (let i = 0; i < rowData.length; i++) {
                doc.setFillColor(255, 255, 255);
                doc.rect(currentX, yPos, colWidths[i], 3, 'F');
                doc.setDrawColor(0, 0, 0);
                doc.rect(currentX, yPos, colWidths[i], 3);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(2);
                doc.setFont('helvetica', 'normal');

                if (rowData[i]) {
                    const text = rowData[i].toString();
                    const maxLen = Math.floor(colWidths[i] / 1.2);
                    const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                    doc.text(displayText, currentX + 0.5, yPos + 2);
                }
                currentX += colWidths[i];
            }
            yPos += 3;
        }
    });

    // Summary rows for Section III
    const amortizationSummaryRows = [
        'D. JUMLAH AMORTISASI FISKAL',
        'E. JUMLAH AMORTISASI KOMERSIAL',
        'F. SELISIH AMORTISASI (D-E)'
    ];

    amortizationSummaryRows.forEach(label => {
        currentX = 10;

        // First two columns merged for label
        doc.setFillColor(240, 240, 240);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidths[0] + colWidths[1], 3);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');
        doc.text(label, currentX + 1, yPos + 2);

        currentX += colWidths[0] + colWidths[1];

        // Other columns
        for (let i = 2; i < colWidths.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidths[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidths[i], 3);
            currentX += colWidths[i];
        }
        yPos += 3;
    });

    // Footer
    yPos += 10;
    doc.setFontSize(3);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3C - DAFTAR PENYUSUTAN DAN AMORTISASI FISKAL', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran3D = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l3dData = detailData.l3d_data || {};
    const entertainmentCosts = l3dData.entertainment_costs || [];
    const promotionCosts = l3dData.promotion_costs || [];
    const badDebts = l3dData.bad_debts || [];
    const taxpayerData = sptData.taxpayer_identity || {};

    const perhatianText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG MENGELUARKAN BIAYA ENTERTAINMENT, BIAYA TIDAK PROMOSI DAN PENJUALAN, SERTA PENYISIHAN ATAU KERUGIAN DALAM MENGATUR YANG NYATA-NYATA TIDAK DAPAT DITAGIH, DAFTAR PIUTANG YANG NYATA-NYATA TIDAK DAPAT DITAGIH';
    yPos = createLampiran3Header(
        doc,
        'LAMPIRAN 3D',
        'RINCIAN BIAYA TERTENTU',
        '',
        perhatianText,
        taxpayerData
    );


    // === A. DAFTAR NOMINATIF BIAYA ENTERTAINMENT ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('A. DAFTAR NOMINATIF BIAYA ENTERTAINMENT', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // Table A headers
    const headersA = [
        'NO', 'TANGGAL', 'NAMA\nTEMPAT', 'ALAMAT', 'JENIS', 'JUMLAH', 'NAMA', 'POSISI', 'NAMA\nPERUSAHAAN', 'JENIS USAHA', 'KETERANGAN'
    ];
    const colWidthsA = [8, 15, 20, 25, 15, 15, 20, 15, 20, 20, 17];

    // Sub-headers for Table A
    const subHeadersA = [
        '', '', '', '', '', '', '', '', '', '', ''
    ];
    const subHeaderLabelsA = [
        '', '', '', '', '', '', 'RELASI USAHA YANG DIBERIKAN ENTERTAINMENT', '', '', '', ''
    ];

    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // Main section headers
    doc.rect(10, yPos, 95, 3, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPos, 95, 3);
    doc.setFontSize(2.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PEMBERIAN ENTERTAINMENT', 57.5, yPos + 2, { align: 'center' });

    doc.rect(105, yPos, 85, 3, 'F');
    doc.rect(105, yPos, 85, 3);
    doc.text('RELASI USAHA YANG DIBERIKAN ENTERTAINMENT', 147.5, yPos + 2, { align: 'center' });
    yPos += 3;

    // Column numbers row
    currentX = 10;
    for (let i = 0; i < headersA.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, colWidthsA[i], 2.5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsA[i], 2.5);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (colWidthsA[i] / 2), yPos + 1.5, { align: 'center' });
        currentX += colWidthsA[i];
    }
    yPos += 2.5;

    // Header text row
    currentX = 10;
    for (let i = 0; i < headersA.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, colWidthsA[i], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsA[i], 4);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');

        // Handle multi-line headers
        const headerLines = headersA[i].split('\n');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidthsA[i] / 2), yPos + 1.5 + (lineIndex * 1.5), { align: 'center' });
        });
        currentX += colWidthsA[i];
    }
    yPos += 4;

    // Data rows for Table A
    for (let rowNum = 1; rowNum <= 8; rowNum++) {
        currentX = 10;

        // Get data for this row
        const dataItem = entertainmentCosts[rowNum - 1] || {};

        const rowData = [
            rowNum.toString(),
            dataItem.entertainmentDate || '',
            dataItem.entertainmentLocation || '',
            dataItem.address || '',
            dataItem.entertainmentType || '',
            dataItem.entertainmentAmount || '',
            dataItem.relatedPartyName || '',
            dataItem.position || '',
            dataItem.companyName || '',
            dataItem.businessType || '',
            dataItem.notes || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidthsA[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidthsA[i], 3);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(2);
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxLen = Math.floor(colWidthsA[i] / 1.2);
                const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                doc.text(displayText, currentX + 0.5, yPos + 2);
            }
            currentX += colWidthsA[i];
        }
        yPos += 3;
    }

    yPos += 5;

    // === B. DAFTAR NOMINATIF BIAYA PROMOSI SERTA PENGGANTIAN ATAU IMBALAN DALAM BENTUK NATURA DAN/ATAU KENIKMATAN ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('B. DAFTAR NOMINATIF BIAYA PROMOSI SERTA PENGGANTIAN ATAU IMBALAN DALAM BENTUK NATURA DAN/ATAU KENIKMATAN', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // Table B headers
    const headersB = [
        'NO', 'NOMOR IDENTITAS', 'NAMA', 'ALAMAT', 'TANGGAL', 'BENTUK\nDAN JENIS\nBIAYA', 'NILAI', 'KETERANGAN', 'JUMLAH', 'NOMOR BUKTI\nPOTONG'
    ];
    const colWidthsB = [8, 20, 25, 25, 15, 20, 15, 20, 15, 17];

    // Sub-headers for Table B
    doc.setFillColor(220, 220, 220);
    doc.rect(40, yPos, 40, 3, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(40, yPos, 40, 3);
    doc.setFontSize(2.5);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA PENERIMA', 60, yPos + 2, { align: 'center' });

    doc.rect(140, yPos, 50, 3, 'F');
    doc.rect(140, yPos, 50, 3);
    doc.text('PEMOTONGAN/PEMUNGUTAN PPh', 165, yPos + 2, { align: 'center' });
    yPos += 3;

    // Column numbers row
    currentX = 10;
    for (let i = 0; i < headersB.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, colWidthsB[i], 2.5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsB[i], 2.5);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.text(`(${i + 1})`, currentX + (colWidthsB[i] / 2), yPos + 1.5, { align: 'center' });
        currentX += colWidthsB[i];
    }
    yPos += 2.5;

    // Header text row
    currentX = 10;
    for (let i = 0; i < headersB.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, colWidthsB[i], 4, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsB[i], 4);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');

        // Handle multi-line headers
        const headerLines = headersB[i].split('\n');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidthsB[i] / 2), yPos + 1.5 + (lineIndex * 1), { align: 'center' });
        });
        currentX += colWidthsB[i];
    }
    yPos += 4;

    // Data rows for Table B
    for (let rowNum = 1; rowNum <= 10; rowNum++) {
        currentX = 10;

        // Get data for this row
        const dataItem = promotionCosts[rowNum - 1] || {};

        const rowData = [
            rowNum.toString(),
            dataItem.tinNumber || '',
            dataItem.name || '',
            dataItem.address || '',
            dataItem.date || '',
            dataItem.typeOfCost || '',
            dataItem.amount || '',
            dataItem.notes || '',
            dataItem.incomeTaxWithholdingAmount || '',
            dataItem.withholdingSlipNumber || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidthsB[i], 3, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidthsB[i], 3);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(2);
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxLen = Math.floor(colWidthsB[i] / 1.2);
                const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                doc.text(displayText, currentX + 0.5, yPos + 2);
            }
            currentX += colWidthsB[i];
        }
        yPos += 3;
    }

    yPos += 5;

    // === C. DAFTAR PIUTANG YANG NYATA-NYATA TIDAK DAPAT DITAGIH ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('C. DAFTAR PIUTANG YANG NYATA-NYATA TIDAK DAPAT DITAGIH', 12, yPos + 2.5);
    doc.setTextColor(0, 0, 0);
    yPos += 5;

    // Table C headers
    const headersC = [
        'NO', 'NOMOR IDENTITAS', 'NAMA DEBITUR', 'ALAMAT', 'JUMLAH PIAFON\nPIUTANG', 'JUMLAH PIUTANG YANG\nNYATA-NYATA\nTIDAK DAPAT DITAGIH', 'METODE\nPEMBEBASAN', 'JENIS DOKUMEN\nPEMBUKTIAN PEMENUHAN\nPERSYARATAN'
    ];
    const colWidthsC = [8, 25, 25, 25, 25, 30, 25, 27];

    // Column numbers row
    currentX = 10;
    doc.setFillColor(220, 220, 220);
    for (let i = 0; i < headersC.length; i++) {
        doc.rect(currentX, yPos, colWidthsC[i], 2.5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsC[i], 2.5);

        doc.setFontSize(2);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`(${i + 1})`, currentX + (colWidthsC[i] / 2), yPos + 1.5, { align: 'center' });
        currentX += colWidthsC[i];
    }
    yPos += 2.5;

    // Header text row
    currentX = 10;
    for (let i = 0; i < headersC.length; i++) {
        doc.setFillColor(220, 220, 220);
        doc.rect(currentX, yPos, colWidthsC[i], 6, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsC[i], 6);

        doc.setFontSize(2.5);
        doc.setFont('helvetica', 'bold');

        // Handle multi-line headers
        const headerLines = headersC[i].split('\n');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidthsC[i] / 2), yPos + 1.5 + (lineIndex * 1.5), { align: 'center' });
        });
        currentX += colWidthsC[i];
    }
    yPos += 6;

    // Data rows for Table C
    for (let rowNum = 1; rowNum <= 8; rowNum++) {
        currentX = 10;

        // Get data for this row
        const dataItem = badDebts[rowNum - 1] || {};

        const rowData = [
            rowNum.toString(),
            dataItem.tinNumber || '',
            dataItem.debtorName || '',
            dataItem.debtorAddress || '',
            dataItem.amountOfDebt || '',
            dataItem.badDebt || '',
            dataItem.deductionMethod || '',
            dataItem.typeOfFulfillmentProving || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidthsC[i], 4, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidthsC[i], 4);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(2);
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxLen = Math.floor(colWidthsC[i] / 1.2);
                const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                doc.text(displayText, currentX + 0.5, yPos + 2.5);
            }
            currentX += colWidthsC[i];
        }
        yPos += 4;
    }

    // Footer
    yPos += 10;
    doc.setFontSize(3);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 3D - RINCIAN BIAYA TERTENTU', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran4 = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l4Data = detailData.l4_data || {};
    const calculation = l4Data.calculation || {};
    const taxpayerData = sptData.taxpayer_identity || {};

    // Debug: Log data to check if it's loaded correctly
    console.log('L4 Data:', l4Data);
    console.log('Calculation:', calculation);

    // === HEADER ===
    doc.setFillColor(173, 216, 230);
    doc.rect(10, yPos, 190, 20, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, yPos, 190, 20);

    // Left section - PERHATIAN
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PERHATIAN', 12, yPos + 4);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    const perhatianLines = [
        'LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG',
        'BERKEWAJIBAN MEMBAYAR ANGSURAN PPh',
        'PASAL 25 DAN/ATAU WAJIB PAJAK YANG',
        'STATUS KEWAJIBAN PAJAK WAJIB PAJAK DAN',
        'PASANGANNYA ADALAH PISAH HARTA (PH)',
        'ATAU MEMILIH TERPISAH (MT)'
    ];

    perhatianLines.forEach((line, index) => {
        doc.text(line, 12, yPos + 6 + (index * 2));
    });

    // Center section - Section titles
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);

    // Section A title
    const centerX = 105;
    doc.text('A. PENGHITUNGAN ANGSURAN PPh PASAL 25', centerX, yPos + 8, { align: 'center' });
    doc.text('TAHUN PAJAK BERIKUTNYA', centerX, yPos + 10.5, { align: 'center' });

    // Section B title  
    doc.text('B. PENGHITUNGAN PPh TERUTANG', centerX, yPos + 13, { align: 'center' });
    doc.text('WAJIB PAJAK DAN SUAMI/ISTRI', centerX, yPos + 15.5, { align: 'center' });

    // Right section - LAMPIRAN 4 box
    doc.setFillColor(255, 193, 7);
    doc.rect(160, yPos + 2, 38, 10, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(160, yPos + 2, 38, 10);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('LAMPIRAN 4', 179, yPos + 8.5, { align: 'center' });

    // NIK/NPWP section
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text('NIK/NPWP', 160, yPos + 14);

    // NIK/NPWP boxes
    const nikStartX = 160;
    const nikStartY = yPos + 15;
    const boxWidth = 2.2;
    const boxHeight = 3;

    for (let i = 0; i < 16; i++) {
        const boxX = nikStartX + (i * (boxWidth + 0.2));
        doc.setFillColor(255, 255, 255);
        doc.rect(boxX, nikStartY, boxWidth, boxHeight, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(boxX, nikStartY, boxWidth, boxHeight);
        
        if (taxpayerData.nik && taxpayerData.nik[i]) {
            doc.setFontSize(7);
            doc.text(taxpayerData.nik[i], boxX + 1.1, nikStartY + 2.2, { align: 'center' });
        }
    }

    yPos += 28;
    
    // === A. PENGHITUNGAN ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('A. PENGHITUNGAN ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA', 105, yPos + 4, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Section A calculation rows
    const sectionAItems = [
        { num: '1', text: 'PENGHASILAN NETO', value: calculation.regularNetIncome || '', formula: '' },
        { num: '2', text: 'KOMPENSASI KERUGIAN TAHUN PAJAK BERIKUTNYA', value: calculation.fiscalLossCompensation || '', formula: '' },
        { num: '3', text: 'ZAKAT/SUMBANGAN KEAGAMAAN YANG BERSIFAT WAJIB', value: calculation.compulsoryZakat || '', formula: '' },
        { num: '4', text: 'JUMLAH PENGHASILAN NETO', value: '', formula: '( 1 + 2 - 3 )' },
        { num: '5', text: 'PENGHASILAN TIDAK KENA PAJAK', value: '', formula: '' },
        { num: '6', text: 'PENGHASILAN KENA PAJAK', value: '', formula: '( 4 - 5 )' },
        { num: '7', text: 'PPh TERUTANG', value: '', formula: '' },
        { num: '8', text: 'PENGURANG PPh TERUTANG', value: calculation.incomeTaxDeduction || '', formula: '' },
        { num: '9', text: 'KREDIT PAJAK', value: calculation.taxCreditFromWithholding || '', formula: '' },
        { num: '10', text: 'PPh YANG HARUS DIBAYAR', value: '', formula: '( 7 - 8 - 9 )' },
        { num: '11', text: 'ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA', value: '', formula: '( 1/12 x 10 )' }
    ];

    sectionAItems.forEach(item => {
        // Yellow number box
        doc.setFillColor(255, 193, 7);
        doc.rect(12, yPos, 8, 6, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(12, yPos, 8, 6);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item.num, 16, yPos + 4, { align: 'center' });

        // Item text
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(item.text, 22, yPos + 4);

        // Formula (if any)
        if (item.formula) {
            doc.setFontSize(6);
            doc.text(item.formula, 120, yPos + 4);
        }

        // Value field
        doc.setFillColor(255, 255, 255);
        doc.rect(155, yPos, 35, 6, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(155, yPos, 35, 6);

        if (item.value) {
            doc.setFontSize(6);
            doc.text(item.value.toString(), 157, yPos + 4);
        }

        yPos += 7;
    });

     yPos += 8;
    // Note for Section A
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text('PINDAHKAN JUMLAH ANGSURAN PPh PASAL 25 TAHUN PAJAK BERIKUTNYA PADA NOMOR 11 KE INDUK BAGIAN H ANGKA 13 HURUF b', 12, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 10;

    // === B. PENGHITUNGAN PPh TERUTANG WAJIB PAJAK DAN SUAMI/ISTRI ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('B. PENGHITUNGAN PPh TERUTANG WAJIB PAJAK DAN SUAMI/ISTRI', 105, yPos + 4, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Two-column header for Section B
    doc.setFillColor(52, 84, 139);
    doc.rect(130, yPos, 30, 5, 'F');
    doc.rect(160, yPos, 30, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('WAJIB PAJAK', 145, yPos + 3.5, { align: 'center' });
    doc.text('SUAMI/ISTRI', 175, yPos + 3.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 6;

    // Section B calculation rows
    const sectionBItems = [
        { num: '1', text: 'PENGHASILAN BRUTO', wpValue: '', spouseValue: '' },
        { num: '2', text: 'PENGHASILAN NETO', wpValue: '', spouseValue: '' },
        { num: '3', text: 'PENGHASILAN NETO SETELAH DIKURANGI ZAKAT/SUMBANGAN KEAGAMAAN WAJIB DAN KOMPENSASI KERUGIAN', hasSub: true, wpValue: '', spouseValue: '', multiline: true },
        { num: '4', text: 'PENGHASILAN NETO SETELAH DIKURANGI ZAKAT/SUMBANGAN KEAGAMAAN WAJIB DAN KOMPENSASI KERUGIAN GABUNGAN', wpValue: '', isGabungan: true, multiline: true },
        { num: '5', text: 'PENGHASILAN TIDAK KENA PAJAK GABUNGAN', wpValue: '', isGabungan: true },
        { num: '6', text: 'PENGHASILAN KENA PAJAK GABUNGAN', wpValue: '', formula: '( 4 - 5 )', isGabungan: true },
        { num: '7', text: 'PPh TERUTANG GABUNGAN', wpValue: '', isGabungan: true },
        { num: '8', text: 'PPh TERUTANG YANG DITANGGUNG OLEH WAJIB PAJAK', formula: '( 3a : 4 ) x 7', wpValue: '', isGabungan: true },
        { num: '9', text: 'PPh TERUTANG YANG DITANGGUNG OLEH SUAMI/ISTRI', formula: '( 3b : 4 ) x 7', wpValue: '', isGabungan: true }
    ];

    sectionBItems.forEach(item => {
        const rowHeight = item.multiline ? 10 : 6;
        
        // Yellow number box
        doc.setFillColor(255, 193, 7);
        doc.rect(12, yPos, 8, rowHeight, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(12, yPos, 8, rowHeight);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item.num, 16, yPos + (rowHeight / 2) + 1.5, { align: 'center' });

        // Item text - split into multiple lines if needed
        doc.setFont('helvetica', 'normal');
        
        if (item.multiline) {
            // Split text manually for better control
            doc.setFontSize(5.5);
            if (item.num === '3') {
                doc.text('PENGHASILAN NETO SETELAH DIKURANGI ZAKAT/SUMBANGAN', 22, yPos + 3.5);
                doc.text('KEAGAMAAN WAJIB DAN KOMPENSASI KERUGIAN', 22, yPos + 7);
            } else if (item.num === '4') {
                doc.text('PENGHASILAN NETO SETELAH DIKURANGI ZAKAT/SUMBANGAN', 22, yPos + 3.5);
                doc.text('KEAGAMAAN WAJIB DAN KOMPENSASI KERUGIAN GABUNGAN', 22, yPos + 7);
            }
        } else {
            doc.setFontSize(6.5);
            doc.text(item.text, 22, yPos + 4);
        }

        // Sub-number boxes for item 3 (3a and 3b)
        if (item.hasSub) {
            // 3a box in Wajib Pajak column
            doc.setFillColor(255, 193, 7);
            doc.rect(130, yPos, 8, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(130, yPos, 8, rowHeight);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('3a', 134, yPos + (rowHeight / 2) + 1.5, { align: 'center' });

            // 3b box in Suami/Istri column
            doc.setFillColor(255, 193, 7);
            doc.rect(160, yPos, 8, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(160, yPos, 8, rowHeight);
            doc.text('3b', 164, yPos + (rowHeight / 2) + 1.5, { align: 'center' });

            // Value fields for 3a and 3b
            doc.setFillColor(255, 255, 255);
            doc.rect(138, yPos, 22, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(138, yPos, 22, rowHeight);

            if (item.wpValue) {
                doc.setFontSize(6);
                doc.setFont('helvetica', 'normal');
                doc.text(item.wpValue.toString(), 140, yPos + (rowHeight / 2) + 1.5);
            }

            doc.setFillColor(255, 255, 255);
            doc.rect(168, yPos, 22, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(168, yPos, 22, rowHeight);

            if (item.spouseValue) {
                doc.setFontSize(6);
                doc.text(item.spouseValue.toString(), 170, yPos + (rowHeight / 2) + 1.5);
            }
        } else if (item.isGabungan) {
            // Formula (if any)
            if (item.formula) {
                doc.setFontSize(6.5);
                doc.text(item.formula, 100, yPos + (rowHeight / 2) + 1.5);
            }

            // Single field spanning both columns for gabungan items
            doc.setFillColor(255, 255, 255);
            doc.rect(130, yPos, 60, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(130, yPos, 60, rowHeight);

            if (item.wpValue) {
                doc.setFontSize(6);
                doc.text(item.wpValue.toString(), 132, yPos + (rowHeight / 2) + 1.5);
            }
        } else {
            // Regular two-column layout for items 1 and 2
            // Wajib Pajak column
            doc.setFillColor(255, 255, 255);
            doc.rect(130, yPos, 30, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(130, yPos, 30, rowHeight);

            if (item.wpValue) {
                doc.setFontSize(6);
                doc.text(item.wpValue.toString(), 132, yPos + (rowHeight / 2) + 1.5);
            }

            // Suami/Istri column
            doc.setFillColor(255, 255, 255);
            doc.rect(160, yPos, 30, rowHeight, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(160, yPos, 30, rowHeight);

            if (item.spouseValue) {
                doc.setFontSize(6);
                doc.text(item.spouseValue.toString(), 162, yPos + (rowHeight / 2) + 1.5);
            }
        }

        yPos += rowHeight + 1;
    });

    yPos += 12;

    // Notes for Section B
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text('PINDAHKAN JUMLAH PPh TERUTANG YANG DITANGGUNG OLEH WAJIB PAJAK PADA NOMOR 8 KE INDUK BAGIAN C ANGKA 7 SPT WAJIB PAJAK', 12, yPos);
    yPos += 4;
    doc.text('PINDAHKAN JUMLAH PPh TERUTANG YANG DITANGGUNG OLEH SUAMI/ISTRI PADA NOMOR 9 KE INDUK BAGIAN C ANGKA 7 SPT SUAMI/ISTRI', 12, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 12;

    // === WAJIB PAJAK SECTION ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('WAJIB PAJAK', 105, yPos + 4, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // NIK/NPWP field for Wajib Pajak
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NIK/NPWP', 12, yPos + 3);
    for (let i = 0; i < 16; i++) {
        doc.rect(12 + (i * 8), yPos + 4, 7, 4);
        if (taxpayerData.nik && taxpayerData.nik[i]) {
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text(taxpayerData.nik[i], 14 + (i * 8), yPos + 7);
        }
    }

    // NAMA field for Wajib Pajak
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAMA', 12, yPos + 11);
    doc.rect(30, yPos + 10, 80, 4, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(30, yPos + 10, 80, 4);
    if (taxpayerData.name) {
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text(taxpayerData.name, 32, yPos + 13);
    }

    // NAMA DAN TTD field
    doc.setFillColor(255, 255, 255);
    doc.rect(120, yPos + 4, 70, 10, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(120, yPos + 4, 70, 10);
    doc.setFillColor(52, 84, 139);
    doc.rect(120, yPos + 4, 70, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAMA DAN TTD', 155, yPos + 6.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    yPos += 18;

    // === SUAMI/ISTRI SECTION ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SUAMI/ISTRI', 105, yPos + 4, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // NIK/NPWP field for Suami/Istri
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NIK/NPWP', 12, yPos + 3);
    for (let i = 0; i < 16; i++) {
        doc.rect(12 + (i * 8), yPos + 4, 7, 4);
        if (taxpayerData.spouse_nik && taxpayerData.spouse_nik[i]) {
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text(taxpayerData.spouse_nik[i], 14 + (i * 8), yPos + 7);
        }
    }

    // NAMA field for Suami/Istri
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAMA', 12, yPos + 11);
    doc.rect(30, yPos + 10, 80, 4, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(30, yPos + 10, 80, 4);
    if (taxpayerData.spouse_name) {
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.text(taxpayerData.spouse_name, 32, yPos + 13);
    }

    // NAMA DAN TTD field
    doc.setFillColor(255, 255, 255);
    doc.rect(120, yPos + 4, 70, 10, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(120, yPos + 4, 70, 10);
    doc.setFillColor(52, 84, 139);
    doc.rect(120, yPos + 4, 70, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAMA DAN TTD', 155, yPos + 6.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Footer
    yPos += 25;
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 4 - PENGHITUNGAN ANGSURAN PPh PASAL 25 DAN PPh TERUTANG WAJIB PAJAK DAN SUAMI/ISTRI', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 4);
    }
    doc.setTextColor(0, 0, 0);
};

const addLampiran5 = (doc, sptData) => {
    doc.addPage();
    let yPos = 15;

    // Parse data
    const detailData = JSON.parse(sptData.detail || '{}');
    const l5Data = detailData.l5_data || {};
    const fiscalLossCompensation = l5Data.fiscal_loss_compensation || [];
    const netIncomeDeduction = l5Data.net_income_deduction || [];
    const incomeTaxDeduction = l5Data.income_tax_deduction || [];
    const taxpayerData = sptData.taxpayer_identity || {};

    // Debug: Log data to check if it's loaded correctly
    console.log('L5 Data:', l5Data);
    console.log('Fiscal Loss Compensation:', fiscalLossCompensation);
    console.log('Net Income Deduction:', netIncomeDeduction);
    console.log('Income Tax Deduction:', incomeTaxDeduction);

    // === IMPROVED HEADER ===
    // Main header box with better proportions
    doc.setFillColor(173, 216, 230);
    doc.rect(10, yPos, 190, 22, 'F');
    doc.rect(10, yPos, 190, 22);

    // PERHATIAN text section - improved readability
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PERHATIAN', 12, yPos + 4);
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'normal');
    doc.text('LAMPIRAN INI DIISI OLEH WAJIB PAJAK YANG', 12, yPos + 8);
    doc.text('MENGAKUI KOMPENSASI KERUGIAN FISKAL,', 12, yPos + 11);
    doc.text('PENGURANG PENGHASILAN NETO, DAN/ATAU', 12, yPos + 14);
    doc.text('PENGURANG PPh TERUTANG', 12, yPos + 17);

    // Center sections A, B, C - improved layout
    doc.setFillColor(52, 84, 139);
    doc.rect(65, yPos + 2, 100, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('A. PENGHITUNGAN KOMPENSASI KERUGIAN FISKAL', 115, yPos + 7, { align: 'center' });
    doc.text('B. PENGURANG PENGHASILAN NETO', 115, yPos + 11, { align: 'center' });
    doc.text('C. PENGURANG PPh TERUTANG', 115, yPos + 15, { align: 'center' });

    // LAMPIRAN 5 box - improved size and position
    doc.setFillColor(255, 193, 7);
    doc.rect(170, yPos + 2, 28, 10, 'F');
    doc.rect(170, yPos + 2, 28, 10);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('LAMPIRAN 5', 184, yPos + 8, { align: 'center' });

    // NIK/NPWP - improved layout
    doc.setFontSize(5);
    doc.text('NIK/NPWP', 170, yPos + 15);
    for (let i = 0; i < 16; i++) {
        doc.rect(170 + (i * 1.8), yPos + 16, 1.6, 3);
        if (taxpayerData.nik && taxpayerData.nik[i]) {
            doc.setFontSize(4);
            doc.text(taxpayerData.nik[i], 170.2 + (i * 1.8), yPos + 17.8);
        }
    }

    // TAHUN PAJAK - improved layout
    // doc.setFontSize(5);
    // doc.text('TAHUN PAJAK', 170, yPos + 21);
    // const taxYear = l5Data.header?.periodYear || '2023';
    // for (let i = 0; i < 4; i++) {
    //     doc.rect(170 + (i * 2.2), yPos + 22, 2, 3);
    //     if (taxYear[i]) {
    //         doc.setFontSize(4);
    //         doc.text(taxYear[i], 170.3 + (i * 2.2), yPos + 24);
    //     }
    // }

    yPos += 30;

    // === A. PENGHITUNGAN KOMPENSASI KERUGIAN FISKAL ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('A. PENGHITUNGAN KOMPENSASI KERUGIAN FISKAL', 12, yPos + 4);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Improved responsive column widths for Table A
    const colWidthsA = [10, 25, 20, 18, 18, 18, 18, 18, 25, 25];

    // First header row - main headers with better spacing
    let currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    // NO column
    doc.rect(currentX, yPos, colWidthsA[0], 12, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(currentX, yPos, colWidthsA[0], 12);
    doc.setFontSize(4);
    doc.setFont('helvetica', 'bold');
    doc.text('(1)', currentX + (colWidthsA[0] / 2), yPos + 3, { align: 'center' });
    doc.text('NO', currentX + (colWidthsA[0] / 2), yPos + 8, { align: 'center' });
    currentX += colWidthsA[0];

    // LABA/RUGI NETO FISKAL - improved header
    doc.rect(currentX, yPos, colWidthsA[1] + colWidthsA[2], 6, 'F');
    doc.rect(currentX, yPos, colWidthsA[1] + colWidthsA[2], 6);
    doc.setFontSize(5);
    doc.text('LABA/RUGI NETO FISKAL', currentX + ((colWidthsA[1] + colWidthsA[2]) / 2), yPos + 3.5, { align: 'center' });

    // Sub-headers for LABA/RUGI
    doc.rect(currentX, yPos + 6, colWidthsA[1], 6, 'F');
    doc.rect(currentX, yPos + 6, colWidthsA[1], 6);
    doc.setFontSize(4);
    doc.text('(2)', currentX + (colWidthsA[1] / 2), yPos + 7.5, { align: 'center' });
    doc.text('TAHUN PAJAK', currentX + (colWidthsA[1] / 2), yPos + 10.5, { align: 'center' });
    currentX += colWidthsA[1];

    doc.rect(currentX, yPos + 6, colWidthsA[2], 6, 'F');
    doc.rect(currentX, yPos + 6, colWidthsA[2], 6);
    doc.text('(3)', currentX + (colWidthsA[2] / 2), yPos + 7.5, { align: 'center' });
    doc.text('RUPIAH', currentX + (colWidthsA[2] / 2), yPos + 10.5, { align: 'center' });
    currentX += colWidthsA[2];

    // KOMPENSASI KERUGIAN FISKAL (6 columns) - improved header
    const compensationWidth = colWidthsA[3] + colWidthsA[4] + colWidthsA[5] + colWidthsA[6] + colWidthsA[7] + colWidthsA[8];
    doc.rect(currentX, yPos, compensationWidth, 6, 'F');
    doc.rect(currentX, yPos, compensationWidth, 6);
    doc.setFontSize(5);
    doc.text('KOMPENSASI KERUGIAN FISKAL', currentX + (compensationWidth / 2), yPos + 3.5, { align: 'center' });

    // Sub-columns for years with improved readability
    const yearNumbers = ['(4)', '(5)', '(6)', '(7)', '(8)', '(9)'];
    const yearLabels = ['TAHUN', 'TAHUN', 'TAHUN', 'TAHUN', 'TAHUN', 'TAHUN'];

    for (let i = 0; i < 6; i++) {
        doc.rect(currentX, yPos + 6, colWidthsA[3 + i], 6, 'F');
        doc.rect(currentX, yPos + 6, colWidthsA[3 + i], 6);
        doc.setFontSize(3.5);
        doc.text(yearNumbers[i], currentX + (colWidthsA[3 + i] / 2), yPos + 8, { align: 'center' });
        doc.text(yearLabels[i], currentX + (colWidthsA[3 + i] / 2), yPos + 11, { align: 'center' });
        currentX += colWidthsA[3 + i];
    }

    yPos += 12;

    // Data rows for fiscal loss compensation with improved font sizes
    fiscalLossCompensation.forEach((item, index) => {
        if (item.checked !== false) {
            currentX = 10;

            const rowData = [
                item.no || (index + 1).toString(),
                item.taxYear || '',
                item.amountRupiah || '',
                item.year2018 || '',
                item.year2019 || '',
                item.year2020 || '',
                item.year2021 || '',
                item.year2022 || '',
                item.currentYear || '',
                item.followingYear || ''
            ];

            for (let i = 0; i < rowData.length; i++) {
                doc.setFillColor(255, 255, 255);
                doc.rect(currentX, yPos, colWidthsA[i], 6, 'F');
                doc.setDrawColor(0, 0, 0);
                doc.rect(currentX, yPos, colWidthsA[i], 6);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(4);
                doc.setFont('helvetica', 'normal');

                if (rowData[i]) {
                    const text = rowData[i].toString();
                    const maxLen = Math.floor(colWidthsA[i] / 2);
                    const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                    doc.text(displayText, currentX + 1, yPos + 4);
                }
                currentX += colWidthsA[i];
            }
            yPos += 6;
        }
    });

    // Add JUMLAH TABEL A row with improved styling
    currentX = 10;
    doc.setFillColor(255, 193, 7);
    doc.rect(currentX + colWidthsA[0] + colWidthsA[1] + colWidthsA[2] + colWidthsA[3] + colWidthsA[4] + colWidthsA[5] + colWidthsA[6] + colWidthsA[7], yPos, colWidthsA[8], 6, 'F');
    doc.rect(currentX + colWidthsA[0] + colWidthsA[1] + colWidthsA[2] + colWidthsA[3] + colWidthsA[4] + colWidthsA[5] + colWidthsA[6] + colWidthsA[7], yPos, colWidthsA[8], 6);
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('JUMLAH TABEL A', currentX + colWidthsA[0] + colWidthsA[1] + colWidthsA[2] + colWidthsA[3] + colWidthsA[4] + colWidthsA[5] + colWidthsA[6] + colWidthsA[7] + (colWidthsA[8] / 2), yPos + 4, { align: 'center' });

    yPos += 8;

    // Note for Section A with improved readability
    doc.setFontSize(4);
    doc.setTextColor(0, 0, 0);
    doc.text('PINDAHKAN JUMLAH TABEL A KOLOM (8) KE LAMPIRAN INI BAGIAN B BARIS 6 KOLOM (4)', 12, yPos);
    yPos += 10;

    // === B. PENGURANG PENGHASILAN NETO ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('B. PENGURANG PENGHASILAN NETO', 12, yPos + 4);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Improved responsive column widths for Table B
    const colWidthsB = [12, 25, 100, 53];

    // Draw header for Table B with improved styling
    currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    const headersB = ['NO', 'KODE', 'JENIS\nPENGURANG PENGHASILAN NETO', 'JUMLAH\nPENGURANG PENGHASILAN NETO'];

    for (let i = 0; i < headersB.length; i++) {
        doc.rect(currentX, yPos, colWidthsB[i], 8, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsB[i], 8);

        // Column numbers
        doc.setFontSize(4);
        doc.text(`(${i + 1})`, currentX + (colWidthsB[i] / 2), yPos + 2, { align: 'center' });

        // Header text with improved line spacing
        const headerLines = headersB[i].split('\n');
        doc.setFontSize(4.5);
        doc.setFont('helvetica', 'bold');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidthsB[i] / 2), yPos + 4.5 + (lineIndex * 2), { align: 'center' });
        });
        currentX += colWidthsB[i];
    }
    yPos += 8;

    // Add rows for net income deduction with improved font size
    for (let rowNum = 1; rowNum <= 7; rowNum++) {
        currentX = 10;

        // Special handling for row 6 (JUMLAH KOMPENSASI KERUGIAN FISKAL)
        if (rowNum === 6) {
            const rowData = [
                '6',
                'B.6',
                'JUMLAH KOMPENSASI KERUGIAN FISKAL',
                '' // Will be filled from Table A calculation
            ];

            for (let i = 0; i < rowData.length; i++) {
                if (i === 2) {
                    // Special styling for row 6
                    doc.setFillColor(255, 193, 7);
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                doc.rect(currentX, yPos, colWidthsB[i], 6, 'F');
                doc.setDrawColor(0, 0, 0);
                doc.rect(currentX, yPos, colWidthsB[i], 6);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(4);
                doc.setFont('helvetica', 'normal');

                if (rowData[i]) {
                    doc.text(rowData[i], currentX + 1, yPos + 4);
                }
                currentX += colWidthsB[i];
            }
        } else {
            // Regular data rows
            const dataItem = netIncomeDeduction[rowNum - 1] || {};

            const rowData = [
                rowNum.toString(),
                dataItem.code || '',
                dataItem.typeOfDeduction || '',
                dataItem.amountOfDeduction || ''
            ];

            for (let i = 0; i < rowData.length; i++) {
                doc.setFillColor(255, 255, 255);
                doc.rect(currentX, yPos, colWidthsB[i], 6, 'F');
                doc.setDrawColor(0, 0, 0);
                doc.rect(currentX, yPos, colWidthsB[i], 6);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(4);
                doc.setFont('helvetica', 'normal');

                if (rowData[i]) {
                    const text = rowData[i].toString();
                    const maxLen = Math.floor(colWidthsB[i] / 2.5);
                    const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                    doc.text(displayText, currentX + 1, yPos + 4);
                }
                currentX += colWidthsB[i];
            }
        }
        yPos += 6;
    }

    // JUMLAH TABEL B with improved styling
    currentX = 10;
    doc.setFillColor(255, 193, 7);
    doc.rect(currentX + colWidthsB[0] + colWidthsB[1] + colWidthsB[2], yPos, colWidthsB[3], 6, 'F');
    doc.rect(currentX + colWidthsB[0] + colWidthsB[1] + colWidthsB[2], yPos, colWidthsB[3], 6);
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('JUMLAH TABEL B', 12, yPos + 4);
    doc.text('B.+', currentX + colWidthsB[0] + colWidthsB[1] + colWidthsB[2] + (colWidthsB[3] / 2), yPos + 4, { align: 'center' });

    yPos += 8;

    // Note for Section B
    doc.setFontSize(4);
    doc.setTextColor(0, 0, 0);
    doc.text('PINDAHKAN JUMLAH TABEL B BAGIAN B (+) KE INDUK BAGIAN B ANGKA 3', 12, yPos);
    yPos += 10;

    // === C. PENGURANG PPh TERUTANG ===
    doc.setFillColor(52, 84, 139);
    doc.rect(10, yPos, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('C. PENGURANG PPh TERUTANG', 12, yPos + 4);
    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Improved responsive column widths for Table C
    const colWidthsC = [12, 25, 100, 53];
    const headersC = ['NO', 'KODE', 'JENIS\nPENGURANG PPh TERUTANG', 'JUMLAH\nPENGURANG PPh TERUTANG'];

    // Draw header for Table C with improved styling
    currentX = 10;
    doc.setFillColor(220, 220, 220);
    doc.setTextColor(0, 0, 0);

    for (let i = 0; i < headersC.length; i++) {
        doc.rect(currentX, yPos, colWidthsC[i], 8, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(currentX, yPos, colWidthsC[i], 8);

        // Column numbers
        doc.setFontSize(4);
        doc.text(`(${i + 1})`, currentX + (colWidthsC[i] / 2), yPos + 2, { align: 'center' });

        // Header text with improved line spacing
        const headerLines = headersC[i].split('\n');
        doc.setFontSize(4.5);
        doc.setFont('helvetica', 'bold');
        headerLines.forEach((line, lineIndex) => {
            doc.text(line, currentX + (colWidthsC[i] / 2), yPos + 4.5 + (lineIndex * 2), { align: 'center' });
        });
        currentX += colWidthsC[i];
    }
    yPos += 8;

    // Add rows for income tax deduction with improved font size
    for (let rowNum = 1; rowNum <= 6; rowNum++) {
        currentX = 10;

        const dataItem = incomeTaxDeduction[rowNum - 1] || {};

        const rowData = [
            rowNum.toString(),
            dataItem.code || '',
            dataItem.typeOfPPh || '',
            dataItem.amountOfPPh || ''
        ];

        for (let i = 0; i < rowData.length; i++) {
            doc.setFillColor(255, 255, 255);
            doc.rect(currentX, yPos, colWidthsC[i], 6, 'F');
            doc.setDrawColor(0, 0, 0);
            doc.rect(currentX, yPos, colWidthsC[i], 6);

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(4);
            doc.setFont('helvetica', 'normal');

            if (rowData[i]) {
                const text = rowData[i].toString();
                const maxLen = Math.floor(colWidthsC[i] / 2.5);
                const displayText = text.length > maxLen ? text.substring(0, maxLen - 2) + '..' : text;
                doc.text(displayText, currentX + 1, yPos + 4);
            }
            currentX += colWidthsC[i];
        }
        yPos += 6;
    }

    // JUMLAH TABEL C with improved styling
    currentX = 10;
    doc.setFillColor(255, 193, 7);
    doc.rect(currentX + colWidthsC[0] + colWidthsC[1] + colWidthsC[2], yPos, colWidthsC[3], 6, 'F');
    doc.rect(currentX + colWidthsC[0] + colWidthsC[1] + colWidthsC[2], yPos, colWidthsC[3], 6);
    doc.setFontSize(4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('JUMLAH TABEL C', 12, yPos + 4);
    doc.text('C', currentX + colWidthsC[0] + colWidthsC[1] + colWidthsC[2] + (colWidthsC[3] / 2), yPos + 4, { align: 'center' });

    yPos += 8;

    // Note for Section C
    doc.setFontSize(4);
    doc.setTextColor(0, 0, 0);
    doc.text('PINDAHKAN JUMLAH TABEL C KE INDUK BAGIAN C ANGKA 8', 12, yPos);

    // Footer with improved styling
    yPos += 12;
    doc.setFontSize(4);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 5 - KOMPENSASI KERUGIAN FISKAL, PENGURANG PENGHASILAN NETO, DAN PENGURANG PPh TERUTANG', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 4);
    }
    doc.setTextColor(0, 0, 0);
};

const generateCompleteSPTPDF = (sptData) => {
    console.log('Generating Complete SPT PDF with Lampiran 1:', JSON.parse(sptData?.detail));

    // === FUNGSI HELPER UNTUK RESPONSIVE HEADER ===
    const createResponsiveHeader = (doc, pageNumber, yPos, sptData) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const headerWidth = pageWidth - (margin * 2);
        const fonts = PDFHelpers.getFontSizes();

        // Header height yang lebih tinggi untuk menampung NIK/NPWP
        const headerHeight = 50;

        // Background header
        doc.setFillColor(...PDFHelpers.colors.lightBlue);
        doc.rect(margin, yPos, headerWidth, headerHeight, 'F');
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, yPos, headerWidth, headerHeight);

        // === RIGHT SECTION - LAMPIRAN BOX (dibuat dulu untuk menentukan posisi) ===
        const lampBoxWidth = 60; // Fixed width yang lebih besar
        const lampBoxHeight = 25; // Tinggi yang proporsional
        const lampBoxX = pageWidth - margin - lampBoxWidth - 2;

        // Yellow box untuk LAMPIRAN
        doc.setFillColor(...PDFHelpers.colors.yellow);
        doc.rect(lampBoxX, yPos + 5, lampBoxWidth, lampBoxHeight, 'F');
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.rect(lampBoxX, yPos + 5, lampBoxWidth, lampBoxHeight);

        // Text dalam box - lebih besar dan centered
        doc.setFontSize(fonts.medium);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('LAMPIRAN 1', lampBoxX + (lampBoxWidth / 2), yPos + 15, { align: 'center' });
        doc.text(`HALAMAN ${pageNumber}`, lampBoxX + (lampBoxWidth / 2), yPos + 22, { align: 'center' });

        // === LEFT SECTION - PERHATIAN ===
        const leftMargin = margin + 3;
        const leftSectionWidth = lampBoxX - leftMargin - 10; // Width sampai sebelum legend

        doc.setFontSize(fonts.small);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('PERHATIAN', leftMargin, yPos + 7);

        const instructionText = 'LAMPIRAN INI DIISI OLEH WAJIB PAJAK UNTUK MELAPORKAN HARTA, UTANG, DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN, PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN, DAN/ATAU BUKTI PEMOTONGAN/PEMUNGUTAN PPh';

        // Instruction text width - responsive tapi lebih lebar
        const instructionWidth = Math.min(leftSectionWidth * 0.6, 120);

        doc.setFontSize(fonts.tiny);
        doc.setFont('helvetica', 'normal');
        const instructionLines = doc.splitTextToSize(instructionText, instructionWidth);
        let maxLines = Math.floor((headerHeight - 25) / 3); // Adjust for NIK/NPWP space

        instructionLines.slice(0, maxLines).forEach((line, index) => {
            doc.text(line, leftMargin, yPos + 11 + (index * 3));
        });

        // === CENTER SECTION - LEGEND ===
        const legendX = leftMargin + instructionWidth + 15;
        const legendWidth = lampBoxX - legendX - 10;

        const legendItems = [
            'A. HARTA PADA AKHIR TAHUN PAJAK',
            'B. UTANG PADA AKHIR TAHUN PAJAK',
            'C. DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN',
            'D. PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN',
            'E. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh'
        ];

        doc.setFontSize(fonts.tiny);
        doc.setFont('helvetica', 'bold');

        // Tampilkan legend dengan spacing yang baik
        legendItems.forEach((item, index) => {
            const legendY = yPos + 9 + (index * 3.5);
            if (legendY < yPos + headerHeight - 15) { // Leave space for NIK/NPWP
                // Potong text jika terlalu panjang untuk legend width
                const legendText = doc.getTextWidth(item) > legendWidth ?
                    doc.splitTextToSize(item, legendWidth)[0] : item;
                doc.text(legendText, legendX, legendY);
            }
        });

        // === NIK/NPWP DAN TAHUN PAJAK - TETAP DI DALAM HEADER BIRU ===
        const taxpayerData = sptData.taxpayer_identity || {};
        const taxYear = sptData.tax_year || '2024';

        // Posisi field di dalam header biru, di bawah yellow box
        const fieldStartY = yPos + lampBoxHeight + 8;
        const fieldSize = 3;
        const fieldSpacing = 3.5;

        // NIK/NPWP
        doc.setFontSize(fonts.tiny);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text('NIK/NPWP', lampBoxX, fieldStartY);

        // Input fields untuk NIK/NPWP - dalam satu baris
        const availableWidth = lampBoxWidth;
        const maxNikFields = Math.floor(availableWidth / fieldSpacing);
        for (let i = 0; i < Math.min(16, maxNikFields); i++) {
            const fieldX = lampBoxX + (i * fieldSpacing);
            if (fieldX + fieldSize <= lampBoxX + lampBoxWidth) {
                PDFHelpers.addInputField(doc, fieldX, fieldStartY + 2, fieldSize, fieldSize);
            }
        }

        // TAHUN PAJAK
        const taxYearY = fieldStartY + 8;
        doc.text('TAHUN PAJAK', lampBoxX, taxYearY);

        // Input fields untuk tahun - hanya 4 field
        for (let i = 0; i < 4; i++) {
            const fieldX = lampBoxX + (i * fieldSpacing);
            PDFHelpers.addInputField(doc, fieldX, taxYearY + 2, fieldSize, fieldSize);
            if (taxYear[i]) {
                doc.setFontSize(fonts.tiny);
                doc.text(taxYear[i], fieldX + 1.5, taxYearY + 4.5);
            }
        }

        return yPos + headerHeight + 8;
    };

    // Start with main SPT
    const doc = generateSPTPDF(sptData);

    // Parse detail data for Lampiran 1
    const detailData = JSON.parse(sptData.detail || '{}');
    const l1_assets = detailData.l1_assets || {};

    // Add new page for Lampiran 1
    doc.addPage();
    let yPos = PDFHelpers.getPageDimensions().margin.top;

    // === LAMPIRAN 1 HEADER HALAMAN 1 - RESPONSIVE ===
    yPos = createResponsiveHeader(doc, 1, yPos, sptData);

    const pageWidth = doc.internal.pageSize.getWidth();
    const headerWidth = pageWidth - 20;
    const fonts = PDFHelpers.getFontSizes();

    // === A. HARTA PADA AKHIR TAHUN PAJAK ===
    yPos = PDFHelpers.addBlueHeader(doc, 'A. HARTA PADA AKHIR TAHUN PAJAK', yPos);

    // 1. KAS DAN SETARA KAS
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('1. KAS DAN SETARA KAS', 12, yPos + 3);

    const kasHeaders = ['KODE', 'DESKRIPSI', 'NOMOR AKUN', 'ATAS NAMA', 'NAMA BANK/INSTITUSI', 'LOKASI HARTA', 'TAHUN PEROLEHAN', 'SALDO', 'KETERANGAN'];
    const kasWidths = PDFHelpers.calculateColumnWidths(kasHeaders, headerWidth - 2);

    yPos += 6;
    yPos = PDFHelpers.addTableHeader(doc, kasHeaders, 12, yPos, kasWidths);

    // Add empty rows for kas
    const kasData = l1_assets.cash_and_cash_equivalents || [];
    if (kasData.length === 0) {
        for (let i = 0; i < 3; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(9).fill(''), 12, yPos, kasWidths);
        }
    } else {
        kasData.forEach(item => {
            const rowData = [
                item.code || '',
                item.description || '',
                item.account_number || '',
                item.account_name || '',
                item.bank_name || '',
                item.location || '',
                item.year_of_acquisition || '',
                PDFHelpers.formatCurrency(item.balance),
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, kasWidths);
        });
    }

    // JUMLAH TABEL 1
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, '1');
    yPos += 8;

    // 2. PIUTANG
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 20);
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('2. PIUTANG', 12, yPos + 3);

    const piutangHeaders = ['KODE', 'DESKRIPSI', 'LOKASI PENERIMA PINJAMAN', 'PENERIMA PINJAMAN', 'NILAI PIUTANG', 'TAHUN DIMULAI', 'SALDO PIUTANG SAAT INI', 'KETERANGAN'];
    const piutangWidths = PDFHelpers.calculateColumnWidths(piutangHeaders, headerWidth - 2);

    yPos += 6;
    yPos = PDFHelpers.addTableHeader(doc, piutangHeaders, 12, yPos, piutangWidths);

    // Add rows for piutang with NIK/NPWP fields
    const piutangData = l1_assets.account_receivable || [];
    if (piutangData.length === 0) {
        for (let i = 0; i < 3; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(8).fill(''), 12, yPos, piutangWidths);
            // Add NIK/NPWP sub-fields
            doc.setFontSize(fonts.tiny);
            doc.text('NIK/NPWP:', 37, yPos - 4);
            doc.text('NAMA:', 37, yPos - 2);
            doc.setFontSize(fonts.small);
        }
    } else {
        piutangData.forEach(item => {
            const rowData = [
                item.code || '',
                item.description || '',
                item.debtor_location || '',
                item.debtor_name || '',
                PDFHelpers.formatCurrency(item.debt_amount),
                item.year_started || '',
                PDFHelpers.formatCurrency(item.current_balance),
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, piutangWidths);
        });
    }

    // JUMLAH TABEL 2
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, '2');
    yPos += 8;

    // 3. INVESTASI/SEKURITAS
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 20);
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('3. INVESTASI/SEKURITAS', 12, yPos + 3);

    const investasiHeaders = ['KODE', 'DESKRIPSI', 'LOKASI HARTA', 'BANK/INSTITUSI/PENERIMA INVESTASI', 'NOMOR AKUN', 'HARGA PEROLEHAN', 'TAHUN PEROLEHAN', 'NILAI SAAT INI', 'KETERANGAN'];
    const investasiWidths = PDFHelpers.calculateColumnWidths(investasiHeaders, headerWidth - 2);

    yPos += 6;
    yPos = PDFHelpers.addTableHeader(doc, investasiHeaders, 12, yPos, investasiWidths);

    // Add rows for investments
    const investmentData = l1_assets.investments_securities || [];
    if (investmentData.length === 0) {
        for (let i = 0; i < 3; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(9).fill(''), 12, yPos, investasiWidths);
            // Add NPWP/NAMA sub-fields
            doc.setFontSize(fonts.tiny);
            doc.text('NPWP:', 52, yPos - 4);
            doc.text('NAMA:', 52, yPos - 2);
            doc.setFontSize(fonts.small);
        }
    } else {
        investmentData.forEach(item => {
            const rowData = [
                item.code || '',
                item.description || '',
                item.location || '',
                item.institution_name || '',
                item.account_number || '',
                PDFHelpers.formatCurrency(item.acquisition_cost),
                item.year_of_acquisition || '',
                PDFHelpers.formatCurrency(item.current_value),
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, investasiWidths);
        });
    }

    // JUMLAH TABEL 3
    PDFHelpers.addYellowBox(doc, pageWidth - 45, yPos, 15, 4, '3.6');
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, '3.8');
    yPos += 8;

    // Check if we need a new page
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 25);

    // 4. HARTA BERGERAK
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('4. HARTA BERGERAK', 12, yPos + 3);

    const hartaBergerakHeaders = ['KODE', 'DESKRIPSI', 'NOMOR POLISI/REGISTRASI', 'KEPEMILIKAN', 'TAHUN PEROLEHAN', 'HARGA PEROLEHAN', 'NILAI SAAT INI', 'KETERANGAN'];
    const hartaBergerakWidths = PDFHelpers.calculateColumnWidths(hartaBergerakHeaders, headerWidth - 2);

    yPos += 6;
    yPos = PDFHelpers.addTableHeader(doc, hartaBergerakHeaders, 12, yPos, hartaBergerakWidths);

    // Add movable assets data
    const movableAssets = l1_assets.movable_assets || [];
    if (movableAssets.length === 0) {
        for (let i = 0; i < 5; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(8).fill(''), 12, yPos, hartaBergerakWidths);
            // Add ownership checkboxes
            doc.setFontSize(fonts.tiny);
            doc.text('☐ ATAS NAMA SENDIRI', 32, yPos - 4);
            doc.text('☐ ATAS NAMA PIHAK LAIN', 32, yPos - 2);
            doc.text('NIK/NPWP:', 32, yPos - 0.5);
            doc.text('NAMA:', 50, yPos - 0.5);
            doc.setFontSize(fonts.small);
        }
    } else {
        movableAssets.forEach(item => {
            const rowData = [
                item.code || '',
                item.description_type + ' ' + (item.description_merk_model || ''),
                item.police_registration_number || '',
                item.ownership || '',
                item.year_of_acquisition || '',
                PDFHelpers.formatCurrency(item.cost_of_acquisition),
                PDFHelpers.formatCurrency(item.fair_market_value),
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, hartaBergerakWidths);
        });
    }

    // JUMLAH TABEL 4
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, '4');
    yPos += 12;

    // === HALAMAN 2 ===
    doc.addPage();
    yPos = 20;

    // === LAMPIRAN 1 HEADER HALAMAN 2 - RESPONSIVE ===
    yPos = createResponsiveHeader(doc, 2, yPos, sptData);

    // Continue with remaining sections from Lampiran 1
    // 5. HARTA TIDAK BERGERAK, 6. HARTA LAINNYA, B. UTANG, etc.
    yPos = PDFHelpers.addBlueHeader(doc, 'A. HARTA PADA AKHIR TAHUN PAJAK (LANJUTAN)', yPos);

    // 5. HARTA TIDAK BERGERAK
    doc.setFontSize(fonts.small);
    doc.setFont('helvetica', 'bold');
    doc.text('5. HARTA TIDAK BERGERAK', 12, yPos + 3);

    const hartaTidakBergerakHeaders = ['KODE', 'DESKRIPSI', 'LOKASI HARTA', 'UKURAN PROPERTI', 'SUMBER KEPEMILIKAN', 'NOMOR SERTIFIKAT', 'TAHUN PEROLEHAN', 'HARGA PEROLEHAN', 'NILAI SAAT INI', 'KETERANGAN'];
    const hartaTidakBergerakWidths = PDFHelpers.calculateColumnWidths(hartaTidakBergerakHeaders, headerWidth - 2);

    yPos += 6;
    yPos = PDFHelpers.addTableHeader(doc, hartaTidakBergerakHeaders, 12, yPos, hartaTidakBergerakWidths);

    // Add immovable assets data
    const immovableAssets = l1_assets.non_movable_assets || [];
    if (immovableAssets.length === 0) {
        for (let i = 0; i < 5; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(10).fill(''), 12, yPos, hartaTidakBergerakWidths);
            // Add property size sub-fields
            doc.setFontSize(fonts.tiny);
            doc.text('TANAH:', 43, yPos - 4);
            doc.text('BANGUNAN:', 43, yPos - 2);
            doc.setFontSize(fonts.small);
        }
    } else {
        immovableAssets.forEach(item => {
            const rowData = [
                item.code || '',
                item.description || '',
                item.location_of_asset || '',
                (item.property_size_land || '') + '/' + (item.property_size_building || ''),
                item.source_of_ownership || '',
                item.certificate_number || '',
                item.year_of_acquisition || '',
                PDFHelpers.formatCurrency(item.cost_of_acquisition),
                PDFHelpers.formatCurrency(item.fair_market_value),
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, hartaTidakBergerakWidths);
        });
    }

    // JUMLAH TABEL 5
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, '5');
    yPos += 8;

    // === B. UTANG PADA AKHIR TAHUN PAJAK ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 25);
    yPos = PDFHelpers.addBlueHeader(doc, 'B. UTANG PADA AKHIR TAHUN PAJAK', yPos);

    const utangHeaders = ['KODE', 'DESKRIPSI', 'KREDITOR', 'NEGARA KREDITOR', 'TAHUN PEMINJAMAN', 'SALDO', 'KETERANGAN'];
    const utangWidths = PDFHelpers.calculateColumnWidths(utangHeaders, headerWidth - 2);

    yPos = PDFHelpers.addTableHeader(doc, utangHeaders, 12, yPos, utangWidths);

    // Add debt data
    const debtData = l1_assets.debt_at_end_of_year || [];
    if (debtData.length === 0) {
        for (let i = 0; i < 8; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(7).fill(''), 12, yPos, utangWidths);
            // Add NIK/NPWP sub-fields
            doc.setFontSize(fonts.tiny);
            doc.text('NIK/NPWP:', 47, yPos - 4);
            doc.text('NAMA:', 47, yPos - 2);
            doc.setFontSize(fonts.small);
        }
    } else {
        debtData.forEach(item => {
            const rowData = [
                item.code || '',
                item.description || '',
                item.creditor_name || '',
                item.country_of_creditor || '',
                item.year_of_acquisition || '',
                PDFHelpers.formatCurrency(item.balance_of_debt),
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, utangWidths);
        });
    }

    // JUMLAH TABEL 8
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, '8');
    yPos += 10;

    // === C. DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 20);
    yPos = PDFHelpers.addBlueHeader(doc, 'C. DAFTAR ANGGOTA KELUARGA YANG MENJADI TANGGUNGAN', yPos);

    const familyHeaders = ['NO', 'NIK/NPWP', 'NAMA', 'TANGGAL LAHIR', 'HUBUNGAN KELUARGA', 'KETERANGAN'];
    const familyWidths = PDFHelpers.calculateColumnWidths(familyHeaders, headerWidth - 2);

    yPos = PDFHelpers.addTableHeader(doc, familyHeaders, 12, yPos, familyWidths);

    // Add family member data
    const familyData = l1_assets.family_dependents || [];
    if (familyData.length === 0) {
        for (let i = 0; i < 5; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(6).fill(''), 12, yPos, familyWidths);
        }
    } else {
        familyData.forEach((item, index) => {
            const rowData = [
                (index + 1).toString(),
                item.nik_npwp || '',
                item.name || '',
                item.birth_date || '',
                item.family_relationship || '',
                item.remark || ''
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, familyWidths);
        });
    }

    yPos += 10;

    // === HALAMAN 3 ===
    doc.addPage();
    yPos = 20;

    // === LAMPIRAN 1 HEADER HALAMAN 3 - RESPONSIVE ===
    yPos = createResponsiveHeader(doc, 3, yPos, sptData);

    // === D. PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN ===
    yPos = PDFHelpers.addBlueHeader(doc, 'D. PENGHASILAN NETO DALAM NEGERI DARI PEKERJAAN', yPos);

    const employmentHeaders = ['NO', 'NAMA PEMBERI KERJA', 'NOMOR IDENTITAS PEMBERI KERJA', 'PENGHASILAN BRUTO', 'PENGURANG PENGHASILAN BRUTO/BIAYA', 'PENGHASILAN NETO'];
    const employmentWidths = PDFHelpers.calculateColumnWidths(employmentHeaders, headerWidth - 2);

    yPos = PDFHelpers.addTableHeader(doc, employmentHeaders, 12, yPos, employmentWidths);

    // Add employment income data
    const employmentData = l1_assets.employment_income || [];
    if (employmentData.length === 0) {
        for (let i = 0; i < 5; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(6).fill(''), 12, yPos, employmentWidths);
        }
    } else {
        employmentData.forEach((item, index) => {
            const rowData = [
                (index + 1).toString(),
                item.employer_name || '',
                item.tin_of_employer || '',
                PDFHelpers.formatCurrency(item.gross_income),
                PDFHelpers.formatCurrency(item.deduction_of_gross_income),
                PDFHelpers.formatCurrency(item.net_income)
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, employmentWidths);
        });
    }

    // JUMLAH TABEL D
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, 'D');
    yPos += 10;

    // === E. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh ===
    yPos = PDFHelpers.checkPageBreak(doc, yPos, 25);
    yPos = PDFHelpers.addBlueHeader(doc, 'E. DAFTAR BUKTI PEMOTONGAN/PEMUNGUTAN PPh', yPos);

    const withholdingHeaders = ['NO', 'PEMOTONG/PEMUNGUT PPh', 'BUKTI PEMOTONGAN/PEMUNGUTAN', 'JENIS PAJAK', 'PENGHASILAN BRUTO', 'JUMLAH PPh YANG DIPOTONG/DIPUNGUT'];
    const withholdingWidths = PDFHelpers.calculateColumnWidths(withholdingHeaders, headerWidth - 2);

    yPos = PDFHelpers.addTableHeader(doc, withholdingHeaders, 12, yPos, withholdingWidths);

    // Add withholding tax data
    const withholdingData = l1_assets.withholding_tax || [];
    if (withholdingData.length === 0) {
        for (let i = 0; i < 10; i++) {
            yPos = PDFHelpers.addTableRow(doc, Array(6).fill(''), 12, yPos, withholdingWidths);
            // Add sub-fields for BUKTI PEMOTONGAN/PEMUNGUTAN
            doc.setFontSize(fonts.tiny);
            doc.text('NOMOR:', 77, yPos - 4);
            doc.text('TANGGAL:', 77, yPos - 2);
            doc.setFontSize(fonts.small);
        }
    } else {
        withholdingData.forEach((item, index) => {
            const rowData = [
                (index + 1).toString(),
                item.name || '',
                (item.slipNumber || '') + ' / ' + (item.slipDate || ''),
                item.taxType || '',
                PDFHelpers.formatCurrency(item.taxBase),
                PDFHelpers.formatCurrency(item.taxAmount)
            ];
            yPos = PDFHelpers.addTableRow(doc, rowData, 12, yPos, withholdingWidths);
        });
    }

    // JUMLAH TABEL E
    PDFHelpers.addYellowBox(doc, pageWidth - 25, yPos, 15, 4, 'E');

    // Footer for Lampiran 1
    yPos += 15;
    doc.setFontSize(fonts.tiny);
    doc.setTextColor(100, 100, 100);
    doc.text('LAMPIRAN 1 - HARTA, UTANG, DAN DAFTAR KELUARGA', 15, yPos);
    if (sptData.submission_date) {
        doc.text('Tanggal Pengajuan: ' + new Date(sptData.submission_date).toLocaleDateString('id-ID'), 15, yPos + 3);
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Add remaining lampiran
    addLampiran2(doc, sptData);
    addLampiran3A1(doc, sptData);
    addLampiran3A2(doc, sptData);
    addLampiran3A3(doc, sptData);
    addLampiran3A4(doc, sptData);
    addLampiran3B(doc, sptData);
    addLampiran3C(doc, sptData);
    addLampiran3D(doc, sptData);
    addLampiran4(doc, sptData);
    addLampiran5(doc, sptData);

    return doc;
};
export {
    generateCompleteSPTPDF,
    PDFHelpers
};

export default generateCompleteSPTPDF;