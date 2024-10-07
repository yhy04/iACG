<template>
	<view class="container">
		<view class="nickname-box">
			<input v-model="nickname" type="nickname" placeholder="请输入昵称" maxlength="24" @change="nicknameChange" />
		</view>
		<button class="save-btn" type="primary" @click="saveUpdate">保存</button>
	</view>
</template>

<script>
	/**
	 * 建议昵称不重复
	 */
	export default {
		data() {
			return {
				nickname: ''
			};
		},
		onLoad() {
			let vuex_user = {} // 从vuex拿
			this.nickname = vuex_user.nickname
		},
		methods: {
			// 保存更改
			saveUpdate() {
				uni.redirectTo({
					url: '../my-info'
				})
			},
			// 昵称填写能力回调
			nicknameChange(e) {
				this.nickname = e.detail.value
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		padding: 20rpx;
		background-color: #eee;
	}

	.nickname-box {
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.save-btn {
		margin-top: 50rpx;
	}
</style>