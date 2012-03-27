---
layout: post
title: Unicode Perl Best Practices
---

bytes vs characters

### What's the problem? ###

ASCII has 128 characters. Extended ASCII character sets can have 256 characters,
e.g. ISO-8859-1. This is the limit of one byte.

Unicode has 110,000 characters; we need more bytes!

### UTF-8 ###

UCS (Universal Character Set) Transformation Format - 8 bit represents unicode
characters as 1 - 4 bytes and is the de facto standard encoding on the web. It
also has excellent support in Perl (as of 5.14).

### UTF-8 and Perl ###

There are two things you need to worry about when programming: data outside your
program and data inside your program.

Outside of your program you have sequences of bytes, which can be in any encoding.
Whereas inside your program you [should] have strings of characters, in Perl's
internal string representation (which is almost UTF-8).

You need to *patrol your borders*: all data coming into your program must be
decoded into character strings and all data leaving your program must be
encoded back into bytes.

    # decode on the way in
    $chars = decode('utf-8', $bytes);

    # encode on the way out
    $bytes = encode('iso-8859-1', $chars);

### Automagic Encoding Layer ###

Consider a larger Perl application, for example a Catalyst web application, with
a database (DBIx::Class) and message queues (ActiveMQ).
