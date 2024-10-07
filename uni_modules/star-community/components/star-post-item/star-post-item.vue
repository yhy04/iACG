<template>
	<view v-if="!!post" class="star-post-item" @click="selectPost" @longpress="longpressPost">
		<view class="user-box">
			<image class="avatar" :src="post.avatar" :mode="propOption.avatarMode" @click.stop="clickUserAvatar">
			</image>
			<view class="center">
				<view class="nickname-box">
					<view class="nickname" @click.stop="clickUserNickname">
						{{post.nickname}}
					</view>
				</view>
				<view v-if="post.createTime" class="time">
					{{timeFrom(post.createTime)}}
				</view>
			</view>
			<view v-if="propOption.showDelete||propOption.showFocus||propOption.showChat||propOption.showMore"
				class="right">
				<view v-if="propOption.showFocus&&!isFocusUser&&post.user_id!==my_user.id" class="focus-box"
					@click.stop="clickFocusUser">
					关注
				</view>
				<view v-else-if="propOption.showChat&&isFocusUser&&post.user_id!==my_user.id" class="chat-box"
					@click.stop="clickChatUser">
					私聊
				</view>
				<view v-if="post.status===0" class="status-box">
					审核中
				</view>
				<view v-if="propOption.showDelete&&(post.user_id===my_user.id||my_user.isAdmin)" class="delete-box"
					@click.stop="clickDeletePost">
					删除
				</view>
				<image v-if="propOption.showMore" class="more-icon" :src="propOption.iconMore" @click.stop="clickMore">
				</image>
				<slot name="user-right"></slot>
			</view>
		</view>
		<view v-if="post.title" class="title" :style="{marginLeft: propOption.mode===2 ? '0':'100rpx'}">
			<text user-select>{{post.title}}</text>
		</view>
		<view v-if="post.content" class="content"
			:class="propOption.lineShow?`star-line-${propOption.lineShow.toString()}`:'content-class'"
			:style="{marginLeft: propOption.mode===2 ? '0':'100rpx'}">
			<text :user-select="!propOption.lineShow">{{post.content}}</text>
		</view>
		<view v-if="post.imgList&&post.imgList.length>0" class="img-list-box"
			:style="{marginLeft: propOption.mode===2 ? '0':'100rpx'}">
			<!-- #ifdef MP -->
			<image v-for="(img, index) in post.imgList" :key="index" class="img"
				:style="{height: propOption.mode===2 ? 'calc((100vw - 40rpx - 30rpx) / 3)':'calc((100vw - 40rpx - 30rpx - 100rpx) / 3)', width: propOption.mode===2 ? 'calc((100vw - 40rpx - 30rpx) / 3)':'calc((100vw - 40rpx - 30rpx - 100rpx) / 3)'}"
				:src="img" :mode="propOption.imgMode" @click.stop="previewImg(post.imgList,index)"></image>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<image v-for="(img, index) in post.imgList" :key="index" class="img"
				:style="{height: propOption.mode===2 ? 'calc((100vw - 60px) / 3)':'calc((100vw - 110px) / 3)', width: propOption.mode===2 ? 'calc((100vw - 60px) / 3)':'calc((100vw - 110px) / 3)'}"
				:src="img" :mode="propOption.imgMode" @click.stop="previewImg(post.imgList,index)"></image>
			<!-- #endif -->
		</view>
		<!-- <view class="topic-container">
				<view v-if="post.topic" class="topic-box">
					<image class="icon" :src="post.topic.icon"></image>
					<view class="text">
						{{post.topic.name}}
					</view>
				</view>
			</view> -->
		<view
			v-if="propOption.showFooter&&(propOption.showShare||propOption.showView||propOption.showComment||propOption.showLike)"
			class="footer" :style="{marginLeft: propOption.mode===2 ? '0':'100rpx'}">
			<view v-if="propOption.showShare" class="item-box" @click.stop="clickSharePost">
				<image class="icon" :src="propOption.iconShare"></image>
				<view class="text">
					{{ numberFormat(post.shareCount) || '分享' }}
				</view>
			</view>
			<view v-if="propOption.showView" class="item-box">
				<image class="icon" :src="propOption.iconView"></image>
				<view class="text">
					{{ numberFormat(post.viewCount) || '围观' }}
				</view>
			</view>
			<view v-if="propOption.showComment" class="item-box" @click.stop="clickCommentPost">
				<image class="icon" :src="propOption.iconComment"></image>
				<view class="text">
					{{ numberFormat(post.commentCount) || '评论' }}
				</view>
			</view>
			<view v-if="propOption.showLike" class="item-box" hover-stop-propagation @click.stop="toggleLike">
				<image v-if="isLiked" class="icon scale-ver-center" :src="propOption.iconLiked">
				</image>
				<image v-else class="icon" :src="propOption.iconLike">
				</image>
				<view class="text">
					{{ numberFormat(likeCount) || '点赞' }}
				</view>
			</view>
		</view>
		<view v-if="propOption.showCheckBtn&&(propOption.showCheckFail||propOption.showCheckPass)" class="btn-list-box">
			<button v-if="propOption.showCheckFail" class="btn" type="warn" @click.stop="clickFailPost">驳回</button>
			<button v-if="propOption.showCheckPass" class="btn" type="primary" @click.stop="clickPassPost">通过</button>
		</view>
		<slot name="footer"></slot>
	</view>
