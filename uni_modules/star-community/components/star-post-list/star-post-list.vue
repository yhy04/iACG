<template>
	<view class="star-post-list">
		<view v-for="post in list" :key="post.id">
			<StarPostItem :post="post" :option="option" :my_user="my_user" @selectPost="selectPost"
				@longpressPost="longpressPost" @clickUserAvatar="clickUserAvatar" @clickUserNickname="clickUserNickname"
				@clickFocusUser="clickFocusUser" @clickChatUser="clickChatUser" @clickMore="clickMore"
				@clickSharePost="clickSharePost" @clickCommentPost="clickCommentPost" @clickFailPost="clickFailPost"
				@clickPassPost="clickPassPost" @toggleLike="toggleLike" @clickDeletePost="clickDeletePost">
			</StarPostItem>
		</view>
	</view>
</template>

<script>
	import StarPostItem from '../star-post-item/star-post-item.vue'

	export default {
		components: {
			StarPostItem,
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
			},
			my_user: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			// 选中帖子
			selectPost(post) {
				this.$emit('selectPost', post)
			},
			// 长按帖子
			longpressPost(post) {
				this.$emit('longpressPost', post)
			},
			// 选中用户头像
			clickUserAvatar(post) {
				this.$emit('clickUserAvatar', post)
			},
			// 选中用户昵称
			clickUserNickname(post) {
				this.$emit('clickUserNickname', post)
			},
			// 点击关注用户
			clickFocusUser(post) {
				this.$emit('clickFocusUser', post)
			},
			// 点击私聊用户
			clickChatUser(post) {
				this.$emit('clickChatUser', post)
			},
			// 点击更多
			clickMore(post) {
				this.$emit('clickMore', post)
			},
			// 点击分享帖子
			clickSharePost(post) {
				this.$emit('clickSharePost', post)
			},
			// 点击评论帖子
			clickCommentPost(post) {
				this.$emit('clickCommentPost', post)
			},
			// 选择帖子违规
			clickFailPost(post) {
				this.$emit('clickFailPost', post)
			},
			// 选择帖子通过
			clickPassPost(post) {
				this.$emit('clickPassPost', post)
			},
			// 点赞
			toggleLike(post, isLiked) {
				this.$emit('toggleLike', post, isLiked)
			},
			// 删帖
			clickDeletePost(post) {
				this.$emit('clickDeletePost', post)
			}
		}
	}
</script>

<style scoped lang="scss">

</style>