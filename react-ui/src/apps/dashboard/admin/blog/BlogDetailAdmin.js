import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { convertToRaw, EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import axios from "axios";
import API from "../../../../utils/host.config";
import toast from "react-hot-toast";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, CircularProgress } from "@mui/material";
import { ShimmerSectionHeader, ShimmerTitle } from "react-shimmer-effects";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import useSWR from "swr";
import { Helmet } from "react-helmet";
import makeStyles from "@mui/styles/makeStyles";
import { Save } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  btnback: {
    backgroundColor: "#7C7C7C",
    textTransform: "none",
    marginLeft: "0px",
    marginRight: "10px",
    marginBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "20px",
    "&:hover": {
      backgroundColor: "#5D5D5D",
      boxShadow: "none",
    },
  },
  btnsave: {
    // backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      // backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
  btnLihatPreviewMhs: {
    backgroundColor: "#4EC387",
    textTransform: "none",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#4ED287",
      boxShadow: "none",
    },
  },
}));

const BlogDetailAdmin = () => {
  const classes = useStyles();
  let { title, type } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isLoad, setIsLoad] = useState(true);
  const [counter, setCounter] = useState(0);
  let history = useHistory();
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const getHtml = (editorState) =>
    draftToHtml(convertToRaw(editorState.getCurrentContent()));

  const { data, error } = useSWR(
    `${API.HOST}/api/v2/admin/blog/detail/${type}/${title}#${counter}`,
    (url) =>
      axios(url, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }).then((data) => data.data),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      loadingTimeout: 60000, //default 3000ms
      onLoadingSlow: () =>
        toast.error("Koneksi Anda Buruk", {
          style: {
            minWidth: "250px",
            border: "1px solid #FF4C4D",
            padding: "16px",
            color: "#000",
            marginBottom: "25px",
          },
          duration: 3500,
          icon: "⚠️",
        }),
      onSuccess: (data) => {
        setIsLoad(false);
        const contentState = ContentState.createFromBlockArray(
          htmlToDraft(data.data.content).contentBlocks
        );
        setEditorState(EditorState.createWithContent(contentState));
      },
    }
  );

  if (error) return "Failed to load...";

  const onEdit = async () => {
    const dataa = {
      content: getHtml(editorState),
      id: data.data.id,
    };
    const reqUpdate = axios.post(
      `${API.HOST}/api/v2/admin/blog/update`,
      dataa,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("xtoken"),
        },
      }
    );

    try {
      toast.promise(
        reqUpdate,
        {
          loading: "Menyimpan pembaruan...",
          success: (data) => {
            if (data.data.success) {
              setCounter(counter + 1);
              // startEditing()
              toast.success(data.data.message, {
                style: {
                  minWidth: "250px",
                  border: "1px solid #1E40AF",
                  padding: "16px",
                  color: "#1E40AF",
                  marginBottom: "25px",
                },
                success: {
                  duration: 3500,
                },
              });
            } else {
              toast.error(data.data.message, {
                style: {
                  minWidth: "250px",
                  border: "1px solid #FF4C4D",
                  padding: "16px",
                  color: "#000",
                  marginBottom: "25px",
                },
                success: {
                  duration: 3500,
                },
              });
            }
          },
          error: (error) => {
            console.log(error);
          },
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
            marginBottom: "25px",
          },
          success: {
            duration: 1,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("photo", file);

      const prosessupload = axios.post(
        `${API.HOST}/api/v2/upload/img/blog`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("xtoken"),
          },
        }
      );
      toast.promise(
        prosessupload,
        {
          loading: "upload image...",
          success: (data) => {
            resolve({
              data: {
                link: API.HOST + "/" + data.data.file.path,
              },
            });
            return data.data.message;
          },
          error: (error) => {
            reject(null);
            return (
              <div className="relative">
                <span className="absolute inset-y-0 -left-5 flex items-center"></span>
                <p className="pl-3">
                  <b>{error.response.data.message}</b>
                </p>
              </div>
            );
          },
        },
        {
          style: {
            minWidth: "250px",
            border: "1px solid #1E40AF",
            padding: "16px",
            color: "#1E40AF",
            marginBottom: "25px",
          },
          success: {
            duration: 1000,
          },
        }
      );
    });
  };

  const EditorPage = () => {
    return (
      <Editor
        placeholder="Ketikan konten Anda di sini.."
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(value) => onEditorStateChange(value)}
        toolbar={{
          inline: { inDropdown: false },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadCallback,
            previewImage: true,
            alt: { present: true, mandatory: false },
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          },
        }}
      />
    );
  };

  return (
    <>
      <Helmet>
        <title>Detail Blog - Admin</title>
      </Helmet>
      <div className="flex items-center relative mb-8">
        <div className="text-2xl capitalize text-center w-full absolute">
          {title}
          <p>{type}</p>
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.btnback}
          onClick={() => {
            history.goBack();
          }}
        >
          <ArrowBackIcon fontSize="small" className="mr-1" />
          Back
        </Button>
      </div>
      <div className="w-full border-collapse border ">
        <div className="w-full min-h-50v">
          <div className="h-14 bg-blue-600 relative">
            <div className="mx-auto max-w-6xl flex items-center h-full  justify-between">
              <div className=" grow">
                <div className=" inline">
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        "\n.dropdown:hover > .dropdown-content {\n\tdisplay: block;\n}\n.dropdown2:hover > .dropdown2-content {\n\tdisplay: block;\n}\n",
                    }}
                  />
                  <div className="dropdown inline-block hover:bg-blue-300 rounded text-white font-bold text-sm uppercase m-3 p-2">
                    {/* <NavLink
                            to="/"
                            exact
                            isActive={() => ["/"].includes(pathname)}
                            activeClassName={active}
                            className="text-white font-bold text-sm uppercase m-3 p-2 "
                            > */}
                    Home
                    {/* </NavLink> */}
                  </div>
                  <div className="dropdown inline-block relative hover:bg-blue-300 rounded">
                    <button className="px-5 text-white font-bold text-sm uppercase ">
                      Informasi Umum
                    </button>
                    {/* <ul className="dropdown-content absolute hidden text-slate-700 pt-2 px-2 -ml-1 w-44 z-50">
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-t"
                                href="/b/profil"
                                >
                                Profil
                                </a>
                            </li>
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                                href="/b/bagan-organisasi"
                                >
                                Bagan Organisasi
                                </a>
                            </li>
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-b"
                                href="/b/departemen"
                                >
                                Departemen
                                </a>
                            </li>
                            </ul> */}
                  </div>
                  <div className="dropdown2 inline-block relative hover:bg-blue-300 rounded">
                    <button className="px-5 text-white font-bold text-sm uppercase ">
                      Sistem & prosedur
                    </button>
                    {/* <ul className="dropdown2-content absolute hidden text-slate-700 pt-2 w-44 z-50">
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-t"
                                href="/b/penerimaan-pendapatan-jasa"
                                >
                                Penerimaan Pendapatan Jasa
                                </a>
                            </li>
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                                href="/b/pengeluaran-kas"
                                >
                                Pengeluaran Kas
                                </a>
                            </li>
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap"
                                href="/b/penggajian"
                                >
                                Penggajian
                                </a>
                            </li>
                            <li>
                                <a
                                className="bg-slate-200 hover:bg-blue-200 py-2 px-2 block whitespace-no-wrap rounded-b"
                                href="/b/penggajian"
                                >
                                Penagihan & Penerimaan Piutang
                                </a>
                            </li>
                            </ul> */}
                  </div>
                  <div className="inline-block relative hover:bg-blue-300 rounded text-white font-bold text-sm uppercase m-3 p-2">
                    {/* <NavLink
                            to="/virtual/virtualtour"
                            activeClassName={active}
                            className="text-white font-bold text-sm uppercase m-3 p-2"
                            > */}
                    Virtual Tour
                    {/* </NavLink> */}
                  </div>
                </div>
              </div>

              <div>{/* <Login /> */}</div>
            </div>
          </div>
          <div className="mx-3 my-5 border border-collapse min-h-50v relative">
            {data ? (
              <EditorPage />
            ) : (
              <>
                <ShimmerSectionHeader />
                <ShimmerTitle line={5} variant="secondary" />
                <div className="absolute inset-0 flex items-center justify-center z-50">
                  <CircularProgress />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-5">
        <Button
          variant="contained"
          startIcon={
            isLoad ? (
              <CircularProgress
                size={20}
                thickness={4}
                style={{ color: "white" }}
              />
            ) : (
              <Save />
            )
          }
          className={classes.btnsave}
          onClick={onEdit}
        >
          Simpan Perubahan
        </Button>
        <a href={`/${type}/b/${title}`}>
          <Button
            variant="contained"
            className={classes.btnLihatPreviewMhs}
            endIcon={<OpenInNewIcon />}
          >
            Lihat tampilan di Mahasiswa
          </Button>
        </a>
      </div>
    </>
  );
};

export default BlogDetailAdmin;
