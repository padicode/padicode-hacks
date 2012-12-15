/* 
The original script for Google Analytics is provided by Justin Cutroni: http://cutroni.com/blog/2012/02/21/advanced-content-tracking-with-google-analytics-part-1/
I modified the script and optimized it for the new analytics.js - Universal Analytics that Google Analytics is due to launch in 2013.
Any suggestions for optimization are welcomed.
*/
jQuery(function($) {
    // Debug flag
    var debugMode = false;

    // Default time delay before checking location
    var callBackTime = 100;

    // # px before tracking a reader
    var readerLocation = 150;

    // Set some flags for tracking & execution
    var timer = 0;
    var scroller = false;
    var endContent = false;
    var halfContent = false;
    var didComplete = false;

    // Set some time variables to calculate reading time
    var startTime = new Date();
    var beginning = startTime.getTime();
    var totalTime = 0;

    // Track the aticle load
    if (!debugMode) {
        ga('send', {
          hitType: 'event',         
          eventCategory: 'Reading', 
          eventAction: 'ArticleLoaded',
          nonInteraction: 1
        });
        
    }

    // Check the location and track user
    function trackLocation() {
        bottom = $(window).height() + $(window).scrollTop();
        height = $(document).height();

        // If user starts to scroll send an event
        if (bottom > readerLocation && !scroller) {
            currentTime = new Date();
            scrollStart = currentTime.getTime();
            timeToScroll = Math.round((scrollStart - beginning) / 1000);
            if (!debugMode) {
                
                ga('send', {
                  hitType: 'event',         
                  eventCategory: 'Reading', 
                  eventAction: 'StartReading',
                  eventValue: timeToScroll
                });
            } else {
                alert('started reading ' + timeToScroll);
            }
            scroller = true;
        }


        // If user has hit the bottom of the content send an event
        if (bottom >= ($('.entry-content').scrollTop() + $('.entry-content').innerHeight())/2 && !halfContent) {
            currentTime = new Date();
            contentScrollEnd = currentTime.getTime();
            timeToContentEnd = Math.round((contentScrollEnd - scrollStart) / 1000);
            if (!debugMode) {
                ga('send', {
                  hitType: 'event',         
                  eventCategory: 'Reading', 
                  eventAction: 'HalfContent',
                  eventValue: timeToContentEnd
                });
            } else {
                alert('half content section '+timeToContentEnd);
            }
            halfContent = true;
        }
        
        // If user has hit the bottom of the content send an event
        if (bottom >= $('.entry-content').scrollTop() + $('.entry-content').innerHeight() && !endContent) {
            currentTime = new Date();
            contentScrollEnd = currentTime.getTime();
            timeToContentEnd = Math.round((contentScrollEnd - scrollStart) / 1000);
            if (!debugMode) {
                if (timeToContentEnd < 60) {
                    ga('set', 'dimension2', 'Scanner');
                } else {
                    ga('set', 'dimension2', 'Reader');
                }
                
                ga('send', {
                  hitType: 'event',         
                  eventCategory: 'Reading', 
                  eventAction: 'ContentBottom',
                  eventValue: timeToContentEnd,
                  metric1:timeToContentEnd
                });
            } else {
                alert('end content section '+timeToContentEnd);
            }
            endContent = true;
        }

        // If user has hit the bottom of page send an event
        if (bottom >= (height-500) && !didComplete) {
            currentTime = new Date();
            end = currentTime.getTime();
            totalTime = Math.round((end - scrollStart) / 1000);
            if (!debugMode) {
                 ga('send', {
                  hitType: 'event',         
                  eventCategory: 'Reading', 
                  eventAction: 'PageBottom',
                  eventValue: totalTime
                });
            } else {
                alert('bottom of page '+totalTime);
            }
            didComplete = true;
        }
    }

    // Track the scrolling and track location
    $(window).scroll(function() {
        if (timer) {
            clearTimeout(timer);
        }

        // Use a buffer so we don't call trackLocation too often.
        timer = setTimeout(trackLocation, callBackTime);
    });
});
