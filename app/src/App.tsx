// This was copied from this tutorial: https://medium.com/geekculture/firebase-auth-with-react-and-typescript-abeebcd7940a
import React, { useContext, useRef } from "react";
import { Button, Col, Container, Form, Navbar, Row} from "react-bootstrap";
import { AuthContext } from "./context/AuthContext";
import { auth } from "./firebaseSetup";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

function App() {
  const user = useContext(AuthContext);

  // Email and password sign in
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Google authentication
  const provider = new GoogleAuthProvider();

  const googleSignIn = async () => {

    // Code from Firebase documentation
    const auth = getAuth();
    signInWithRedirect(auth, provider);
    
  }

  const createAccount = async () => {
    try {
      await auth.createUserWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <>
      <Navbar className="justify-content-between" bg="dark" variant="dark">
        <Navbar.Brand>Firebase Authentication</Navbar.Brand>
        {user && <Button onClick={signOut}>Sign Out</Button>}
      </Navbar>
      {!user ? (
        <Container style={{ maxWidth: "500px" }} fluid>
          <Form className="mt-4">
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control ref={emailRef} type="email" placeholder="email" />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                ref={passwordRef}
                type="password"
                placeholder="password"
              />
            </Form.Group>
            <Form.Group as = { Row } >
              <Col xs={6}>
                <Button onClick={createAccount} type="button">
                  Sign Up
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  onClick={signIn}
                  type="button"
                  variant="secondary"
                >
                  Sign In
                </Button>
              <Col xs = {6}>
                <Button
                onClick = {googleSignIn}
                type = "button"
                variant = "secondary"
                >
                  Google Sign In
                </Button>
              </Col>
              </Col>
            </Form.Group>
          </Form>
        </Container>
      ) : (
        <h2 className="mt-4 text-center">Welcome {user.email}</h2>
      )}
    </>
  );
}

export default App;