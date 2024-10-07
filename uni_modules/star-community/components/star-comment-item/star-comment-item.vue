<template>
	<view class="star-comment-item" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
		@click="selectComment" @longpress="longpressComment">
		<view class="star-comment-wrap">
			<view class="avatar" hover-stop-propagation>
				<image :src="comment.avatar" :mode="propOption.avatarMode" @click.stop="clickUserAvatar"></image>
			</view>
			<view class="comment-item-right">
				<view class="comment-detail">
					<view class="detail-left">
						<view class="user-box">
							<view class="nickname-box">
								<view class="nickname" hover-stop-propagation @click.stop="clickUserNickname">
									{{comment.nickname}}
								</view>
								<block v-if="comment.replyChildComment">
									<view class="reply-text">
										回复
									</view>
									<view class="nickname" hover-stop-propagation @click.stop="clickReplyUserNickname">
										{{comment.replyChildComment.nickname}}
									</view>
								</block>
							</view>
							<view v-if="comment.status===0" class="status-box">
								审核中
							</view>
							<view v-if="propOption.showDelete&&(comment.user_id===my_user.id||my_user.isAdmin)"
								class="delete-box" @click.stop="clickDeleteComment">
								删除
							</view>
						</view>
						<view v-if="comment.content" class="content">
							<text user-select decode>{{comment.content+'&nbsp;&nbsp;'}}</text><text
								class="time">{{timeFrom(comment.createTime)}}</text>
						</view>
						<view v-if="comment.imgList&&comment.imgList.length>0" class="img-list-box">
							<view v-for="(img, index) in comment.imgList" :key="index" hover-stop-propagation>
								<image class="img"
									:style="{height: propOption.mode==='father' ? 'calc((100vw - 40rpx - 30rpx - 140rpx) / 3)':'calc((100vw - 40rpx - 30rpx - 220rpx) / 3)', width: propOption.mode==='father' ? 'calc((100vw - 40rpx - 30rpx - 180rpx) / 3)':'calc((100vw - 40rpx - 30rpx - 260rpx) / 3)'}"
									:src="img" @click.stop="previewImg(comment.imgList,index)"
									:mode="propOption.imgMode">
								</image>
							</view>
						</view>
					</view>
					<view v-if="propOption.showLike" class="detail-right">
						<view class="like-box" hover-stop-propagation @click.stop="toggleLike">
							<image v-if="isLiked" class="icon scale-ver-center" :src="propOption.iconLiked">
							</image>
							<image v-else class="icon" :src="propOption.iconLike">
							</image>
							<view v-if="likeCount" class="text">
								{{ numberFormat(likeCount) }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="propOption.showCheckBtn&&(propOption.showCheckFail||propOption.showCheckPass)" class="btn-list-box">
			<button v-if="propOption.showCheckFail" class="btn" type="warn" @click.stop="clickFailComment">驳回</button>
			<button v-if="propOption.showCheckPass" class="btn" type="primary"
				@click.stop="clickPassComment">通过</button>
		</view>
		<slot name="footer"></slot>
	</view>
</template>

<script>
	import timeFrom from '../../utils/timeFrom.js'
	import numberFormat from '../../utils/numberFormat.js'

	export default {
		props: {
			comment: {
				type: Object,
				default: () => ({})
			},
			post_id: {
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
			},
		},
		data() {
			return {
				propOption: {
					mode: 'father',
					avatarMode: 'aspectFill',
					imgMode: 'aspectFill',
					showLike: true,
					showCheckBtn: false,
					showCheckFail: true,
					showCheckPass: true,
					showDelete: true,
					iconLike: '/uni_modules/star-community/static/like.svg',
					iconLiked: '/uni_modules/star-community/static/liked.svg',
				},

				isLiked: this.comment?.isLiked || false,
				likeCount: this.comment?.likeCount || 0,
			};
		},
		created() {
			this.propOption = {
				...this.propOption,
				...this.option
			}
		},
		methods: {
			timeFrom,
			numberFormat,
			// 点击预览图片
			previewImg(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
			// 选中评论
			selectComment() {
				this.$emit('selectComment', this.comment)
			},
			// 长按评论
			longpressComment() {
				this.$emit('longpressComment', this.comment)
			},
			// 点击用户头像
			clickUserAvatar() {
				this.$emit('clickUserAvatar', this.comment)
			},
			// 点击用户昵称
			clickUserNickname() {
				this.$emit('clickUserNickname', this.comment)
			},
			// 点击回复用户昵称
			clickReplyUserNickname() {
				this.$emit('clickReplyUserNickname', this.comment)
			},
			// 点击喜欢评论
			toggleLike() {
				// 根据当前的 isLiked 状态来增加或减少点赞数量
				this.likeCount = this.isLiked ? this.likeCount - 1 : this.likeCount + 1;
				this.isLiked = !this.isLiked;

				this.$emit('toggleLike', this.comment, this.isLiked)
			},
			// 点击删除评论
			clickDeleteComment() {
				this.$emit('clickDeleteComment', this.comment)
			},
			// 驳回评论
			clickFailComment() {
				this.$emit('clickFailComment', this.comment)
			},
			// 通过评论
			clickPassComment() {
				this.$emit('clickPassComment', this.comment)
			}
		}
	}
</script>

<style scoped lang="scss">
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

	.view-hover {
		background-color: #eee;
	}

	.star-comment-item {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		flex-direction: column;

		.star-comment-wrap {
			display: inline-flex;

			.avatar {
				background-color: #eee;
				height: 60rpx;
				width: 60rpx;
				border-radius: 50%;
				overflow: hidden;
				flex-shrink: 0;

				image {
					height: 100%;
					width: 100%;
				}
			}

			.comment-item-right {
				width: 100%;

				.comment-detail {
					width: 100%;
					display: inline-flex;

					.detail-left {
						flex-grow: 1;
						display: flex;
						flex-direction: column;
						padding: 0 20rpx;

						.user-box {
							display: inline-flex;
							align-items: center;

							.nickname-box {
								flex: 1;
								display: inline-flex;
								align-items: center;

								.nickname {
									font-size: 26rpx;
									font-weight: 600;
									color: #55aaff;
								}

								.reply-text {
									margin: 0 20rpx;
									font-size: 26rpx;
									color: #878787;
								}
							}

							.status-box {
								font-size: 26rpx;
								font-weight: 700;
								color: orange;
							}

							.delete-box {
								margin-left: 20rpx;
								font-size: 26rpx;
								font-weight: 700;
								color: red;
							}
						}

						.content {
							margin-top: 10rpx;
							font-size: 30rpx;

							.time {
								color: #878787;
								font-size: 24rpx;
								white-space: nowrap;
							}
						}

						.img-list-box {
							margin-top: 10rpx;
							display: inline-flex;
							flex-wrap: wrap;

							.img {
								margin: 10rpx 10rpx 0 0;
								border-radius: 20rpx;
							}
						}
					}

					.detail-right {
						width: 80rpx;
						flex-shrink: 0;

						.like-box {
							display: flex;
							flex-direction: column;
							align-items: center;

							.icon {
								flex-shrink: 0;
								height: 40rpx;
								width: 40rpx;
								padding-bottom: 10rpx;
							}
						}
					}
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