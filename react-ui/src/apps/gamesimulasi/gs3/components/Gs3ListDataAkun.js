import React, { useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ModalSetDataAkunGs3 from "./ModalSetDataAkunGs3";
import ModalNewDataAkunGs3 from "./ModalNewDataAkunGs3";
import MUIDataTable from "mui-datatables";
import { filter } from "lodash";

export default function Gs3ListDataAkun(props) {
  const dataall = props.dataall;
  const [openEdit, setOpenEdit] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [rowData, setRowData] = useState(null);
  // const [cSorting, setCSorting] = useState(0);

  const columns = [
    {
      name: "Aktif",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              paddingLeft: 20,
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="flex justify-center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dataall[dataIndex].used}
                    onChange={() => {
                      let itm = {
                        ...dataall[dataIndex],
                        used: !dataall[dataIndex].used,
                      };
                      const allupdate = dataall.map((u) =>
                        u.code !== itm.code ? u : itm
                      );
                      // to reorder
                      const selectedonly = filter(allupdate, {
                        used: true,
                      });
                      const unselected = filter(allupdate, { used: false });
                      var reorder = [...selectedonly, ...unselected];

                      props.setData(selectedonly, reorder);
                    }}
                  />
                }
              />
            </div>
          );
        },
      },
    },
    {
      label: "Kode",
      name: "code",
    },
    {
      label: "Nama Akun",
      name: "name",
    },
    {
      label: "Jenis",
      name: "jenis",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          const jenis = dataall[dataIndex].jenis;
          return (
            <div className="flex flex-col justify-center items-center">
              <p>{jenis === "debit" ? "Debet" : jenis}</p>
            </div>
          );
        },
      },
    },
    {
      name: "menu",
      options: {
        filter: false,
        sort: false,
        empty: true,
        setCellHeaderProps: (value) => {
          return {
            style: {
              textAlign: "center",
            },
          };
        },
        customBodyRenderLite: (dataIndex) => {
          return (
            <div className="flex justify-around">
              <IconButton
                onClick={(event) => {
                  setRowData(dataall[dataIndex]);
                  setOpenEdit(true);
                }}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
          );
        },
      },
    },
  ];

  const CustomToolbar = ({ displayData }) => {
    return (
      <div className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddBoxIcon />}
          onClick={() => setOpenNew(true)}
        >
          Tambah data akun
        </Button>
      </div>
    );
  };

  const options = {
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 25, 50],
    filterType: "dropdown",
    responsive: "vertical",
    filter: false,
    viewColumns: false,
    download: false,
    print: false,
    selectableRows: "none",
    textLabels: {
      body: {
        noMatch: "Data Kosong ...",
      },
    },
    customToolbar: CustomToolbar,
  };

  return (
    <>
      <MUIDataTable data={dataall} columns={columns} options={options} />

      {openEdit && (
        <ModalSetDataAkunGs3
          open={openEdit}
          data={rowData}
          update={() => props.updateBank()}
          close={() => setOpenEdit(false)}
        />
      )}
      {openNew && (
        <ModalNewDataAkunGs3
          open={openNew}
          update={() => props.updateBank()}
          close={() => setOpenNew(false)}
        />
      )}
    </>
  );
}
