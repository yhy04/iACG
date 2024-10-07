<template>
	<view>
		<StarPostHotList :list="postList" :option="postOption" @selectPost="selectPost"></StarPostHotList>
	</view>
</template>

<script>
	import StarPostHotList from '@/uni_modules/star-community/components/star-post-hot-list/star-post-hot-list.vue'

	import mockPost from '../../mock/mockjs/post.js'

	export default {
		components: {
			StarPostHotList
		},
		data() {
			return {
				postList: [],
				postOption: {

				},
			};
		},
		// 原生下拉刷新，推荐
		async onPullDownRefresh() {
			this.postList = await this.getPostList(10)
			uni.stopPullDownRefresh()
		},
		async onLoad() {
			this.postList = await this.getPostList(10)
		},
		methods: {
			// 拉取帖子列表
			getPostList(size) {
				return mockPost.generateRandomPosts(size)
			},
			// 选中帖子
			selectPost(post) {
				console.log('selectPost');
				this.goto(`../post-detail/post-detail?id=${post.id}`)
			},
			goto(url) {
				uni.navigateTo({
					url
				})
			},
		}
	}
</script>

<style lang="scss">

</style>