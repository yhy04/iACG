<!-- 上拉加载区域 -->
<template>
	<view class="star-upwarp">
		<!-- 加载中 (此处不能用v-if,否则android小程序快速上拉可能会不断触发上拉回调) -->
		<view v-show="isUpLoading">
			<view class="upwarp-progress star-rotate"></view>
			<view class="upwarp-tip">加载中</view>
		</view>
		<!-- 无数据 -->
		<view v-if="isUpNoMore" class="upwarp-nodata">没有更多了</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: Number // 上拉加载的状态：0（loading前），1（loading中），2（没有更多了）
		},
		computed: {
			// 加载中
			isUpLoading() {
				return this.type === 1;
			},
			// 没有更多了
			isUpNoMore() {
				return this.type === 2;
			}
		}
	};
</script>

<style scoped lang="scss">
	/* 上拉加载区域 */
	.star-upwarp {
		box-sizing: border-box;
		min-height: 110rpx;
		padding: 30rpx 0;
		text-align: center;
		clear: both;
	}

	/*提示文本 */
	.star-upwarp .upwarp-tip,
	.star-upwarp .upwarp-nodata {
		display: inline-block;
		font-size: 28rpx;
		vertical-align: middle;
		/* color: gray; 已在style设置color,此处删去*/
	}

	.star-upwarp .upwarp-tip {
		margin-left: 16rpx;
	}

	/*旋转进度条 */
	.star-upwarp .upwarp-progress {
		display: inline-block;
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		border: 2rpx solid gray;
		border-bottom-color: transparent !important;
		/*已在style设置border-color,此处需加 !important*/
		vertical-align: middle;
	}

	/* 旋转动画 */
	.star-upwarp .star-rotate {
		animation: starUpRotate 0.6s linear infinite;
	}

	@keyframes starUpRotate {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>