import createGoogleMapsMock from "jest-google-maps-mock";

describe("Marker component", () => {
  let googleMaps: any;

  beforeEach(() => {
    googleMaps = createGoogleMapsMock();
  });

  it("should create a Marker mock with specified options", () => {
    const position = { lat: 53.52716644287327, lng: -113.5302139343207 };
    const marker = new googleMaps.Marker({ position });

    expect(marker.opts).toEqual({ position });
  });

  it("should call setMap method", () => {
    const marker = new googleMaps.Marker({});
    marker.setMap();

    expect(marker.setMap).toHaveBeenCalled();
  });

  it("should call setOpacity method", () => {
    const marker = new googleMaps.Marker({});
    marker.setOpacity();

    expect(marker.setOpacity).toHaveBeenCalled();
  });

  it("should call setOptions method", () => {
    const marker = new googleMaps.Marker({});
    marker.setOptions();

    expect(marker.setOptions).toHaveBeenCalled();
  });

  it("should call setPosition method", () => {
    const marker = new googleMaps.Marker({});
    marker.setPosition();

    expect(marker.setPosition).toHaveBeenCalled();
  });

  it("should call setShape method", () => {
    const marker = new googleMaps.Marker({});
    marker.setShape();

    expect(marker.setShape).toHaveBeenCalled();
  });

  it("should call setTitle method", () => {
    const marker = new googleMaps.Marker({});
    marker.setTitle();

    expect(marker.setTitle).toHaveBeenCalled();
  });

  it("should call setVisible method", () => {
    const marker = new googleMaps.Marker({});
    marker.setVisible();

    expect(marker.setVisible).toHaveBeenCalled();
  });

  it("should call setZIndex method", () => {
    const marker = new googleMaps.Marker({});
    marker.setZIndex();

    expect(marker.setZIndex).toHaveBeenCalled();
  });
});
