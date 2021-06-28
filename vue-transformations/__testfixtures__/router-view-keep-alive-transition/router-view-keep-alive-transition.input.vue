<template>
  <transition>
    <keep-alive>
      <router-view class="class one"></router-view>
    </keep-alive>
  </transition>

  <transition>
    <router-view class="class two"></router-view>
  </transition>
</template>
