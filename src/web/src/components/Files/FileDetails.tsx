import { useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowBack, Share, Edit, Download } from "@mui/icons-material"
import {
  Box,
  IconButton,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Container,
} from "@mui/material"
import { useAuth } from "../../authentication/AuthContext"
import { useGetFileByName } from "../../hooks/useFileList"
import { useFileService } from "../../hooks/useFileService"
import { formatDate, formatFileSize } from "../../utils/formatUtils"

const FileDetails = () => {
  const [searchParams] = useSearchParams()
  const { id } = {
    id: searchParams.get("id"),
  }
  const { session } = useAuth()
  const navigate = useNavigate()

  const sessionJwt = useMemo(() => session?.access_token, [session])
  const fileService = useFileService(sessionJwt)
  const { data: file, isLoading, error } = useGetFileByName(fileService, id || "")

  if (isLoading) {
    return <CircularProgress />
  } else if (error) {
    return <Typography color="error">Error loading file details: {error.message}</Typography>
  } else if (!file) {
    return <Typography>No file details found.</Typography>
  }

  return (
    <Container>
      {/* Header with Back Button */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate("/files")} sx={{ color: "primary.main" }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">File Details</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Share />}
          sx={{ mr: 1 }}
          onClick={() => console.log("Share file:", file.originalFileName || file.fileName)}
        >
          Share
        </Button>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          sx={{ mr: 1 }}
          onClick={() => console.log("Edit file:", file.originalFileName || file.fileName)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={() => console.log("Download file:", file.originalFileName || file.fileName)}
        >
          Download
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main File Information */}
        <Grid size={{ xs: 8, md: 12 }}>
          <Card>
            <CardContent>
              {/* File Name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {file.originalFileName || file.fileName?.split("/").pop()}
                </Typography>
              </Box>
              <Divider sx={{ my: 3 }} />

              {/* File Details Grid */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    File Size
                  </Typography>
                  <Typography>{formatFileSize(file.fileSize || 0)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    File ID
                  </Typography>
                  <Typography sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                    {file.id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded By
                  </Typography>
                  <Typography>{file.uploadedBy}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Upload Date
                  </Typography>
                  <Typography>{formatDate(file.updatedDate)}</Typography>
                </Grid>
                {file.organizationName && (
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Organization
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default FileDetails
