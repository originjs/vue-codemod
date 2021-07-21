import * as pack from '../packageTransformation'

describe('run-packageTransformation', () => {
let input =
`{
	"dependencies": {
		"vue": "^2.6.10",
		"vue-i18n": "^8.14.0",
		"vue-router": "^3.1.2",
		"vuex": "^3.1.1",
    "@vue/composition-api": "^1.0.0-rc.12"
	},
	"peerDependencies": {
		"vue": "^2.6.10",
		"vue-i18n": "^8.14.0",
		"vue-router": "^3.1.2",
		"vuex": "^3.1.1",
    "@vue/composition-api": "^1.0.0-rc.12"
	},
	"devDependencies": {
		"babel-eslint": "^10.0.2",
		"vue": "^2.6.10",
		"vue-i18n": "^8.14.0",
		"vue-router": "^3.1.2",
		"vuex": "^3.1.1",
    "@vue/composition-api": "^1.0.0-rc.12"
	},
	"eslintConfig": {
		"root": true,
		"env": {
			"node": true
		},
		"extends": [
			"plugin:vue/essential",
			"eslint:recommended"
		],
		"rules": {},
		"parserOptions": {
			"parser": "babel-eslint"
		}
	}
}
` 
let output =
`{
	"dependencies": {
		"vue": "^3.1.1",
		"vue-i18n": "^9.1.6",
		"vue-router": "^4.0.8",
		"vuex": "^4.0.1"
	},
	"peerDependencies": {
		"vue": "^3.1.1",
		"vue-i18n": "^9.1.6",
		"vue-router": "^4.0.8",
		"vuex": "^4.0.1"
	},
	"devDependencies": {
		"@babel/core": "^7.14.6",
		"@babel/eslint-parser": "^7.14.6",
		"@vue/compiler-sfc": "^3.1.1",
		"eslint": "^7.20.0",
		"eslint-plugin-vue": "^7.11.1",
		"vue": "^3.1.1",
		"vue-i18n": "^9.1.6",
		"vue-router": "^4.0.8",
		"vuex": "^4.0.1"
	},
	"eslintConfig": {
		"root": true,
		"env": {
			"node": true
		},
		"extends": [
			"plugin:vue/essential",
			"eslint:recommended"
		],
		"rules": {},
		"parserOptions": {
			"parser": "@babel/eslint-parser"
		}
	}
}
` 
  it('insertTextAfter code to equal object', () => {
    expect(pack.process(JSON.parse(input))).toStrictEqual(JSON.parse(output))
  })
})

describe('upgrade element-ui', () => {
	let input =
	`{
		"dependencies": {
			"vue": "^2.6.10",
			"vue-i18n": "^8.14.0",
			"vue-router": "^3.1.2",
			"vuex": "^3.1.1",
			"@vue/composition-api": "^1.0.0-rc.12",
			"element-ui": "^1.0.0"
		}
	}
	` 
	let output =
	`{
		"dependencies": {
			"vue": "^3.1.1",
			"vue-i18n": "^9.1.6",
			"vue-router": "^4.0.8",
			"vuex": "^4.0.1",
			"element-plus": "^1.0.2-beta.55"
		}
	}
	` 
	  it('upgread element-ui to element-plus', () => {
		expect(pack.process(JSON.parse(input))).toStrictEqual(JSON.parse(output))
	  })
	})
	
