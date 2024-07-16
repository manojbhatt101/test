(function () {
    try {
        /* main variables */
        var debug = 1; // Set to 1 to enable console logging
        var variation_name = "travelshift-CS2-T4";

        /* all Pure helper functions */
        function waitForElement(selector, trigger) {

            var interval = setInterval(function () {
                var element = document.querySelector(selector);
                if (document && element && document.querySelectorAll(selector).length > 0) {
                    clearInterval(interval);
                    trigger();
                }
            }, 50);
            setTimeout(function () {
                clearInterval(interval);

            }, 15000);
        }

        // HTM, content-------------
        var newContent = `<div class="video-container" style="display:none">
                <div class="headingsubheading">
                   <h1>Welcome to Iceland</h1>
                   <p>Find the very best selection on the largest marketplace for Icelandic travel services</p>
                </div>
                <div id='creVideo'> </div>
        </div>`;

        // Youtube video Initializer-------------------------
        function initYTVideo() {
            window.crePlayer = new YT.Player('creVideo', {
                height: '500',
                width: '768',
                videoId: '_xdCEnMEoHU', // Replace with your actual YouTube video ID
                playerVars: {
                    'mute': 1,       // Mute the video
                    'autoplay': 1,   // Autoplay the video
                    'controls': 0,   // Hide controls (optional)
                    'disablekb': 1,  // Disable keyboard control (optional)
                    'fs': 0,         // Disable fullscreen button (optional)
                    'modestbranding': 1, // Hide YouTube logo (optional)
                    'rel': 0,        // Hide related videos at the end (optional)
                    'showinfo': 0    // Hide video info (title and uploader) (optional)
                },
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        // On player state change checking if the videos gets ended, then adding a class, on that class bases showing the Background Image---------------
        function onPlayerStateChange(event) {
            var playerState = window.crePlayer.getPlayerState();
            if (playerState == YT.PlayerState.ENDED) {
                document.querySelector('[data-crid="t4-video-autoloop"]').classList.add("showThumbnail")
            }
        }

        // Function for adding youtube script-------------
        function addYoutubeScript() {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        //Adding the youtube API script-----------------
        addYoutubeScript();

        //Wait for Youtube function----------------------
        function waitForYT(trigger) {
            var interval = setInterval(function () {
                if (typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
                    clearInterval(interval);
                    trigger();
                }
            }, 50);
            setTimeout(function () {
                clearInterval(interval);
            }, 15000);
        }

        /* Variation Init */
        function init() {
            document.querySelector("body").classList.add("travelshift-CS2-T4")

            document.querySelector('[data-crid="t4-video-autoloop"]').innerHTML = newContent;

            waitForYT(initYTVideo)
            // 
            if (!window.documentVisibilityChnageListener) {
                window.documentVisibilityChnageListener = true;

                document.addEventListener("visibilitychange", function () {
                    // getting the current video timestamp-------------
                    if (!document.querySelector(".showThumbnail")) {
                        var currentVideoTime = window.crePlayer && window.crePlayer.getCurrentTime();
                        window.crePlayer && window.crePlayer.seekTo(currentVideoTime);
                        window.crePlayer && window.crePlayer.playVideo();
                    }
                });
            }


        }

        function Test_04perfObserver(list, observer) {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === "mark" && entry.name === "afterHydrate") {
                    observer.disconnect();
                    waitForElement('[data-crid="t4-video-autoloop"]', init, 50, 15000);
                }
            });
        }

        if (window._travelshift && window._travelshift.chunksLoadingData && window._travelshift.chunksLoadingData.status != "loaded") {
            const observer = new PerformanceObserver(Test_04perfObserver);
            observer.observe({ entryTypes: ["mark"] });
        } else {
            setTimeout(function () {
                waitForElement('[data-crid="t4-video-autoloop"]', init, 50, 15000);
                console.log("test triggered set timeout")
            }, 2000)
        }
    } catch (e) {
        if (debug) console.log(e, "error in Test " + variation_name);
    }
})();

