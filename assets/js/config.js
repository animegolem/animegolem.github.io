// Configuration options
const init_phones = ["Golem HRTF Target", "MDR-MV1"],// Optional. Which graphs to display on initial load. Note: Share URLs will override this set
      DIR = "data/",                                // Directory where graph files are stored
      default_channels = ["L","R"],                 // Which channels to display. Avoid javascript errors if loading just one channel per phone
      default_normalization = "dB",                 // Sets default graph normalization mode. Accepts "dB" or "Hz"
      default_norm_db = 60,                         // Sets default dB normalization point
      default_norm_hz = 630,                        // Sets default Hz normalization point (500Hz is recommended by IEC)
      max_channel_imbalance = 5,                    // Channel imbalance threshold to show ! in the channel selector
      alt_layout = true,                            // Toggle between classic and alt layouts
      alt_sticky_graph = true,                      // If active graphs overflows the viewport, does the graph scroll with the page or stick to the viewport?
      alt_animated = true,                          // Determines if new graphs are drawn with a 1-second animation, or appear instantly
      alt_header = true,                            // Display a configurable header at the top of the alt layout
      alt_tutorial = false,                          // Display a configurable frequency response guide below the graph
      site_url = '/',                               // URL of your graph "homepage"
      share_url = true,                             // If true, enables shareable URLs
      watermark_text = "",              // Optional. Watermark appears behind graphs
      watermark_image_url = "assets/images/golem.svg", // Optional. If image file is in same directory as config, can be just the filename
      page_title = "",                  // Optional. Appended to the page title if share URLs are enabled
      page_description = "DIY Pirate blocked canal measurements. Use at your own risk.",
      accessories = false,                           // If true, displays specified HTML at the bottom of the page. Configure further below
      externalLinksBar = true,                      // If true, displays row of pill-shaped links at the bottom of the page. Configure further below
      expandable = false,                           // Enables button to expand iframe over the top of the parent page
      expandableOnly = false,                       // Prevents iframe interactions unless the user has expanded it. Accepts "true" or "false" OR a pixel value; if pixel value, that is used as the maximum width at which expandableOnly is used
      headerHeight = '0px',                         // Optional. If expandable=true, determines how much space to leave for the parent page header
      darkModeButton = false,                        // Adds a "Dark Mode" button the main toolbar to let users set preference
      targetDashed = true,                          // If true, makes target curves dashed lines
      targetColorCustom = false,                    // If false, targets appear as a random gray value. Can replace with a fixed color value to make all targets the specified color, e.g. "black"
      labelsPosition = "bottom-left",               // Up to four labels will be grouped in a specified corner. Accepts "top-left," bottom-left," "bottom-right," and "default"
      stickyLabels = true,                          // "Sticky" labels 
      analyticsEnabled = false,                     // Enables Google Analytics 4 measurement of site usage
      extraEnabled = true,                          // Enable extra features
      extraUploadEnabled = true,                    // Enable upload function
      extraEQEnabled = true,                        // Enable parametic eq function
      extraEQBands = 10,                            // Default EQ bands available
      extraEQBandsMax = 20,                         // Max EQ bands available
      num_samples = 25,                              // Number of samples to average for smoothing
      Scale_smoothing = 0.2;                        // Smoothing factor for scale transitions

// Specify which targets to display
const targets = [
    { type:"Golem HRTFs",  files:["Golem HRTF"] },
    { type:"Blocked Canal DF HRTFs",  files:["ARI, HUTUBS, RIEC, SONICOM AVG","ISO 11904"] },
];

