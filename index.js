'use strict';

const {join} = require('path');
const {homedir, tmpdir} = require('os');

const inspectWithKind = require('inspect-with-kind');

const ARG_ERROR = 'Expected an application name to find its cache directory';
const LOCALAPPDATA = 'LOCALAPPDATA';

function validateArgument(...args) {
	const argLen = args.length;

	if (argLen !== 1) {
		throw new RangeError(`Expected 1 argument (<string>), but got ${argLen || 'no'} arguments.`);
	}

	const [appName] = args;

	if (typeof appName !== 'string') {
		throw new TypeError(`${ARG_ERROR} (string), but got ${inspectWithKind(appName)}.`);
	}

	if (appName.length === 0) {
		throw new Error(`${ARG_ERROR}, but got '' (empty string).`);
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
