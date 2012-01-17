http://www.jedi.be/blog/ general monitoring/metric articles & links

At work, like many organisations, we have a large collection of system metrics,
created by our sysops teams but we (the developers) are less good at thinking
about application level metrics. I've taken it upon myself to investigate
different methods for collecting metrics from our applications.

A Very Quick Introduction To Application Metrics
================================================

Take a minute to think about monitoring and metric collection; what comes to mind...?
CPU usage? Memory usage? Free disk space?

These are all very important metrics to collect but they're obviously very
low level metrics.

There's an additional higher level of metrics that can be collected, application
metrics. These could be things like:

- number of x processed (where x is an important function of the application)
- number of background jobs processed
- cache hits vs cache misses
- number of application errors

While system metrics can be used to notify you when something is about to,
or is already, going wrong; application metrics can be used as an actual pointer
to what specifically has gone wrong. Additionally, in continuous deployment
environments application metrics are often used as post-deploy health checks
for your application.

There are two obvious ways to collect metrics from applications:

- direct metric collection: adding calls into your applications to send metrics
directly to various metric collection systems
- log based metric collection: an alternative way to collect metrics from an
application would be to output events to log files and then parse those and
send values to metric collection systems

Most developers and organisations are used to logging important errors or
application events so using log based metric collection may be a lower friction
and lower cost approach to starting to collect application metrics. The downside
is that developers have to write various parsing scripts for different log formats.

Alternatively developers could litter their application with direct calls to metric
collection systems. This negates the need to parse log files but adds more noise
to the codebase, unless you
[utilise metaprogramming techniques](http://www.shopify.com/technology/3709232-statsd-at-shopify).

Direct Metric Collection
========================

### Statsd ###

[StatsD](https://github.com/etsy/statsd) a tool by Etsy is described as:

    "A network daemon for aggregating statistics (counters and timers), rolling them up, then sending them to graphite."

StatsD is a network daemon that accepts packets over UDP (to minimise application
impact), which sends batch updates to Ganglia for trending and graphing.

There client libraries available in many languages, including
[Perl](https://metacpan.org/module/Net::Statsd).

If you're starting to collect metrics from scratch, it's probably well worth
investigation StatsD (and graphite). However, at work, we already have the
infrastructure in place to collect metrics using Ganglia.

Short of modifying StatsD to send the metrics to Ganglia, or setting
up the infrastructure to collect metrics with Graphite (which I briefly tried
and failed at previously), we'll probably give StatsD a miss at work for now.

### Gmetric ###

Ganglia has a command line client called gmetric that allows you to easily send
metric values straight to Ganglia (well roughly, there's some multi-node collection
details but they're not important in this discussion) and, again, there are
client libraries in many languages, including various
[implementations](https://metacpan.org/module/Ganglia::Gmetric)
[in](https://metacpan.org/module/Ganglia::Gmetric::PP)
[Perl](https://metacpan.org/module/Ganglia::Gmetric::XS).

Okay, sounds like a good alternative to StatsD. However, the thing that
attracted me to StatsD was the ability to increment counters, so everytime
your application processed x you could fire off a StatsD packet incrementing the
counter, using Gmetric directly, you can't do this. You _have_ to send total values.
This would either require maintaining counters in your application, or sending
counts per second.

Log Based Metric Collection
===========================

Parse and filter log files. Output to where-ever.

### Logster ###

[Logster](https://github.com/etsy/logster) is a tool for tailing logfiles and sending interesting info to ganglia or graphite. 

- quite basic/simple
- must write custom parsers in python

### Logstash ###

[Logstash](http://logstash.net/) describes itself as tool to:

    "Ship logs from any source, parse them, get the right timestamp, index them, and search them."

- requires either MRI ruby 1.9.2
- jruby JAR package
- many more possibilities -> elasticsearch + web interface
