import { useState } from "react";
import axios from "axios";
import { Typography, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import toast from "react-hot-toast";
import API, { HOST } from "../../../../../utils/host.config";
import { useDispatch } from "react-redux";
import { refresh } from "../../../../../redux/counterSlice";
import styled from "@emotion/styled";

// Styled Components
const UploadButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #357ae8;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const OutlinedButton = styled.button`
  background-color: transparent;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(74, 144, 226, 0.1);
  }
  
  &:disabled {
    color: #cccccc;
    border-color: #cccccc;
    cursor: not-allowed;
  }
`;

const FileUploadCard = styled.label`
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
  margin-bottom: 16px;
  
  &:hover {
    border-color: #4a90e2;
    background-color: #f0f7ff;
  }
  
  input {
    display: none;
  }
`;

const FileIcon = styled.div`
  margin-bottom: 12px;
  font-size: 28px;
  color: #757575;
`;

const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 12px;
`;

const DialogCloseButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    color: #999;
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const CustomDialogActions = styled(DialogActions)`
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
`;

export const UploadNewUsers = () => {
    const dispatch = useDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [uploadState, setUploadState] = useState({
        file: null,
        fileName: null,
        isUploading: false
    });

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setUploadState({
                ...uploadState,
                file: selectedFile,
                fileName: selectedFile.name
            });
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!uploadState.file) {
            toast.error("Pilih file terlebih dahulu!");
            return;
        }

        setUploadState({ ...uploadState, isUploading: true });

        const formData = new FormData();
        formData.append("file", uploadState.file);

        try {
            const response = await axios.post(
                `${API.HOST}/api/v2/auth/upload-register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("xtoken")}`,
                    },
                }
            );

            toast.success(response.data.message);
            dispatch(refresh());
            resetAndCloseDialog();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal mengunggah file");
        } finally {
            setUploadState({ ...uploadState, isUploading: false });
        }
    };

    const resetAndCloseDialog = () => {
        setUploadState({
            file: null,
            fileName: null,
            isUploading: false
        });
        setDialogOpen(false);
    };

    const downloadTemplate = () => {
        window.open(`${HOST}/assets/uploads/file/template_upload_users.xlsx`, "_blank");
    };

    return (
        <>
            <UploadButton onClick={() => setDialogOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload Pengguna
            </UploadButton>

            <Dialog
                open={dialogOpen}
                onClose={() => !uploadState.isUploading && resetAndCloseDialog()}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload File Pengguna Baru
                    </div>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <FileUploadCard htmlFor="file-input">
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                id="file-input"
                                onChange={handleFileChange}
                            />
                            <center>
                                <FileIcon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="12" y1="18" x2="12" y2="12"></line>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                    </svg>
                                </FileIcon>
                            </center>
                            <Typography variant="body1" fontWeight={500}>
                                Klik untuk memilih file
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Mendukung format .xlsx dan .xls
                            </Typography>
                        </FileUploadCard>

                        <OutlinedButton onClick={downloadTemplate} type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Unduh Template
                        </OutlinedButton>

                        {uploadState.fileName && (
                            <FileInfoContainer>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                <Typography variant="body2">
                                    {uploadState.fileName}
                                </Typography>
                            </FileInfoContainer>
                        )}
                    </Stack>
                </DialogContent>

                <CustomDialogActions>
                    <DialogCloseButton
                        onClick={resetAndCloseDialog}
                        disabled={uploadState.isUploading}
                    >
                        Batal
                    </DialogCloseButton>

                    <UploadButton
                        onClick={handleUpload}
                        disabled={uploadState.isUploading}
                        style={{ minWidth: '120px' }}
                    >
                        {uploadState.isUploading ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }}>
                                    <line x1="12" y1="2" x2="12" y2="6"></line>
                                    <line x1="12" y1="18" x2="12" y2="22"></line>
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                    <line x1="2" y1="12" x2="6" y2="12"></line>
                                    <line x1="18" y1="12" x2="22" y2="12"></line>
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                </svg>
                                Mengunggah...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                Upload
                            </>
                        )}
                    </UploadButton>
                </CustomDialogActions>
            </Dialog>
        </>
    );
};