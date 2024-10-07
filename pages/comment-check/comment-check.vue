<template>
	<view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<view class="star-comment-list">
				<view v-for="comment in commentList" :key="comment.id" class="comment-item-warp">
					<StarCommentItem :comment="comment" :option="commentOption" @selectComment="selectComment"
						@clickUserAvatar="clickUserAvatar" @clickUserNickname="clickUserNickname"
						@clickPassComment="clickPassComment" @clickFailComment="clickFailComment">
					</StarCommentItem>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import StarCommentItem from '@/uni_modules/star-community/components/star-comment-item/star-comment-item.vue'

	import mockComment from '../../mock/mockjs/comment.js'

	/**
	 * 建议机器审核有争议的给人工审核
	 */
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			StarCommentItem
		},
		// 原生下拉刷新，推荐
		onPullDownRefresh() {
			this.mescroll.resetUpScroll()
			uni.stopPullDownRefresh()
		},
		data() {
			return {
				commentList: [],
				commentOption: {
					showLike: false,
					showCheckBtn: true,
				},
				downOption: {
					use: false, // 不启用mescroll下拉刷新，使用页面原生下拉刷新
				},
				upOption: {
					isBounce: false,
					noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				}
			};
		},
		methods: {
			// // mescroll下拉刷新的回调
			// downCallback() {
			// 	// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// 	// loadSwiper();
			// 	// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			// 	this.mescroll.resetUpScroll()
			// },
			// 上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
			async upCallback(page) {
				try {
					// 请求数据列表
					let list = await this.getCommentList(page)
					// 设置列表数据
					if (page.num === 1) this.commentList = [] // 如果是第一页需手动制空列表
					this.commentList = [...this.commentList, ...list] // 追加新数据
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(list.length)
				} catch (err) {
					console.log(err)
				}
			},
			// 拉取评论列表
			getCommentList(page) {
				return mockComment.generateRandomComments(page.size)
			},
			// 选中评论
			selectComment(comment) {
				console.log('selectComment');
				this.goto(`../post-detail/post-detail?id=${comment.post_id}`)
			},
			// 点击评论用户头像
			clickUserAvatar(comment) {
				console.log('clickUserAvatar');
				this.goto(`../homepage/homepage?id=${comment.user_id}`)
			},
			// 点击评论用户昵称
			clickUserNickname(comment) {
				console.log('clickUserNickname');
				this.goto(`../homepage/homepage?id=${comment.user_id}`)
			},
			// 驳回评论
			clickFailComment(comment) {
				console.log('clickFailComment');
				uni.showModal({
					title: '提示',
					content: '确定要驳回该评论吗？',
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '驳回中',
								mask: true
							})

							// await 更改评论状态

							this.mescroll.resetUpScroll()
							uni.hideLoading()
							uni.showToast({
								title: '已驳回'
							})
						}
					}
				})
			},
			// 通过评论
			clickPassComment(comment) {
				console.log('clickPassComment');
				uni.showModal({
					title: '提示',
					content: '确定要通过该评论吗？',
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '通过中',
								mask: true
							})

							// await 更改评论状态

							this.mescroll.resetUpScroll()
							uni.hideLoading()
							uni.showToast({
								title: '已通过'
							})
						}
					}
				})
			},
			// 点击预览图片
			previewImage(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
			goto(url) {
				uni.navigateTo({
					url
				})
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