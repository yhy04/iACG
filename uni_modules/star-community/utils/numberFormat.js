function numberFormat(number) {
	if (number >= 10000) {
		const result = (number / 10000).toFixed(2);
		return result.replace(/\.?0*$/, '') + " w";
	} else if (number >= 1000) {
		const result = (number / 1000).toFixed(2);
		return result.replace(/\.?0*$/, '') + " k";
	} else if (number == 0) {
		return 0
	} else {
		const result = number.toFixed(2);
		return result.replace(/\.?0*$/, '');
	}
}

export default numberFormat