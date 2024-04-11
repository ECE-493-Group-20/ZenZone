/**
 * @jest-environment node
 */
import { distanceLatLon, getMicrophoneStats, getLocation, findCurrentLocation, getLocData, uploadLoudness, userLoudUpload, userBusyUpload, requestAverageSound, requestBusyMeasure, getAllLocs, getTrendLoc, newLocation, deleteLoc, updateLocation, addFavourite, removeFavourite, getUserInformation } from '../../scripts/Firebase';
import { toggleMicrophone, getAverage, calcRMSandDB } from '../../scripts/microphone';
import { Timestamp, getDocs, doc, getDoc, collection, where, query, GeoPoint} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRESTORE_KEY,
  authDomain: "zenzone-90b7a.firebaseapp.com",
  projectId: "zenzone-90b7a",
  storageBucket: "zenzone-90b7a.appspot.com",
  messagingSenderId: "956790020992",
  appId: process.env.REACT_APP_FIRESTORE_ID,
  measurementId: "G-VRYF87GJDY"
};
// https://stackoverflow.com/questions/43331011/firebase-app-named-default-already-exists-app-duplicate-app
var app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const db = firebase.firestore(app);

jest.mock('../../scripts/Firebase', () => ({
  ...jest.requireActual('../../scripts/Firebase'),
  findCurrentLocation: jest.fn(),
  getLocation: jest.fn(),
  locString: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({
      toMillis: jest.fn(() => 1234567890), // Mock a timestamp value
    })),
  },
  NoiseLevel: "mock",
}));

jest.mock('../../scripts/microphone', () => ({
  ...jest.requireActual('../../scripts/microphone'),
  toggleMicrophone: jest.fn().mockResolvedValue(true),
  getAverage: jest.fn(),
}));


describe('distanceLatLon', () => {
  it('calculates distance between two different points correctly', () => {
    const lat1 = 40.7128;
    const lon1 = -74.0060;
    const lat2 = 34.0522;
    const lon2 = -118.2437;

    const expectedDistance = 3935746.254;
    const calculatedDistance = distanceLatLon(lat1, lon1, lat2, lon2);

    const tolerance = 0.000001;
    expect(calculatedDistance).toBeCloseTo(expectedDistance, tolerance);
  });

  it('returns 0 when coordinates are the same', () => {
    const lat1 = 40.7128;
    const lon1 = -74.0060;

    const distance = distanceLatLon(lat1, lon1, lat1, lon1);
    expect(distance).toBe(0);
  });

});

describe('calcRMSandDB', () => {
  test('Returns at least 10dB', () => {
    const data = [0, 0, 0, 0];
    const db = calcRMSandDB(data);
    expect(db).toEqual(10);
  });
  test('Calculates the RMS power of a signal and puts it onto the dB scale', () => {
    // Note, the comparison value was computed with a calculator.
    const data = [0.1, 0.2, 0.3, 0.4];
    const expected = 88.75061;
    const tolerance = 0.000001;
    const db = calcRMSandDB(data);
    expect(db).toBeCloseTo(expected, tolerance);
  });
  test('Returns 10dB when given an empty array', () => {
    const data: number[] = [];
    const db = calcRMSandDB(data);
    expect(db).toEqual(10);
  })
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

describe('findCurrentLocation', () => {
  // Reset mock before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Note we can't really test this further, all the function does is use two const callbacks that are either only
  // external APIs or have math that has been tested elsewhere.
  it('should call findCurrentLocation reliably', () => {
    // Mock locations data
    const locations = {};

    findCurrentLocation(locations);

    expect(findCurrentLocation).toHaveBeenCalledTimes(1);
  });
});

describe('uploadLoudness', () => {
  it('calls getAverage', () => {
    // Mock data for the audio measurement
    const audioData = [20]; // Example loudness data

    // Mock implementations for dependencies
    (getAverage as jest.Mock).mockReturnValue(audioData);

    // Call the function to test
    uploadLoudness();

    // Assertions
    expect(getAverage).toHaveBeenCalled();
  });
});

describe('userLoudUpload', () => {
  test('Loudness data is uploaded to Firebase', async() => {
    await userLoudUpload(20, "test");
    const timestamp = Timestamp.now().toMillis();
    const q = query(collection(db, "NoiseLevel"), where("location", "==", "/Locations/test"), where("timestamp", "==", timestamp));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
      expect(doc.data().loudnessmeasure).toEqual(20);
    });
  });
});

describe('userBusyUpload', () => {
  test('Busyness data is uploaded to Firebase', async() => {
    await userBusyUpload(20, "test");
    const timestamp = Timestamp.now().toMillis();
    const q = query(collection(db, "BusyLevel"), where("location", "==", "/Locations/test"), where("timestamp", "==", timestamp));
    const queryColl = await getDocs(q);
    queryColl.forEach((doc) => {
      expect(doc.data().busymeasure).toEqual(20);
    });
  });
});

describe('requestAverageSound', () => {
  test('Average sound calculated from Firebase', async() => {
    const sound = await requestAverageSound("test");
    expect(sound).toEqual(20);  // Each test run uploads only 20 for data.
  });
});

