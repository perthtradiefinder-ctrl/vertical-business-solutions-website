# VBS cinematic homepage hero — approved integration

Checkpoint: VBS-HERO-02-20261006. Owner approval on 6 October 2026: “Yes I approve, build site”. This authorises integration and production deployment of the reviewed VBS-HERO-01 prototype.

## Scope and source

Existing repository: perthtradiefinder-ctrl/vertical-business-solutions-website, main. Baseline: d28e34f806afe105a998df303272df04b2b0e6ac. Existing Netlify site: b1b5758a-2e46-48b3-930e-4275bfcdcbe5. Production: https://verticalbusinesssolutions.com.au.

The approved 17-second workflow replaces the old abstract hero and six-card carousel. One photographic driveway/house/van environment and a CSS 3D phone persist across enquiry intake, site photos, physical paver assembly, exploded quote, approval/scheduling and completion. Styles, DOM IDs and animation targets are namespaced. The current products, platform, navigation, footer and demo-request form are preserved. Book a demo reaches the existing form; the final CTA reaches the existing trade products.

This remains a static HTML/CSS/JS marketing site. No new repository, hosting site, database or product was created. It is an owner-directed marketing exception; Life Agent remains the sole Active Sprint.

## Technology and assets

GSAP 3.14.2 and ScrollTrigger are locally served, with CSS perspective/transforms, HTML interface cards and a perspective SVG finish over the same background photograph. No WebGL scene, image sequence or video background. The 1536px WebP is 324,780 bytes; the 960px mobile WebP is 120,258 bytes. All six hero assets together are 611,631 bytes before HTTP compression. Mobile uses the smaller background and fewer particles/price labels.

Expected local application bytes initially requested are roughly 343 KB on mobile and 668 KB on desktop, excluding the existing Google font and HTTP overhead. These are size estimates, not measured network timing or Core Web Vitals. The server may compress text assets. Only the immediate background is high priority; runtime assets are deferred and self-hosted.

ScrollTrigger maps the continuous sticky scroll track to all six stages. Play, pause, replay, keyboard controls, a range scrubber and stage shortcuts supplement scrolling. On short phone screens the stage shortcuts collapse so playback and the scrubber stay visible. Resize rebuilds preserve timeline state. Offscreen/hidden-document animation advancement pauses.

## Verification

63 targeted browser/contract checks passed in Chromium 153 on Linux, including six major moments at desktop 1440×900 and mobile 414×896, same background and central phone, correct exploded price labels, playback, keyboard play, range/stage navigation, scroll mapping/sticky placement, CTA destinations, mobile navigation, unchanged product/platform/demo markup, the Netlify POST/honeypot contract and existing success message. Responsive checks passed at 375×667, 390×844, 768×1024, 820×1180 and 1920×1080. No JavaScript errors or missing GSAP targets. See hero-verification.json for the exact assertions.

The reduced-motion preference shows a static completed-job composition and a readable Enquiry → Visual → Quote → Approved Job → Complete summary, without a long sticky track. The same complete phone and summary remain usable with JavaScript disabled or an animation dependency blocked. Semantic copy and the existing product descriptions communicate the journey without the animation. Playback targets are at least 44×44 pixels.

A complete mobile autoplay run reached closeout. Software-rendered Chromium recorded 887 RAF samples, mean 19.39 ms, 61 intervals over 25 ms and a maximum interval of 133.3 ms. RAF timing is not actual paint FPS. Physical iPhone Safari, real-device 60fps and real network Core Web Vitals remain unverified. No real demo request was submitted; form delivery is not an end-to-end test claim.

## Deliberate compromises

The phone, assembly and exploded materials use CSS 3D, without true lighting/refraction or physical object intersection. Photos are different crops of the same site plate. The background finish is a perspective SVG overlay, retaining the original shadows. Full Three.js could improve materials, phone reflections and occlusion later if device testing supports the additional cost. The example customer and quantities/prices are illustrative and visibly labelled demo values, not a live product execution or project estimate.

## Publishing and rollback

Publish only through the mapped existing main branch/Netlify site. A release is production-verified only after Netlify reports a ready published deploy whose commit matches the tested source and live responses match the asset hashes. The final commit and deploy evidence are recorded separately in the release checkpoint and VBS control registers.

Rollback reference: baseline commit d28e34f806afe105a998df303272df04b2b0e6ac / former ready deploy 6ac445d89a8a3d0008ea505a. A rollback, if required, should restore that existing deploy or revert this commit, preserving subsequent unrelated work.
