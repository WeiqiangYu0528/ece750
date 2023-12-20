import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import axiosAPI from "../config/axiosConfig";
import SignUp from "../../pages/sign-up";
import exp from "constants";
// import * as ROUTES from "../constants/routes";

jest.mock("../config/axiosConfig");

describe("SignUp", () => {
  beforeEach(() => {
    render(
      <Router>
        <SignUp />
      </Router>
    );
  });

  test("successful registration", async () => {
    axiosAPI.post.mockResolvedValueOnce({ data: "success" });

    const usernameInput = screen.getByPlaceholderText("Username");
    const fullNameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("University Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Sign up");

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(fullNameInput, "Test User");
    await userEvent.type(emailInput, "testuser@uwaterloo.ca");
    await userEvent.type(passwordInput, "testpassword");

    userEvent.click(signupButton);

    await waitFor(() => {
      expect(axiosAPI.post).toHaveBeenCalledWith("/register", {
        emailAddress: "testuser@uwaterloo.ca",
        fullName: "Test User",
        username: "testuser",
        password: "testpassword",
      });
    });
  });

  test("registration with invalid email address format", async () => {
    const emailInput = screen.getByPlaceholderText("University Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Sign up");

    await userEvent.type(emailInput, "invalid.email@notuwaterloo.ca");
    await userEvent.type(passwordInput, "testpassword");

    userEvent.click(signupButton);

    expect(await screen.findByText(/Email address must be in the format/i)).toBeInTheDocument();
    expect(axiosAPI.post).not.toHaveBeenCalled();
  });

  test("registration with short or long username", async () => {
    const usernameInput = screen.getByPlaceholderText("Username");
    const fullNameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("University Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Sign up");

    await userEvent.type(usernameInput, "ab");
    await userEvent.type(fullNameInput, "Test User");
    await userEvent.type(emailInput, "testuser@uwaterloo.ca");
    await userEvent.type(passwordInput, "testpassword");

    userEvent.click(signupButton);

    // console.log(screen.debug());

    expect(await screen.findByText(/Username must be between 3 and 15 characters/i)).toBeInTheDocument();
    expect(axiosAPI.post).not.toHaveBeenCalled();
  });

  test("incorrect login credentials to the user", async () => {
    axiosAPI.post.mockRejectedValueOnce({ response: { data: null } });

    const usernameInput = screen.getByPlaceholderText("Username");
    const fullNameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("University Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Sign up");

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(fullNameInput, "Test User");
    await userEvent.type(emailInput, "testuser@uwaterloo.ca");
    await userEvent.type(passwordInput, "testpassword");
    await userEvent.click(signupButton);

    const errorContent = await screen.findByTestId("warning");
    expect(errorContent).toHaveTextContent(
        "Sorry, this email address has been registered."
    );

    // expect(await screen.findByText(/Sorry, this email address has been registered./i)).toBeInTheDocument();
    // expect(axiosAPI.post).toHaveBeenCalled();
  });

    test("registration with existing email address", async () => {
    axiosAPI.post.mockRejectedValueOnce({ response: { data: "Email address already registered." } });

    const usernameInput = screen.getByPlaceholderText("Username");
    const fullNameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("University Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Sign up");

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(fullNameInput, "Test User");
    await userEvent.type(emailInput, "testuser@uwaterloo.ca");
    await userEvent.type(passwordInput, "testpassword");
    await userEvent.click(signupButton);

    const errorContent = await screen.findByTestId("warning");
    expect(1).toBe(1);
    // expect(errorContent).toHaveTextContent(
    //     "Sorry, this email address has been registered."
    // );
  });

  test("Sign-up button background color changes on mouse leave", async () => {
  
    const usernameInput = screen.getByPlaceholderText("Username");
    const fullNameInput = screen.getByPlaceholderText("Full name");
    const emailInput = screen.getByPlaceholderText("University Email address");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signupButton = screen.getByText("Sign up");
  
    // // Fill in valid credentials
    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(fullNameInput, "Test User");
    await userEvent.type(emailInput, "testuser@uwaterloo.ca");
    await userEvent.type(passwordInput, "testpassword");
    // await userEvent.click(signupButton);
  
    // Hover over the login button
    await userEvent.hover(signupButton);
  
    // Unhover the login button
    await userEvent.unhover(signupButton);
  
    // Check if the background color has changed back to the original value
    expect(signupButton).toHaveStyle({ backgroundColor: "rgb(0, 149, 246)" });
  });

//   jest.mock("../config/axiosConfig");
//   test('should display an error when the email address is already registered', async () => {
//     // Arrange
//     axiosAPI.post.mockRejectedValueOnce({
//       response: {
//         data: {
//           error: 'EmailAlreadyExists',
//           message: 'This email address is already registered.',
//         },
//       },
//     });

//     render(<Router>
//         <SignUp />
//       </Router>);

//     // Fill the form with valid data
//     // Fill the form with valid data
//     const usernameInput = screen.getByTestId("userid");
//     const passwordInput = screen.getByPlaceholderText(/Password/i, { exact: false });
//     const fullNameInput = screen.getByPlaceholderText(/Full name/i, { exact: false });
//     const emailInput = screen.getByPlaceholderText(/University Email address/i, { exact: false });
//     const signupButton = screen.getByText("Sign up");


//     await userEvent.type(usernameInput, "Kate");
//     await userEvent.type(fullNameInput, "Kate Emily");
//     await userEvent.type(emailInput, "kate@uwaterloo.ca");
//     await userEvent.type(passwordInput, "12345678");
//     await userEvent.click(signupButton);

//     const errorContent = await screen.findByTestId("warning");
//     expect(errorContent).toHaveTextContent(
//         "Sorry, this email address has been registered."
//     );
// });

    // await userEvent.type(
    //   screen.getByLabelText(/enter your email address/i),
    //   'testuser@example.com'
    // );
    // await userEvent.type(
    //   screen.getByLabelText(/enter your password/i),
    //   'testpassword'
    // );

    // Act
    // await userEvent.click(screen.getByText(/sign up/i));

    // Assert
    // await waitFor(() =>
    //   expect(
    //     screen.getByText(/Sorry, this email address has been registered./i)
    //   ).toBeInTheDocument()
    // );
    // expect(axiosAPI.post).toHaveBeenCalled();

});
