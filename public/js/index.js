const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error)
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Zain Shah",
}).addTo(map);

const makers = {};

socket.on("recieve-location", (data) => {
  const { id, longitude, latitude } = data;
  map.setView([latitude, longitude]);

  if (makers[id]) {
    makers[id].setLatLng([latitude, longitude]);
  } else {
    makers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (data) => {
  const id = data.id;
  if (makers[id]) {
    map.removeLayer(makers[id]);
    delete makers[id];
  }
});
