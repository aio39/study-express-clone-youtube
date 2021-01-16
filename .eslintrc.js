module.exports = {
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: ["eslint:recommended"],
	parser: "babel-eslint",
	rules: {
		"no-console": "off",
	},
	env: {
		browser: true,
		node: true,
	},
};
