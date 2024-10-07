// 记得安装npm install mockjs
// mockjs官网 http://mockjs.com
// 引入Mock.js库
import Mock from 'mockjs'
// const Mock = require('mockjs');

// 生成图片列表，推荐最多3张
const generateImgList = (min, max) => {
	const imgList = [];
	const numImages = Mock.Random.integer(min, max);
	for (let i = 0; i < numImages; i++) {
		imgList.push(Mock.Random.image());
	}
	return imgList;
};

// 生成随机评论数据
const generateRandomComment = () => {
	return {
		id: Mock.Random.uuid(),
		post_id: Mock.Random.uuid(),
		user_id: Mock.Random.uuid(),
		avatar: Mock.Random.image('50x50', Mock.Random.color(), 'avatar'),
		nickname: Mock.Random.cname(),
		createTime: Mock.Random.integer(Date.now() - 10000000, Date.now()), // 生成一个最近的随机时间戳
		content: Mock.Random.csentence(2, 80),
		imgList: generateImgList(0, 3),
		commentCount: Mock.Random.integer(1, 10),
		likeCount: Mock.Random.integer(1, 1000),
		commentList: [], // 初始化为空评论列表
	};
};

// 生成指定数量的随机评论
const generateRandomComments = (numComments = 10) => {
	const commentList = [];
	for (let i = 0; i < numComments; i++) {
		const newComment = generateRandomComment();
		commentList.push(newComment);
	}
	return commentList;
};

module.exports = {
	generateRandomComments,
};