import { useTranslation } from "react-i18next"
import { Close } from "@mui/icons-material"
import { Box, Typography, Grid, Divider, Modal, IconButton } from "@mui/material"
import { BlobFile } from "../../models/file"
import { formatDate, formatFileSize } from "../../utils/formatUtils"

const FileDetails = ({
  file,
  open,
  onClose,
}: {
  file: BlobFile
  open: boolean
  onClose: () => void
}) => {
  const { t } = useTranslation()
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          width: { xs: "90%", md: "70%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">
            {file.originalFileName || file.fileName?.split("/").pop()}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t("files.size")}
              </Typography>
              <Typography>{formatFileSize(file.fileSize || 0)}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                ID
              </Typography>
              <Typography sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                {file.id}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t("files.uploaded_by")}
              </Typography>
              <Typography>{file.uploadedByUsername ?? file.uploadedBy}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" color="text.secondary">
                {t("files.uploaded_at")}
              </Typography>
              <Typography>{formatDate(file.updatedDate)}</Typography>
            </Grid>
            {file.organizationName && (
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("files.organization")}
                </Typography>
                <Typography>{file.organizationName}</Typography>
              </Grid>
            )}
          </Grid>

          {/* Tags */}
          {/* file.tags && file.tags.length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {file.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>
                </>
              ) */}
        </Grid>
      </Box>
    </Modal>
  )
}

export default FileDetails
