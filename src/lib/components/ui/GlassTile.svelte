<script>
  /**
   * A single frosted "Control Center" bento tile — see DESIGN.md § Components > Glass Tiles.
   * Renders as an <a> when href is passed, a <div> otherwise.
   */
  let {
    strong = false,
    href = undefined,
    rounded = 'rounded-[2rem]',
    padding = 'p-8',
    class: className = '',
    children,
    ...rest
  } = $props();

  const tileClass = $derived(
    `glass-tile ${strong ? 'glass-tile-strong' : ''} ${rounded} ${padding} ${className}`
  );
</script>

{#if href}
  <a {href} class="{tileClass} block" {...rest}>
    {@render children?.()}
  </a>
{:else}
  <div class={tileClass} {...rest}>
    {@render children?.()}
  </div>
{/if}
