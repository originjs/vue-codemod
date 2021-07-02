<template>
  <router-view :key="key" class="class one" v-slot="{ Component }"><transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition></router-view>

  <router-view :key="key" class="class two" v-slot="{ Component }"><transition>
    <component :is="Component" />
  </transition></router-view>
</template>
