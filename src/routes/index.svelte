<script context="module">
  export const prerender = false;
</script>

<script>
import { browser } from '$app/env';
  import { v4 as uuid } from "uuid";
  import { writable } from "svelte/store";

  import supabase from "$lib/supabase";
  import Camera from "$lib/Camera.svelte";
  import PinDropMap from "$lib/PinDropMap.svelte";

  const hasManuallyChangedSteps = writable(false);
  const hasSaved = writable(false);
  const isSaving = writable(false);
  const photo = writable(null);
  const location = writable(null);
  const steps = ["Take a picture", "Put it on a map", "Move on with your day"];
  const currentStep = writable(null);
  const nextStepIn = writable(null);

  function callNextStep(next, timeout = 1500) {
    if (!browser) return
    if ($hasManuallyChangedSteps) return
    let elapsed = 0;
    let interval = setInterval(() => {
      elapsed += 500;

      if (elapsed < timeout) {
        $nextStepIn = timeout - elapsed;
        return;
      }

      window.clearInterval(interval);
      $nextStepIn = null;
      next();
    }, 500);
  }

  function handlePhoto({ detail }) {
    $photo = detail;
    
    if (!detail) return
    callNextStep(() => {
      $currentStep = 1;
    }, 2500);
  }

  location.subscribe((value) => {
    if (value === null) return
    console.log({ value })
    callNextStep(() => {
      $currentStep = 2;
    }, 2500);
  })

  async function save() {
    $isSaving = true;
    const id = uuid();
    console.log({ id, photo }, $location);

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(`${id}.png`, $photo, {
        contentType: "image/png",
      });

    const response = await fetch("/junk.json", {
      method: "POST",
      body: JSON.stringify({
        id,
        lat: $location.lat,
        lng: $location.lng,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    $hasSaved = true;
    $isSaving = false;
  }
</script>

<svelte:head>
  <title>Car Junk</title>
</svelte:head>

<header>
  <h1 class="well-width">Car Junk</h1>
  <marquee>🚴 🚴 🚴 🚴 🚴</marquee>
</header>

<section>
  <div class="well-width">
    <p>See evidence of vehicle violence? Document it!</p>
    {#if $hasSaved}
      <p>Thanks for reporting car junk!</p>
    {:else}
      <div>
        <ul class="steps">
          {#each steps as step, i}
            <li class:active={i === $currentStep}>
              <button
                on:click={() => {
                  $currentStep = i;
                  $hasManuallyChangedSteps = true
                }}
              >
                Step: {i + 1}: {step}
              </button>
            </li>
          {/each}
        </ul>
        {#if $currentStep === null}
          <div class="start-container">
            <button on:click={() => ($currentStep = 0)}>🚀  Start!</button>
          </div>
        {:else if $currentStep === 0}
          <Camera initialBlob={$photo} on:photo={handlePhoto} />
        {:else if $currentStep === 1}
          <PinDropMap bind:location={$location} />
        {:else if $currentStep === 2}
          <div class="save-container">
            <button on:click={save}
              >💾  {#if $isSaving}Saving{:else if $hasSaved}Saved{:else}Save{/if}</button
            >
          </div>
        {/if}
        {#if $nextStepIn !== null}
          <p>{$nextStepIn / 1000} seconds until next step</p>
        {/if}
      </div>
    {/if}
  </div>

  {#if $currentStep === null}
  <details class="well-width" open>
    <summary>What is this?</summary>
    <div>
      <p>Insurance data and police reports aren't good enough data sets for determining the safety of a roadway. Some accidents aren't filed with insurance, many aren't filed with the police. So we're measuring a proxy of safety: accident debris.</p>
      <p>Debris from cars is a good sign a collision has occurred in that area or at least nearby. Taking pictures of car junk and geocoding them with a map gives us another way to advocate for vehicle mitigation methods.</p>
      <p>The data isn't publicly available, yet, out of concerns for content moderation. The code for this application is open, however, and can be found <a href="https://www.github.com/jeremiak/car-junk">on Github</a>.</p>
    </div>
  </details>
  {/if}
</section>

<footer>
  <div>🚲 Ride safe!</div>
</footer>

<style lang="scss">
  section {
    margin-top: 1.5rem;
  }
  .well-width {
    max-width: 750px;
    margin: 0 auto;
  }

  header {
    margin-top: 6vh;
  }
  h1 {
    display: block;
    font-weight: 700;
    text-align: center;
  }

  marquee {
    margin-top: 1rem;
  }

  p {
    text-align: center;
  }

  details {
    padding-top: 3rem;
  }

  summary {
    font-weight: 700;
  }

  details p {
    text-align: left;
  }

  .steps {
    color: #ebebeb;
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 0;

    li {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    li::before {
      align-items: center;
      background-color: none;
      border-radius: 3rem;
      content: "👇";
      display: flex;
      font-size: 2rem;
      height: 3rem;
      justify-content: center;
      pointer-events: none;
      // position: absolute;
      opacity: 0;
      width: 3rem;
    }

    button {
      border: none;
      color: #ebebeb;
    }
  }

  .steps .active::before {
    opacity: .8;
    z-index: 0;
    // background-color: green;
  }

  .start-container,
  .save-container {
    align-items: center;
    display: flex;
    justify-content: center;

    button {
      border: none;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }


  .start-container {
    button {
      background-color: #ebebeb;
      color: #212121;
      font-size: 2.5rem;
      width: 80%;
    }

    button:hover {
      background-color: #bcbcbc;
    }
  }
  .save-container {
    button {
      background-color: gold;
    }
  }

  footer {
    align-items: center;
    bottom: 0;
    display: none;
    font-size: 0.9rem;
    justify-content: center;
    margin-top: 20rem;
    padding-bottom: 1rem;
    position: sticky;
  }
</style>
