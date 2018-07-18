---
layout: post
title: Easily make native web applications on OS X
---

I spend a fair bit of time listening to BBC Radio from my laptop while working
and I had a thought that it would be easier if I had a desktop app that wrapped
it to make starting and running it easier.

It's easy to misplace a tab running a radio station in a sea of other pages and
apps. This might be an unpopular opinion, but I'd rather have it as a desktop app.

Given the rise of [Electron](https://electronjs.org/), it seems it would be
quite simple to create a wrapper app.

Well, it is _really simple_, we don't need to learn how Electron works at all.
This is because someone has already open-sourced a project that does exactly
what I want: give it a URL and it will do all the magic to create a native
wrapper. It's called [nativefier](https://github.com/jiahaog/nativefier).

Installing nativefier
--------------------

Installing nativefier is really easy, the [README](https://github.com/jiahaog/nativefier#installation)
explains how.

On OS X you need [NodeJS](https://nodejs.org/en/download/), then install the
`nativefier` package via NPM:

    $ npm install nativefier -g

Creating a native application
-----------------------------

It really is as easy as described in the README.

    $ nativefier "example.com"

This creates a directory example.com, containing the Electron `.app` file you
can launch.

Native BBC Radio Player
-----------------------

The default window size of the iplayer radio is smaller than the default window
size of the Electron app nativefier creates but it's easily tweaked.

    $ nativefier "https://www.bbc.co.uk/radio/player/bbc_6music" --name "BBC Music Player" --width 380 --height 665

Here we're starting at the BBC 6 Music station (because it's the best!). We set
a static title, otherwise it's taken from the `<title />` tag of the page. And
finally we set a sensible width and height for the window.

This results in the following directory:

    Adams-MBP:src adam$ tree -L 1 BBC\ Music\ Player-darwin-x64/
    BBC\ Music\ Player-darwin-x64/
    ├── BBC\ Music\ Player.app
    ├── LICENSE
    ├── LICENSES.chromium.html
    └── version

    1 directory, 3 files

And launching `BBC Music Player.app` starts the radio app:

<img src="/images/bbc-radio-player-native-os-x.png" alt="Screenshot of native desktop OS X BBC radio electron wrapper app" width="75%" height="75%" />
