(function () {
    try {
        // Wait for Element function
        function waitForElement(selector, trigger) {
            var interval = setInterval(function () {
                if (document && document.querySelector(selector) && document.querySelectorAll(selector).length > 0) {
                    clearInterval(interval);
                    trigger();
                }
            }, 50);
            setTimeout(function () {
                clearInterval(interval);
            }, 15000);
        }

        /**
         * Find all occurrences of an element and watch for new elements as they are added to the DOM asynchronously.
         * @param {string} selector - A CSS selector matching the target element(s).
         * @param {Function} callback - The callback that will be fired when an element matching the selector is found.
         * @param {Object} options - Options for observing the selector.
         * @param {number} options.timeout - Timeout duration (not implemented).
         * @param {boolean} options.once - Whether to observe only once.
         * @param {number} options.onTimeout - Timeout callback (not implemented).
         * @param {Document} options.document - Document to observe (default is window.document).
         * @returns {Function} - A "teardown" function that when called will turn off the mutation observer.
         */
        function observeSelector(selector, callback, options = {}) {
            const document = options.document || window.document;
            const processed = new Map();

            if (options.timeout || options.onTimeout) {
                throw `observeSelector options \`timeout\` and \`onTimeout\` are not yet implemented.`;
            }

            let obs;
            let isDone = false;

            const done = () => {
                if (obs) obs.disconnect();
                isDone = true;
            };

            const processElement = (el) => {
                if (!processed.has(el)) {
                    processed.set(el, true);
                    callback(el);
                    if (options.once) {
                        done();
                        return true;
                    }
                }
                return false;
            };

            const lookForSelector = (elParent) => {
                if (elParent.matches(selector) && processElement(elParent)) {
                    return true;
                }
                const elements = elParent.querySelectorAll(selector);
                for (const el of elements) {
                    if (processElement(el)) return true;
                }
                return false;
            };
            lookForSelector(document.documentElement);

            if (!isDone) {
                obs = new MutationObserver((mutationsList) => {
                    for (const record of mutationsList) {
                        if (record && record.addedNodes && record.addedNodes.length) {
                            for (const addedNode of record.addedNodes) {
                                const el = addedNode.parentElement;
                                if (el && lookForSelector(el)) return true;
                            }
                        }
                    }
                });
                obs.observe(document, {
                    attributes: false,
                    childList: true,
                    subtree: true,
                });
            }

            return done;
        }

        // Tooltip content
        var tooltipContents = [
            { crid: "Airplane", content: "Aerial views of Iceland's stunning landscapes" },
            { crid: "ATV", content: "Off-road adventures in Icelandic nature" },
            { crid: "Biking", content: "Cycle through scenic Icelandic routes" },
            { crid: "Bird watching", content: "Spot Iceland's diverse bird species" },
            { crid: "Boat Trip", content: "Sail Iceland's beautiful fjords and coastlines" },
            { crid: "Canoeing", content: "Paddle Iceland's serene lakes and rivers" },
            { crid: "Caving", content: "Explore Iceland's underground lava caves" },
            { crid: "Climbing", content: "Scale Iceland's rugged cliffs and peaks" },
            { crid: "Cultural Activity", content: "Experience Icelandic traditions and culture" },
            { crid: "Diving", content: "Dive in Iceland's unique underwater sites" },
            { crid: "Dog sledding", content: "Mush through snowy terrains with huskies" },
            { crid: "Exhibitions", content: "Discover Icelandic art and history" },
            { crid: "Fishing", content: "Catch fish in Iceland's rich waters" },
            { crid: "Food & Drinks", content: "Enjoy Icelandic culinary delights" },
            { crid: "Glacier Hiking", content: "Walk on Iceland's majestic glaciers" },
            { crid: "Helicopter", content: "Helicopter tours over Iceland's landscapes" },
            { crid: "Hiking", content: "Hike Iceland's breathtaking trails" },
            { crid: "Horse Riding", content: "Ride Icelandic horses through scenic routes" },
            { crid: "Hot Spring Bathing", content: "Relax in Iceland's natural hot springs" },
            { crid: "Ice Caving", content: "Explore stunning ice caves in Iceland" },
            { crid: "Ice Climbing", content: "Climb Iceland's frozen waterfalls" },
            { crid: "Kayaking", content: "Kayak in Iceland's tranquil waters" },
            { crid: "Motorbiking", content: "Motorbike through Iceland's rugged terrains" },
            { crid: "Museums", content: "Explore Iceland's rich history and culture" },
            { crid: "Northern lights hunting", content: "Chase the aurora borealis in Iceland" },
            { crid: "Paragliding", content: "Paraglide over Iceland's stunning scenery" },
            { crid: "Puffin tours", content: "Observe charming puffins in Iceland" },
            { crid: "Rafting", content: "Experience thrilling river rafting in Iceland" },
            { crid: "Reindeers", content: "Spot wild reindeer in Iceland" },
            { crid: "Self drive", content: "Explore Iceland at your own pace" },
            { crid: "Sightseeing", content: "Visit Iceland's iconic natural and cultural sites" },
            { crid: "Skiing", content: "Ski on Iceland's snowy slopes" },
            { crid: "Snorkelling", content: "Snorkel in Iceland's clear waters" },
            { crid: "Snowmobile", content: "Ride snowmobiles across Iceland's snowy landscapes" },
            { crid: "Super Jeep", content: "Off-road in Icelandic Super Jeeps" },
            { crid: "Transfers", content: "Convenient travel services in Iceland" },
            { crid: "Walking tours", content: "Guided walks through Icelandic towns" },
            { crid: "Whale Watching", content: "See majestic whales off Iceland's coast" },
            { crid: "Zipline", content: "Thrill-seeking zipline adventures in Iceland" },
            { crid: "Keflavik International Airport", content: "Iceland's main airport near Reykjavik" },
            { crid: "Reykjavik", content: "The vibrant capital city of Iceland" },
            { crid: "Golden Circle", content: "Popular sightseeing route near Reykjavik" },
            { crid: "Blue Lagoon", content: "Famous spa between Reykjavik & airport" },
            { crid: "Sky Lagoon", content: "Luxury oceanside retreat near Reykjavik" },
            { crid: "Jokulsarlon Glacier Lagoon", content: "Iceberg-filled lagoon in Southeast Iceland" },
            { crid: "Ring Road", content: "Scenic route around Iceland" },
            { crid: "Reynisfjara Black Sand Beach", content: "Dramatic volcanic beach in South Iceland" },
            { crid: "Gullfoss", content: "Spectacular waterfall in Southwest Iceland" },
            { crid: "Vatnajokull Glacier", content: "Europe's largest glacier in Southeast Iceland" },
            { crid: "North Iceland", content: "Whale watching and volcanic landscapes" },
            { crid: "West Iceland", content: "Waterfalls, hot springs, and lava fields" },
            { crid: "Eastfjords", content: "Scenic fjords and fishing villages" },
            { crid: "Westfjords", content: "Remote wilderness in Northwest Iceland" },
            { crid: "South Coast", content: "Glaciers, black sand beaches, waterfalls" },
            { crid: "Snaefellsnes", content: "Peninsula with diverse landscapes in West Iceland" },
            { crid: "Reykjanes", content: "Geothermal activity area near Reykjavik" },
            { crid: "Thingvellir", content: "Historic national park in Southwest Iceland" },
            { crid: "Geysir", content: "Home to erupting hot springs in Southwest Iceland" },
            { crid: "Vik", content: "Charming village with black sand beach in South Iceland" },
            { crid: "Skaftafell", content: "National park with glacier hikes in Southeast Iceland" },
            { crid: "Akureyri", content: "Cultural hub, whale watching, botanical gardens in North Iceland" },
            { crid: "Dettifoss", content: "Powerful waterfall in Northeast Iceland" },
            { crid: "Landmannalaugar", content: "Colorful mountains, hiking trails, hot springs in Highlands" },
            { crid: "Myvatn", content: "Volcanic lake, geothermal areas, birdwatching in North Iceland" },
            { crid: "Thorsmork", content: "Valley with hiking trails, stunning views in South Iceland" },
            { crid: "Egilsstadir", content: "Gateway to Eastfjords, forests, lakes in East Iceland" },
            { crid: "Langjokull", content: "Second largest glacier in West Iceland" },
            { crid: "Solheimajokull", content: "Accessible glacier for hiking in South Iceland" },
            { crid: "Eyjafjallajokull", content: "Famous volcano in South Iceland" },
            { crid: "Hvammsvik Hot Springs", content: "Secluded geothermal hot springs in West Iceland" },
            { crid: "Secret Lagoon", content: "Historic natural hot spring in South Iceland" },
            { crid: "Forest Lagoon", content: "Geothermal baths amidst trees in North Iceland" },
            { crid: "Vok Baths", content: "Floating geothermal pools in East Iceland" },
            { crid: "GeoSea Geothermal Baths", content: "Clifftop geothermal baths with sea views in North Iceland" },
            { crid: "Krauma Spa", content: "Hot springs and modern spa in West Iceland" },
            { crid: "Vestmannaeyjar (Westman Islands)", content: "Volcanic islands with puffins, hiking in South Iceland" },
            { crid: "Husavik", content: "Whale watching capital in North Iceland" },
            { crid: "Hveragerdi", content: "Town known for hot springs in South Iceland" },
            { crid: "Reykjadalur", content: "Hot river valley, hiking trails in South Iceland" },
            { crid: "Husafell", content: "Lava caves, waterfalls, hot springs in West Iceland" },
            { crid: "Seljalandsfoss", content: "Waterfall you can walk behind in South Iceland" },
            { crid: "Skogafoss", content: "Majestic waterfall with a staircase in South Iceland" },
            { crid: "Hella", content: "Small town, nearby caves in South Iceland" },
            { crid: "Kirkjubaejarklaustur", content: "Historic site, basalt columns, waterfalls in South Iceland" },
            { crid: "Hofn", content: "Harbor town, gateway to Vatnajokull in Southeast Iceland" },
            { crid: "Djupivogur", content: "Quiet fishing village, bird watching in East Iceland" },
            { crid: "Seydisfjordur", content: "Colorful town with fjord views in East Iceland" },
            { crid: "Asbyrgi", content: "Horse-shoe canyon, lush vegetation in North Iceland" },
            { crid: "Siglufjordur", content: "Historic fishing town, herring museum in North Iceland" },
            { crid: "Hauganes", content: "Small village, whale watching tours in North Iceland" },
            { crid: "Varmahlid", content: "Horse riding and traditional turf houses in North Iceland" },
            { crid: "Dynjandi", content: "Series of beautiful waterfalls in Westfjords" },
            { crid: "Hornstrandir", content: "Remote nature reserve, hiking paradise in Westfjords" },
            { crid: "Patreksfjordur", content: "Coastal village with rich history in Westfjords" },
            { crid: "Stykkisholmur", content: "Charming town, gateway to Snaefellsnes in West Iceland" },
            { crid: "Grundarfjordur", content: "Town near iconic Kirkjufell mountain in West Iceland" },
            { crid: "Olafsvik", content: "Fishing town with coastal scenery in West Iceland" },
            { crid: "Reykholt", content: "Historic site, Snorri's pool in West Iceland" },
            { crid: "Fludir", content: "Greenhouses, Secret Lagoon nearby in South Iceland" },
            { crid: "Hvalfjordur", content: "Scenic fjord with hiking trails in West Iceland" },
            { crid: "Kerlingarfjoll Mountain Range", content: "Geothermal area, colorful rhyolite mountains in Highlands" },
            { crid: "Grindavik", content: "Fishing village, Blue Lagoon nearby in Southwest Iceland" },
            { crid: "Krysuvik", content: "Geothermal area with bubbling mud pots in Southwest Iceland" },
            { crid: "Godafoss Waterfall", content: "Spectacular waterfall with historical significance in North Iceland" },
            { crid: "Hraunfossar", content: "Waterfalls streaming through lava fields in West Iceland" },
            { crid: "Barnafoss", content: "Lava waterfall with folklore tale in West Iceland" },
            { crid: "Hvitserkur", content: "Rock formation resembling a troll in North Iceland" },
            { crid: "Hvita River", content: "River known for rafting adventures in South Iceland" },
            { crid: "Stokkseyri", content: "Coastal village with elf museum in South Iceland" },
            { crid: "Borgarfjordur eystri", content: "Puffin watching, hiking trails in East Iceland" },
            { crid: "Breiddalsvik", content: "Peaceful village, scenic fjord in East Iceland" },
            { crid: "Holmavik", content: "Witchcraft museum, coastal views in Westfjords" },
            { crid: "Myrdalsjokull", content: "Ice cap on the top of the Katla volcano" },
        ];

        // Update Tooltip position
        function updateTooltipPosition(triggerElement, tooltipElement) {
            var rect = triggerElement.getBoundingClientRect();
            tooltipElement.style.position = "absolute";
            if (window.innerWidth < 959) {
                tooltipElement.style.top = `${rect.top + window.scrollY - tooltipElement.offsetHeight - 10}px`; // Adjust position above the element
                tooltipElement.style.right = "0px";
            } else {
                tooltipElement.style.top = `${rect.top + window.scrollY - tooltipElement.offsetHeight - 20}px`; // Adjust position above the element
                tooltipElement.style.left = `${rect.left + window.scrollX}px`;
            }
        }

        // Initialize tooltip
        function initializeTooltips() {
            var items = document.querySelectorAll('[data-crid="filter-section-activityIds"] [data-crid], [data-crid="filter-section-attractionIds"] [data-crid]');
            var internalScrollContainer = document.getElementById("internal-scroll-container");

            items.forEach((item) => {
                // Create the trigger element
                var triggerElement = document.createElement("div");
                triggerElement.classList.add("Creinfo");
                triggerElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>`;

                if (!item.querySelector(".Creinfo") && item.getAttribute("data-crid") != "filter-section-heading") {
                    item.appendChild(triggerElement);
                }

                triggerElement.addEventListener("mouseenter", function () {
                    var crid = item.getAttribute("data-crid");
                    var content = tooltipContents.find((entry) => entry.crid === crid)?.content;

                    if (content) {
                        // Remove any existing tooltip
                        document.querySelectorAll(".tooltip").forEach((tooltip) => tooltip.remove());

                        // Create tooltip element
                        var tooltipElement = document.createElement("div");
                        tooltipElement.classList.add("tooltip");
                        tooltipElement.setAttribute("id", "cre-filter-toolTip");
                        tooltipElement.textContent = content;

                        // Create close button
                        var closeButton = document.createElement("span");
                        closeButton.classList.add("Creross");
                        closeButton.innerHTML = `
                    <svg viewBox="0 0 25 26" class="x-urwy9g e1e4xw9s0">
                        <path d="M1.06 21.567a1.5 1.5 0 000 2.121l.708.707a1.5 1.5 0 002.121 0l8.777-8.777 9.044 9.045a1.5 1.5 0 002.122 0l.707-.707a1.5 1.5 0 000-2.121l-9.045-9.045 8.901-8.9a1.5 1.5 0 000-2.122l-.707-.707a1.5 1.5 0 00-2.121 0l-8.901 8.9L4.033 1.33a1.5 1.5 0 00-2.122 0l-.707.707a1.5 1.5 0 000 2.121l8.633 8.633-8.776 8.777z"></path>
                    </svg>
                `;

                        closeButton.addEventListener("click", function () {
                            tooltipElement.remove();
                            removeEventListeners(updatePosition);
                        });

                        // Append close button and tooltip content
                        tooltipElement.appendChild(closeButton);
                        document.body.appendChild(tooltipElement);

                        // Initial positioning
                        updateTooltipPosition(triggerElement, tooltipElement);

                        // Update tooltip position on scroll and resize
                        var updatePosition = () => updateTooltipPosition(triggerElement, tooltipElement);
                        window.addEventListener("scroll", updatePosition);
                        if (internalScrollContainer) {
                            internalScrollContainer.addEventListener("scroll", updatePosition);
                        }
                        window.addEventListener("resize", updatePosition);

                        addScrollableListeners(tooltipElement, updatePosition);
                    }
                });

                triggerElement.addEventListener("mouseleave", function () {
                    var tooltipElement = document.querySelector(".tooltip");
                    if (tooltipElement) {
                        tooltipElement.remove();
                        removeEventListeners(updateTooltipPosition);
                    }
                });
            });

            function addScrollableListeners(tooltipElement, updatePosition) {
                var scrollableDivs = [
                    document.querySelector('[data-crid="filter-section-attractionIds"]>div:nth-child(3)>div'),
                    document.querySelector('[data-crid="filter-section-activityIds"]>div:nth-child(3)>div'),
                ];

                scrollableDivs.forEach((scrollableDiv) => {
                    if (scrollableDiv) {
                        // Add a scroll event listener
                        scrollableDiv.addEventListener("scroll", function () {
                            updatePosition();
                            // Check if the tooltip is still within the visible area of scrollableDiv
                            if (isTooltipOutOfView(tooltipElement, scrollableDiv)) {
                                tooltipElement.remove();
                                removeEventListeners(updatePosition);
                            }
                        });
                    }
                });
            }

            function isTooltipOutOfView(tooltipElement, container) {
                var tooltipRect = tooltipElement.getBoundingClientRect();
                var containerRect = container.getBoundingClientRect();
                return tooltipRect.bottom < containerRect.top || tooltipRect.top > containerRect.bottom || tooltipRect.right < containerRect.left || tooltipRect.left > containerRect.right;
            }

            function removeEventListeners(updatePosition) {
                window.removeEventListener("scroll", updatePosition);
                if (internalScrollContainer) {
                    internalScrollContainer.removeEventListener("scroll", updatePosition);
                }
                window.removeEventListener("resize", updatePosition);
            }
        }

        // Event handler
        function eventHandler() {
            // Observer selector
            observeSelector('[data-crid="filter-section-attractionIds"] [data-crid], [data-crid="filter-section-activityIds"] [data-crid]', init);

            /* tooltip close event */
            document.body.addEventListener("click", function (event) {
                var target = event.target;
                if (!target.closest(".tooltip") && !target.closest(".Creinfo")) {
                    if (document.querySelector(".tooltip")) {
                        document.querySelector(".tooltip").remove();
                    }
                }
            });
        }

        // Initialize experiment
        function init() {
            console.log("Code injected");

            // Add observer
            if (!window.inputFieldObserverAdded) {
                window.inputFieldObserverAdded = true;
                eventHandler();
            }

            // Call initializeTooltips to set up event listeners
            initializeTooltips();
        }

        // Performance observer
        function Test_26perfObserver(list, observer) {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === "mark" && entry.name === "afterHydrate") {
                    observer.disconnect();
                    waitForElement('[data-crid="filter-section-attractionIds"] [data-crid]', init);
                }
            });
        }

        // Chunks loaded
        if (window?._travelshift?.chunksLoadingData?.status != "loaded") {
            const observer = new PerformanceObserver(Test_26perfObserver);
            observer.observe({ entryTypes: ["mark"] });
        } else {
            setTimeout(function () {
                waitForElement('[data-crid="filter-section-attractionIds"] [data-crid]', init);
            }, 2000);
        }
    } catch (err) {
        //console && console.log(err);
    }
})();