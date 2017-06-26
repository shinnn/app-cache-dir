'use strict';

const {join} = require('path');
const {homedir, tmpdir} = require('os');

const appCacheDir = require('.');
const pretendPlatform = require('pretend-platform');
const test = require('tape');

delete process.env.LOCALAPPDATA;
delete process.env.XDG_CACHE_HOME;

test('appCacheDir()', t => {
  t.throws(
    () => appCacheDir(1),
    /^TypeError.*Expected an application name to find its cache directory \(string\), but got 1\./,
    'should throw an error when it takes a non-string argument.'
  );

  t.throws(
    () => appCacheDir(''),
    /^Error.*Expected an application name to find its cache directory, but got '' \(empty string\)\./,
    'should throw an error when it takes an empty string.'
  );

  t.end();
});

test('appCacheDir() on a POSIX environment with no `XDG_CACHE_HOME`', t => {
  pretendPlatform('linux');

  t.equal(
    appCacheDir('my-app'),
    join(homedir(), '.cache', 'my-app'),
    'should return a path in the home directory.'
  );

  t.end();
});

test('appCacheDir() with no cache related environment variables', t => {
  pretendPlatform('win32');

  t.equal(
    appCacheDir('my-app'),
    join(tmpdir(), 'my-app', 'cache'),
    'should return a path in the temporary directory.'
  );

  t.end();
});

test('appCacheDir.posix()', t => {
  process.env.XDG_CACHE_HOME = __dirname;

  pretendPlatform('freebsd');

  t.equal(
    appCacheDir('my-app'),
    join(__dirname, 'my-app'),
    'should respect `XDG_CACHE_HOME` environment variable.'
  );

  t.end();
});

test('appCacheDir.posix() with no `XDG_CACHE_HOME` and `HOME`', t => {
  for (const key of Object.keys(process.env)) {
    process.env[key] = '';
  }

  t.equal(
    appCacheDir('my-app'),
    join(tmpdir(), 'my-app', 'cache'),
    'should use a temporary directory as a fallback.'
  );

  t.end();
});

test('appCacheDir.win32()', t => {
  process.env.localApPdATa = join(__dirname, 'x', 'y', 'z');

  pretendPlatform('win32');

  t.equal(
    appCacheDir('my-app'),
    join(__dirname, 'x', 'y', 'z', 'my-app', 'cache'),
    'should respect `LOCALAPPDATA` environment variable.'
  );

  t.end();
});
