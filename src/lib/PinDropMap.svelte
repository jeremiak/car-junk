<script>
  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import leaflet from 'leaflet'
  import PickAPlace from 'svelte-pick-a-place';

  const coordinates = writable({ lat: null, lng: null })
  const coordinatesError = writable(null)
  async function handleLocateClick() {
    function success(position) {
      const { latitude: lat, longitude: lng } = position.coords
      $coordinates = {
        lat,
        lng,
      }
    }
    function error(err) {
      $coordinatesError = err
    }
    navigator.geolocation.getCurrentPosition(success, error, { timeout: 5000 })
  }

  // onMount(() => {
  //   const mapContainer = document.querySelector("#map-container")
  //   let map = L.map(mapContainer)//.setView(initialView, 5)
  //   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   }).addTo(map)
  // })

  function handleMapUpdate(e) {
    console.log('e', e)
  }
</script>

<div class="container">
  <PickAPlace {leaflet} on:update={handleMapUpdate} />
  <div id="map-container" />
  <button on:click={handleLocateClick}>Locate</button>
</div>

<style lang="scss">
  .container {
    align-items: center;
    // background-color: pink;
    display: flex;
    height: 100vh;
    justify-content: center;
    max-height: 600px;
    max-width: 700px;
    position: relative;
    width: 100%;
  }

  #map-container {
    height: 100vh;
    left: 0;
    position: absolute;
    width: 100vw;
  }

  button {
    background-color: white;
  }
</style>
