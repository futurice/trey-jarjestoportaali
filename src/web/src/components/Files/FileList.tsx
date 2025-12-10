import { useMemo } from "react"
import { useTranslation } from "react-i18next"
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
  CircularProgress,
} from "@mui/material"
import { useAuth } from "../../authentication/AuthContext"
import { useFilesForOrganization } from "../../hooks/useFileList"
import { useFileService } from "../../hooks/useFileService"
import { BlobFile } from "../../models/file"
import { formatDate, formatFileSize } from "../../utils/formatUtils"

interface FilesListProps {
  readonly files: readonly BlobFile[]
}

export const OrganizationFileList = ({
  organizationId,
}: {
  organizationId: string | undefined
}) => {
  const { session } = useAuth()
  const sessionJwt = useMemo(() => session?.access_token, [session])
  const { t } = useTranslation()

  const fileService = useFileService(sessionJwt)
  const { data: files, isLoading, error } = useFilesForOrganization(fileService, organizationId!)
  if (isLoading) {
    return <CircularProgress />
  }
  if (error) {
    return <h1>{t("files.error")}</h1>
  }
  if (!files || files.length === 0) {
    return <p>{t("files.no_files")}</p>
  }
  return <FilesList files={files} />
}

export function FilesList({ files }: FilesListProps) {
  const { t } = useTranslation()
  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("files.name")}</TableCell>
                  <TableCell>{t("files.type")}</TableCell>
                  <TableCell>{t("files.size")}</TableCell>
                  <TableCell>{t("files.organization")}</TableCell>
                  <TableCell>{t("files.uploaded_at")}</TableCell>
                  <TableCell>{t("files.uploaded_by")}</TableCell>
                  <TableCell align="center">{t("files.actions")}</TableCell>
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
                    <TableCell sx={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <Typography noWrap title={file.originalFileName ?? file.fileName}>
                        {file.originalFileName ?? file.fileName}
                      </Typography>
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
                        {file.organizationName || file.organizationId || t("files.unknown")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(file.createdDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {file.uploadedByUsername || file.uploadedBy || t("files.unknown")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            component={RouterLink}
                            to={`/file?id=${file.id}`}
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
          <Typography color="text.secondary">{t("files.no_files")}</Typography>
        </Box>
      )}
    </Box>
  )
}