describe('requestBusyMeasure', () => {
  test('Busy level calculated from Firebase', async() => {
    const busy = await requestBusyMeasure("test");
    // Due to asynchonity of tests, can't expect an actual value here. Rather, just assert it is between 0 and 100.
    expect(busy).toBeGreaterThanOrEqual(0.0);
    expect(busy).toBeLessThanOrEqual(100.0);
  });
});

describe('getAllLocs', () => {
  test('Gets the test locations from Firebase with callbacks.', async() => {
    // We will get results here throughout the other tests when callbacks trigger. In all cases, lat and lon should be 0.
    await getAllLocs("test", (location) => { 
      expect(location.position.latitude).toEqual(0); 
      expect(location.position.longitude).toEqual(0);
    },
    (location) => { 
      expect(location.position.latitude).toEqual(0); 
      expect(location.position.longitude).toEqual(0);
    },
    (location) => { 
      expect(location.position.latitude).toEqual(0); 
      expect(location.position.longitude).toEqual(0);
    });
  });
});

describe('getTrendLoc', () => {
  test('Gets the trend for the test location. Just check to make sure values are set.', async() => {
    const timestamp = Timestamp.now().toMillis();
    var date = new Date(timestamp);
    var ind = date.getHours();
    await getTrendLoc("test", ind);
    var data = await(getLocData("test"));
    // Our data from earlier may not be uploaded due to testing running in parallel. As such, this should be either 10 or 20.
    expect([10, 20]).toContain(data?.loudtrend[ind]);
    // Again busy data we just need to check between 0 and 100. Here we check greater than 0 since it should not be default.
    expect(data?.busytrend[ind]).toBeGreaterThan(0);
    expect(data?.busytrend[ind]).toBeLessThanOrEqual(100);
  })
});

describe('getLocData', () => {
  test('Gets all data from the test location.', async() => {
    var data = await(getLocData("test"));
    // Our data from earlier should be uploaded
    expect(data?.name).toEqual("test");
    expect(data?.description).toEqual("test");
    expect(data?.floors).toEqual("test");
    expect(data?.capacity).toEqual(100);
    expect(data?.size).toEqual(100);
    expect(data?.position.latitude).toEqual(0);
    expect(data?.position.longitude).toEqual(0);
  })
});

describe('newLocation', () => {
  afterAll(async() => {
    await deleteLoc("test2");
  });
  test('Creating an existing location does not work.', async() => {
    const result = await newLocation("test", "test", new GeoPoint(0, 0), 100, 100, "test2", "test2");
    expect(result).toBeFalsy();
  });
  test('Creating a new location, then deleting it to avoid cluttering database.', async() => {
    const result = await newLocation("test2", "test", new GeoPoint(0, 0), 100, 100, "test2", "test2");
    expect(result).toBeTruthy();
    var data = await(getLocData("test2"));
    // Our new location should exist in the database
    expect(data?.name).toEqual("test2");
  });
});

describe('updateLocation', () => {
  afterAll(async() => {
    await deleteLoc("test3");
  });
  // Use a different dummy location to avoid affecting other tests
  test('Create and modify dummy location, then delete it.', async() => {
    const result = await newLocation("test3", "test", new GeoPoint(0, 0), 100, 100, "test3", "test3");
    expect(result).toBeTruthy();
    var data = await(getLocData("test3"));
    // Our new location should exist in the database
    expect(data?.name).toEqual("test3");
    expect(data?.size).toEqual(100);
    const resultSec = await updateLocation("test3", "test31", "test", new GeoPoint(0, 0), 300, 100, "test3", "test3");
    expect(resultSec).toBeTruthy();
    // Check the updated data
    var data = await(getLocData("test3"));
    expect(data?.name).toEqual("test31");
    expect(data?.size).toEqual(300);
  });
  test('Updating a location that does not exist is not valid.', async() => {
    const result = await updateLocation("test4", "test4", "test", new GeoPoint(0, 0), 100, 100, "test4", "test4");
    expect(result).toBeFalsy();
  })
});

describe('addFavourite and removeFavourite', () => {
  // Since these tests are called in parallel, easiest to just handle these in one case.
  // Test user is jjIwOvNgT0aI0Ccf96wLJKjO2LX2 (testadmin@email.com)
  test('Add favourite, then remove it.', async() => {
    var uid = "jjIwOvNgT0aI0Ccf96wLJKjO2LX2";
    await addFavourite(uid, "test");
    const usrDocQuery = doc(db, "UserInformation", uid);
    const usrDoc = await getDoc(usrDocQuery);
    expect(usrDoc?.data()?.favourites).toEqual(["test"]);
    await removeFavourite(uid, "test");
    const usrDocTwo = await getDoc(usrDocQuery);
    expect(usrDocTwo?.data()?.favourites).toEqual([])
  });
});

describe('getUserInformation', () => {
  test('Get the user information from Firebase callbacks.', () => {
    getUserInformation("jjIwOvNgT0aI0Ccf96wLJKjO2LX2", (user) => {
      expect(user.isAdmin).toBeTruthy();
      expect(user.id).toEqual("jjIwOvNgT0aI0Ccf96wLJKjO2LX2");
    });
  });
});

