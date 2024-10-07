<template>
	<view class="star-post-hot-list">
		<view v-for="(post, index) in list" :key="post.id">
			<StarPostHotItem :index="index" :post="post" :option="option" @selectPost="selectPost"></StarPostHotItem>
		</view>
	</view>
</template>

<script>
	import StarPostHotItem from '../star-post-hot-item/star-post-hot-item.vue'

	export default {
		components: {
			StarPostHotItem,
		},
		props: {
			list: {
				required: true,
				type: Array,
				default: []
			},
			option: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			// 选中帖子
			selectPost(post) {
				this.$emit('selectPost', post)
			},
		}
	}
</script>

<style lang="scss">

</style>