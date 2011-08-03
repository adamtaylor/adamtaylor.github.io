---
layout: post
title: MetaCPAN Everywhere!
---

[MetaCPAN](http://www.metacpan.org) is one of the
[new](http://blogs.perl.org/users/mo/2011/06/introducing-betametacpanorg---a-better-search-for-the-cpan.html)
[shinies](http://szabgab.com/blog/2011/07/metacpan-is-awesome.html) in Perl
space at the moment.

It is awesome and I found myself getting annoyed when "normal" CPAN results
were appearing in Google results pages.

So last night I wrote a quick and dirty greasemonkey script to add a link to the
MetaCPAN page for CPAN modules that appear in Google results pages:

<img src="/images/metacpan-greasemonkey.png" />

Currently it only works for those links that point to the perldoc? page on
CPAN and it may well not work for everyone.
[Patches welcome!](http://github.com/adamtaylor/userscripts/)

[The script](http://userscripts.org/scripts/show/108877s) should work natively on
chrome (or with
[tampermonkey](https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo#)).
I haven't checked it in FireFox but I assume it should work there too. Enjoy!
