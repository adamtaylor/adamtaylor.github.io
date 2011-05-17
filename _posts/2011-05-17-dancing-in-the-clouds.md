---
layout: post
title: Dancing in the Clouds
---

Recent excitment surrounding the launch of a [Perl "cloud" hosting provider](http://blog.dotcloud.com/dotcloud-introduces-camel-as-a-service-with-i) led me
to sign up to the beta programme and give it a whirl. I'm interested in using
the platform to deploy Dancer applications so I'll lay out the steps required
to successfully deploy a skeleton application.

### Cloud what? ###

> A simple multi-language application platform. Assemble your stack from dozens
> of pre-configured components. We deploy and scale it for you.

<cite><a href="http://www.dotcloud.com">dotcloud</a></cite>

dotcloud is a "platform as a service" provider that aim to take the hassle out
of managing servers and deploying code.

The idea is that deploying code with dotcloud is as simple as:

- write your application
- dotcloud push
- boom - application deployed!

This is enabled by a command line utility that makes it very easy to push code
to their servers and have it instantly deployed.

### Initial Setup ###

I'm working on a MacBook with Snow Leopard installed so the following instructions
are slightly OS X specific but you should be able to translate them to use your
favourite OS or package manager.

Firstly, check you have python installed:

`$ which python`

I'm on OS X, so it is already installed as standard.

Next [install homebrew](https://github.com/mxcl/homebrew/wiki/installation).

Finally, we need to install the python package manager and the dotcloud client
itself:

`$ brew install setuptools`

`$ easy_install dotcloud`

### First stack ###

Every project you deploy to dotcloud requires it's own "namespace" for the
deployment stack. This is then split into the multiple "services" that the
application requires.

For example, your namespace might be `awesomedancerapp` and your services might be
`awesomedancerapp.www`, `awesomedancerapp.db` and so on.

Let's create our first application namespace:

`$ dotcloud create dancertest` 

If this is your first time running dotcloud, it will ask for your API key, just
follow the instructions.

Now let's create the perl service (the part of the stack which will run the
Dancer application):

`$ dotcloud deploy -t perl dancertest.www`

At this point you can already get to your service:
[http://www.dancertest.dotcloud.com/](http://www.dancertest.dotcloud.com/)

<img src="/images/dotcloud/dotcloud_service.png" width="640px" height="400px"
alt="dotcloud psgi application"/>

Now we create our skeleton application:

`$ dancer -a Test`

Check that it works locally:

`$ perl bin/app.pl && open http://0.0.0.0:3000`

You should see the Dancer default page. If that failed, perhaps try upgrading
Dancer:

`cpan Dancer` or similar.

<img src="/images/dotcloud/dancer_skeleton.png" width="640px" height="400px" 
alt="skeleton Dancer application" />

The dotcloud Perl environments rely on PSGI to connect you're Perl application to
their servers. So we need to "plackify" our Dancer application (Plack is the
reference implementation based on the PSGI specifiction).

Fortunately Dancer applications support PSGI out of the box, we just need to
create an app.psgi file in the root of the application:

`$ echo "require 'bin/app.pl';" > app.psgi`

### Declaring our dependencies ###

The simplest way to declare the dependencies for a Perl application is to add
the required libraries to the makefile. The skeleton Dancer application we
created already contains a Makefile.PL. Simply append Plack as a dependency:

    PREREQ_PM => {
        'Test::More' => 0,
        'YAML'       => 0,
        'Dancer'     => 1.3030,
        'Plack'      => 0.9974,
    },

### Deploying our code ###

`$ dotcloud push dancertest.www .`

This is saying push all the code in the current (.) directory to our service
`www` in our `dancertest` namspace.

You should see a whole bunch output (cpanminus installing the dependencies)
ending in:

    <== Installed dependencies for .. Finishing.
    21 distributions installed
    uwsgi: stopped
    uwsgi: started
    Connection to www.dancertest.dotcloud.com closed.

Go back to the URL and you should see the skeleton application running:

<img src="/images/dotcloud/dancer_deployed.png"  width="640px" height="400px"
alt="Dancer application deployed on dotcloud" />

How ridiculously easy was that? Happy hacking!
