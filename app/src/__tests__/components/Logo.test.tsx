import Logo from "../../components/logo/Logo";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("Logo component", () => {
  it("renders correctly", () => {
    const { getByAltText } = render(<Logo />);
    const logoElement = screen.getByAltText("zenzone logo");
    expect(logoElement).toBeDefined();
  });

  it("has the correct src", () => {
    const { getByAltText } = render(<Logo />);
    const logoElement = screen.getByAltText("zenzone logo");
    expect(logoElement).toHaveClass('logo');
  });

  it("passes additional props correctly", () => {
    const { getByAltText } = render(<Logo className="custom-class" />);
    const logoElement = screen.getByAltText("zenzone logo");
    expect(logoElement).toHaveClass("custom-class");
  });
});
