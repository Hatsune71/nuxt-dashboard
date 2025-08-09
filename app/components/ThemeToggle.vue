<script setup lang="ts">
import { useColorMode } from '#imports'

const colorMode = useColorMode()

const toggleTheme = (e: MouseEvent) => {
  const nextTheme = colorMode.value === 'dark' ? 'light' : 'dark'

  if (!document.startViewTransition) {
    colorMode.preference = nextTheme
    return
  }
  const button = e.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const maxRadius = Math.hypot(window.innerWidth, window.innerHeight)
    document.startViewTransition(() => {
    colorMode.preference = nextTheme
  }).ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${maxRadius}px at ${x}px ${y}px)`
    ]
    document.documentElement.animate(
      { clipPath },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}

</script>

<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    aria-label="Ganti tema"
  />
</template>

<style>
.theme-toggle {
  --size: 1.1rem;

  appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
  
  width: var(--size);
  height: var(--size);
  border-radius: 999px;
  transition: all 500ms;
}

html:not(.dark) .theme-toggle {
  --ray-size: calc(var(--size) * -0.4);
  --offset-orthogonal: calc(var(--size) * 0.65);
  --offset-diagonal: calc(var(--size) * 0.45);

  transform: scale(0.75);
  color: hsl(40, 100%, 50%);
  
  box-shadow: 
    inset 0 0 0 var(--size),
    calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size),
    var(--offset-orthogonal) 0 0 var(--ray-size),
    0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size),
    0 var(--offset-orthogonal) 0 var(--ray-size),
    calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size),
    var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size),
    calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size),
    var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
}

html.dark .theme-toggle {
  transform: scale(1);
  color: hsl(240, 100%, 95%);

  box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
}

html {
  view-transition-name: root;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}
</style>