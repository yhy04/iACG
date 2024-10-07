<template>
	<view>
		<view class="release-wrap">
			<view class="img-list-box">
				<view v-for="(img, index) in imgList" :key="index">
					<view class="img-box">
						<image class="img" :src="img" @click.stop="previewImage(imgList,index)" mode="aspectFill">
						</image>
						<image class="remove-icon" src="/static/remove.svg" mode="" @click.stop="removeImg(index)">
						</image>
					</view>
				</view>
				<view v-if="imgList.length<9" class="upload-img" @click="chooseImg">
					+
				</view>
			</view>
			<input class="title-input" type="text" v-model="title" placeholder="输入标题(可选)" :maxlength="20">
			<view class="line"></view>
			<textarea class="content-textarea" v-model="content" auto-height :show-confirm-bar="false"
				:cursor-spacing="50" placeholder="添加正文" :maxlength="9999"></textarea>
		</view>
		<view class="fixed-box">
			<view class="draft-box" @click="saveDraft('确认保存帖子至草稿箱吗？')">
				<image class="icon" src="/static/draft.svg"></image>
				<view class="text">
					存草稿
				</view>
			</view>
			<button @click="sendPost">发布帖子</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '', // 标题
				content: '', // 正文
				imgList: [], // 图片列表

				isSaveDraft: false, // 是否已经保存至草稿
			};
		},
		onLoad() {
			let draft_post_list = uni.getStorageSync('draft_post_list')
			if (draft_post_list && draft_post_list.length > 0) {
				// 判断是否有草稿
				uni.showModal({
					title: '提示',
					content: '您有上次未发布的草稿，是否继续编辑？',
					success: (res) => {
						if (res.confirm) {

							let post = draft_post_list[0]
							this.title = post.title
							this.content = post.content
						}
					}
				})
			}
		},
		onUnload() {
			let hasPost = false
			if (this.title) {
				hasPost = true
			}
			if (this.content) {
				hasPost = true
			}
			if (this.imgList.length > 0) {
				hasPost = true
			}
			if (hasPost && !this.isSaveDraft) {
				this.saveDraft('需要保存帖子至草稿箱吗？', false)
			} else if (!hasPost) {
				uni.setStorageSync('draft_post_list', [])
			}
		},
		methods: {
			// 发布帖子
			sendPost() {
				console.log('点击发布帖子');

				let vuex_user = this.vuex_user // 从缓存获取我的用户信息

				// 请替换成真实值
				let post = {
					status: 0, // 0 审核中 1 正常 2 审核不通过 3 已删除 4 已违规
					commentCount: 0,
					title: this.title,
					content: this.content,
					createTime: Date.now(),
					id: Date.now().toString(), // 建议使用uuid 或 后端添加后返回的id值
					imgList: this.imgList, // 在此之前请将临时路径替换成线上路径
					likeCount: 0,
					shareCount: 0,
					user_id: vuex_user.id,
					viewCount: 0,
				}

				console.log(post);

				// 发布成功，跳转个人主页
				this.isSaveDraft = true
				uni.setStorageSync('draft_post_list', []) // 防止弹出保存草稿箱弹窗
				uni.redirectTo({
					url: `../homepage/homepage`
				})
				uni.showToast({
					title: '发布成功'
				})
			},
			// 选择图片
			chooseImg() {
				// #ifndef MP-WEIXIN
				uni.chooseImage({
					count: 9 - this.imgList.length,
					sizeType: ['compressed'],
					success: (res) => {
						const tempFiles = res.tempFiles
						const maxSizeBytes = 5 * 1024 * 1024 // 5MB的字节数

						for (let i = 0; i < tempFiles.length; i++) {
							const filePath = tempFiles[i].path
							const fileSize = tempFiles[i].size

							if (fileSize > maxSizeBytes) {
								// 图片大小超过5MB，进行相应的处理
								uni.showToast({
									title: '图片大小不能超过5MB',
									duration: 2000
								});
							} else {
								// 图片大小符合要求，可以进行其他操作
								console.log(`图片${i + 1}的大小为${(fileSize/1024/1024).toFixed(2)}M`)
								this.imgList.push(filePath)
							}
						}
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
					count: 9 - this.imgList.length,
					mediaType: ['image'],
					sizeType: ['compressed'],
					success: (res) => {
						const tempFiles = res.tempFiles
						const maxSizeBytes = 5 * 1024 * 1024 // 5MB的字节数

						for (let i = 0; i < tempFiles.length; i++) {
							const filePath = tempFiles[i].tempFilePath
							const fileSize = tempFiles[i].size

							if (fileSize > maxSizeBytes) {
								// 图片大小超过5MB，进行相应的处理
								uni.showToast({
									title: '图片大小不能超过5MB',
									duration: 2000
								});
							} else {
								// 图片大小符合要求，可以进行其他操作
								console.log(`图片${i + 1}的大小为${(fileSize/1024/1024).toFixed(2)}M`)
								this.imgList.push(filePath)
							}
						}
					}
				});
				// #endif
			},
			// 点击预览图片
			previewImage(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
			// 点击移除图片按钮
			removeImg(index) {
				this.imgList.splice(index, 1)
			},
			// 保存至草稿箱
			saveDraft(content, back = true) {
				uni.showModal({
					title: '提示',
					content,
					confirmText: '保存',
					cancelText: '不保存',
					success: (res) => {
						if (res.cancel) {
							uni.setStorageSync('draft_post_list', [])
						} else {
							let post = {
								title: this.title,
								content: this.content,
								createTime: Date.now()
							}
							// 兼容多个草稿 本示例只适配一个草稿
							let draft_post_list = uni.getStorageSync('draft_post_list')
							if (!draft_post_list) {
								uni.setStorageSync('draft_post_list', [])
								draft_post_list = []
							}
							// draft_post_list.unshift(post)
							draft_post_list = [post]
							console.log(draft_post_list);
							uni.setStorageSync('draft_post_list', draft_post_list)
							if (back) {
								this.isSaveDraft = true
								uni.navigateBack()
							}
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.release-wrap {
		padding: 10rpx 20rpx 20rpx;

		.img-list-box {
			width: 100%;
			display: inline-flex;
			flex-wrap: wrap;

			.img-box {
				position: relative;
				border-radius: 20rpx;
				margin: 10rpx 10rpx 0 0;
				height: calc((100vw - 40rpx - 30rpx) / 3);
				width: calc((100vw - 40rpx - 30rpx) / 3);

				.remove-icon {
					position: absolute;
					height: 50rpx;
					width: 50rpx;
					top: -10rpx;
					right: -10rpx;
					border-radius: 50%;
					opacity: 0.8;
				}
			}

			.img {
				border-radius: 20rpx;
				height: 100%;
				width: 100%;
			}

			.upload-img {
				@extend .img-box;
				background-color: #eee;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 80rpx;
				color: #5e5e5e;
			}
		}

		.title-input {
			height: 80rpx;
			font-size: 40rpx;
			// border: 2rpx #eee solid;
		}

		.line {
			border: 2rpx #eee solid;
			margin: 20rpx 0;
		}

		.content-textarea {
			min-height: 400rpx;
			width: 100%;
			// border: 2rpx #eee solid;
		}
	}

	.fixed-box {
		position: fixed;
		display: inline-flex;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		background-color: #f7f7f7;
		box-shadow: -4rpx -4rpx 12rpx -4rpx rgb(238, 238, 238);
		bottom: 0;
		padding: 20rpx 30rpx;

		.draft-box {
			margin-right: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.icon {
				flex-shrink: 0;
				height: 40rpx;
				width: 40rpx;
				margin-bottom: 10rpx;
			}

			.text {
				font-size: 24rpx;
			}
		}

		button {
			flex: 1;
			border-radius: 100rpx;
			background-color: #55aaff;
			color: #fff;
		}
	}
</style>