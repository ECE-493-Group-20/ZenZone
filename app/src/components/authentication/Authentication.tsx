// This was copied from this tutorial: https://medium.com/geekculture/firebase-auth-with-react-and-typescript-abeebcd7940a
import React, { useContext, useRef, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { auth, db } from "./firebaseSetup";
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
import {useNavigate, redirectDocument} from "react-router-dom";
import Logo from "../logo/Logo";


function UserSignIn() {
  // both admin an regular users use the same signin page
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  // Google authentication
  const provider = new GoogleAuthProvider();

  // redirect after login
  useEffect(() => {
    // Go back to home
    if (user != null) {
      navigate("/");
    }
  }, [user]);

  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    console.log("Signed in as: ", auth.currentUser);
  }

  const signIn = async () => {
    await auth.signInWithEmailAndPassword(
      emailRef.current!.value,
      passwordRef.current!.value
      ).catch(function(error){// Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  };

  return (
    <div style={{ height: "100vh" }}>
      <Button component={RouteLink} to={"/"}>
        Home
      </Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Link href="/">
            <Logo className="logo" style={{ margin: 1 }} />
          </Link>
          <Typography id="authSignIn" component="h1" variant="h5">
            Sign in {user?.email}
          </Typography>

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

          <Button type="submit" fullWidth variant="contained" onClick={signIn}>
            Sign In
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={googleSignIn}
          >
            Continue with Google
          </Button>

          <Link component={RouteLink} to="/register">
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Container>
    </div>
  );
}

function UserSignUp() {
  
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Google authentication
  const provider = new GoogleAuthProvider();

  // redirect after login
  useEffect(() => {
    // Go back to home
    if (user != null) {
      const userInfo = db.collection("UserInformation");
      userInfo.doc(user?.uid).set({isAdmin : false, favourites : []});

      navigate("/");
    }
  }, [user]);

  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    console.log("Signed in as: ", auth.currentUser);
  }

  const createAccount = async () => {
    try {
      await auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      ).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
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
              onClick={createAccount}
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

            <Grid container>
              <Grid item xs>
                <Link component={RouteLink} to="/adminregister">
                  Click here to register as a system admin.
                </Link>
              </Grid>
            </Grid>
          </Box>

      </Container>
    </>
  )
}



function AdminSignUp() {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Google authentication
  const provider = new GoogleAuthProvider();

  // redirect after login
  useEffect(() => {
    // Go back to home
    if (user != null) {
      // Make new user an admin
      // This cannot be done from within the googleSignIn function
      const userInfo = db.collection("UserInformation");
      userInfo.doc(user?.uid).set({isAdmin : true, favourites : []});
      navigate("/");
    }
  }, [user]); 

  const googleSignIn = async () => {
    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    // User gets assigned admin when redirected to main page
  }


  const createAccount = async () => {
    await auth.createUserWithEmailAndPassword(
      emailRef.current!.value,
      passwordRef.current!.value).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      })
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
            onClick={createAccount}
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
            <Grid item>
              <Link component={RouteLink} to="/signin">
                {"Already have an account? Sign in here"}
              </Link>
            </Grid>
          </Grid>
        </Box>
    </Container>
  </>
  )
}

function signOut() {
    auth.signOut();
}

export {
  UserSignIn,
  UserSignUp,
  AdminSignUp,
  signOut
}