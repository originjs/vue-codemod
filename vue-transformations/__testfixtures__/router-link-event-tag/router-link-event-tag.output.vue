<template>
  <router-link class="one" to="/about" custom v-slot="{ navigate }"><span @dblclick="navigate">About Us</span></router-link>

  <router-link class="one" to="/about" custom v-slot="{ navigate }"><span @click="navigate">About Us</span></router-link>

  <router-link class="one" to="/about" custom v-slot="{ navigate }"><a @dblclick="navigate">About Us</a></router-link>

  <router-link class="one" to="/about" custom v-slot="{ navigate }"><span @click="navigate" @dblclick="navigate">About Us</span></router-link>

  <router-link class="one" to="/about" custom v-slot="{ navigate }"><a @click="navigate" @dblclick="navigate">About Us</a></router-link>
</template>
