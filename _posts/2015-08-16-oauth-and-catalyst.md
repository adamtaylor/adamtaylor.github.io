---
layout: post
title: OAuth and Catalyst
---

I've been working on and off on a [http://cowbellhq.com](hobby Catalyst application)
for a while now and one of the things I was not happy with was the authentication
system, which felt like a bit of a hack.

I was able to dedicate a bit of time lately into understanding Catalyst's
authentication quirks at the weekend and really nail my approach. I couldn't find
the right documentation to explain exactly what was required, so here's my attempt,
to help future me and anyone else who might be trying something similar.

OAuth
=====

Let's say you have a web application, and you want to allow users to log in to your
application, then you might want to defer the registration and authentication to
another service, like Facebook or Google, and user their OAuth login systems.

This is where a user can login with the third party service and authorise your
web application access to their account. This gives you access to some details of
their account but also verifies them as a user that could also log in to your
web application.

Catalyst
========

[Catalyst](http://www.catalystframework.org/) is a well known Perl MVC web
framework, akin to Ruby's Ruby on Rails or Python's Django.

Catalyst is very flexible and extensible and already has good support for
authentication and authorisation.

Catalyst::Plugin::Authentication
================================

As mentioned, Catalyst already has good authentication and authorisation support
through [Catalyst::Plugin::Authentication](https://metacpan.org/pod/Catalyst::Plugin::Authentication).

You can read the linked documentation to see how it all works, but it's pretty
straightforward. Oftentimes you'll use it with a backend store like
[Catalyst::Authentication::Store::DBIx::Class](https://metacpan.org/pod/Catalyst::Authentication::Store::DBIx::Class)
and all will be good with the world.

Catalyst::Authentication::Credential::Facebook::OAuth2
======================================================

If you want to defer your authentication to a third party OAuth provider, there
already exist a number of modules to do this for you. For example, I have used
[Catalyst::Authentication::Credential::Facebook::OAuth2](https://metacpan.org/pod/Catalyst::Authentication::Credential::Facebook::OAuth2)
and it works really nicely. I also started writing my own to authenticate
using [Strava's API](http://strava.github.io/api/). Things can start to get a bit
tricky at this point. What if you want to customise the behaviour of the authentication
plugin or do more than merely authenticate a user?

In my case I had two issues:

- I need to associate a user with only one account in my application, if they login
across the different providers but are really the same user (i.e. have the same
email address).
- I want to grab more information from the authentication provider than merely the
authentication token because there's other useful stuff there.


Catalyst::Authentication::Realm::Adaptor
========================================

This is where I recently learnt about a really useful module called
(Catalyst::Authentication::Realm::Adaptor)[https://metacpan.org/pod/Catalyst::Authentication::Realm::Adaptor]
that allows you to customise the behaviour of the authentication plugins. This is
exactly what I had been looking for.

It gives you two places to hook into and alter the behaviour. Now, most people might
not need any of this but it is especially useful with OAuth authentication.

One really simple thing you can do with this is rename the column the authentication
realm uses to lookup and store your access code. For example, the default field used
by the Facebook::OAuth2 realm is `token`. This is fine if you're only setting up
login with Facebook but if you want to support multiple OAuth providers, may not
be as appropriate.

Putting it all together
=======================

So in my application, I want to provide login via Facebook and Strava. And I want to
be able to link users from Facebook and Strava, if they login to my application
using the same account (email address). You might say that this is placing too much
trust in the provider but I say this is what they are here for.

We can do all of this with the modules mentioned above, some minimal controller
actions and resultset/row methods and a bit of config to tie it all together.

First the configuration for our app:

{% gist 9143f40ccd188c7920e3 %}

Our login actions:

{% gist 7560cdd1e7ed57910d19 %}

And, finally, our auto_create and auto_update methods:

{% gist e76e8e93992183207b66 %}

So, mostly with the help of
(Catalyst::Authentication::Realm::Adaptor)[https://metacpan.org/pod/Catalyst::Authentication::Realm::Adaptor],
we can get the exact customised login behaviour we need without hardcoding any
hacks into the core authentication code.

If you'd also like to use Strava for login, Catalyst::Authentication::Credential::Strava
should be heading to CPAN soon.
