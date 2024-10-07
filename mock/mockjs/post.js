// 记得安装npm install mockjs
// mockjs官网 http://mockjs.com
// 引入Mock.js库
import Mock from 'mockjs'
// const Mock = require('mockjs');

// 生成图片列表，推荐最多9张
const generateImgList = (min, max) => {
	const imgList = [];
	const numImages = Mock.Random.integer(min, max);
	for (let i = 0; i < numImages; i++) {
		imgList.push(Mock.Random.image());
	}
	return imgList;
};

// 生成随机帖子数据
const generateRandomPost = () => {
	return {
		id: Mock.Random.uuid(),
		user_id: Mock.Random.uuid(),
		avatar: Mock.Random.image('50x50', Mock.Random.color(), 'avatar'),
		nickname: Mock.Random.cname(),
		createTime: Mock.Random.integer(Date.now() - 10000000000, Date.now()), // 生成一个时间戳范围内的随机时间戳,
		content: Mock.Random.csentence(2, 200),
		imgList: generateImgList(0, 9),
		shareCount: Mock.Random.integer(1, 1000),
		viewCount: Mock.Random.integer(1, 50000),
		commentCount: Mock.Random.integer(1, 1000),
		likeCount: Mock.Random.integer(1, 1000),
	};
};

// 生成指定数量的随机帖子
const generateRandomPosts = (numPosts = 10) => {
	const postList = [];
	for (let i = 0; i < numPosts; i++) {
		const newPost = generateRandomPost();
		postList.push(newPost);
	}
	return postList;
};

module.exports = {
	generateRandomPosts,
};