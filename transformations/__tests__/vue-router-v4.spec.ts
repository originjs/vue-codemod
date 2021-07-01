jest.autoMockOff()

import { defineTest } from 'jscodeshift/src/testUtils'

defineTest(__dirname, 'vue-router-v4', {}, 'vue-router-v4/create-router')
defineTest(__dirname, 'vue-router-v4', {}, 'vue-router-v4/create-history')
defineTest(__dirname, 'vue-router-v4', {}, 'vue-router-v4/rename-create-router')
defineTest(__dirname, 'router/router4-onready-to-isready', {}, 'vue-router-v4/router-ready')
defineTest(__dirname, 'router/router-update-addRoute', {}, 'vue-router-v4/router-addRoute')
