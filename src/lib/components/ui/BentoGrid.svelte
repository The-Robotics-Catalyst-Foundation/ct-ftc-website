<script>
  /**
   * Breakpoint-free bento layout — see DESIGN.md § Components > Glass Tiles > Grid.
   * Children provide their own grid-column/grid-row spans for hero-sized tiles.
   */
  let { class: className = '', minTile = '240px', gap = 'gap-5', children, ...rest } = $props();
</script>

<div
  class="grid {gap} {className}"
  style="grid-template-columns: repeat(auto-fit, minmax({minTile}, 1fr));"
  {...rest}
>
  {@render children?.()}
</div>
