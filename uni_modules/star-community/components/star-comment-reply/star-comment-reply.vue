<template>
	<view class="star-comment-reply" :style="{bottom: keyboardHeight+'px'}">
		<scroll-view v-if="imgList.length>0" class="img-list-box" scroll-x enable-flex
			:scroll-into-view="'item'+intoViewCurrent" scroll-with-animation>
			<block v-for="(item,index) in imgList" :key="index">
				<view :id="'item'+index" class="img-item" @click="previewImg(imgList,index)">
					<image class="img" :src="item" mode="aspectFill"></image>
					<image class="remove-icon" :src="propOption.iconImgRemove" mode="" @click.stop="removeImg(index)">
					</image>
					<view class="img-num">
						{{index+1}}
					</view>
				</view>
			</block>
		</scroll-view>
		<view class="reply-main">
			<view class="input-box" :class="propOption.showChooseImg&&content.length>10?'more-input-box':''">
				<textarea v-model="content" :focus="focus" :placeholder="placeholder" auto-height auto-blur
					:adjust-position="false" :cursor-spacing="50" fixed :show-confirm-bar="false" :maxlength="9999"
					:auto-height="lineCount<5" @linechange="linechange" @blur="focus=false"></textarea>
				<image v-if="propOption.showChooseImg" class="icon" :src="propOption.iconImg" mode="heightFix"
					@click.stop="chooseImg">
				</image>
			</view>
			<!-- 选择图片 -->
			<!-- <image v-if="propOption.showChooseImg" class="item-icon" :src="propOption.iconImg" @click.stop="chooseImg">
			</image> -->
			<view v-if="content||imgList.length>0" class="send-box" @click="sendComment">发送</view>
		</view>
		<!-- <view class="emoji-box">

		</view> -->
	</view>
</template>

<script>
	export default {
		props: {
			option: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				propOption: {
					showChooseImg: true,
					imgMaxCount: 3, // 选择图片最大数量
					imgMaxSize: 5, // 单位：M
					iconImgRemove: '/uni_modules/star-community/static/remove.svg', // 移除图片icon
					iconImg: '/uni_modules/star-community/static/chooseImg.svg', // 选择图片icon
				},

				focus: false, // 评论框聚焦
				intoViewCurrent: 0, // 图片自动滑动到哪张
				content: '',
				imgList: [],
				placeholder: '善语结善缘，恶语伤人心',
				lineCount: 0,
				keyboardHeight: 0, // 键盘高度
				to_father_id: null, // 回复父评论
				to_child_id: null, // 回复子评论
				to_user_id: null, // 回复谁
			};
		},
		created() {
			this.propOption = {
				...this.propOption,
				...this.option
			}
			// #ifndef H5 || MP-BAIDU || MP-TOUTIAO
			uni.onKeyboardHeightChange(res => {
				console.log(res.height)
				this.keyboardHeight = res.height
			})
			// #endif
		},
		destroyed() {
			// #ifndef H5 || MP-BAIDU || MP-TOUTIAO
			uni.offKeyboardHeightChange()
			// #endif
		},
		methods: {
			linechange(e) {
				this.lineCount = e.detail.lineCount
			},
			//选择图片
			chooseImg() {
				let maxCount = this.propOption.imgMaxCount - this.imgList.length
				// #ifndef MP-WEIXIN
				uni.chooseImage({
					count: maxCount,
					sizeType: ['compressed'],
					success: (res) => {
						if (maxCount > 0) {
							const tempFiles = res.tempFiles
							const maxSizeBytes = this.propOption.imgMaxSize * 1024 * 1024 // 5MB的字节数

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

							// 自动滑动到最后一个
							this.intoViewCurrent = this.imgList.length
						}
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
					count: maxCount,
					mediaType: ['image'],
					sizeType: ['compressed'],
					success: (res) => {
						if (maxCount > 0) {
							const tempFiles = res.tempFiles
							const maxSizeBytes = this.propOption.imgMaxSize * 1024 * 1024 // 5MB的字节数

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

							// 自动滑动到最后一个
							this.intoViewCurrent = this.imgList.length
						}
					}
				});
				// #endif
			},
			//移出图片
			removeImg(index) {
				this.imgList.splice(index, 1)
			},
			// 重置评论框
			resetCommentReply() {
				this.focus = false // 评论框聚焦
				this.content = ''
				this.imgList = []
				this.placeholder = '善语结善缘，恶语伤人心'
				this.lineCount = 0
				this.keyboardHeight = 0 // 键盘高度
				this.to_father_id = null // 回复父评论
				this.to_child_id = null // 回复子评论
				this.to_user_id = null // 回复谁
			},
			// 发送评论
			sendComment() {
				this.$emit('sendComment', {
					to_father_id: this.to_father_id,
					to_child_id: this.to_child_id,
					to_user_id: this.to_user_id,
					content: this.content,
					imgList: this.imgList
				})
			},
			// 预览图片
			previewImg(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.star-comment-reply {
		position: fixed;
		width: 100%;
		z-index: 9;
		bottom: 0;
		transition: all .15s;

		.img-list-box {
			box-shadow: -4rpx -4rpx 12rpx -4rpx rgb(238, 238, 238);
			box-sizing: border-box;
			max-width: 670rpx;
			width: auto;
			float: right;
			white-space: nowrap;
			padding: 0 0 14rpx 30rpx;
			border-radius: 10rpx 0 0 0;
			background-color: #FFFFFF;

			.img-item {
				position: relative;
				display: inline-flex;
				flex-shrink: 0;
				margin: 30rpx 30rpx 0 0;
				background-color: #FFFFFF;

				.img {
					display: flex;
					flex-shrink: 0;
					height: 130rpx;
					width: 130rpx;
				}

				.remove-icon {
					height: 36rpx;
					width: 36rpx;
					position: absolute;
					top: -14rpx;
					right: -14rpx;
					border-radius: 50%;
					opacity: 0.8;
				}

				.img-num {
					position: absolute;
					bottom: 0;
					right: 0;
					color: #FFFFFF;
					background-color: #888888;
					font-size: 22rpx;
					padding: 2rpx 6rpx;
					border-radius: 4rpx 0 0 0;
					opacity: 0.8;
				}
			}
		}

		.reply-main {
			width: 100%;
			padding: 16rpx 30rpx;
			box-sizing: border-box;
			display: inline-flex;
			align-items: flex-end;
			background-color: #fff;

			.input-box {
				min-height: 80rpx;
				width: 100%;
				padding: 18rpx 30rpx;
				border-radius: 50rpx;
				background-color: #eee;
				box-sizing: border-box;
				display: inline-flex;
				align-items: center;

				textarea {
					width: 100%;
				}

				.icon {
					margin-left: 10rpx;
					height: 50rpx;
				}
			}

			.more-input-box {
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				textarea {
					margin-bottom: 10rpx;
				}
			}

			.item-icon {
				margin-left: 20rpx;
				height: 72rpx;
				width: 72rpx;
				flex-shrink: 0;
			}

			.send-box {
				height: 80rpx;
				width: 120rpx;
				margin-left: 20rpx;
				flex-shrink: 0;
				border-radius: 50rpx;
				background-color: #55aaff;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>