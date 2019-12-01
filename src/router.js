import Vue from 'vue'
import Router from 'vue-router'
import DrillHole from '@/components/DrillHole'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Hello',
			component: DrillHole
		}
	]
})
