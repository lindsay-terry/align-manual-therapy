import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const latitude = 37.1122592;  
  const longitude = -113.5957902;

  useEffect(() => {
    // Initialize the map and set its view to the provided coordinates (latitude, longitude)
    const map = L.map('mapid').setView([latitude, longitude], 13);

    // Add Esri World Imagery (Satellite) tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com">Esri</a>, Earthstar Geographics',
    }).addTo(map);

    // Add a marker with a popup that contains a link
    const popupContent = `
      <a href="https://www.google.com/maps/place/Dragon-Massage/@37.1121227,-113.598272,16z/data=!3m1!4b1!4m6!3m5!1s0x80ca44c1c4500001:0x3597d13902b7d713!8m2!3d37.1121185!4d-113.5956917!16s%2Fg%2F11g07952sd?entry=ttu&g_ep=EgoyMDI0MDkxOC4xIKXMDSoASAFQAw%3D%3D" target="_blank" style="color: blue; text-decoration: underline;">
        Align Manual Therapy
        St. George Massage
      </a>
    `;

    L.marker([latitude, longitude]).addTo(map)
      .bindPopup(popupContent)
      .openPopup();

    setTimeout(() => {
      map.invalidateSize();  // Fixes the grey area
    }, 100);

    // Clean up the map instance when the component unmounts
    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div id="mapid" style={{ height: '400px', width: '60%' }}></div>
    </div>
  );
};

export default MapComponent;