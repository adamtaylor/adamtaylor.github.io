// ==UserScript==
// @name          MetaCPAN Everywhere
// @description   Add to every link to CPAN a link to MetaCPAN on a Google results page.
// @namespace     http://ajct.info
// @include       *

//by Adam Taylor (http://ajct.info)
// ==/UserScript==

(function() {

    var page_links = document.links;
    for (var i=0; i<page_links.length; i++){
        if (page_links[i].href.match(/http:\/\/search\.cpan\.org\/perldoc\?(.*?)$/i)) {
            var match = page_links[i].href.match(/http:\/\/search\.cpan\.org\/perldoc\?(.*?)$/i);
            var span = document.createElement("span");
            span.innerHTML = "&nbsp; <a href=\"http://www.metacpan.org/module/"+match[1]+"\">MetaCPAN</a>";
            page_links[i].parentNode.insertAfter(span, page_links[i].nextSibling);
        }
    }

})();

