---
layout: post
title: OAuth and Catalyst
---

I've been working on and off on a <a href="http://cowbellhq.com">hobby Catalyst
application</a> for a while now and one of the things I was not happy with was
the authentication system, which felt like a bit of a hack.

I was able to dedicate a bit of time lately into understanding Catalyst's
authentication quirks at the weekend and really nail my approach. I couldn't find
the right documentaiton to explain exactly what was required, so here's my attempt,
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

<Better explanation here>

Catalyst
========

Catalyst is a well known Perl MVC web framework, akin to Ruby's Ruby on Rails or
Python's Django.

Catalyst is very flexible and extensible and alreay has good support for
authentication and authorisation.

Catalyst::Plugin::Authentication
================================

Catalyst::Authentication::Store::DBIx::Class
============================================

Catalyst::Authentication::Credential::Facebook::OAuth2
======================================================

Catalyst::Authentication::Realm::Adaptor
========================================

