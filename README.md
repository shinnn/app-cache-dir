# app-cache-dir

[![npm version](https://img.shields.io/npm/v/app-cache-dir.svg)](https://www.npmjs.com/package/app-cache-dir)
[![Build Status](https://travis-ci.com/shinnn/app-cache-dir.svg?branch=master)](https://travis-ci.com/shinnn/app-cache-dir)
[![codecov](https://codecov.io/gh/shinnn/app-cache-dir/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/app-cache-dir)

Get a path of the standard cache directory for a given application

```javascript
const appCacheDir = require('app-cache-dir');

// On most Linuxes
appCacheDir('my-app'); //=> '/root/shinnn/.cache/my-app'

// On macOS
appCacheDir('my-app'); //=> '/Users/shinnn/.cache/my-app'

// On Windows
appCacheDir('my-app'); //=> 'C:\\Users\\shinnn\\AppData\\Local\\my-app\\cache'
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install app-cache-dir
```

## API

```javascript
const appCacheDir = require('app-cache-dir');
```

### appCacheDir(*appName*)

*appName*: `string` (application name)  
Return: `string` (absolute directory path)

It resolves an application name into its [standard cache directory presented in the Atom issue tracker](https://github.com/atom/atom/issues/8281#issue-99784635), with following the environment variables [`XDG_CACHE_HOME`](https://standards.freedesktop.org/basedir-spec/basedir-spec-latest.html) (POSIX) and `LOCALAPPDATA` (Windows).

Basically it results:

* `~/.cache/${appName}` on POSIX
* `C:\\Users\\${username}\\AppData\Local\${appName}\cache` on Windows

```javascript
// On macOS

appCacheDir('hi'); //=> '/Users/shinnn/.cache/hi'

process.env.XDG_CACHE_HOME = '/foo/bar/';

appCacheDir('hi'); //=> '/foo/bar/hi'
```

When it cannot resolve the cache path, for exmaple both `HOME` and `XDG_CACHE_HOME` are empty, it returns `${os.tmpdir()}/${appName}/cache` as a last resort.

### appCacheDir.posix(*appName*)

*appName*: `string`  
Return: `string`

Follow POSIX way regardless of the current OS.

### appCacheDir.win32(*appName*)

*appName*: `string`  
Return: `string`

Follow Windows way regardless of the current OS.

## License

[ISC License](./LICENSE) © 2017 - 2019 Shinnosuke Watanabe
