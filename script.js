const map = L.map("map").setView([20, 0], 2);

L.tileLayer(
  `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${maptilerKey}`,
  {
    tileSize: 256,
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }
).addTo(map);

map.on("click", function (event) {
  const latlng = event.latlng;
  const marker = L.marker([latlng.lat, latlng.lng]);
  marker.addTo(map);
});
