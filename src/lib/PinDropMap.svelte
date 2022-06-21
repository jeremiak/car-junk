<script>
  import { onMount } from "svelte";
  import { browser } from "$app/env";

  export let location;
  let map, marker;

  function centerMapOnDevice() {
    if (!map) return
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude: lat, longitude: lng } = position.coords
      map.setView({ lat, lng })
    }, err => {
      console.error(err)
    })
  }

  onMount(async () => {
    if (browser) {
      const leaflet = await import("leaflet");
      map = leaflet.map("map").setView([38.5816, -121.4944], 15);
      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        if (marker) {
          marker.setLatLng({ lat, lng });
        } else {
          marker = leaflet.marker({ lat, lng }).addTo(map);
        }
        location = { lat, lng };
      });

      if (location) {
        marker = leaflet.marker({
          lat: location.lat,
          lng: location.lng
        }).addTo(map);
      }
    }
  });
</script>

<div class="map-container">
  <button on:click={centerMapOnDevice}>Locate</button>
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

  /* button {
    position: absolute;
  } */
</style>
