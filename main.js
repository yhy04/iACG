import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'

// 模拟用户信息，通常使用vuex管理
Vue.prototype.vuex_user = {
	id: '123456789',
	avatar: 'http://dummyimage.com/50x50/79f291&text=avatar',
	nickname: '一幅画'
}

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif