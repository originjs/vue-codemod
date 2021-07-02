<template>
  <transition>
    <keep-alive>
      <router-view :key="key" class="class one"></router-view>
    </keep-alive>
  </transition>

  <transition>
    <router-view :key="key" class="class two"></router-view>
  </transition>
</template>
