import createGoogleMapsMock from "jest-google-maps-mock";

describe("createGoogleMapsMock", () => {
  let googleMaps: any;

  beforeEach(() => {
    googleMaps = createGoogleMapsMock();
  });

  it("should create a map mock", () => {
    const mapDiv = document.createElement("div");
    new googleMaps.Map(mapDiv);

    expect(googleMaps.Map).toHaveBeenCalledTimes(1);
    expect(googleMaps.Map.mock.instances.length).toBe(1);
    expect(googleMaps.Map).toHaveBeenLastCalledWith(mapDiv);
  });

  it("should create a marker mock at etlc", () => {
    const position = { lat: 53.52716644287327, lng: -113.5302139343207 };
    new googleMaps.Marker({ position });

    expect(googleMaps.Marker).toHaveBeenCalledTimes(1);
    expect(googleMaps.Marker.mock.instances.length).toBe(1);
    expect(googleMaps.Marker).toHaveBeenLastCalledWith({
      position,
    });
  });

  it("should create a mock with default options", () => {
    expect(googleMaps).toHaveProperty("Map");
    expect(googleMaps).toHaveProperty("Marker");
    expect(googleMaps).toHaveProperty("InfoWindow");
    expect(googleMaps).toHaveProperty("LatLng");
    expect(googleMaps).toHaveProperty("LatLngBounds");
  });

    it("should call setCenter method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setCenter();

      expect(map.setCenter).toHaveBeenCalled();
    });

    it("should call setClickableIcons method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setClickableIcons();

      expect(map.setClickableIcons).toHaveBeenCalled();
    });

    it("should call setHeading method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setHeading();

      expect(map.setHeading).toHaveBeenCalled();
    });

    it("should call setMapTypeId method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setMapTypeId();

      expect(map.setMapTypeId).toHaveBeenCalled();
    });

    it("should call setOptions method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setOptions();

      expect(map.setOptions).toHaveBeenCalled();
    });

    it("should call setStreetView method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setStreetView();

      expect(map.setStreetView).toHaveBeenCalled();
    });

    it("should call setTilt method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setTilt();

      expect(map.setTilt).toHaveBeenCalled();
    });

    it("should call getZoom method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.getZoom();

      expect(map.getZoom).toHaveBeenCalled();
    });

    it("should call setZoom method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.setZoom();

      expect(map.setZoom).toHaveBeenCalled();
    });

    it("should call fitBounds method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.fitBounds();

      expect(map.fitBounds).toHaveBeenCalled();
    });

    it("should call getBounds method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.getBounds();

      expect(map.getBounds).toHaveBeenCalled();
    });

    it("should call panToBounds method", () => {
      const map = new googleMaps.Map(document.createElement("div"), {});
      map.panToBounds();

      expect(map.panToBounds).toHaveBeenCalled();
    });

    it("should return mapDiv with getDiv method", () => {
      const mapDiv = document.createElement("div");
      const map = new googleMaps.Map(mapDiv, {});
      const returnedDiv = map.getDiv();

      expect(returnedDiv).toBe(mapDiv);
    });
});
