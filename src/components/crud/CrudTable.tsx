"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import IconifyIcon from "components/base/IconifyIcon"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
} from "@mui/material"

// Define the Country interface
interface Country {
  id: number
  name: string
  countryCode: string
  description: string | null
}

// Define the Organization interface
interface Organization {
  id?: number
  name: string
  email: string
  phoneNumber: string
  country: Country | null
  notes: string
  description: string
  website: string
  contactPerson: string
  socialMedia: string
  projects: string
  imageUrl: string | null
  createdAt: string
  modifiedAt: string
}

// Define the OrganizationAddRequest interface
interface OrganizationAddRequest {
  organization: Organization
  situationId: number | null
}

interface CrudTableProps {
  title: string
  fetchUrl: string
  createUrl: string
  updateUrl: string
  deleteUrl: string
}

// Shared scrollbar styling
const scrollbarStyle = {
  "&::-webkit-scrollbar": {
    width: "16px",
    height: "16px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "8px",
    border: "4px solid transparent",
    backgroundClip: "padding-box",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-corner": {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  scrollbarWidth: "auto",
  scrollbarColor: "rgba(0,0,0,0.3) rgba(0,0,0,0.05)",
}

const CrudTable = ({ title, fetchUrl, createUrl, updateUrl, deleteUrl }: CrudTableProps) => {
  const [searchText, setSearchText] = useState<string>("")
  const [data, setData] = useState<Organization[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [editData, setEditData] = useState<Organization | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<Organization>({
    name: "",
    email: "",
    phoneNumber: "",
    country: null,
    notes: "",
    description: "",
    website: "",
    contactPerson: "",
    socialMedia: "",
    projects: "",
    imageUrl: null,
    createdAt: "",
    modifiedAt: "",
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Get the token from local storage
  const token = localStorage.getItem("token")

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [orgResponse, countriesResponse] = await Promise.all([
          axios.get<Organization[]>(fetchUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Country[]>("https://maktoum.oummal.org/country/all-countries", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        setData(orgResponse.data)
        setCountries(countriesResponse.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fetchUrl, token])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCountryChange = (value: Country | null) => {
    setFormData({ ...formData, country: value })
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${deleteUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setData((prevData) => prevData.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Failed to delete data:", error)
    }
  }

  const handleOpenModal = (data: Organization | null = null) => {
    setEditData(data)
    setFormData(
      data || {
        name: "",
        email: "",
        phoneNumber: "",
        country: null,
        notes: "",
        description: "",
        website: "",
        contactPerson: "",
        socialMedia: "",
        projects: "",
        imageUrl: null,
        createdAt: "",
        modifiedAt: "",
      },
    )
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditData(null)
    setImageFile(null) // Clear the image file when closing the modal
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.country) {
        alert("Please fill out all required fields.")
        return
      }

      const payload: OrganizationAddRequest = {
        organization: formData,
        situationId: null, // Set to null if no situation is selected
      }

      let response
      if (editData) {
        // Edit existing organization
        response = await axios.put(`${updateUrl}/${editData.id}`, payload.organization, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData((prevData) => prevData.map((item) => (item.id === editData.id ? { ...item, ...formData } : item)))
      } else {
        // Add new organization
        response = await axios.post(createUrl, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData([...data, response.data])
      }

      // Handle image upload if a file is selected
      if (imageFile && response.data.id) {
        const formData = new FormData()
        formData.append("image", imageFile)
        const uploadResponse = await axios.post(
          `https://maktoum.oummal.org/admin/image/upload/${response.data.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        )

        // Ensure the server returns the direct image URL
        const imageUrl = uploadResponse.data.imageUrl
        setFormData((prev) => ({ ...prev, imageUrl }))
        setData((prevData) => prevData.map((item) => (item.id === response.data.id ? { ...item, imageUrl } : item)))
      }

      handleCloseModal()
    } catch (error) {
      console.error("Failed to save data:", error)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0])
    }
  }

  const isFormValid = formData.name && formData.country

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) => typeof value === "string" && value.toLowerCase().includes(searchText.toLowerCase()),
    ),
  )

  const handleChangePage = (newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    // Note: This component should be wrapped in a scrollable container at the app level
    <Paper
      sx={{
        px: 0,
        height: "auto", // Allow content to determine height
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        px={3.5}
        py={2}
        spacing={{ xs: 2, sm: 0 }}
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4" minWidth={200}>
          {title}
        </Typography>
        <TextField
          variant="filled"
          size="small"
          placeholder={`Search ${title}`}
          value={searchText}
          onChange={handleInputChange}
          sx={{ width: 1, maxWidth: 250 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconifyIcon icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
          Add {title}
        </Button>
      </Stack>

      {/* Table container with both horizontal and vertical scrolls */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          m: 2,
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "8px",
          height: { xs: 400, sm: 500, md: 600 },
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Typography align="center" mt={5}>
            Loading...
          </Typography>
        ) : (
          <TableContainer
            sx={{
              height: "100%",
              maxHeight: "100%",
              width: "100%",
              overflow: "auto",
              ...scrollbarStyle,
            }}
          >
            <Table stickyHeader style={{ minWidth: 1500 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 150 }}>Name</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Contact Person</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Contact Information</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Country</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Brief about the organization</TableCell>
                  <TableCell sx={{ minWidth: 250 }}>Ongoing projects / support / services</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Website</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Contact Person</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Social Media</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Projects</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Image</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Created At</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Modified At</TableCell>
                  <TableCell sx={{ minWidth: 180, padding: 1 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.contactPerson}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.country ? item.country.name : "N/A"}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.website}</TableCell>
                    <TableCell>{item.contactPerson}</TableCell>
                    <TableCell>{item.socialMedia}</TableCell>
                    <TableCell>{item.projects}</TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <>
                          <img
                            src={`https://maktoum.oummal.org/admin/image/${item.imageUrl}`}
                            alt={item.name}
                            style={{ width: "50px", height: "50px", objectFit: "contain" }}
                          />
                          <a href={`https://maktoum.oummal.org/admin/image/${item.imageUrl}`} download>
                            Download
                          </a>
                        </>
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{item.modifiedAt}</TableCell>
                    <TableCell sx={{ padding: "4px 8px" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{
                          color: "primary.main",
                          borderColor: "primary.main",
                          mb: 1,
                          display: "block",
                          width: "100%",
                        }}
                        onClick={() => handleOpenModal(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ color: "error.main", borderColor: "error.main", display: "block", width: "100%" }}
                        onClick={() => handleDelete(item.id!)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => handleChangePage(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ".MuiTablePagination-actions": {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 20,
          },
        }}
      />

      {/* Add/Edit Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle>{editData ? "Edit Organization" : "Add Organization"}</DialogTitle>
        <DialogContent
          sx={{
            overflowY: "auto",
            ...scrollbarStyle,
            pb: 2,
          }}
        >
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Contact person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Contact information"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Brief about the organization"
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Ongoing projects / support / services"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Social media"
            name="socialMedia"
            value={formData.socialMedia}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />
          <TextField
            margin="dense"
            label="Projects"
            name="projects"
            value={formData.projects}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                backgroundColor: 'background.paper',
                px: 0.5,
              },
            }}
          />

          {/* Country Dropdown */}
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.name}
            value={formData.country}
            onChange={(_, value) => handleCountryChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                margin="dense"
                variant="outlined"
                sx={{
                  '& .MuiInputLabel-root': {
                    backgroundColor: 'background.paper',
                    px: 0.5,
                  },
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {/* Upload Button */}
          <Box mt={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          {/* Image Preview */}
          {imageFile && (
            <Box mt={2}>
              <Typography variant="body2">Image Preview:</Typography>
              <img
                src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                alt="Preview"
                style={{ width: "100%", maxHeight: "200px", objectFit: "contain" }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={!isFormValid}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default CrudTable
