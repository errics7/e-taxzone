const DATA = 
{
    id: "1asd",
    narasisoal: "<p><strong>GS4 - MENCATAT TRANSAKSI KE JURNAL PEMBELIAN</strong></p>\n<p>Transaksi pembelian yang terjadi selama bulan Desember 2021  sebagai berikut.</p>\n",
    cvname: "CV Rovadi",
    subtable: "Bulan Desember 2021",
    subinvoice: "Transaksi pembelian yang terjadi selama bulan Desember 2021 sebagai berikut.",
    datainvoice: [
        {
            idConfig: 'xxixx',
            uuid: "bef676f5-c5fb-4c9f-bb02-528514edd79a",
            vendorName: 'PT PAPIER',
            vendorAlamat: 'Jl. Jakarta N0.10 Gresik, Jawa Timur',
            buyerName: 'CV Rofadi',
            buyerAlamat: 'Jl. Soekarno Blok A1, Malang',
            tanggal: '3-Des-21',
            noOrder: '765476',
            noInvoice: 'J-660',
            subTotal: 9400000,
            ppn: 940000,
            jumlah: 10340000
        },
        {
            idConfig: 'xxixx',
            uuid: "bef676f5-1245fb-4c9f-bb02-528514edd791",
            vendorName: 'PT CHARTA INDO',
            vendorAlamat: 'Jl. Niaga Kav Carang, Jawa Timur',
            buyerName: 'CV Rofadi',
            buyerAlamat: 'Jl. Soekarno Blok A1, Malang',
            tanggal: '14-Des-21',
            noOrder: '4323',
            noInvoice: 'J-660',
            subTotal: 3700000,
            ppn: 370000,
            jumlah: 4070000
        },
    ],
    dataakun: [
        {
            id_config: "A1",
            noakun: 115,
            jumlah: 0,
            posisi: "Debit"
        },
        {
            id_config: "A2",
            noakun: 116,
            jumlah: 0,
            posisi: "Debit"
        },
        {
            id_config: "A3",
            noakun: 210,
            jumlah: 0,
            posisi: "Kredit"
        },
    ],
    databarang: [
        {
            idInvoice: 'bef676f5-c5fb-4c9f-bb02-528514edd79a',
            idBarang: '079331ab-05e2-4e22-998a-131ba95eb554',
            namaBarang: 'Paperfine F4 75gr',
            satuan: 'Rim',
            jumlah: 100,
            harga: 54000,
            total: 5400000
        },
        {
            idInvoice: 'bef676f5-c5fb-4c9f-bb02-528514edd79a',
            idBarang: '7974acbd-2ab0-47b9-8e2b-5ffdb22b0609',
            namaBarang: 'Paperfine A4 80gr',
            satuan: 'Rim',
            jumlah: 100,
            harga: 40000,
            total: 4000000
        },
        {
            idInvoice: 'bef676f5-1245fb-4c9f-bb02-528514edd791',
            idBarang: '797av12cbd-2ab0-47b9-8e2b-5ffdb22b0609',
            namaBarang: 'Karton Manila',
            satuan: 'Lembar',
            jumlah: 500,
            harga: 2200,
            total: 1100000
        }, 
        {
            idInvoice: 'bef676f5-1245fb-4c9f-bb02-528514edd791',
            idBarang: '7974acbd-2ab0-47b9-8esadfb-5ffsfd22b0609',
            namaBarang: 'Charta A4 60gr',
            satuan: 'Rim',
            jumlah: 100,
            harga: 26000,
            total: 2600000
        }, 
    ],

}

export default DATA;