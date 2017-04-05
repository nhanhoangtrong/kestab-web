module.exports = function(name, value, options) {
	this['is_equal'] = this[name] === value
}