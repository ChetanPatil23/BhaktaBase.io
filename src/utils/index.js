export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[789]\d{9}$/; // Starts with 7, 8, or 9 and has 10 digits
  return phoneRegex.test(phone);
};

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in km
};

export const getTopThreeDevotees= (devotees) => {
  const sortedDevotees = [...devotees].sort((a, b) => b.chantingRounds - a.chantingRounds);
  return sortedDevotees.slice(0, 3);
}
