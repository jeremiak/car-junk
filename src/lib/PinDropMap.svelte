<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";

  export let location;
  let deviceMarker, L, map, marker;

  function centerMapOnDevice() {
    if (!map) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        deviceMarker = L.marker(
          { lat, lng },
          { icon: L.divIcon({ className: 'device-marker', html: "📍" }) }
        ).addTo(map);
        map.setView({ lat, lng }, 16);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onMount(async () => {
    if (browser) {
      L = await import("leaflet");
      map = L.map("map").setView([38.5816, -121.4944], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        if (marker) {
          marker.setLatLng({ lat, lng });
        } else {
          marker = L.marker({ lat, lng }).addTo(map);
        }
        location = { lat, lng };
      });

      if (location) {
        marker = L.marker({
          lat: location.lat,
          lng: location.lng,
        }).addTo(map);
      }
    }
  });
</script>

<div class="map-container">
  <button on:click={centerMapOnDevice}>📍 Locate</button>
  <div id="map" />
</div>

<style>
  @import "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
  #map {
    height: 500px;
  }

  .map-container {
    position: relative;
  }

  button {
    background-color: white;
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10000;
  }

  :global(.device-marker) {
    font-size: 1rem;
  }
</style>
