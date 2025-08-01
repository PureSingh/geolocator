import React, { useState } from 'react';

interface UploadLocation {
  lat: number;
  lon: number;
  accuracy: number;
}

const UploadWithLocation = () => {
  const [location, setLocation] = useState<UploadLocation | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    setLoading(true);
    setUploadStatus('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 500) {
          setUploadStatus(`Upload blocked. Accuracy too low: ${Math.round(accuracy)}m`);
          setLoading(false);
          return;
        }

        const loc = { lat: latitude, lon: longitude, accuracy };
        setLocation(loc);

        // Simulate upload
        await new Promise((res) => setTimeout(res, 1500));
        setUploadStatus(`Upload successful! Location accuracy: ${Math.round(accuracy)}m`);
        setLoading(false);
      },
      (err) => {
        setUploadStatus('Location error: ' + err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={loading}
      />
      <p>{uploadStatus}</p>
      {location && (
        <p>
          📍 Lat: {location.lat.toFixed(5)} | Lon: {location.lon.toFixed(5)} | Accuracy:{' '}
          {Math.round(location.accuracy)}m
        </p>
      )}
    </div>
  );
};

export default UploadWithLocation;
