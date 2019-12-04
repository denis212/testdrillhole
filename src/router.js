import Vue from 'vue'
import Router from 'vue-router'
import DrillHole from '@/components/DrillHole'
import DepthReading from '@/components/DepthReading'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'drillholes',
			component: DrillHole
		},
		{
			path: '/depthreadings/:hole_id',
			name: 'depthreadings',
			props: true,
			component: DepthReading
		}
	]
})
