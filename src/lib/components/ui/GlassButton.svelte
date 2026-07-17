<script>
  /**
   * Primary (solid Robotics Blue) or glass (translucent) pill button.
   * See DESIGN.md § Components > Buttons. No black borders, ever.
   */
  /** @type {{ variant?: 'primary' | 'glass', href?: string, type?: 'button' | 'submit' | 'reset', class?: string, children?: import('svelte').Snippet, [key: string]: any }} */
  let {
    variant = 'primary',
    href = undefined,
    type = 'button',
    class: className = '',
    children,
    ...rest
  } = $props();

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0';

  /** @type {Record<string, string>} */
  const variants = {
    primary:
      'bg-robotics-blue text-white hover:bg-robotics-blue-deep shadow-ambient shadow-ambient-hover',
    glass: 'glass-tile rounded-full bg-glass-white text-ink-900'
  };

  const classes = $derived(`${base} ${variants[variant] ?? variants.primary} ${className}`);
</script>

{#if href}
  <a {href} class={classes} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <button {type} class={classes} {...rest}>
    {@render children?.()}
  </button>
{/if}
