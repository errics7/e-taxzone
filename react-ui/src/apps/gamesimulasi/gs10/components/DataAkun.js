import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import ModalNewDa from "./ModalNewDa";
import ModalEditDa from "./ModalEditDa";
import MUIDataTable from "mui-datatables";

export default function DataAkun(props) {
  const { dataakun } = props;
  const [lastCount, setLastCount] = useState(0);
  const [newDA, setNewDA] = useState(false);
  const [editDA, setEditDA] = useState(false);
  const [rowData, setRowData] = useState(null);

  //
  useEffect(() => {
    const check = () => {
      var x = -1;
      dataakun.forEach((el) => {
        if (el.used) {
          x += 1;
        }
      });
      setLastCount(x);
    };
    check();
  }, [dataakun]);

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
                    checked={dataakun[dataIndex].used}
                    onChange={() => {
                      // memberi last index untuk sorting
                      var last = !dataakun[dataIndex].used
                        ? lastCount + 1
                        : lastCount - 1;
                      let itm = {
                        ...dataakun[dataIndex],
                        used: !dataakun[dataIndex].used,
                        sorting: last,
                      };
                      // before => updated item
                      const bef = dataakun.map((u) =>
                        u.code !== itm.code ? u : itm
                      );
                      // to reorder
                      const selectedonly = bef.filter((x) => x.used === true);
                      // fix reorder sorting
                      var fixreorde = [];
                      selectedonly.forEach((item, index) => {
                        const dat = item;
                        dat["sorting"] = index;
                        fixreorde.push(dat);
                      });
                      // reorder unselected
                      const unselected = bef.filter((x) => x.used === false);
                      //compile
                      var reorder = [...fixreorde, ...unselected];
                      console.log(reorder);
                      props.setdata(selectedonly, reorder);
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
                  setRowData(dataakun[dataIndex]);
                  setEditDA(true);
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
          onClick={() => setNewDA(true)}
        >
          Tambah data akun
        </Button>
      </div>
    );
  };
  const options = {
    rowsPerPage: 7,
    rowsPerPageOptions: [7, 10, 15, 25],
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
    <div className="bg-white">
      <div className="py-3 flex border">
        <h2 className="grow text-center text-lg">Data Akun</h2>
      </div>

      <MUIDataTable data={dataakun} columns={columns} options={options} />

      {/*  */}
      {newDA && (
        <ModalNewDa
          open={newDA}
          close={() => setNewDA(false)}
          update={() => props.update()}
        />
      )}
      {editDA && (
        <ModalEditDa
          open={editDA}
          data={rowData}
          close={() => setEditDA(false)}
          update={() => props.update()}
        />
      )}
    </div>
  );
}
