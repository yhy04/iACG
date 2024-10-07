<template>
	<view class="star-post-hot-item" @click="selectPost">
		<view class="index-box" :style="{ color: getIndexColor(index) }">
			{{ padWithZero(index+1,2) }}
		</view>
		<view class="index-right">
			<view class="main-box">
				<view class="main-text star-line-3">
					<text v-if="post.title" class="title">{{ post.title + ' ' }}</text>
					<text class="content">{{ post.content }}</text>
				</view>
				<view class="footer">
					<view class="view-box">
						<text>围观数 {{ numberFormat(post.viewCount) }}</text>
					</view>
					<view class="comment-box">
						<text>评论数 {{ numberFormat(post.commentCount) }}</text>
					</view>
				</view>
			</view>
			<image class="img" v-if="post.imgList.length>0" :src="post.imgList[0]" :mode="propOption.imgMode"></image>
		</view>
	</view>
</template>

<script>
	import numberFormat from '../../utils/numberFormat.js'

	export default {
		props: {
			index: {
				type: Number,
				default: 1
			},
			post: {
				type: Object,
				default: () => ({})
			},
			option: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				propOption: {
					imgMode: 'aspectFill',
				},
			};
		},
		created() {
			this.propOption = {
				...this.propOption,
				...this.option
			}
		},
		methods: {
			numberFormat,
			// 选中帖子
			selectPost() {
				this.$emit('selectPost', this.post)
			},
			// 指定几位，前面补零
			padWithZero(number, width) {
				const numberString = number.toString();
				const zeroPadding = "0".repeat(Math.max(0, width - numberString.length));
				return zeroPadding + numberString;
			},
			getIndexColor(index) {
				if (index === 0) {
					return "#ff0000"; // 前三名为红色
				} else if (index === 1) {
					return "#dc5858"; // 前三名为红色
				} else if (index === 2) {
					return "#e17f7f"; // 前三名为红色
				} else {
					return "gray"; // 前三名为红色
				}
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
	.star-post-hot-item {
		width: 100%;
		display: inline-flex;
		box-sizing: border-box;
		padding: 20rpx;
		// height: 220rpx;
		border-bottom: 2rpx #eee solid;

		.index-box {
			margin-right: 20rpx;
			line-height: 50rpx;
		}

		.index-right {
			width: 100%;
			display: inline-flex;

			.main-box {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.main-text {
					line-height: 50rpx;
					font-size: 30rpx;
				}

				.title {
					font-weight: 700;
				}

				.content {
					font-weight: 500;
				}

				.footer {
					margin-top: 30rpx;
					display: inline-flex;
					align-items: center;
					font-size: 24rpx;

					.view-box {
						margin-right: 30rpx;
						width: 200rpx;
						color: #ce0000;
					}

					.comment-box {
						margin-right: 30rpx;
						width: 200rpx;
					}
				}
			}

			.img {
				margin-left: 20rpx;
				flex-shrink: 0;
				height: 180rpx;
				width: 180rpx;
				border-radius: 20rpx;
			}
		}
	}
</style>