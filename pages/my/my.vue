<template>
	<view>
		<view class="user-wrap" @click="goto('../my-info/my-info')">
			<!-- 此处添加背景图片标签 -->
			<view class="background-mask"></view>
			<view class="user-container">
				<view class="user-box">
					<image class="avatar" src="http://dummyimage.com/180x150"></image>
					<view class="nickname">
						自定义
					</view>
					<view class="introduction">
						点击编辑简介
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-container">
			<view class="list-container">
				<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
					@click="goto(`../homepage/homepage`)">
					<view class="left-box">
						个人主页
					</view>
					<view class="right-box">
						<image class="icon" src="/static/right.svg"></image>
					</view>
				</view>
				<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
					@click="goto('../my-info/my-info')">
					<view class="left-box">
						个人资料
					</view>
					<view class="right-box">
						<image class="icon" src="/static/right.svg"></image>
					</view>
				</view>
				<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
					@click="goto('../post-check/post-check')">
					<view class="left-box">
						帖子审核
					</view>
					<view class="right-box">
						<view class="text">
							请判断是否为管理员
						</view>
						<image class="icon" src="/static/right.svg"></image>
					</view>
				</view>
				<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
					@click="goto('../comment-check/comment-check')">
					<view class="left-box">
						评论审核
					</view>
					<view class="right-box">
						<view class="text">
							请判断是否为管理员
						</view>
						<image class="icon" src="/static/right.svg"></image>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="contact-btn" hover-class="contact-btn-hover" open-type="contact">
					<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation>
						<view class="left-box">
							意见反馈
						</view>
						<view class="right-box">
							<image class="icon" src="/static/right.svg"></image>
						</view>
					</view>
				</button>
				<!-- #endif -->
			</view>
			<view class="logo-box">
				<image class="logo" src="/static/logo.svg" mode="widthFix"></image>
				<view class="text">
					星之链科技
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			goto(url) {
				uni.navigateTo({
					url
				})
			},
			// 复制文字
			copyText(data, title) {
				uni.showLoading({
					title: ''
				})
				uni.setClipboardData({
					data,
					success: (res) => {
						uni.hideLoading()
						uni.showToast({
							title,
							icon: 'none'
						})
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '复制失败',
							icon: 'error'
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.view-hover {
		background-color: #eee;
	}

	.user-wrap {
		position: relative;

		.background-mask {
			z-index: -1;
			position: absolute;
			height: 100%;
			width: 100%;
			background-color: #545454;
			opacity: .4;
		}

		.user-container {
			padding: 30rpx 30rpx 90rpx;


			.user-box {
				display: flex;
				flex-direction: column;
				align-items: center;

				.avatar {
					flex-shrink: 0;
					height: 130rpx;
					width: 130rpx;
					border-radius: 50%;
				}

				.nickname {
					margin-top: 20rpx;
					font-size: 34rpx;
					font-weight: 700;
				}

				.introduction {
					margin-top: 20rpx;
					color: #4b4b4b;
				}
			}
		}
	}

	.bottom-container {
		margin-top: -50rpx;
		padding-top: 30rpx;
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
		overflow: hidden;

		.list-container {

			.contact-btn {
				background-color: transparent;
				padding: 0;
			}

			.contact-btn-hover {
				background-color: #f7f8f9;
			}

			.contact-btn::after {
				border: none;
			}

			.item-box {
				box-sizing: border-box;
				padding: 30rpx;
				width: 100%;
				display: inline-flex;
				justify-content: space-between;
				border-bottom: 2rpx #dcdcdc solid;
				font-size: 30rpx;
				line-height: 1;

				.left-box {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				.right-box {
					display: inline-flex;
					align-items: center;

					.text {}

					.icon {
						margin-left: 20rpx;
						height: 30rpx;
						width: 30rpx;
					}
				}
			}
		}


		.logo-box {
			margin: 100rpx 0 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.logo {
				width: 25%;
			}

			.text {
				margin-top: 30rpx;
				color: #9c9c9c;
			}
		}
	}
</style>