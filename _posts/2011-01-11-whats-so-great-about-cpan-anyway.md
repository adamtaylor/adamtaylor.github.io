---
layout: post
title: What's so great about CPAN anyway?
---

Whenever people say that Perl is an abomination of a language, or dead, or not
hipster enough, one of the counter arguments from a [Perl rockstar](http://blogs.perl.org/users/su-shee/2011/01/and-suddenly-youre-hip.html) is that
CPAN is awesome. This is true but I'm not sure people realise quite how
awesome CPAN is!

### Uhm, so, what exactly is CPAN? ###

If you've been living under a rock, or just hate Perl that much, CPAN is the
"Comprehensive Perl Archive Network". What does that actually mean? It means
that CPAN is the place were you can search and download (amongst other things,
we'll get to those in a bit) any of the thousands of publicly available Perl
modules.

If you want to do "something", chances are, somebody else also wanted to do
"something", did it, and uploaded it to CPAN for you to freely use (instead
of having to re-invent the wheel).

For example:

- Want to SPEEK LIEK A LOLCATZ? There's a [module](http://search.cpan.org/perldoc?Acme::LOLCAT) for that!
- Want random facts about Jack Bauer (Chuch Norris style)? There's a [module](http://search.cpan.org/perldoc?Acme::24)
for that!
- Want to check if you're drunk or not? There's a [module](http://search.cpan.org/perldoc?Acme::Drunk) for that!

...There are [useful modules](http://search.cpan.org/perldoc?Task::Kensho) as well!

### How much stuff is on CPAN? I hear Ruby has more gems. ###

You may have seen that [Ruby has more gems](http://www.modulecounts.com/) than Perl has modules. [Well this is a
bit contriversial](http://www.modernperlbooks.com/mt/2010/12/counting-modules.html). As of this post there are either 21699 Distribution or 89058
Modules on CPAN...

I know. We don't kid when we say there's a lot of stuff on CPAN. If you just
want to get a feel for the kinds of useful modules available take a look at
[Task::Kensho](http://search.cpan.org/perldoc?Task::Kensho). It's a decent starting point for finding a recommend module for
a task.

### Okay, there are a bunch of modules on CPAN. Sounds good, how do I use it? ###

Usually you go to [search.cpan.org](http://search.cpan.org/) and search for what you want or browse
through the categories. Don't be put off by the plain interface &mdash; it's a
case of function over style.

### But how do I know if a module is actually any good? ###

Remember how I said that there was more to CPAN than just searching and
downloading modules? This is one of those things!

We have three extra services that can help you when evaluating a module:

#### CPAN Testers ####

> The objective of the group is to test as many of the
> distributions on CPAN as possible, on as many platforms
> as possible.

> The ultimate goal is to improve the portability of the
> distributions on CPAN, and provide good feedback to the
> authors.

[What is CPAN Testers?](http://wiki.cpantesters.org/wiki/WhatIsCPANTesters)

A bunch of people donate some spare CPU cycles to test new modules as they're
uploaded to CPAN using a bunch of different Perls on a bunch of different
machines. This means, for free, your module, or a module you're looking to
evaluate, has already been tested in a load of different environments and you
get to see the results.

As a user, this can help you decide if the module is stable enough and as a
developer this can help improve the stability and quality of your module(s).

#### CPAN Ratings ####

As well as seeing an indication of the quality of a module via test reports, we also have [CPAN Ratings](http://cpanratings.perl.org/), which is like Amazon book ratings but for Perl modules.

Want to know what other users think of a module? Look it up on CPAN Ratings! For example, [here's the reviews for a new, shiny web framework](http://cpanratings.perl.org/dist/Dancer). (These are also linked from the search.cpan.org module search results pages).

#### CPANTS ####

And finally, how about checking the Kwalitee of a module?

> Kwalitee: It looks like quality, it sounds like quality, but it's not quite
> quality

[What's "Kwalitee", anyway?](http://cpants.perl.org/kwalitee.html)

Each module uploaded to CPAN is tested against a bunch of Perl module development best practice metrics, for example, does it have unit tests, does it contain documentation etc.

Admittedly this is probably less useful for end users but indirectly it encourages a base level quality for Perl modules that benefits everybody

#### And how do I install something from CPAN? ####

Assuming you already have a Perl installed, you can just `cpan Module::Name` on the command line. If it's the first time you've used the CPAN client it might ask you a few short questions but then it will resolve all the dependencies and run all the unit tests. Assuming they all pass it will then install the module.

#### What if I find a bug in the module? ####

Another thing that comes for free with CPAN is [Request Tracker (RT)](https://rt.cpan.org/), a bug tracking tool. So if you find a bug, raise it in the modules bug queue, the module author is notified, and everyone's winner!

#### What if the documentation doesn't quite make sense? ####

Generally speaking, Perl modules conform to a reasonably standardised format for documentation. That said, another auxillary service of CPAN is [AnnoCPAN](http://www.annocpan.org/).

This is a place where users can add additional comments around the documentation of Perl modules. If there's nothing [useful] on Annocpan and something in the documentation seems confusing or inaccurate (which hopefully isn't the case too often); submit a bug ticket through RT!

As an aside, as well as reading the documentation through CPAN, you can view it via `perldoc Module::Name` on the command line.

#### Okay, I'm sold, Perl rocks, how do I contribute to CPAN? ####

So it turns out that CPAN's awesome and Perl rocks? Great! Glad I convinced you. If you want to get involved you need to register with [PAUSE](http://pause.perl.org/pause/query) and upload modules.

Check out [Dist::Zilla](http://dzil.org/), a neat way to manage your module(s) and don't forget the Kwalitee!
