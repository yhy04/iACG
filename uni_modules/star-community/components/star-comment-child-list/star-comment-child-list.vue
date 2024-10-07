<template>
	<view class="star-comment-child-list">
		<view v-for="(comment, index) in list" :key="comment.id">
			<view v-show="showAll ? true : (index < 2 || comment.isNewComment)">
				<StarCommentItem :comment="comment" :option="option" :my_user="my_user" @selectComment="selectComment"
					@clickUserAvatar="clickUserAvatar" @clickUserNickname="clickUserNickname"
					@clickReplyUserNickname="clickReplyUserNickname" @longpressComment="longpressComment"
					@toggleLike="toggleLike" @clickDeleteComment="clickDeleteComment">
				</StarCommentItem>
			</view>
		</view>
		<view v-if="showActionText" class="action-text" @click="toggleShowList">
			{{ showAll ? '收起' : `展开${list.length}条回复`}}
		</view>
	</view>
</template>

<script>
	import StarCommentItem from '../star-comment-item/star-comment-item.vue'

	export default {
		components: {
			StarCommentItem
		},
		props: {
			list: {
				required: true,
				type: Array,
				default: []
			},
			father_id: {
				required: true,
				type: String,
				default: ''
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
		data() {
			return {
				showAll: false,
			};
		},
		computed: {
			// 是否显示 更多/收起
			showActionText() {
				let newCommentCount = this.list.reduce((count, item) => {
					if (item.isNewComment) {
						return count + 1;
					}
					return count;
				}, 0);

				return this.list.length - newCommentCount > 2
			}
		},
		methods: {
			// 展开/收起事件
			toggleShowList() {
				this.showAll = !this.showAll;
			},
			// 选中评论
			selectComment(comment) {
				this.$emit('selectComment', comment)
			},
			// 长按评论
			longpressComment(comment) {
				this.$emit('longpressComment', comment)
			},
			// 点击用户头像
			clickUserAvatar(comment) {
				this.$emit('clickUserAvatar', comment)
			},
			// 点击用户昵称
			clickUserNickname(comment) {
				this.$emit('clickUserNickname', comment)
			},
			// 点击回复用户昵称
			clickReplyUserNickname(comment) {
				this.$emit('clickReplyUserNickname', comment)
			},
			// 点击喜欢评论
			toggleLike(comment, isLiked) {
				this.$emit('toggleLike', comment, isLiked)
			},
			// 点击删除评论
			clickDeleteComment(comment) {
				this.$emit('clickDeleteComment', comment)
			},
		},
	};
</script>

<style scoped lang="scss">
	.star-comment-child-list {
		padding-bottom: 20rpx;

		.action-text {
			margin-left: 100rpx;
			color: #00aaff;
			font-size: 34rpx;
		}
	}
</style>