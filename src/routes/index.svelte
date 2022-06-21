<script context="module">
  export const prerender = false;
</script>

<script>
  import { v4 as uuid } from "uuid";
  import { writable } from "svelte/store";

  import supabase from "$lib/supabase";
  import Camera from "$lib/Camera.svelte";
  import PinDropMap from "$lib/PinDropMap.svelte";

  const hasSaved = writable(false);
  const isSaving = writable(false);
  const photo = writable(null);
  const location = writable(null);
  const steps = ["Take a picture", "Put it on a map", "Move on with your day"];
  const currentStep = writable(null);

  function handlePhoto({ detail }) {
    $photo = detail;
  }

  async function save() {
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

<section>
  <div class="well-width">
    <h1>Car Junk {$hasSaved}</h1>
    <p>See evidence of vehicle violence? Document it! {$currentStep}</p>
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
                }}
              >
                {step}
              </button>
            </li>
          {/each}
        </ul>
        {#if $currentStep === null}
          <button on:click={() => ($currentStep = 0)}> Start! </button>
        {:else if $currentStep === 0}
          <Camera on:photo={handlePhoto} />
        {:else if $currentStep === 1}
          <PinDropMap bind:location={$location} />
        {:else if $currentStep === 2}
          <div>
            <button on:click={save}
              >{#if $isSaving}Saving{:else if $hasSaved}Saved{:else}Save{/if}</button
            >
          </div>
        {/if}
      </div>
    {/if}
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

  .steps {
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    padding-left: 0;
  }

  .steps .active {
    background-color: green;
  }

  footer {
    font-size: 0.9rem;
    padding-bottom: 1rem;
    text-align: center;
  }
</style>