// Haruto's Addons
const  preference_bounds_name = "Bounds",  // Preference bounds name
       preference_bounds_dir = "assets/pref_bounds/",  // Preference bounds directory
       preference_bounds_startup = false,              // If true, preference bounds are displayed on startup
       allowSquigDownload = true,                     // If true, allows download of measurement data
       PHONE_BOOK = "phone_book.json",                 // Path to phone book JSON file
       default_y_scale = "40db",                       // Default Y scale; values: ["20db", "30db", "40db", "50db", "crin"]
       default_DF_name = "Golem HRTF",                   // Default RAW DF name
       dfBaseline = true,                              // If true, DF is used as baseline when custom df tilt is on
       default_bass_shelf = 1,                         // Default Custom DF bass shelf value
       default_tilt = 0,                            // Default Custom DF tilt value
       default_ear = -1.5,                                // Default Custom DF ear gain value
       default_treble = -5,                             // Default Custom DF treble gain value
       tiltableTargets = ["Golem HRTF","ARI, HUTUBS, RIEC, SONICOM AVG","ISO 11904"],                 // Targets that are allowed to be tilted
       compTargets = ["Golem HRTF","ARI, HUTUBS, RIEC, SONICOM AVG","ISO 11904"],                     // Targets that are allowed to be used for compensation
       allowCreatorSupport = false;                     // Allow the creator to have a button top right to support them
       allowLanguageSelector = false;                   // Add Language Selector on the top right of the page. If it's false, l10n feature will be disabled.
       availableLanguages = ["en", "ko"];              // List of available language codes. When you are adding a new language, make sure to use ISO 639-1 Language Codes for auto-detection.
       defaultLanguage = "en";                         // Determine default (fallback) language. It should be included in the availableLanguages list.
       useBrowserLangAsDefault = true;                 // If true, the browser's language will be used as the default language. If false, the defaultLanguage setting will be used as the default.
       translateHeader = true;                         // If true, translated header link from language files will be used over the one from config.js
       translateTutorial = true;                       // If true, translated tutorial from language files will be used over the one from config.js
       translateAccessories = true;                    // If true, translated accessories from language files will be used over the one from config.js
       translateTargetTypes = true;                    // If true, translated target types from language files will be used over the one from config.js
       translateAlertMessages = true;                  // If true, translated alert messages from language files will be used.

const harmanFilters = [
    { name: "Harman 2013 OE", tilt: 0, bass_shelf: 4.8, ear: 0, treble: -4.4 },
    { name: "Harman 2015 OE", tilt: 0, bass_shelf: 6.6, ear: 0, treble: -1.4 },
    { name: "Harman 2018 OE", tilt: 0, bass_shelf: 6.6, ear: -1.8, treble: -3 },
]

// *************************************************************
// Functions to support config options set above; probably don't need to change these
// *************************************************************

// But I will anyways haha - Haruto

// Set up the watermark, based on config options above
function watermark(svg) {
    let wm = svg.append("g")
        .attr("transform", "translate("+(pad.l+W/2)+","+(pad.t+H/2-20)+")")
        .attr("opacity",0.2);
    
    if ( watermark_image_url ) {
        wm.append("image")
            .attrs({id:'logo', x:-64, y:-64, width:128, height:128, "xlink:href":watermark_image_url, "class":"graph_logo"});
    }
    
    if ( watermark_text ) {
        wm.append("text")
            .attrs({id:'wtext', x:0, y:80, "font-size":28, "text-anchor":"middle", "class":"graph-name"})
            .text(watermark_text);
    }

    // Extra flair
    svg.append("g")
        .attr("opacity",0.2)
        .append("text")
        .attrs({x:765, y:314, "font-size":14, "text-anchor":"end", "class":"graph-name"})
        .text("DIY Pirate Blocked Canal");
}



// Parse fr text data from REW or AudioTool format with whatever separator
function tsvParse(fr) {
    return fr.split(/[\r\n]/)
        .map(l => l.trim()).filter(l => l && l[0] !== '*')
        .map(l => l.split(/[\s,]+/).map(e => parseFloat(e)).slice(0, 2))
        .filter(t => !isNaN(t[0]) && !isNaN(t[1]));
}



// Apply stylesheet based layout options above
function setLayout() {
    function applyStylesheet(styleSheet) {
        var docHead = document.querySelector("head"),
            linkTag = document.createElement("link");
        
        linkTag.setAttribute("rel", "stylesheet");
        linkTag.setAttribute("type", "text/css");
        
        linkTag.setAttribute("href", styleSheet);
        docHead.append(linkTag);
    }

    if ( !alt_layout ) {
        applyStylesheet("assets/css/style.css");
    } else {
        applyStylesheet("assets/css/style-alt.css");
        applyStylesheet("assets/css/style-alt-theme.css");
    }
}
setLayout();



