<script>
  import Camera from '$lib/Camera.svelte'
  import PinDropMap from '$lib/PinDropMap.svelte'

  let dataUrl
</script>

<svelte:head>
  <title>Car Junk</title>
</svelte:head>

<section>
  <div class="well-width">
    <h1>Car Junk</h1>
    <p>See evidence of vehicle violence? Document it!</p>
    <!-- <Camera bind:dataUrl={dataUrl} /> -->
    <PinDropMap />
  </div>
</section>

<footer>
  <div>🚲 🚲 🚲</div>
</footer>

<style lang="scss">

  .well-width {
    max-width: 750px;
    margin: 0 auto;
  }
  h1 {
    font-weight: 700;
    text-align: center;
  }

  p {
    text-align: center;
  }

  footer {
    font-size: .9rem;
    padding-bottom: 1rem;
    text-align: center;
  }

</style>