</template>

<script>
	import timeFrom from '../../utils/timeFrom.js'
	import numberFormat from '../../utils/numberFormat.js'

	export default {
		props: {
			post: {
				type: Object,
				default: () => ({})
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
				propOption: {
					mode: 2,
					avatarMode: 'aspectFill',
					imgMode: 'aspectFill',
					// lineShow: 6, // 超出多少行显示省略号
					showFooter: true,
					showCheckBtn: false,
					showCheckFail: true,
					showCheckPass: true,
					showFocus: true,
					showChat: true,
					showMore: true,
					showShare: true,
					showView: true,
					showComment: true,
					showLike: true,
					showDelete: true,
					iconShare: '/uni_modules/star-community/static/share.svg',
					iconView: '/uni_modules/star-community/static/view.svg',
					iconComment: '/uni_modules/star-community/static/comment.svg',
					iconLike: '/uni_modules/star-community/static/like.svg',
					iconLiked: '/uni_modules/star-community/static/liked.svg',
					iconDelete: '/uni_modules/star-community/static/delete.svg',
					iconMore: '/uni_modules/star-community/static/more.svg',
				},

				isFocusUser: this.post?.isFocusUser || false,
				isLiked: this.post?.isLiked || false,
				likeCount: this.post?.likeCount || 0,
			};
		},
		watch: {
			option: {
				handler(newVal, oldVal) {
					this.propOption = {
						...this.propOption,
						...newVal
					}
				},
				deep: true, // 深度监听
				immediate: true // 立即执行
			}
		},
		methods: {
			timeFrom,
			numberFormat,
			// 选中帖子
			selectPost() {
				this.$emit('selectPost', this.post)
			},
			// 长按帖子
			longpressPost() {
				this.$emit('longpressPost', this.post)
			},
			// 选中用户头像
			clickUserAvatar() {
				this.$emit('clickUserAvatar', this.post)
			},
			// 选中用户昵称
			clickUserNickname() {
				this.$emit('clickUserNickname', this.post)
			},
			// 点击关注用户
			clickFocusUser() {
				this.isFocusUser = true
				this.$emit('clickFocusUser', this.post)
			},
			// 点击私聊用户
			clickChatUser() {
				this.$emit('clickChatUser', this.post)
			},
			// 点击更多
			clickMore() {
				this.$emit('clickMore', this.post)
			},
			// 点击分享帖子
			clickSharePost() {
				this.$emit('clickSharePost', this.post)
			},
			// 点击评论帖子
			clickCommentPost() {
				this.$emit('clickCommentPost', this.post)
			},
			// 点击预览图片
			previewImg(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
			// 点击喜欢
			toggleLike() {
				// 根据当前的 isLiked 状态来增加或减少点赞数量
				this.likeCount = this.isLiked ? this.likeCount - 1 : this.likeCount + 1;
				this.isLiked = !this.isLiked;

				this.$emit('toggleLike', this.post, this.isLiked)
			},
			// 删帖
			clickDeletePost() {
				this.$emit('clickDeletePost', this.post)
			},
			// 驳回帖子
			clickFailPost() {
				this.$emit('clickFailPost', this.post)
			},
			// 通过帖子
			clickPassPost() {
				this.$emit('clickPassPost', this.post)
			}
		}
	}
</script>

<style scoped lang="scss">
	/* start--文本行数限制--start */
	.star-line-1 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.star-line-2 {
		-webkit-line-clamp: 2;
	}

	.star-line-3 {
		-webkit-line-clamp: 3;
	}

	.star-line-4 {
		-webkit-line-clamp: 4;
	}

	.star-line-5 {
		-webkit-line-clamp: 5;
	}

	.star-line-6 {
		-webkit-line-clamp: 6;
	}

	.star-line-7 {
		-webkit-line-clamp: 7;
	}

	.star-line-8 {
		-webkit-line-clamp: 8;
	}

	.star-line-9 {
		-webkit-line-clamp: 9;
	}

	.star-line-2,
	.star-line-3,
	.star-line-4,
	.star-line-5,
	.star-line-6,
	.star-line-7,
	.star-line-8,
	.star-line-9 {
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box; // 弹性伸缩盒
		-webkit-box-orient: vertical; // 设置伸缩盒子元素排列方式
	}

	/* end--文本行数限制--end */

	.scale-ver-center {
		animation: scale-ver-center .4s cubic-bezier(.39, .575, .565, 1.000) both;
	}

	@keyframes scale-ver-center {
		0% {
			transform: scale(.9)
		}

		50% {
			transform: scale(1.5)
		}

		100% {
			transform: scale(1)
		}
	}

	.star-post-item {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		border-bottom: 2rpx #eee solid;

		.user-box {
			display: inline-flex;
			align-items: center;

			.avatar {
				height: 80rpx;
				width: 80rpx;
				border-radius: 50%;
				flex-shrink: 0;
				margin-right: 20rpx;
			}

			.center {
				flex: 1;
				padding-right: 10rpx;

				.nickname-box {
					display: inline-flex;
					align-items: center;

					.nickname {
						font-size: 26rpx;
						font-weight: 600;
						color: #55aaff;
					}
				}

				.time {
					margin-top: 10rpx;
					font-size: 20rpx;
				}
			}

			.right {
				display: inline-flex;
				align-items: center;

				.focus-box {
					border: 2rpx #55aaff solid;
					border-radius: 100rpx;
					color: #55aaff;
					font-size: 26rpx;
					padding: 6rpx 20rpx;
				}

				.chat-box {
					@extend .focus-box;
				}

				.delete-box {
					margin-left: 20rpx;
					font-size: 26rpx;
					font-weight: 700;
					color: red;
				}

				.status-box {
					margin-left: 20rpx;
					font-size: 26rpx;
					font-weight: 700;
					color: orange;
				}

				.more-icon {
					margin-left: 20rpx;
					height: 50rpx;
					width: 50rpx;
					flex-shrink: 0;
				}
			}
		}

		.title {
			margin-top: 20rpx;
			font-size: 34rpx;
			font-weight: 700;
		}

		.content {
			margin-top: 20rpx;
			font-size: 30rpx;
		}

		.content-class {
			white-space: normal;
			word-wrap: break-word;
			overflow: hidden;
		}

		.img-list-box {
			margin-top: 10rpx;
			display: inline-flex;
			flex-wrap: wrap;

			.img {
				margin: 10rpx 10rpx 0 0;
				flex-shrink: 0;
				border-radius: 20rpx;
				height: 200rpx;
				width: 200rpx;
			}
		}

		.topic-container {
			margin-top: 20rpx;

			.topic-box {
				padding: 8rpx 14rpx;
				border-radius: 20rpx;
				display: inline-flex;
				align-items: center;
				border: 2rpx #eee solid;

				.icon {
					flex-shrink: 0;
					height: 30rpx;
					width: 30rpx;
					margin-right: 10rpx;
				}

				.text {
					font-size: 26rpx;
				}
			}
		}

		.footer {
			margin-top: 20rpx;
			display: inline-flex;
			justify-content: space-between;

			.item-box {
				display: inline-flex;
				align-items: center;

				.icon {
					flex-shrink: 0;
					height: 50rpx;
					width: 50rpx;
					margin-right: 10rpx;
				}

				.text {
					width: 100rpx;
					text-align: center;
					font-size: 26rpx;
				}
			}
		}

		.btn-list-box {
			margin-top: 20rpx;
			width: 100%;
			display: inline-flex;
			align-items: center;
			gap: 20rpx; // 部分机型不支持，管他呢，我的机型支持就行了

			.btn {
				flex: 1;
			}
		}
	}
</style>