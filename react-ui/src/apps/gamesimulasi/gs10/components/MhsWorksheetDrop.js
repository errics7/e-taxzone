import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import { Droppable } from "react-beautiful-dnd";
import ItemsDataBaseGs10 from "./ItemsDataBaseGs10";
import ItemsDataNilaiGs10 from "./ItemsDataNilaiGs10";
import toast from "react-hot-toast";

const useStyles = makeStyles((theme) => ({
  btnsave: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnreset: {
    backgroundColor: "#FF8E90",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#FF4C4D",
      boxShadow: "none",
    },
  },
  btnupdate: {
    backgroundColor: "#34A5DD",
    textTransform: "none",
    marginTop: "5px",
    marginBottom: "5px",
    marginLeft: "10px",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#277BA5",
      boxShadow: "none",
    },
  },
}));

export default function MhsWorksheetDrop(props) {
  const classes = useStyles();
  const data = props.data;
  const valid = props.valid;

  return (
    <>
      <br />
      <div className="grid grid-flow-row gap-0">
        <div className="grid grid-flow-col grid-cols-4 gap-0 w-full">
          <div className="px-2 py-2 border text-center font-semibold">Kode</div>
          <div className="px-2 py-2 border text-center font-semibold">
            Debet (Rp)
          </div>
          <div className="px-2 py-2 border text-center font-semibold">Kode</div>
          <div className="px-2 py-2 border text-center font-semibold">
            Kredit (Rp)
          </div>
        </div>
        {data &&
          data.tbl2.map((item, index) => (
            <div key={index} className="grid grid-flow-col grid-cols-4 gap-0">
              <Droppable droppableId={"dst_kode-debit_" + index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`inline-block w-full items-stretch p-1 border border-slate-200 ${
                      snapshot.isDraggingOver && "bg-slate-100"
                    }`}
                  >
                    {item.debit.kode.value ? (
                      <ItemsDataBaseGs10
                        data={item.debit.kode.value}
                        addon={"akun"}
                        index={index}
                        checker={valid.check}
                        stat={item.debit.kode.status}
                      />
                    ) : (
                      <div className="text-center opacity-40">
                        {index === 0 && <>Drop disini</>}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId={"dst_nilai-debit_" + index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`inline-block w-full items-stretch p-1 border border-slate-200 ${
                      snapshot.isDraggingOver && "bg-slate-100"
                    }`}
                  >
                    {item.debit.nilai.value ? (
                      <ItemsDataNilaiGs10
                        data={item.debit.nilai.value}
                        addon={"nilai"}
                        index={index}
                        checker={valid.check}
                        stat={item.debit.nilai.status}
                      />
                    ) : (
                      <div className="text-center opacity-40">
                        {index === 0 && <>Drop disini</>}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId={"dst_kode-kredit_" + index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`inline-block w-full items-stretch p-1 border border-slate-200 ${
                      snapshot.isDraggingOver && "bg-slate-100"
                    }`}
                  >
                    {item.kredit.kode.value ? (
                      <ItemsDataBaseGs10
                        data={item.kredit.kode.value}
                        addon={"akun"}
                        index={index}
                        checker={valid.check}
                        stat={item.kredit.kode.status}
                      />
                    ) : (
                      <div className="text-center opacity-40">
                        {index === 0 && <>Drop disini</>}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId={"dst_nilai-kredit_" + index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`w-full inline-block items-stretch p-1 border border-slate-200 grow min-h-5v ${
                      snapshot.isDraggingOver && "bg-slate-100"
                    }`}
                  >
                    {item.kredit.nilai.value ? (
                      <ItemsDataNilaiGs10
                        data={item.kredit.nilai.value}
                        addon={"nilai"}
                        index={index}
                        checker={valid.check}
                        stat={item.kredit.nilai.status}
                      />
                    ) : (
                      <div className="text-center opacity-40">
                        {index === 0 && <>Drop disini</>}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
      </div>
      <div className="flex flex-row-reverse mt-3">
        <div
          className={`flex flex-row-reverse py-1 w-full 2xl:w-1/2 bg-gradient-to-l from-slate-100`}
        >
          {props.alldone ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.btnupdate}
              onClick={() => {
                toast.success(`Data Telah Disimpan.`, {
                  style: {
                    minWidth: "250px",
                    border: "1px solid #1E40AF",
                    padding: "16px",
                    color: "#1E40AF",
                    marginBottom: "25px",
                  },
                  success: {
                    duration: 5000,
                  },
                });
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              className={classes.btnsave}
              // disabled={props.valid.check}
              onClick={() => {
                props.check2();
              }}
            >
              Check
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
