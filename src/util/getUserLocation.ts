type UserLocation = {
  latitude: number;
  longitude: number;
  source: "gps" | "ip";
};

export async function getUserLocation(): Promise<UserLocation> {
  // Check if browser supports Geolocation API
  if ("geolocation" in navigator) {
    return new Promise<UserLocation>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            source: "gps",
          });
        },
        async () => {
          // If denied or failed → fallback to IP-based
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          resolve({
            latitude: data.latitude,
            longitude: data.longitude,
            source: "ip",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  // If geolocation not supported → fallback to IP
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    source: "ip",
  };
}
