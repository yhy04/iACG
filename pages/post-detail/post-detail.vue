<template>
	<view class="post-detail">
		<mescroll-body ref="mescrollRef" :up="upOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view v-if="post" id="comment-up-area">
				<StarPostItem :post="post" :option="postOption" :my_user="vuex_user" @selectPost="selectPost"
					@longpressPost="longpressPost" @clickUserAvatar="clickPostUserAvatar"
					@clickUserNickname="clickPostUserNickname" @clickFocusUser="clickPostFocusUser"
					@clickChatUser="clickPostChatUser" @clickMore="clickMore" @clickSharePost="clickSharePost"
					@clickCommentPost="clickCommentPost" @toggleLike="togglePostLike">
				</StarPostItem>
			</view>
			<view class="comment-top">
				<view class="title">
					全部评论
				</view>
				<view class="tab">
					<view class="tab-item" :class="{ active: selectedTab === 'recommend' }"
						@click="selectTab('recommend')">
						推荐
					</view>
					<view class="tab-item" :class="{ active: selectedTab === 'latest' }" @click="selectTab('latest')">
						最新
					</view>
				</view>
			</view>
			<StarCommentList :list="commentList" :post_id="post.id" :option="commentOption" :my_user="vuex_user"
				@selectComment="selectComment" @clickUserAvatar="clickCommentUserAvatar"
				@clickUserNickname="clickCommentUserNickname" @clickReplyUserNickname="clickCommentReplyUserNickname"
				@longpressComment="longpressComment" @toggleLike="toggleCommentLike"></StarCommentList>
		</mescroll-body>
		<StarCommentReply ref="starCommentReplyRef" :option="replyOption" @sendComment="sendComment"></StarCommentReply>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import StarPostItem from '@/uni_modules/star-community/components/star-post-item/star-post-item.vue'
	import StarCommentList from '@/uni_modules/star-community/components/star-comment-list/star-comment-list.vue'
	import StarCommentReply from '@/uni_modules/star-community/components/star-comment-reply/star-comment-reply.vue'

	import mockPost from '../../mock/mockjs/post.js'
	import mockComment from '../../mock/mockjs/comment.js'

	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			StarPostItem,
			StarCommentList,
			StarCommentReply
		},
		data() {
			return {
				selectedTab: 'recommend', // 默认选择推荐标签
				postOption: {
					// showShare: false,
					showView: false,
					// showComment: false,
					// showLike: false,
					// iconShare: '/static/share.svg',
					// iconView: '/static/view.svg',
					// iconComment: '/static/comment.svg',
					// iconLike: '/static/like.svg',
					// iconLiked: '/static/liked.svg',
				},
				commentOption: {
					showDelete: true,
					// iconLike: '/static/like.svg',
					// iconLiked: '/static/liked.svg',
				},
				replyOption: {
					imgMaxCount: 9, // 选择图片最大数量
					// imgMaxSize: 5, // 单位：M
					// iconImgRemove: '/static/remove.svg'
					// iconImg: '/static/chooseImg.svg', // 选择图片icon
				},
				upOption: {
					isBounce: false,
					noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					toTop: {
						bottom: '320rpx',
						safearea: true,
					}
				},
				post: null,
				commentList: []
			};
		},
		onLoad(option) {
			console.log(option?.id);

			// 拉取帖子数据
			this.post = mockPost.generateRandomPosts(1)[0]

			// 是否自动滑动至评论区，option?.comment === 'yes'
			if (option?.comment === 'yes') {
				// 等待dom渲染完毕，才能获取节点信息
				setTimeout(() => {
					this.goArea('#comment-up-area') // 自动滑动至评论区
					this.$refs.starCommentReplyRef.focus = true // 评论框自动聚焦
				}, 300)
			}
		},
		methods: {
			// 下拉刷新的回调
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll()
			},
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
			// 获取评论列表
			getCommentList(page) {
				let fatherCommentList = mockComment.generateRandomComments(page.size)
				let randomInteger = Math.floor(Math.random() * 11) // 随机生成0-10个子评论
				let childCommentList = mockComment.generateRandomComments(randomInteger)
				return fatherCommentList.map(comment => ({
					...comment,
					status: 1,
					commentList: childCommentList.map(childComment => ({
						...childComment,
						father_id: comment.id,
						status: 1,
					}))
				}))
			},
			// 切换标签
			selectTab(tab) {
				this.selectedTab = tab
				this.commentList = []
				this.mescroll.resetUpScroll()
			},
			// 自动滑动至某元素，如评论区
			goArea(selector) {
				uni.createSelectorQuery().select(selector).boundingClientRect(res => {
					console.log(res.height);
					uni.pageScrollTo({
						scrollTop: res.height
					})
				}).exec()
			},
			// 选中帖子
			selectPost(post) {
				console.log('selectPost');
				// 重置评论框
				this.$refs.starCommentReplyRef.resetCommentReply()
				this.$refs.starCommentReplyRef.focus = true
			},
			// 长按帖子
			longpressPost(post) {
				console.log('longpressPost');
				this.showPostMoreActionSheet(post)
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
				// 重置评论框
				this.$refs.starCommentReplyRef.resetCommentReply()
				this.$refs.starCommentReplyRef.focus = true
				this.goArea('#comment-up-area')
			},
			// 点赞帖子
			togglePostLike(post, isLiked) {
				console.log('togglePostLike', isLiked);
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

			// 选中评论
			selectComment(comment) {
				console.log('selectComment');

				// 重置评论框
				this.$refs.starCommentReplyRef.resetCommentReply()

				if (comment.father_id) {
					this.$refs.starCommentReplyRef.to_father_id = comment.father_id
					this.$refs.starCommentReplyRef.to_child_id = comment.id
				} else {
					this.$refs.starCommentReplyRef.to_father_id = comment.id
				}
				this.$refs.starCommentReplyRef.to_user_id = comment.user_id
				this.$refs.starCommentReplyRef.placeholder = `回复：${comment.nickname}`
				this.$refs.starCommentReplyRef.focus = true
			},
			// 发送评论
			sendComment(comment) {
				console.log('发送评论');

				let vuex_user = this.vuex_user // 从缓存获取我的用户信息

				// 必要信息，请替换成实际值
				let myComment = {
					status: 0, // 0 审核中 1 正常 2 审核不通过 3 已删除 4 已违规
					commentCount: 0,
					commentList: [],
					content: comment.content,
					createTime: Date.now(),
					id: Date.now().toString(),
					imgList: comment.imgList, // 在此之前请将临时路径替换成线上路径
					likeCount: 0,
					post_id: this.post.id,
					user_id: vuex_user.id,
				}

				// 需要回复的父评论
				let fatherComment, fatherCommentIndex = -1
				fatherCommentIndex = this.commentList.findIndex(fatherComment => fatherComment.id === comment
					?.to_father_id) // 父评论下标
				if (fatherCommentIndex > -1) {
					fatherComment = this.commentList[fatherCommentIndex]
				}

				// 需要回复的子评论
				let childComment, childCommentIndex = -1
				if (fatherCommentIndex > -1) {
					let childCommentList = fatherComment.commentList
					childCommentIndex = childCommentList.findIndex(childComment => childComment.id === comment
						?.to_child_id)
					if (childCommentIndex > -1) {
						childComment = fatherComment.commentList[childCommentIndex]
					}
				}

				// 回复子评论
				if (fatherComment && childComment) {
					myComment.father_id = fatherComment.id
					myComment.reply_child_id = childComment.id

					// await 添加至数据库

					myComment.avatar = vuex_user.avatar
					myComment.nickname = vuex_user.nickname
					myComment.isNewComment = true // 优化显示体验，请勿将此字段添加至数据库
					myComment.replyChildComment = childComment
					this.commentList[fatherCommentIndex].commentList.splice(childCommentIndex + 1, 0, myComment)
				}
				// 回复父评论
				else if (fatherComment) {
					myComment.father_id = fatherComment.id

					// await 添加至数据库

					myComment.avatar = vuex_user.avatar
					myComment.nickname = vuex_user.nickname
					myComment.isNewComment = true // 优化显示体验，请勿将此字段添加至数据库
					this.commentList[fatherCommentIndex].commentList.unshift(myComment)
				}
				// 回复帖子
				else {
					// await 添加至数据库

					myComment.avatar = vuex_user.avatar
					myComment.nickname = vuex_user.nickname
					this.commentList.unshift(myComment)
				}

				// 重置评论框
				this.$refs.starCommentReplyRef.resetCommentReply()
				this.$refs.starCommentReplyRef.placeholder = comment.placeholder // 延用回复占位符
				this.$refs.starCommentReplyRef.to_father_id = comment.to_father_id // 延用回复父评论
				this.$refs.starCommentReplyRef.to_child_id = comment.to_child_id // 延用回复子评论
				this.$refs.starCommentReplyRef.to_user_id = comment.to_user_id // 延用回复谁
				uni.showToast({
					title: '发送成功'
				})
			},
			// 长按评论
			longpressComment(comment) {
				console.log('longpressComment');
				this.showCommentMoreActionSheet(comment)
			},
			// 点击评论用户头像
			clickCommentUserAvatar(comment) {
				console.log('clickCommentUserAvatar');
				this.goto(`../homepage/homepage?id=${comment.user_id}`)
			},
			// 点击评论用户昵称
			clickCommentUserNickname(comment) {
				console.log('clickCommentUserNickname');
				this.goto(`../homepage/homepage?id=${comment.user_id}`)
			},
			// 点击评论回复用户昵称
			clickCommentReplyUserNickname(comment) {
				console.log('clickCommentReplyUserNickname');
				this.goto(`../homepage/homepage?id=${comment.replyChildComment.user_id}`)
			},
			// 点击喜欢评论
			toggleCommentLike(comment, isLiked) {
				console.log('toggleCommentLike', isLiked);
			},
			// 显示帖子更多操作菜单选项
			showPostMoreActionSheet() {
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
			// 显示帖子更多操作菜单选项
			showCommentMoreActionSheet(comment) {
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
	.post-detail {
		padding-bottom: 120rpx; // 评论框底部安全距离

		.comment-top {
			padding: 20rpx;
			width: 100%;
			box-sizing: border-box;
			display: inline-flex;
			align-items: center;
			justify-content: space-between;

			.title {
				font-weight: 700;
			}

			.tab {
				display: flex;

				.tab-item {
					padding: 10rpx;

					&.active {
						font-weight: 700;
					}
				}
			}
		}
	}
</style>