<template>
	<view class="star-comment-list">
		<view v-for="comment in list" :key="comment.id" class="comment-item-warp">
			<view v-if="comment.status!==1&&comment.status!==0" style="opacity: .6;">
				<StarCommentItem :comment="unknownComment(comment)" :option="unknownFatherOption"
					@selectComment="selectComment">
				</StarCommentItem>
			</view>
			<StarCommentItem v-else :comment="comment" :option="fatherOption" :my_user="my_user"
				@selectComment="selectComment" @clickUserAvatar="clickUserAvatar" @clickUserNickname="clickUserNickname"
				@clickReplyUserNickname="clickReplyUserNickname" @longpressComment="longpressComment"
				@toggleLike="toggleLike" @clickDeleteComment="clickDeleteComment">
			</StarCommentItem>
			<view v-if="comment.commentList.length>0" style="margin-left: 80rpx;">
				<StarCommentChildList :list="comment.commentList" :father_id="comment.id" :option="childOption"
					:my_user="my_user" @selectComment="selectComment" @clickUserAvatar="clickUserAvatar"
					@clickUserNickname="clickUserNickname" @clickReplyUserNickname="clickReplyUserNickname"
					@longpressComment="longpressComment" @toggleLike="toggleLike"
					@clickDeleteComment="clickDeleteComment"></StarCommentChildList>
			</view>
		</view>
	</view>
</template>

<script>
	import StarCommentItem from '../star-comment-item/star-comment-item.vue'
	import StarCommentChildList from '../star-comment-child-list/star-comment-child-list.vue'

	export default {
		components: {
			StarCommentItem,
			StarCommentChildList
		},
		props: {
			type: {
				type: String,
				default: 'father' //father、child
			},
			list: {
				required: true,
				type: Array,
				default: []
			},
			post_id: {
				required: true,
				type: String,
				default: ''
			},
			option: {
				type: Object,
				default: {
					likeIcon: '/static/logo.png',
					likedIcon: '/static/logo.png'
				}
			},
			my_user: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				fatherOption: {
					...this.option,
					mode: 'father'
				},
				childOption: {
					...this.option,
					mode: 'child'
				},
				unknownFatherOption: {
					showDelete: false,
					showLike: false,
					showMore: false,
					mode: 'father'
				}
			};
		},
		computed: {
			unknownComment() {
				return (comment) => {
					return {
						id: comment.id,
						avatar: '',
						nickname: '未知用户',
						content: '该评论已删除',
						createTime: comment.createTime
					};
				};
			}
		},
		methods: {
			// 选中评论
			selectComment(comment) {
				this.$emit('selectComment', (comment.status !== 1 && comment.status !== 0) ? this.unknownComment(comment
					.id) : comment)
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
		}
	}
</script>

<style scoped lang="scss">
	.star-comment-list {
		display: flex;
		flex-direction: column;

		.comment-item-warp {
			border-bottom: 2rpx #eee solid;
		}
	}
</style>