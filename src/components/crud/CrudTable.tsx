import { useState, useEffect, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
} from '@mui/material';

// Define the Country interface
interface Country {
  id: number;
  name: string;
  countryCode: string;
  description: string | null;
}

// Define the Organization interface
interface Organization {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  country: Country | null;
  notes: string;
  description: string;
  website: string;
  contactPerson: string;
  socialMedia: string;
  projects: string;
  imageUrl: string | null;
  createdAt: string;
  modifiedAt: string;
}

interface CrudTableProps {
  title: string;
  fetchUrl: string;
  createUrl: string;
  updateUrl: string;
  deleteUrl: string;
}

const CrudTable = ({ title, fetchUrl, createUrl, updateUrl, deleteUrl }: CrudTableProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [data, setData] = useState<Organization[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editData, setEditData] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<Organization>({
    name: '',
    email: '',
    phoneNumber: '',
    country: null,
    notes: '',
    description: '',
    website: '',
    contactPerson: '',
    socialMedia: '',
    projects: '',
    imageUrl: null,
    createdAt: '',
    modifiedAt: '',
  });

  // Get the token from local storage
  const token = localStorage.getItem('token');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orgResponse, countriesResponse] = await Promise.all([
          axios.get<Organization[]>(fetchUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<Country[]>('https://maktoum.oummal.org/country/all-countries', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setData(orgResponse.data);
        setCountries(countriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchUrl, token]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = ( value: Country | null) => {
    setFormData({ ...formData, country: value });
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${deleteUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  };

  const handleOpenModal = (data: Organization | null = null) => {
    setEditData(data);
    setFormData(data || {
      name: '',
      email: '',
      phoneNumber: '',
      country: null,
      notes: '',
      description: '',
      website: '',
      contactPerson: '',
      socialMedia: '',
      projects: '',
      imageUrl: null,
      createdAt: '',
      modifiedAt: '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phoneNumber || !formData.country) {
        alert('Please fill out all required fields.');
        return;
      }

      const payload = {
        ...formData,
        countryId: formData.country ? formData.country.id : null,
      };

      if (editData) {
        // Edit existing organization
        await axios.put(`${updateUrl}/${editData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(prevData => prevData.map(item => (item.id === editData.id ? { ...item, ...formData } : item)));
      } else {
        // Add new organization
        const response = await axios.post(createUrl, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData([...data, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const isFormValid = formData.name && formData.email && formData.phoneNumber && formData.country;

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <Paper sx={{ px: 0, height: { xs: 442, sm: 396 } }}>
      <Stack
        px={3.5}
        spacing={{ xs: 2, sm: 0 }}
        direction={{ xs: 'column', sm: 'row' }}
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

      <Box mt={1.5} height={314}>
        {loading ? (
          <Typography align="center" mt={5}>
            Loading...
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Social Media</TableCell>
                  <TableCell>Projects</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Modified At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{item.country ? item.country.name : 'N/A'}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.website}</TableCell>
                    <TableCell>{item.contactPerson}</TableCell>
                    <TableCell>{item.socialMedia}</TableCell>
                    <TableCell>{item.projects}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{item.modifiedAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
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

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{editData ? 'Edit Organization' : 'Add Organization'}</DialogTitle>
        <DialogContent>
          {['name', 'email', 'phoneNumber', 'notes', 'description', 'website', 'contactPerson', 'socialMedia', 'projects'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.replace(/([A-Z])/g, ' $1')}
              name={field}
              value={formData[field as keyof Organization]}
              onChange={handleFormChange}
              fullWidth
            />
          ))}

          {/* Country Dropdown */}
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.name}
            value={formData.country}
            onChange={(_, value) => handleCountryChange(value)}  // Pass only 'value'
            renderInput={(params) => <TextField {...params} label="Country" margin="dense" />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
  );
};

export default CrudTable;