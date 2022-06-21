<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";

  // export let data = null

  let canvas, img, video;
  const facingMode = writable("user");
  const hasEnteredCamera = writable(false);
  const hasTakenPhoto = writable(false);
  const supportsCamera = writable(false);

  const dispatch = createEventDispatcher();

  onMount(async () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      $supportsCamera = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        facingMode: "user",
      });
      video.srcObject = stream;
      video.play();

      $hasEnteredCamera = true;
    }
  });

  function handleClearPhoto() {
    $hasTakenPhoto = false;
  }

  async function handleTakePictureClick(e) {
    const context = canvas.getContext("2d");
    const width = video.clientWidth;
    const height = video.clientHeight;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(blob => {
      dispatch("photo", blob);
      $hasTakenPhoto = true;
    })
  }

  async function handleChangeCamera(e) {
    $facingMode = $facingMode === "user" ? "environment" : "user";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      facingMode: $facingMode,
    });
    video.srcObject = stream;
    video.play();
  }
</script>

<div>
  <div class="canvas-video-container">
    <canvas bind:this={canvas} style:opacity={$hasTakenPhoto ? 1 : 0} />
    <video bind:this={video} style:opacity={$hasTakenPhoto ? 0 : 1} />
    <div class="controls">
      {#if $supportsCamera}
        {#if $hasTakenPhoto}
          <button on:click={handleClearPhoto}>Clear</button>
        {:else}
          <button on:click={handleChangeCamera}>Change camera</button>
          <button on:click={handleTakePictureClick}>Click</button>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .canvas-video-container {
    position: relative;
    height: 100vh;
    max-height: 500px;
    max-width: 700px;

    canvas,
    video {
      border: 1px solid black;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }

    .controls {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: space-around;
      position: relative;
      width: 100%;
      z-index: 100;
    }
  }

  button {
    background-color: white;
  }
</style>
