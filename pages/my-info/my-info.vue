<template>
	<view>
		<view class="top-box">
			<view class="avatar-box" @click="chooseAvatar">
				<image class="avatar" :src="avatar"></image>
				<image class="select-icon" src="/static/selectAvatar.svg"></image>
			</view>
		</view>
		<view class="list-container">
			<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
				@click="goto('./nickname/nickname')">
				<view class="left-box">
					昵称
				</view>
				<view class="right-box">
					<view class="text">
						{{ nickname }}
					</view>
					<image class="icon" src="/static/right.svg"></image>
				</view>
			</view>
			<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
				@click="goto('./introduction/introduction')">
				<view class="left-box">
					简介
				</view>
				<view class="right-box">
					<view class="text">
						{{ introduction }}
					</view>
					<image class="icon" src="/static/right.svg"></image>
				</view>
			</view>
			<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
				@click="goto('./gender/gender')">
				<view class="left-box">
					性别
				</view>
				<view class="right-box">
					<view class="text">
						{{ genderText }}
					</view>
					<image class="icon" src="/static/right.svg"></image>
				</view>
			</view>
			<view class="item-box" hover-class="view-hover" :hover-stay-time="50" hover-stop-propagation
				@click="chooseBackgroundImg">
				<view class="left-box">
					背景图
				</view>
				<view class="right-box">
					<image class="img" :src="backgroundImg" mode="aspectFill"></image>
					<image class="icon" src="/static/right.svg"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: 'http://dummyimage.com/50x50/f2b879&text=avatar', // 头像
				nickname: '', // 昵称
				introduction: '', // 简介
				gender: 0, // 性别
				backgroundImg: 'http://dummyimage.com/120x90', //背景图
			};
		},
		computed: {
			// 中文性别
			genderText() {
				let gender = this.gender
				return gender === 0 ? '女' : gender === 1 ? '男' : '未知'
			}
		},
		onShow() {
			// 刷新用户信息
		},
		methods: {
			// 选择头像
			async chooseAvatar() {
				let img = await this.chooseImg(1)
				console.log(img);
				if (img) {
					this.avatar = img
				}
			},
			// 选择背景图
			async chooseBackgroundImg() {
				let img = await this.chooseImg(1)
				if (img) {
					this.backgroundImg = img
				}
			},
			// 选择头像，推荐使用图片裁剪能力
			chooseImg(count, maxSize = 5) {
				return new Promise((resole, reject) => {
					// #ifndef MP-WEIXIN
					uni.chooseImage({
						count,
						sizeType: ['compressed'],
						success: (res) => {
							if (!res.tempFilePaths.length > 0) {
								return resole(null)
							}

							const tempFiles = res.tempFiles
							const maxSizeBytes = maxSize * 1024 * 1024 // 5MB的字节数
							const filePath = tempFiles[0].path
							const fileSize = tempFiles[0].size

							if (fileSize > maxSizeBytes) {
								// 图片大小超过5MB，进行相应的处理
								uni.showToast({
									title: '图片大小不能超过5MB',
									duration: 2000
								});
							} else {
								// 图片大小符合要求，可以进行其他操作
								return resole(filePath)
							}

						},
						fail: (err) => {
							return reject(null)
						}
					});
					// #endif
					// #ifdef MP-WEIXIN
					uni.chooseMedia({
						count,
						mediaType: ['image'],
						sizeType: ['compressed'],
						success: (res) => {
							if (!res.tempFilePaths.length > 0) {
								return resole(null)
							}

							const tempFiles = res.tempFiles
							const maxSizeBytes = maxSize * 1024 * 1024 // 5MB的字节数
							const filePath = tempFiles[0].tempFilePath
							const fileSize = tempFiles[0].size

							if (fileSize > maxSizeBytes) {
								// 图片大小超过5MB，进行相应的处理
								uni.showToast({
									title: '图片大小不能超过5MB',
									duration: 2000
								});
							} else {
								// 图片大小符合要求，可以进行其他操作
								return resole(filePath)
							}

						},
						fail: (err) => {
							return reject(err)
						}
					});
					// #endif
				})
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
	.top-box {
		display: flex;
		justify-content: center;
		padding: 50rpx 0;

		.avatar-box {
			position: relative;

			.avatar {
				height: 180rpx;
				width: 180rpx;
				border-radius: 50%;
			}

			.select-icon {
				position: absolute;
				right: 0;
				bottom: 0;
				height: 60rpx;
				width: 60rpx;
			}
		}
	}

	.list-container {

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
				width: 160rpx;
				flex-shrink: 0;
				display: flex;
				align-items: center;
			}

			.right-box {
				display: inline-flex;
				align-items: center;

				.img {
					flex-shrink: 0;
					height: 100rpx;
					width: 100rpx;
				}

				.text {}

				.icon {
					flex-shrink: 0;
					margin-left: 20rpx;
					height: 30rpx;
					width: 30rpx;
				}
			}
		}
	}
</style>