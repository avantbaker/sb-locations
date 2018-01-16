import { ScriptCache } from './ScriptCache';
import GoogleApi from './GoogleApi';
import axios from 'axios';


export const makeCancelable = (promise) => {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export const camelize = function(str) {
  return str.split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

export const mapStyles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
}

export const evtNames = ['ready', 'click', 'dragend', 'recenter'];


export const defaultCreateCache = (options) => {
    options = options || {};
    const apiKey = options.apiKey;
    const libraries = options.libraries || ['places'];
    const version = options.version || '3.25';

    return ScriptCache({
        google: GoogleApi({apiKey: apiKey, libraries: libraries, version: version})
    });
};

export const defaultMapConfig = {};

export const createPlacesRequest = ( center, radius = "8000", category ) => ({
    location: center,
    radius: radius,
    type: category,
    scrollwheel: false
});

export const createMapConfig = ( center, zoom ) => {
  return Object.assign({}, {
      center: center,
      zoom: zoom,
      visible: true
  });
};


export const getCurrentPosition = (setCallback, reloadCallback = () => {} ) => {
  return makeCancelable(
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })
  ).promise.then(pos => {
    const coords = pos.coords;
    setCallback({
        lat: coords.latitude,
        lng: coords.longitude
      });
    reloadCallback();
  }).catch(e => e);
}

export const makeGeoPromise = ( maps, address ) => {
  let geo = new maps.Geocoder();

  return new Promise(function(resolve, reject){
      geo.geocode( address, function(results, status){
          if( status == "OK" ){
            var options = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            }
          }
          resolve(options);
      });
  });
}

