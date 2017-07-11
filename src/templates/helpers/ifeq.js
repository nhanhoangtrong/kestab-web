module.exports = function(value1, value2, options) {
	console.log(value1, value2)
	return value1 === value2 ? options.fn(this) : options.inverse(this)
}
