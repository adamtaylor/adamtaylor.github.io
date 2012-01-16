http://www.jedi.be/blog/ general monitoring/metric articles & links

[Something about application/system metrics]

[Different ways of collecting application metrics -> pros/cons (IMO)]

Direct Metric Collection
========================

- statsd

Rolls up counters, timers etc. and batch sends to Ganglia.

http://www.shopify.com/technology/3709232-statsd-at-shopify
metaprogramming -> https://github.com/shopify/statsd-instrument

- gmond/gmetric directly

Pump stuff straight into ganglia. Commandline client. Easy to use.

Log Based Metric Collection
===========================

Parse and filter log files. Output to where-ever.

### Logster ###

[Logster](https://github.com/etsy/logster) is a tool for tailing logfiles and sending interesting info to ganglia or graphite. 

- quite basic/simple
- must write custom parsers in python

### Logstash ###

http://logstash.net/

"Ship logs from any source, parse them, get the right timestamp, index them, and search them."

- requires either MRI ruby 1.9.2
- jruby JAR package
- many more possibilities -> elasticsearch + web interface
