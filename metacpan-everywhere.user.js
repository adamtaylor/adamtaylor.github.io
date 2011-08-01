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
        var match_url = page_links[i].href.match(/http:\/\/search\.cpan\.org\/perldoc\?(.*?)$/i);
        if (match_url) {
            alert match_url[1];
            var span = document.createElement("span");
            span.innerHTML = "<a href=\"http://www.metacpan.org/module/"+match_url[1]+"\">MetaCPAN</a>";
            page_links[i].parentNode.insertBefore(span, page_links[i].nextSibling)
        }
    }

})();

