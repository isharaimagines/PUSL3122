import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders correct route for dashboard", () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});

test("renders correct route for login", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test("renders correct route for ItemShop (Home)", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/itemshop/i)).toBeInTheDocument();
});
