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
} from "@mui/material"

// Define the Country interface
interface Country {
  id: number
  name: string
  countryCode: string
  description: string | null
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

const Countries = () => {
  const [searchText, setSearchText] = useState<string>("")
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [editData, setEditData] = useState<Country | null>(null)
  const [formData, setFormData] = useState<Country>({
    id: 0,
    name: "",
    countryCode: "",
    description: null,
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
        const response = await axios.get<Country[]>("https://maktoum.oummal.org/country/all-countries", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCountries(response.data)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://maktoum.oummal.org/country/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCountries((prevData) => prevData.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Failed to delete country:", error)
    }
  }

  const handleOpenModal = (data: Country | null = null) => {
    setEditData(data)
    setFormData(
      data || {
        id: 0,
        name: "",
        countryCode: "",
        description: null,
      },
    )
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setEditData(null)
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.countryCode) {
        alert("Please fill out all required fields.")
        return
      }

      let response
      if (editData) {
        // Edit existing country
        response = await axios.put(`https://maktoum.oummal.org/country/${editData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCountries((prevData) => prevData.map((item) => (item.id === editData.id ? { ...item, ...formData } : item)))
      } else {
        // Add new country
        response = await axios.post("https://maktoum.oummal.org/country", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCountries([...countries, response.data])
      }

      handleCloseModal()
    } catch (error) {
      console.error("Failed to save country:", error)
    }
  }

  const isFormValid = formData.name && formData.countryCode

  const filteredData = countries.filter((item) =>
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
    <Paper
      sx={{
        px: 0,
        height: "auto",
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
          Countries
        </Typography>
        <TextField
          variant="filled"
          size="small"
          placeholder="Search Countries"
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
          Add Country
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
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Country Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell sx={{ minWidth: 180, padding: 1 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.countryCode}</TableCell>
                    <TableCell>{item.description || "N/A"}</TableCell>
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
                        onClick={() => handleDelete(item.id)}
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

      {/* Country-specific Add/Edit Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle>{editData ? "Edit Country" : "Add Country"}</DialogTitle>
        <DialogContent
          sx={{
            overflowY: "auto",
            ...scrollbarStyle,
            pb: 2,
          }}
        >
          <TextField
            margin="dense"
            label="Country Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Country Code"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleFormChange}
            fullWidth
            required
            helperText="Two-letter country code (e.g., US, UK, AE)"
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={formData.description || ""}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={4}
          />
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

export default Countries
