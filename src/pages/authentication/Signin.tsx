import { useState, ChangeEvent} from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Add this line
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post("http://localhost:80/authenticate/login", {
        username,
        password,
      });
      // Check if the response contains a status property indicating success
      if (response.data.status === 200) {
        // Handle successful login
        console.log(response.data.message); // Log success message

        // Parse the response and extract the token
        const { token, refreshToken, expirationTime } = response.data;

        // Store the token and other relevant data securely
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("expirationTime", expirationTime);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate('/');
      } else {
        // Handle unsuccessful login
        alert(response.data.error || "Unknown error");
      }
    } catch (error) {
      // Handle network errors
      console.error("Network error:", error);
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Sign In
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Welcome back! Let's continue with,
      </Typography>

      <Stack mt={3} spacing={1.75} width={1}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="logos:google-icon" />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="logos:apple" sx={{ mb: 0.5 }} />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Apple
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }}>or Signin with</Divider>

      <Stack component="form" mt={3} onSubmit={handleLogin} direction="column" gap={2}>
        <TextField
          id="username"
          name="username"
          type="username"
          value={username}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Username"
          autoComplete="username"
          fullWidth
          autoFocus
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:baseline-alternate-email" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="current-password"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="ic:outline-lock" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: password ? 1 : 0,
                  pointerEvents: password ? 'auto' : 'none',
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ border: 'none', bgcolor: 'transparent !important' }}
                  edge="end"
                >
                  <IconifyIcon
                    icon={showPassword ? 'ic:outline-visibility' : 'ic:outline-visibility-off'}
                    color="neutral.light"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack mt={-1.25} alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={<Checkbox id="checkbox" name="checkbox" size="medium" color="primary" />}
            label="Remember me"
            sx={{ ml: -0.75 }}
          />
          <Link href="#!" fontSize="body2.fontSize">
            Forgot password?
          </Link>
        </Stack>

        <Button type="submit" variant="contained" size="medium" fullWidth>
          Sign In
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Don't have an account? <Link href={paths.signup}>Signup</Link>
      </Typography>
    </>
  );
};

export default Signin;
