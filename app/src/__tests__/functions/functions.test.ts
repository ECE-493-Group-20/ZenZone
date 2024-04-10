import { distanceLatLon, getMicrophoneStats, getLocation, findCurrentLocation } from '../../scripts/Firebase';
import { toggleMicrophone } from '../../scripts/microphone';

// Helper function to convert degrees to radians
function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

jest.mock('../../scripts/microphone', () => ({
  toggleMicrophone: jest.fn().mockResolvedValue(true),
}));

// jest.mock('../../scripts/Firebase', () => ({
  
// }));

describe('distanceLatLon', () => {
  it('calculates distance between two different points correctly', () => {
    const lat1 = 40.7128;
    const lon1 = -74.0060;
    const lat2 = 34.0522;
    const lon2 = -118.2437;

    const expectedDistance = 3935746.254;
    const calculatedDistance = distanceLatLon(lat1, lon1, lat2, lon2);

    const tolerance = 1;
    expect(calculatedDistance).toBeCloseTo(expectedDistance, tolerance);
  });

  it('returns 0 when coordinates are the same', () => {
    const lat1 = 40.7128;
    const lon1 = -74.0060;

    const distance = distanceLatLon(lat1, lon1, lat1, lon1);
    expect(distance).toBe(0);
  });

});

describe('getMicrophoneStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('toggles microphone when called', async () => {
    await getMicrophoneStats();

    expect(toggleMicrophone).toHaveBeenCalledTimes(1);
  });

});

// describe('findCurrentLocation', () => {
//   // Reset mock before each test
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('calls getLocation with a callback function', () => {
//     // Mock locations data
//     const locations = {};

//     // Call the function
//     findCurrentLocation(locations);

//     // Assert that getLocation is called with a callback function
//     expect(getLocation).toHaveBeenCalledTimes(1);
//     expect(getLocation).toHaveBeenCalledWith(expect.any(Function));
//   });
// });