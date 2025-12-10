import { useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Download, Visibility } from "@mui/icons-material"
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material"
import { useAuth } from "../../authentication/AuthContext"
import { useFilesForOrganization } from "../../hooks/useFileList"
import { useFileService } from "../../hooks/useFileService"
import { BlobFile } from "../../models/file"

interface FilesListProps {
  readonly files: readonly BlobFile[]
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatDate(date?: Date): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export const OrganizationFileList = ({
  organizationId,
}: {
  organizationId: string | undefined
}) => {
  const { session } = useAuth()
  const sessionJwt = useMemo(() => session?.access_token, [session])

  const fileService = useFileService(sessionJwt)
  const { data: files, isLoading, error } = useFilesForOrganization(fileService, organizationId!)
  if (isLoading) {
    return <p>Loading files...</p>
  }
  if (error) {
    return <h1>Error</h1>
  }
  if (!files || files.length === 0) {
    return <p>No files found for this organization.</p>
  }
  return <FilesList files={files} />
}

export function FilesList({ files }: FilesListProps) {
  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow
                    key={file.id}
                    sx={{
                      textDecoration: "none",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box>
                          <Typography>{file.originalFileName ?? file.fileName}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={file.contentType || "Unknown"} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {formatFileSize(file.fileSize || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary">
                        {file.organizationName || file.organizationId || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(file.createdDate)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          by {file.uploadedByUsername || file.uploadedBy || "Unknown"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            component={RouterLink}
                            to={`/file/${file.id}`}
                            size="small"
                            color="primary"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Mock download action
                              console.log(`Downloading file: ${file.uri}`)
                            }}
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {files.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">No files found</Typography>
        </Box>
      )}
    </Box>
  )
}
