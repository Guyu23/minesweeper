<script setup lang="ts">
// import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t } = useI18n()

// async function toggleLocales() {
//   // change to some real logic
//   const locales = availableLocales
//   const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
//   await loadLanguageAsync(newLocale)
//   locale.value = newLocale
// }

function changeBtn(func: () => void, $eve: MouseEvent): void {
  const x = $eve.clientX
  const y = $eve.clientY
  // 计算鼠标点击位置距离视窗的最大圆半径
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  document.documentElement.style.setProperty('--x',`${x}px`)
  document.documentElement.style.setProperty('--y', `${y}px`)
  document.documentElement.style.setProperty('--r', `${endRadius}px`)
  // 判断浏览器是否支持document.startViewTransition
  if ((document as any).startViewTransition) {
    (document as any).startViewTransition(() => {
      func();
    });
  } else {
    func();
  }
}

</script>

<template>
  <nav flex="~ gap-4" mt-6 justify-center text-xl>
    <!-- <RouterLink icon-btn to="/" :title="t('button.home')">
      <div i-carbon-campsite />
    </RouterLink> -->

    <button icon-btn :title="t('button.toggle_dark')" @click="changeBtn(toggleDark, $event)">
      <div i="carbon-sun dark:carbon-moon" />
    </button>

    <!-- <a icon-btn :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </a>

    <RouterLink icon-btn to="/about" :title="t('button.about')" data-test-id="about">
      <div i-carbon-dicom-overlay />
    </RouterLink>

    <a icon-btn rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank" title="GitHub">
      <div i-carbon-logo-github /> -->
    <!-- </a> -->
  </nav>
</template>
