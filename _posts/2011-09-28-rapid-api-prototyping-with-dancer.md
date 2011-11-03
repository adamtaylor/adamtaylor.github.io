---
layout: post
title: Rapid API prototyping with Dancer and DBIx::Class
---

<img src="/images/dancer-perl-api-screenshot.png" alt="Dancer API Screenshot" />

Thursday and Friday last week were hack days here at NAP HQ, which is a time
to work on anything you like, so long as it's vaguely business related. The
project I embarked on (see screenshot above) required an API and I thought this
would be a good opportunity to use <a href="http://www.perldancer.org">Dancer</a> at work.

Dancer is a micro-framework inspired by the likes of <a href="http://www.sinatrarb.com/">Sinatra</a> et. al. The primary goal is to provide developers with a simple <a href="http://en.wikipedia.org/wiki/Domain-specific_language">DSL</a> for handling HTTP requests:

    #!/usr/bin/env perl
    use Dancer;

    get '/' => sub {
        "Hello World!"
    };

    dance;

This makes it well suited for rapidly prototyping APIs and other sorts of HTTP related applications.

###DBIx::Class###

If you use SQL in your Perl application and don't use <a href="https://metacpan.org/module/DBIx::Class">DBIx::Class</a> you're doing it wrong! It is the one true way <a href="http://www.writemoretests.com/2011/09/test-driven-development-give-me-break.html">;)</a>...

Propaganda aside, DBIC is super useful as you can chain together methods on the <a href="https://metacpan.org/module/DBIx::Class::ResultSet">ResultSet</a> (set of results from the table). This is useful because you might have some options available to each method in your API like a limit to the number of results returned, a limit to the country results are returned from, or any other number of similar options.

With traditional SQL, each API method might need to perform the exact query required to return the data specified but with DBIC each API method can be passed a pre-populated ResultSet with the common filters already applied and it merely applies the additional ResultSet method to filter the ResultSet further. This is great as it avoids code duplication so if we think of another common API filter we can add it in one place instead of copying it to each API method.

Also, by using <a href="https://metacpan.org/module/DBIx::Class::Schema::Loader">DBIx::Class::Schema::Loader</a> it's ridiculously quick to get up and running:
<ul>
    <li>Create a database somewhere</li>
    <li>Create an SQL script to generate the required table(s)</li>
    <li>Run the script on the database</li>
    <li>Run schema_loader to generate the DBIC classes: `perl -MDBIx::Class::Schema::Loader=make_schema_at,dump_to_dir:./lib -e 'make_schema_at("Schema::Namespace", { debug => 1 }, [ "dbi:Pg:dbname=database_name","user", "pass" ])'`</li>
</ul>
Bob's your uncle! You now have usable DBIC classes in lib/.

###Dancer::Plugin::DBIC###

<a href="https://metacpan.org/module/Dancer::Plugin::DBIC">Dancer::Plugin::DBIC</a> is a simple plugin that exposes a `schema` keyword to your Dancer application so you can do things like:

    my $activity_rs = schema->resultset('Activity')->search(
        $search_args,
        $modifier_args,
    );

Enter your database credentials in your config.yml and you're good to go.

###Dancer::Serializer###

<a href="https://metacpan.org/module/Dancer::Serializer">Dancer::Serializer</a> handles encoding of references into {JSON, YAML, XML} as specified, for responses.

Set the default serializer in your app (or better, in your config.yml):

    # setting JSON as the default serializer
    set serializer => 'JSON';

Then in your API method you can do something like:

    get 'foo' => sub {
       return { foo => bar }
    }

And your application will return properly formatted JSON (or whatever) data, with the correct HTTP headers etc.

###Before Filters###

In the earlier argument in favour of DBIC we mentioned applying global filters to the ResultSet before passing it on to the specific API method. In Dancer you can have <a href="https://metacpan.org/module/Dancer#before">before filters</a> that are called before the specified HTTP method and can then pass the request on to another HTTP method.

In our API we had a number of filters that could be applied to every API method so our before method was as follows:

    before sub {

        my $country = params->{country};
        my $limit = params->{limit};
        my $activity_type = params->{activity_type};
        my $since = params->{since};

        my $search_args = {};
        $search_args->{country} = $country if defined $country;
        $search_args->{activity_type} = $activity_type if defined $activity_type;
        $search_args->{datetime} = { '>' => $since } if defined $since;

        my $modifier_args = {};
        $modifier_args->{order_by} = { -desc => 'id' };
        $modifier_args->{rows} = $limit if defined $limit;

        my $activity_rs = schema->resultset('Activity')->search(
            $search_args,
            $modifier_args,
        );

        var activity_rs => $activity_rs;

        my $path = request->path_info;

        request->path_info( $path );
    };

So this method, which is called before each API method, stores a (possibly filtered) ResultSet into <a href="https://metacpan.org/module/Dancer#vars">"vars"</a> (another keyword available in any other method - that'd be the stash in Catalyst) and then passes the request onto the originally requested method.

###After Filters###

Similar to before filters are <a href="https://metacpan.org/module/Dancer#after">after filters</a>. Our API was to be used by a simple HTML/CSS/JS web page. This meant that unless we allowed the API to return <a href="http://remysharp.com/2007/10/08/what-is-jsonp/">JSONP</a>, nothing would work. So we added a simple global after modifier:

    after sub {
        my $response = shift;

        $response->{content} = params->{callback} . '(' . $response->{content} . ')'
            if params->{callback};
    };

###In summary...###

What we made was possibly not the most elegant API but it took less than half a day to code up the whole thing from scratch and our demo won one of the three prizes - thank you Dancer, DBIC and Perl!
