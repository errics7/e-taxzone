import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../../../utils/host.config";
import EditorNarasiNote from "./EditorNarasiNote";

export default function EditorNarasiSoal(props) {
  const dataConfig = props.dataConfig;
  const indx = props.gsindex ? props.gsindex : 0;
  const defdataso = ["<p>isi disini</p>\n"];
  //Untuk default narasi
  const html = dataConfig.narasisoal ? dataConfig.narasisoal : defdataso[indx];
  if (!dataConfig.narasisoal) {
    props.setdataConfig({
      ...dataConfig,
      narasisoal: defdataso[indx],
    });
  }

  const contentState = ContentState.createFromBlockArray(
    htmlToDraft(html).contentBlocks
  );
  const editorState = EditorState.createWithContent(contentState);
  const [description, setDescription] = useState(editorState);

  const setEditorState = (editorState) => {
    // console.log('editorState', editorState)
    setDescription(editorState);
    props.setdataConfig({
      ...dataConfig,
      narasisoal: draftToHtml(convertToRaw(description.getCurrentContent())),
    });
  };

  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("photo", file);

      const prosessupload = axios.post(
        `${API.HOST}/api/v2/upload/img/narasigs`,
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

  return (
    <div className="border bg-white mb-5 shadow-sm rounded-sm">
      <Editor
        toolbar={{
          image: {
            uploadCallback: uploadCallback,
            previewImage: true,
            alt: { present: true, mandatory: false },
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
          },
        }}
        editorState={description}
        toolbarClassName="toolbarClassName"
        wrapperClassName=""
        editorClassName="min-h-30v px-2 mb-1"
        onEditorStateChange={setEditorState}
      />

      <EditorNarasiNote />
    </div>
  );
}