// Configure HTML accessories to appear at the bottom of the page. Displayed only if accessories (above) is true
// There are a few templates here for ease of use / examples, but these variables accept any HTML
const 
    // Short text, center-aligned, useful for a little side info, credits, links to measurement setup, etc. 
    simpleAbout = `
    Blocked canal measurements captured at 85DB using a TOM-1537L-HD capsule
    `
    ;
    // Which of the above variables to actually insert into the page
    // If you are using custom accessories, you may need to change loadTranslations() in translate.js to utilize custom accessories
let whichAccessoriesToUse = simpleAbout;



// Configure external links to appear at the bottom of the page. Displayed only if externalLinksBar (above) is true
const linkSets = [
    {
        label: "Blocked Canal Databases",
        links: [
            {
                name: "Listener's EQ Playground",
                url: "https://listener800.github.io/eqplayground"
            }
        ]
    },
    {
        label: "KB006x Databases",
        links: [
            {
                name: "Listener",
                url: "https://listener800.github.io/"
            },
            {
                name: "GadgetryTech",
                url: "https://gadgetrytech.squig.link/"
            },
        ]
    },
    {
        label: "KB500X Databases",
        links: [
            {
                name: "The Hangout",
                url: "https://graph.hangout.audio/headphones"
            }
        ]
    },
    {
        label: "5128 Databases",
        links: [
            {
                name: "Listener",
                url: "https://listener800.github.io/5128.html"
            }
        ]
    }
];



// Set up analytics
function setupGraphAnalytics() {
    if ( analyticsEnabled ) {
        const pageHead = document.querySelector("head"),
              graphAnalytics = document.createElement("script"),
              graphAnalyticsSrc = "graphAnalytics.js";
        
        graphAnalytics.setAttribute("src", graphAnalyticsSrc);
        pageHead.append(graphAnalytics);
    }
}
setupGraphAnalytics();



// If alt_header is enabled, these are the items added to the header
let headerLogoText = "",
    headerLogoImgUrl = "assets/images/headerv2.png",
    headerLinks = [
    {
        name: "How to build your own PIRATE in-ear microphones",
        url: "https://github.com/animegolem/pirate-extensions-extended"
    }
];
let whichHeaderLogoTextToUse = headerLogoText;
let whichHeaderLogoImgUrlToUse = headerLogoImgUrl;
let whichHeaderLinksToUse = headerLinks;

// Source: https://www.teachmeaudio.com/mixing/techniques/audio-spectrum
let tutorialDefinitions = [
    {
        name: 'Sub bass',
        width: '16%',
        description: 'The Rumble, usually out of human\'s hearing range and tend to be felt more than heard, providing a sense of power.'
    },
    {
        name: 'Bass',
        width: '20.6%',
        description: 'Determins how "fat" or "thin" the sound is, boosting around 250hz tend to add a feeling of warmth. If you\'re a bass head you most likely like this range.'
    },
    {
        name: 'Lower Mids',
        width: '10.1%',
        description: 'Low order harmonics of most instruments, generally viewed as the bass presence range. Boosting a signal around 300 Hz adds clarity to the bass and lower-stringed instruments. Too much boost around 500 Hz can make higher-frequency instruments sound muffled.'
    },
    {
        name: 'Midrange',
        width: "20%",
        description: 'The midrange determines how prominent an instrument is in the mix. Boosting around 1000 Hz can give instruments a horn-like quality. Excess output at this range can sound tinny and may cause ear fatigue.'
    },
    {
        name: 'Upper Mids',
        width: "10%",
        description: 'The high midrange is responsible for the attack on percussive and rhythm instruments. If boosted, this range can add presence. However, too much boost around the 3 kHz range can cause listening fatigue.'
    },
    {
        name: 'Presence',
        width: '5.9%',
        description: 'The Presence range is responsible for the clarity and definition of a sound. Over-boosting can cause an irritating, harsh sound. Cutting in this range makes the sound more distant and transparent.'
    },
    {
        name: 'Treble',
        width: '17.4%',
        description: 'The Treble range is composed entirely of harmonics and is responsible for sparkle and air of a sound. Over boosting in this region can accentuate hiss and cause ear fatigue.'
    }
]
let whichTutorialDefinitionsToUse = tutorialDefinitions;