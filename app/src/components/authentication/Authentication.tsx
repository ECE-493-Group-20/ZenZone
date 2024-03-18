// This was copied from this tutorial: https://medium.com/geekculture/firebase-auth-with-react-and-typescript-abeebcd7940a
import React, { useContext, useRef } from "react";
import { AuthContext } from "./AuthContext";
import { auth } from "./firebaseSetup";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useFormControl } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouteLink } from "react-router-dom";
import "../../App.css";
import {useNavigate} from "react-router-dom";

function UserSignIn() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  // Google authentication
  const provider = new GoogleAuthProvider();

  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    console.log("Signed in as: ", auth.currentUser);
    navigate("/");
  }

  const signIn = async () => {
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    try {
      auth.signInWithEmailAndPassword(
        email,
        password
      ).catch(function(error) {
        // do sometime
      }).then(function() {navigate("/")});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Button component={RouteLink} to={"/"}>Home</Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in {user?.email}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordRef}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={signIn}
            >
              Sign In
            </Button>

            <Typography component="h1" variant="h5" align='center'>
            Or
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={googleSignIn}
            >
              Continue with Google
            </Button>

            <Grid container>
              <Grid item>
                <Link component={RouteLink} to="/register">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Button component={RouteLink} to={"/adminsignin"}>Admin Sign In</Button>
    </>
  );
}

function UserSignUp() {
  
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Google authentication
  const provider = new GoogleAuthProvider();

  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    console.log("Signed in as: ", auth.currentUser);
    navigate("/");
  }

  const createAccount = async () => {
    try {
      auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
    <Button component={RouteLink} to={"/"}>Home</Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={createAccount} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordRef}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Typography component="h1" variant="h5" align='center'>
            Or
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick = {googleSignIn}
            >
              Continue with Google
            </Button>

            <Grid container>
              <Grid item xs>
                <Link component={RouteLink} to="/signin">
                  Already Have an account? Sign in here
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Button component={RouteLink} to={"/adminsignin"}>Admin Sign In</Button>
    </>
  )
}

function AdminSignIn() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Google authentication
  const provider = new GoogleAuthProvider();

  // TODO: IMPLEMENT CHECKING FOR ADMIN
  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    navigate("/");
  }

  // TODO: IMPLEMENT CHECKING FOR ADMIN
  const signIn = async () => {
    try {
      auth.signInWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Button component={RouteLink} to={"/"}>Home</Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Admin Sign in
          </Typography>
          <Box component="form" onSubmit={signIn} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={emailRef}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordRef}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Typography component="h1" variant="h5" align='center'>
            Or
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick = {googleSignIn}
            >
              Continue with Google
            </Button>

            <Grid container>
              <Grid item>
                <Link component={RouteLink} to="/adminregister">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Button component={RouteLink} to={"/signin"}>User Sign In</Button>
    </>
  )
}

function AdminSignUp() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Google authentication
  const provider = new GoogleAuthProvider();

  // TODO: IMPLEMENT MAKING ADMIN
  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    console.log("Signed in as: ", auth.currentUser);
    navigate("/");
  }

  // TODO: IMPLEMENT MAKING ADMIN
  const createAccount = async () => {
    try {
      auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Button component={RouteLink} to={"/"}>Home</Button>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Sign up
        </Typography>
        <Box component="form" onSubmit={createAccount} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={emailRef}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={passwordRef}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Typography component="h1" variant="h5" align='center'>
          Or
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick = {googleSignIn}
          >
            Continue with Google
          </Button>

          <Grid container>
            <Grid item>
              <Link component={RouteLink} to="/adminsignin">
                {"Already have an account? Sign in here"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    <Button component={RouteLink} to={"/signin"}>User Sign In</Button>
  </>
  )
}

function signOut() {
    auth.signOut();
}

export {
  UserSignIn,
  UserSignUp,
  AdminSignIn,
  AdminSignUp,
  signOut
}