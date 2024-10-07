<template>
	<view class="star-scroll-body">
		<!-- 列表内容 -->
		<slot></slot>
		<StarScrollUp v-if="!triggered && upLoadType!==3" :type="upLoadType">
		</StarScrollUp>
	</view>
</template>

<script>
	import StarScrollUp from './components/star-scroll-up/star-scroll-up.vue'

	export default {
		components: {
			StarScrollUp
		},
		data() {
			return {
				triggered: false, // 设置当前下拉刷新状态，true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
				upLoadType: 0,
				pageNum: 1,
				pageSize: 10
			};
		},
		created() {
			// 首次加载
			this.scrolltolower()
		},
		methods: {
			// 重置上拉加载
			resetUpScroll() {
				this.upLoadType = 0
				this.pageNum = 1
				this.pageSize = 10
				this.scrolltolower()
			},
			// 自定义下拉刷新被触发
			refresherrefresh() {
				this.triggered = true
				this.upLoadType = 0
				this.pageNum = 1
				this.pageSize = 10
				this.$emit('refresherrefresh')
			},
			// 滚动到底部/右边，会触发 scrolltolower 事件
			scrolltolower() {
				// 如果还有更多数据
				if (this.upLoadType === 0) {
					this.upLoadType = 1
					this.$emit('scrolltolower')
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		-webkit-appearance: none;
		background: transparent;
		color: transparent;
	}
</style>