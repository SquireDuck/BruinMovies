// import React from "react";
// import { render, fireEvent, screen } from "@testing-library/react";
// import SignInPage from "./page";
// import "@testing-library/jest-dom";
// import { useRouter } from "next/router";

// const mockRouter = {
//   push: jest.fn(),
//   prefetch: jest.fn(),
//   query: { id: "123" },
//   route: "/signin",
//   pathname: "/signin",
//   asPath: "/signin",
//   basePath: "",
//   isLocaleDomain: false,
//   isFallback: false,
// };

// jest.mock("next/router", () => ({
//   useRouter: jest.fn().mockReturnValue(mockRouter),
// }));

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe("SignInPage", () => {
//   it("renders sign in form", () => {
//     render(<SignInPage />);
//     expect(screen.getByPlaceholderText("Enter your username")).toBeInTheDocument();
//     expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
//   });

//   it("shows error when username and password are not provided", () => {
//     render(<SignInPage />);
//     fireEvent.click(screen.getByText("Sign In"));
//     expect(screen.getByText("Username and password are required.")).toBeInTheDocument();
//   });

//   it("toggles between sign in and register forms", () => {
//     render(<SignInPage />);
//     fireEvent.click(screen.getByText("Register"));
//     expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
//     fireEvent.click(screen.getByText("Sign In"));
//     expect(screen.queryByPlaceholderText("Enter your email")).not.toBeInTheDocument();
//   });
// });