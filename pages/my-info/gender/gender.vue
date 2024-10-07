<template>
	<view class="container">
		<view class="gender-box">
			<view class="gender-item" @click="gender=1">
				<view class="gender-name">
					男
				</view>
				<view v-if="gender===1" class="use-icon"></view>
			</view>
			<view class="line"></view>
			<view class="gender-item" @click="gender=0">
				<view class="gender-name">
					女
				</view>
				<view v-if="gender===0" class="use-icon"></view>
			</view>
		</view>
		<button class="save-btn" type="primary" @click="saveUpdate">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gender: -1
			};
		},
		onLoad() {
			let vuex_user = {
				gender: 1
			}
			this.gender = vuex_user.gender
		},
		methods: {
			// 保存更改
			saveUpdate() {
				uni.redirectTo({
					url: '../my-info'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		padding: 20rpx;
		background-color: #eee;
	}

	.gender-box {
		background-color: #fff;
		border-radius: 20rpx;

		.gender-item {
			box-sizing: border-box;
			padding: 20rpx 30rpx;
			width: 100%;
			height: 100rpx;
			display: inline-flex;
			justify-content: space-between;
			align-items: center;

			.use-icon {
				height: 40rpx;
				width: 40rpx;
				border-radius: 50%;
				background-color: #55aaff;
			}
		}

		.line {
			border: 2rpx #f7f7f7 solid;
		}
	}

	.save-btn {
		margin-top: 50rpx;
	}
</style>