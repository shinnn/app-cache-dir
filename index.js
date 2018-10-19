'use strict';

const {join} = require('path');
const {homedir, tmpdir} = require('os');

const inspectWithKind = require('inspect-with-kind');

const ARG_LEN_ERROR = 'Expected 1 argument (<string>)';
const ARG_ERROR = 'Expected an application name to find its cache directory';
const LOCALAPPDATA = 'LOCALAPPDATA';

function validateArgument(...args) {
	const argLen = args.length;
	const [appName] = args;
	let error;

	if (argLen === 0) {
		error = new RangeError(`${ARG_LEN_ERROR}, but got no arguments.`);
		error.code = 'ERR_MISSING_ARGS';
	} else if (argLen !== 1) {
		error = new RangeError(`${ARG_LEN_ERROR}, but got ${argLen} arguments.`);
		error.code = 'ERR_TOO_MANY_ARGS';
	} else if (typeof appName !== 'string') {
		error = new TypeError(`${ARG_ERROR} (string), but got ${inspectWithKind(appName)}.`);
		error.code = 'ERR_INVALID_ARG_TYPE';
	} else if (appName.length === 0) {
		error = new Error(`${ARG_ERROR}, but got '' (empty string).`);
		error.code = 'ERR_INVALID_ARG_VALUE';
	}

	if (error) {
		Error.captureStackTrace(error, validateArgument);
		throw error;
	}
}

function fallback(appName) {
	return join(tmpdir(), appName, 'cache');
}

function posixAppCacheDir(...args) {
	validateArgument(...args);

	if (process.env.XDG_CACHE_HOME) {
		return join(process.env.XDG_CACHE_HOME, ...args);
	}

	const home = homedir();

	if (home && !home.includes('\0')) {
		return join(home, '.cache', ...args);
	}

	return fallback(...args);
}

function win32AppCacheDir(...args) {
	validateArgument(...args);

	for (const key of Object.keys(process.env)) {
		if (key.toUpperCase() === LOCALAPPDATA) {
			return join(process.env[key], ...args, 'cache');
		}
	}

	return fallback(...args);
}

module.exports = function appCacheDir(...args) {
	if (process.platform === 'win32') {
		return win32AppCacheDir(...args);
	}

	return posixAppCacheDir(...args);
};

module.exports.posix = posixAppCacheDir;
module.exports.win32 = win32AppCacheDir;
