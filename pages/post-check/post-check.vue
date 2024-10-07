<template>
	<view>
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<StarPostList :list="postList" :option="postOption" @selectPost="selectPost" @longpressPost="longpressPost"
				@clickUserAvatar="clickUserAvatar" @clickUserNickname="clickUserNickname"
				@clickFocusUser="clickPostFocusUser" @clickChatUser="clickPostChatUser" @clickMore="clickMore"
				@clickSharePost="clickSharePost" @clickCommentPost="clickCommentPost" @clickFailPost="clickFailPost"
				@clickPassPost="clickPassPost">
			</StarPostList>
		</mescroll-body>
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
		// 原生下拉刷新，推荐
		onPullDownRefresh() {
			this.mescroll.resetUpScroll()
			uni.stopPullDownRefresh()
		},
		data() {
			return {
				postList: [],
				postOption: {
					lineShow: 6, // 文本超出多少行显示省略号
					showFocus: false,
					showMore: false,
					showFooter: false,
					showCheckBtn: true,
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
			// 点击帖子用户头像
			clickUserAvatar(post) {
				console.log('clickUserAvatar');
				this.goto(`../homepage/homepage?id=${post.user_id}`)
			},
			// 点击贴子用户昵称
			clickUserNickname(post) {
				console.log('clickUserNickname');
				this.goto(`../homepage/homepage?id=${post.user_id}`)
			},
			// 选中贴子
			selectPost(post) {
				console.log('selectPost');
				this.goto(`../post-detail/post-detail?id=${post.id}`)
			},
			// 驳回帖子
			clickFailPost(post) {
				console.log('clickFailPost');
				uni.showModal({
					title: '提示',
					content: '确定要驳回该贴子吗？',
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '驳回中',
								mask: true
							})

							// await 更改帖子状态

							this.mescroll.resetUpScroll()
							uni.hideLoading()
							uni.showToast({
								title: '已驳回'
							})
						}
					}
				})
			},
			// 通过帖子
			clickPassPost(post) {
				console.log('clickPassPost');
				uni.showModal({
					title: '提示',
					content: '确定要通过该贴吗？',
					success: async (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '通过中',
								mask: true
							})

							// await 更改帖子状态

							this.mescroll.resetUpScroll()
							uni.hideLoading()
							uni.showToast({
								title: '已通过'
							})
						}
					}
				})
			},
			goto(url) {
				uni.navigateTo({
					url
				})
			},
			// 点击预览图片
			previewImage(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
		}
	}
</script>

<style lang="scss">

</style>