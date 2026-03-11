const DumyTable = {
    id: 1,
    narasisoal: "<h1>GS7 - POSTING KE BUKU BESAR</h1>",
    cvname: "CV ROFADI",
    tblworkname: "BULAN DESEMBER 2021",
    intropenjualan: "Berikut merupakan jurnal pembelian atas transaksi yang terjadi pada bulan Desember 2021", 
    introkas: "Berikut merupakan jurnal kas keluar atas transaksi yang terjadi pada bulan Desember 2021",
    datajurnal: [
      {
        id_config: 1,
        uid: "bef676f5-c5fb-4c9f-bb02-528514edd79a",
        tgl: "03-12-2021",
        keterangan: "PT PAPIER",
        no: "J-660",
        persediaan: 9400000,
        ppnmasukan: 940000,
        hutangdagang: 10340000,
        kas: 0,
        type: "jurnal pembelian",
      },
      {
        id_config: 1,
        uid: "bef676f5-c5fb-4c9f-bb02-528283432553b",
        tgl: "09-12-2021",
        keterangan: "Pembelian Tunai",
        no: "K91221",
        persediaan: 4550000,
        ppnmasukan: 455000,
        hutangdagang: 0,
        kas: 5005000,
        type: "jurnal kas keluar",
      },
    ],  
    dataakun: [
      {
        uid: "079331ab-05e2-4e22-998a-131ba95eb554",
        id_config: 1,
        idakun: ["bef676f5-c5fb-4c9f-bb02-528283432553b"],
        tgl: "01-12-2021",
        noakun: 110,
        posisi: "kredit",
        name: "kas",   
        detailname: 'kas',
        jumlah: 25000000
      },
      {
        uid: "079331ab-05e2-4e22-998a-132343243243",
        id_config: 1,
        idakun: ["bef676f5-c5fb-4c9f-bb02-528514edd79a", "bef676f5-c5fb-4c9f-bb02-528283432553b"],
        tgl: "01-12-2021",
        noakun: 115,
        posisi: "debet",
        name: "persediaan",
        detailname: 'persediaan',   
        jumlah: 5000000
      },
      {
        uid: "079331ab-05e2-4e22-998a-131dg3465542",
        id_config: 1,
        idakun: ["bef676f5-c5fb-4c9f-bb02-528514edd79a", "bef676f5-c5fb-4c9f-bb02-528283432553b"],
        tgl: "01-12-2021",
        noakun: 116,
        posisi: "debet",
        name: "ppnmasukan",
        detailname: "ppn masukan",   
        jumlah: 250000
      },
      {
        uid: "079331ab-05e2-4e22-998a-131estfg435",
        id_config: 1,
        idakun: ["bef676f5-c5fb-4c9f-bb02-528514edd79a"],
        noakun: 210,
        tgl: "01-12-2021",
        posisi: "kredit",
        name: "hutangdagang", 
        detailname: "hutang dagang",
        jumlah: 4550000  
      },
    ],
  }

export default DumyTable