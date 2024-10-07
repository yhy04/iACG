<template>
	<view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<StarPostList :list="postList" :option="postOption" :my_user="vuex_user" @selectPost="selectPost"
				@longpressPost="longpressPost" @clickUserAvatar="clickPostUserAvatar"
				@clickUserNickname="clickPostUserNickname" @clickFocusUser="clickPostFocusUser"
				@clickChatUser="clickPostChatUser" @clickMore="clickMore" @clickSharePost="clickSharePost"
				@clickCommentPost="clickCommentPost" @toggleLike="togglePostLike">
			</StarPostList>
		</mescroll-body>
		<view class="release-fixed" @click.stop="clickReleasePost">
			+
		</view>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
	import StarPostList from '@/uni_modules/star-community/components/star-post-list/star-post-list.vue'

	import mockPost from '../../mock/mockjs/post.js'

	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			StarPostList,
		},
		data() {
			return {
				postList: [],
				postOption: {
					lineShow: 6, // 文本超出多少行显示省略号
					// iconShare: '/static/share.svg',
					// iconView: '/static/view.svg',
					// iconComment: '/static/comment.svg',
					// iconLike: '/static/like.svg',
					// iconLiked: '/static/liked.svg',
				},
				downOption: {
					use: false, // 不启用mescroll下拉刷新，使用页面原生下拉刷新
				},
				upOption: {
					isBounce: false,
					noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					toTop: {
						right: '20rpx',
						bottom: '140rpx',
						safearea: true,
						width: '80rpx',
						radius: '50%',
					}
				}
			};
		},
		// 原生下拉刷新，推荐
		onPullDownRefresh() {
			this.mescroll.resetUpScroll()
			uni.stopPullDownRefresh()
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
					let list = await this.getPostList(page)
					// 设置列表数据
					if (page.num === 1) this.postList = [] // 如果是第一页需手动制空列表
					this.postList = [...this.postList, ...list] // 追加新数据
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(list.length)
				} catch (err) {
					console.log(err)
				}
			},
			// 拉取帖子列表
			getPostList(page) {
				return mockPost.generateRandomPosts(page.size)
			},
			// 选中贴子
			selectPost(post) {
				console.log('selectPost');
				this.goto(`../post-detail/post-detail?id=${post.id}`)
			},
			// 长按帖子
			longpressPost(post) {
				console.log('longpressPost');
				this.showPostMoreActionSheet(post)
			},
			// 点击帖子中的关注用户
			clickPostFocusUser(post) {
				console.log('clickPostFocusUser');
				uni.showToast({
					title: '关注成功'
				})
			},
			// 点击帖子中的私聊用户
			clickPostChatUser(post) {
				console.log('clickPostChatUser')
				uni.showToast({
					title: '私聊界面开发中',
					icon: 'none'
				})
			},
			// 点击帖子更多
			clickMore(post) {
				console.log('clickMore');
				this.showPostMoreActionSheet(post)
			},
			// 点击分享帖子
			clickSharePost(post) {
				console.log('clickSharePost');
			},
			// 点击评论帖子
			clickCommentPost(post) {
				console.log('clickCommentPost');
				// 建议跳转后自动下滑到评论区
				this.goto(`../post-detail/post-detail?id=${post.id}&comment=yes`)
			},
			// 点击帖子用户头像
			clickPostUserAvatar(post) {
				console.log('clickPostUserAvatar');
				this.goto(`../homepage/homepage?id=${post.user_id}`)
			},
			// 点击贴子用户昵称
			clickPostUserNickname(post) {
				console.log('clickPostUserNickname');
				this.goto(`../homepage/homepage?id=${post.user_id}`)
			},
			// 点赞帖子
			togglePostLike(post, isLiked) {
				console.log('togglePostLike', isLiked);
			},
			// 点击发布帖子按钮
			clickReleasePost() {
				this.goto('../post-release/post-release')
			},
			// 显示帖子更多操作菜单选项
			showPostMoreActionSheet(post) {
				uni.showActionSheet({
					itemList: ['举报'],
					success: (res) => {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						uni.showToast({
							title: '举报成功'
						})
					},
					fail: (res) => {
						console.log(res.errMsg);
					}
				});
			},
			goto(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.release-fixed {
		position: fixed;
		/* #ifdef MP */
		bottom: 50rpx;
		/* #endif */
		/* #ifndef MP */
		bottom: calc(130rpx + constant(safe-area-inset-bottom));
		bottom: calc(130rpx + env(safe-area-inset-bottom));
		/* #endif */
		right: 20rpx;
		background-color: #55aaff;
		color: #fff;
		height: 80rpx;
		width: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
</style>