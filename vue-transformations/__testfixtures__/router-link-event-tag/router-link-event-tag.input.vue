<template>
  <router-link class="one" to="/about" tag="span" event="dblclick">About Us</router-link>

  <router-link class="one" to="/about" tag="span">About Us</router-link>

  <router-link class="one" to="/about" event="dblclick">About Us</router-link>

  <router-link class="one" to="/about" tag="span" event="['click', 'dblclick']">About Us</router-link>

  <router-link class="one" to="/about" event="['click', 'dblclick']">About Us</router-link>
</template>
