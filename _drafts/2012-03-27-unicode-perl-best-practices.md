---
layout: post
title: Unicode Perl Best Practices
---

The following are notes I took during a Unicode tech talk at work by
[Dave Cross](http://twitter.com/davorg).

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
Whereas inside your program you (should) have strings of characters, in Perl's
internal string representation (which is almost UTF-8).

You need to *patrol your borders*: all data coming into your program must be
decoded into character strings and all data leaving your program must be
encoded back into bytes. Importantly, and this can be tricky in some situations,
you need to know the encoding of your input data for when you decode it, and,
hopefully less tricky, the encoding you want to output.

    # decode on the way in
    $chars = decode('utf-8', $bytes);

    # encode on the way out
    $bytes = encode('iso-8859-1', $chars);

### Automagic Encoding Layer ###

Consider a larger Perl application, for example a web application, built with the
Catalyst framework, with a database and ORM (pg + DBIx::Class) and with message
queues (ActiveMQ).

We can start to see that we have a limited amount of places where we interact
with the outside world and if configure all these places correctly we shouldn't
need to worry about too much in the main part of our application.

#### Postgres ####

There's a [flag you can enable in DBD::Pg](https://metacpan.org/module/DBD::Pg#pg_enable_utf8-boolean-)
which will encode data coming back from the database as utf8 (if appropriate and
the database was created with the correct character set).

#### Catalyst #####

You'll want to use
[Catalyst::Plugin::Unicode::Encoding](https://metacpan.org/module/Catalyst::Plugin::Unicode::Encoding)
and you probably want to turn on UTF-8 encoding in your view -
[Template Toolkit in our case](https://metacpan.org/module/Catalyst::View::TT#Unicode).

#### ActiveMQ ####

Our internal ActiveMQ library also handles UTF-8 encoding/decoding on our behalf.

You may have different borders to patrol but the hope is that our application is now
a happy, stress-free microcosm of perfectly decoded data and we have nothing more
to worry about, right? Wrong!

### Welcome to the new world of Unicode pain! ###

Unicode forceably changes the way you think about text because everything you
thought you knew, is no longer true...

### Normalisation ###

Consider the character `é`. You can't pin-point it to one unicode code character
because it could be:

é: U+00E9, otherwise known as LATIN SMALL LETTER E WITH ACCUTE

*or*

e + ´: U+0065 + U+0301, otherwise known as LATIN SMALL LETTER E and COMBINING ACUTE ACCENT

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

A grapheme (actually a graphmeme cluster) is a single user-visible character,
a conceptual character, if you will.

Consider

    reverse split //, 'crème brûlée'

You might, if you're unlucky, end up with the accents on the wrong letters
depending on the composition of the characters.

You can't know what you'll end up with because you don't know whether that
string is made up of single unicode characters or multiple unicode characters.

`\X` in a regex matches a single grapheme so the above could be written instead
as:

    reverse NFD("crème brûlée") =~ /\X/g

There are other string functions that could also have problems when:

    length('crème brûlée')
    substr('crème brûlée', 0, 5)

They could be re-written using the `\X` operator too:

    $length++ while 'crème brûlée' =~ /\X/g
    ($str) = 'crème brûlée' =~ /(\X{5})/

This might get a bit tedious but fortunately the
[Grapheme Cluster String module](https://metacpan.org/module/Unicode::GCString)
provides a number of helpful string methods that works with unicode characters.

### Unicode Properties ###

Unicode characters have properties that can be matched in regexes with
`\p{PROPERTY}` (and `\P{property}`.

For example:

    \p{Lu} # uppercase letters
    \p{Digit} # digit

See `perldoc perluniprops` for all the details.

### Collation ###

Standard Perl collation operators are in codepoint order, which often makes
little sense.

    sort 'd', 'é', 'f'; # dfé

Luckily, we can use [Unicde::Collate](https://metacpan.org/module/Unicode::Collate)
to fix this.

### Further Reading ###

#### General ####

- Joel's [Unicode Essay](http://www.joelonsoftware.com/articles/Unicode.html)
- Tom Christiansen's [Stack Overflow Essay](http://stackoverflow.com/questions/6162484/why-does-modern-perl-avoid-utf-8-by-default)
- Tom Christiansen's [Oscon 2011 Talks](http://98.245.80.27/tcpc/OSCON2011/index.html)
- Tom Christiansen's [Unicode Cookbook posts on perl.com](http://www.perl.com/pub/2012/04/)

#### Perldoc ####

- [perldoc perluniintro](http://perldoc.perl.org/perluniintro.html)
- [perldoc perlunitut](http://perldoc.perl.org/perlunitut.html)
- [perldoc perlunicode](http://perldoc.perl.org/perlunicode.html)
- [The "Unicode Bug"](http://perldoc.perl.org/perlunicode.html#The-%22Unicode-Bug%22)
- ['unicode_strings' feature](http://perldoc.perl.org/feature.html#the-%27unicode_strings%27-feature)
- [open (function)](http://perldoc.perl.org/functions/open.html) (see the section on I/O layers)
- [open (pragma)](http://perldoc.perl.org/open.html)
- [perldoc perluniprops](http://perldoc.perl.org/perluniprops.html)

#### CPAN ####

- [Encode](https://metacpan.org/module/Encode)
- [utf8](https://metacpan.org/module/utf8)
- [Unicode::Collate](https://metacpan.org/module/Unicode::Collate)
- [Unicode::Normalize](http://metacpan.org/module/Unicode::Normalize)
- [Unicode::GCString](https://metacpan.org/module/Unicode::GCString)
- [Unicode::UCD](https://metacpan.org/module/Unicode::UCD)
- [Unicode::Tussle](https://metacpan.org/module/Unicode::Tussle)

#### Books ####

- Effective Perl Programming (Second Edition), Chapter 8, Unicode.
- Programming Perl (Fourth Edition), Chapter 6, Unicode.
