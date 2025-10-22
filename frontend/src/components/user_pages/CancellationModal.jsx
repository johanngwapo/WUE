
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Button,
    Divider,
    Alert
} from '@mui/material';
import { WarningAmber, ArrowBack,UploadFile  } from '@mui/icons-material';

export default function CancellationModal({
                                                     open,
                                                     onClose,
                                                     onCancel,
                                                     onRequestExemption,
                                                     canCancelFreely,
                                                     eventName = "Tech Career Fair 2025"
                                                 }) {
    const [file, setFile] = React.useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
            setFile(selectedFile);
        } else {
            alert("File must be less than 5MB");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WarningAmber color="warning" />
                Cancel Event Registration
            </DialogTitle>

            <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                    Event: <strong>{eventName}</strong>
                </Typography>

                {/* Cancellation Policy */}
                <Box sx={{ backgroundColor: "#FFF6ED", border: "1px solid #F2C087", borderRadius: 1, p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>📋 Cancellation Policy</Typography>
                    <Typography variant="body2">
                        <strong>• Free cancellation</strong> allowed up to <strong>72 hours</strong> before the event.<br />
                        <strong>• Cancellation within 48 hours</strong> only permitted for emergencies with valid documentation
                        (e.g., medical certificate, family emergency proof).
                    </Typography>
                </Box>

                {/* Free cancellation or not */}
                {!canCancelFreely ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        You can cancel this registration freely as there are more than 72 hours until the event.
                    </Alert>
                ) : (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Less than 72 hours left. You need to upload a valid document to request an exemption.
                    </Alert>
                )}

                {/* Upload area */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Emergency Documentation (Optional)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Upload supporting documents for emergency cancellation exemption (PDF, JPG, PNG — Max 5MB)
                    </Typography>
                    <Box
                        sx={{
                            border: "2px dashed #ccc",
                            borderRadius: 2,
                            padding: "20px",
                            textAlign: "center",
                            cursor: "pointer"
                        }}
                        onClick={() => document.getElementById("cancel-doc-upload").click()}
                    >
                        <Typography variant="body2">Click to Upload Document</Typography>
                        <Typography variant="caption">{file ? file.name : "Supported formats: PDF, JPG, PNG (Max 5MB)"}</Typography>
                    </Box>
                    <input
                        type="file"
                        accept=".pdf, .jpg, .jpeg, .png"
                        id="cancel-doc-upload"
                        hidden
                        onChange={handleFileChange}
                    />
                </Box>

                {/* Buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={onCancel}
                    >
                        Cancel Registration
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        disabled={canCancelFreely}
                        onClick={() => onRequestExemption(file)}
                    >
                        Request Exemption
                    </Button>
                </Box>

                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2, color: "gray" }}>
                    Choose an option above to proceed with cancellation
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
