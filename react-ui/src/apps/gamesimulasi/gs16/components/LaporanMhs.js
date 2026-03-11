import { Droppable } from "react-beautiful-dnd";
import ItemsDataGs16 from "./ItemsDataGs16";

export default function LaporanMhs(props) {
  const dataConfig = props.dataConfig;
  const dataTabel = props.dataTabel;
  const dataSoal = props.dataSoal;
  const dataPerecent = props.dataPerecent;

  const toRp = (val) => {
    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
    return price.toString().substring(0, price.toString().length - 3);
  };

  var xtot1 = 0;
  var xtot2 = 0; 
  dataTabel.forEach((items, i) => {
    const dropusrval = dataSoal.find((el) => el.uuid === items.uids);
    if (items.type === 1) {
      if (dropusrval) {
        xtot1 += Number(dropusrval.value);
      }
    } else {
      if (dropusrval) {
        xtot2 += Number(dropusrval.value);
      }
    }
  });

  return (
    <div className="mt-5 min-h-30v border border-dashed">
      <div className="opacity-50 italic font-semibold my-1">Worksheet:</div>
      {/* //header */}
      <div className="flex flex-col items-center pt-4">
        <div
          className={`text-xl relative ${
            !dataConfig && " bg-slate-100 rounded-md animate-pulse min-w-30v h-6"
          }`}
        >
          {dataConfig ? dataConfig.namept : ""}
        </div>
        <div
          className={`mt-8 text-xl relative ${
            !dataConfig && " bg-slate-100 rounded-md animate-pulse min-w-35v h-6"
          }`}
        >
          {dataConfig && dataConfig.title}
        </div>
        <div
          className={`text-xl relative ${
            !dataConfig &&
            " mt-1 bg-slate-100 rounded-md animate-pulse min-w-40v h-6"
          }`}
        >
          {dataConfig && dataConfig.subtitle}
        </div>
      </div>
      {/* Body */}
      <div className="mt-5 mb-3 mx-2">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="min-w-25v border border-slate-300 ">&nbsp;</th>
              <th className="min-w-10v max-w-10v border border-slate-300">BB</th>
              <th className="min-w-10v max-w-10v border border-slate-300">
                BTKL
              </th>
              <th className="min-w-10v max-w-10v border border-slate-300">
                BOP
              </th>
              <th className="min-w-15v max-w-15v border border-slate-300 p-2 table-cell">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="border px-3 pt-2 pb-1 font-semibold">
                {dataConfig && dataConfig.subtitletbl1}
              </td>
            </tr>
            {dataTabel
              .filter((x) => x.type === 1)
              .map((items, index) => {
                const rpercent = dataPerecent.find(
                  (el) => el.uuid === items.uuid
                );
                //byuser
                const dropusrval = dataSoal.find(
                  (el) => el.uuid === items.uids
                );

                const dropbbb =
                  items.uids_bbb !== "" &&
                  dataPerecent.find((el) => el.uuid === items.uids_bbb);
                const dropbtkl =
                  items.uids_btkl !== "" &&
                  dataPerecent.find((el) => el.uuid === items.uids_btkl);
                const dropbop =
                  items.uids_bop !== "" &&
                  dataPerecent.find((el) => el.uuid === items.uids_bop);

                return (
                  <tr key={index}>
                    <td className="p-1 border text-base table-cell">
                      <div className="pl-2 py-1">{items.name}</div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center relative">
                        {rpercent ? (
                          <Droppable droppableId={"dst_bbb_" + items.uuid}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex w-full items-stretch p-0.5 ${
                                  snapshot.isDraggingOver && "bg-slate-50"
                                }`}
                              >
                                {/* IItems */}
                                {dropbbb ? (
                                  <ItemsDataGs16
                                    data={dropbbb.bbb + "%"}
                                    index={index}
                                    addon={dropbbb.uuid + "_bbb"}
                                  />
                                ) : (
                                  <div className="mx-auto opacity-10  absolute inset-0 flex items-center">
                                    <span className="mx-auto">Drop % here</span>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center relative">
                        {rpercent ? (
                          <Droppable droppableId={"dst_btkl_" + items.uuid}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex w-full items-stretch p-0.5 ${
                                  snapshot.isDraggingOver && "bg-slate-50"
                                }`}
                              >
                                {/* IItems */}
                                {dropbtkl ? (
                                  <ItemsDataGs16
                                    data={dropbtkl.btkl + "%"}
                                    index={index}
                                    addon={dropbtkl.uuid + "_btkl"}
                                  />
                                ) : (
                                  <div className="mx-auto opacity-10  absolute inset-0 flex items-center">
                                    <span className="mx-auto">Drop % here</span>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center relative">
                        {rpercent ? (
                          <Droppable droppableId={"dst_bop_" + items.uuid}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex w-full items-stretch p-0.5 ${
                                  snapshot.isDraggingOver && "bg-slate-50"
                                }`}
                              >
                                {/* IItems */}
                                {dropbop ? (
                                  <ItemsDataGs16
                                    data={dropbop.bop + "%"}
                                    index={index}
                                    addon={dropbop.uuid + "_bop"}
                                  />
                                ) : (
                                  <div className="mx-auto opacity-10  absolute inset-0 flex items-center">
                                    <span className="mx-auto">Drop % here</span>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-1 border min-w-15v max-w-15v ">
                      <div className="text-base text-right relative">
                        <Droppable droppableId={"dst_tabel_" + items.uuid}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex w-full items-stretch p-0.5 ${
                                props.checking &&
                                items.error &&
                                items.uids === "" &&
                                " bg-red-300 animate-pulse h-6"
                              } ${snapshot.isDraggingOver && "bg-slate-50"}`}
                            >
                              {/* IItems */}
                              {dropusrval ? (
                                <ItemsDataGs16
                                  data={toRp(dropusrval.value)}
                                  index={index}
                                  addon={dropusrval.uuid}
                                  checker={props.checking}
                                  stat={items.error}
                                  msg="Pastikan posisi data di tempat yang sesuai"
                                />
                              ) : (
                                <div className="mx-auto opacity-10 absolute inset-0 flex items-center">
                                  <span className="mx-auto">Drop here</span>
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="4" className="border px-3 pt-2 pb-1 font-semibold">
                {dataConfig && dataConfig.titlejumlah1}
              </td>
              <td className="p-1 border text-right text-base">
                <div className="pt-2 px-3 border-b border-slate-400">
                  {toRp(xtot1)}
                </div>
              </td>
            </tr>
            {/* TABEL 2 */}
            {dataTabel
              .filter((x) => x.type === 2)
              .map((items, index) => {
                const rpercent = dataPerecent.find(
                  (el) => el.uuid === items.uuid
                );
                //byuser
                const dropusrval = dataSoal.find(
                  (el) => el.uuid === items.uids
                );
                const dropbbb =
                  items.uids_bbb !== "" &&
                  dataPerecent.find((el) => el.uuid === items.uids_bbb);
                const dropbtkl =
                  items.uids_btkl !== "" &&
                  dataPerecent.find((el) => el.uuid === items.uids_btkl);
                const dropbop =
                  items.uids_bop !== "" &&
                  dataPerecent.find((el) => el.uuid === items.uids_bop);

                return (
                  <tr key={index}>
                    <td className="p-1 border text-base">
                      <div className="pl-2 py-1">{items.name}</div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center relative">
                        {rpercent ? (
                          <Droppable droppableId={"dst_bbb_" + items.uuid}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex w-full items-stretch p-0.5 ${
                                  props.checking &&
                                  items.error &&
                                  items.uids_bbb === "" &&
                                  " bg-red-300 animate-pulse h-6"
                                } ${snapshot.isDraggingOver && "bg-slate-50"}`}
                              >
                                {/* IItems */}
                                {dropbbb ? (
                                  <ItemsDataGs16
                                    data={dropbbb.bbb + "%"}
                                    index={index}
                                    addon={dropbbb.uuid + "_bbb"}
                                    checker={props.checking}
                                    stat={items.error_bbb}
                                    msg="Pastikan posisi data di tempat yang sesuai"
                                  />
                                ) : (
                                  <div className="mx-auto opacity-10  absolute inset-0 flex items-center">
                                    <span className="mx-auto">Drop % here</span>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center relative">
                        {rpercent ? (
                          <Droppable droppableId={"dst_btkl_" + items.uuid}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex w-full items-stretch p-0.5 ${
                                  props.checking &&
                                  items.error &&
                                  items.uids_btkl === "" &&
                                  " bg-red-300 animate-pulse h-6"
                                } ${snapshot.isDraggingOver && "bg-slate-50"}`}
                              >
                                {/* IItems */}
                                {dropbtkl ? (
                                  <ItemsDataGs16
                                    data={dropbtkl.btkl + "%"}
                                    index={index}
                                    addon={dropbtkl.uuid + "_btkl"}
                                    checker={props.checking}
                                    stat={items.error_btkl}
                                    msg="Pastikan posisi data di tempat yang sesuai"
                                  />
                                ) : (
                                  <div className="mx-auto opacity-10  absolute inset-0 flex items-center">
                                    <span className="mx-auto">Drop % here</span>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-1 border">
                      <div className="flex items-center relative">
                        {rpercent ? (
                          <Droppable droppableId={"dst_bop_" + items.uuid}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex w-full items-stretch p-0.5 ${
                                  props.checking &&
                                  items.error &&
                                  items.uids_bop === "" &&
                                  " bg-red-300 animate-pulse h-6"
                                } ${snapshot.isDraggingOver && "bg-slate-50"}`}
                              >
                                {/* IItems */}
                                {dropbop ? (
                                  <ItemsDataGs16
                                    data={dropbop.bop + "%"}
                                    index={index}
                                    addon={dropbop.uuid + "_bop"}
                                    checker={props.checking}
                                    stat={items.error_bop}
                                    msg="Pastikan posisi data di tempat yang sesuai"
                                  />
                                ) : (
                                  <div className="mx-auto opacity-10  absolute inset-0 flex items-center">
                                    <span className="mx-auto">Drop % here</span>
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-1 border min-w-15v max-w-15v ">
                      <div className="text-base text-right relative">
                        {/* {toRp(items.value)} */}
                        <Droppable droppableId={"dst_tabel_" + items.uuid}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex w-full items-stretch p-0.5 ${
                                props.checking &&
                                items.error &&
                                items.uids === "" &&
                                " bg-red-300 animate-pulse h-6"
                              } ${snapshot.isDraggingOver && "bg-slate-50"}`}
                            >
                              {/* IItems */}
                              {dropusrval ? (
                                <ItemsDataGs16
                                  data={toRp(dropusrval.value)}
                                  index={index}
                                  addon={dropusrval.uuid}
                                  checker={props.checking}
                                  stat={items.error}
                                  msg="Pastikan posisi data di tempat yang sesuai"
                                />
                              ) : (
                                <div className="mx-auto opacity-10 absolute inset-0 flex items-center">
                                  <span className="mx-auto">Drop here</span>
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan="4" className="border px-3 pt-2 pb-1 font-semibold">
                {dataConfig && dataConfig.titlejumlah2}
              </td>
              <td className="p-1 border text-right text-base">
                <div className="pt-2 px-3 border-b border-slate-400">
                  {toRp(xtot2)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
