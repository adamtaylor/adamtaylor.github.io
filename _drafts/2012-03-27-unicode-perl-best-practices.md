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

Consider a larger Perl application, for example a web application, built with the
Catalyst framework, with a database (DBIx::Class) and with message queues
(ActiveMQ).

We can start to see that we have a limited amount of places where we interact
with the outside world and configure all these places correctly we shouldn't
need to worry about too much in the main part of our application.

... more detail ...

So, our application is now a happy, stress-free microcosm of perfectly decoded
data and we have nothing to worry about, right? Wrong!

### Welcome to the new world of Unicode pain! ###

Unicode forceably changes the way you think about text because everything you
thought you knew, is no longer true...

### Normalisation ###

Consider the character `é`. You can't pin-point it to one unicode code character
because it could be:

é: U+00E9, otherwise known as LATIN SMALL LETTER E WITH ACCUTE

*or*

e + ´: U+0065 + U+0301, otherwise known as LATIN SMALL LETTER E and COMBING ACUTE ACCENT

Given this lovely fact, does `'crème brûlée' eq 'crème brûlée'`?
You can't know for sure!

You can't even know if `length 'crème brûlée' == length 'crème brûlée'`.

How do we fix this? We need to _normalise_ the text. The unciode standard defines
the [normalisation forms](http://unicode.org/reports/tr15/) of characters and the
two that are most important are decomposed and composed characters.

The decomposed, or canonical decomposition, (NFD) is where the character is
split into as many characters as possible.

The decomposed form of é would be U+0065 + U+0301.

The composed, or canonical composition, (NFC) is where the character is
composed into its single representative character.

The composed form of é would be U+00E9.

[Unicode::Normalize](https://metacpan.org/module/Unicode::Normalize) provides,
amongst others the methods `NFD()` and `NFC()`.

So, with our example, we might instead try:

    NFD('crème brûlée') eq NFD('crème brûlée')

### Graphemes ###

# XXX does this make sense?
A grapheme [cluster] is a single user-visible character, a conceptual character,
if you will.



### Further Reading ###

- link
- link
- link
