// checks if 2 locations are within a given radius from each other
function isLocationWithinRadius(lat1, lng1, radius, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance <= radius;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Helper function to calculate distance between two locations in km
function calculateDistance(locationA, locationB) {
  const earthRadius = 6371; // km

  const latDiff = ((locationB.latitude - locationA.latitude) * Math.PI) / 180;
  const lonDiff = ((locationB.longitude - locationA.longitude) * Math.PI) / 180;
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos((locationA.latitude * Math.PI) / 180) *
      Math.cos((locationB.latitude * Math.PI) / 180) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}
module.exports = { isLocationWithinRadius, calculateDistance };
