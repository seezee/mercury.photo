---
layout: _main.njk
title: OKIE-X Artist’s Survey
image: /assets/images/okie-x/OKIE-X-Contact-Sheet-C.jpg
permalink: "/okie-x/okie-x-artists-survey/"
ogtype: website
excerpt: An excerpt
---

<script src="https://www.google.com/recaptcha/api.js"></script>
<script>
  function onSubmit() {
      document.getElementById("okie-x-artist-survey").submit()
  }
</script>

<!-- markdownlint-disable MD025 -->
# <icon-l class="bigger icon-before"><span class="with-icon"><svg id="icon-pencil-duo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="var(--mpb-color-accentReverse)" d="M96 352H32l-16 64 80 80 64-16v-64H96zM498 74.26l-.11-.11L437.77 14a48.09 48.09 0 0 0-67.9 0l-46.1 46.1a12 12 0 0 0 0 17l111 111a12 12 0 0 0 17 0l46.1-46.1a47.93 47.93 0 0 0 .13-67.74z" /><path fill="var(--mpb-color-accent)" d="M.37 483.85a24 24 0 0 0 19.47 27.8 24.27 24.27 0 0 0 8.33 0l67.32-16.16-79-79zM412.3 210.78l-111-111a12.13 12.13 0 0 0-17.1 0L32 352h64v64h64v64l252.27-252.25a12 12 0 0 0 .03-16.97zm-114.41-24.93l-154 154a14 14 0 1 1-19.8-19.8l154-154a14 14 0 1 1 19.8 19.8z" /></svg> {{ title }}</icon-l>
<!-- markdownlint-enable MD025 -->
<mpb-dialog-img>

{% image "featured", "img-constrained", "Contact sheet featuring the third dozen OKIE-X subjects.", "", "eager" %}</mpb-dialog-img>

Thank you for completing the OKIE-X Artists’ Survey.<a href="#mn1" id="mnref1"><span class="sr-only"> [See note]</span></a> Your answers will help me create the descriptive cards that will be displayed alongside your portrait in the OKIE-X project. Fields marked with <span class="required">*</span> are required.

{% include "_okie-x-artist-survey.njk" %}

<hr class="marginnotes-sep" />
<footer class="marginnotes" aria-labelledby="#label-marginnotes">
  <span class="sr-only" id="label-margin-notes">Notes</span>
  <ul class="marginnotes-list" role="list">
    <li id="mn1" role="listitem">

We’ll contact our artists to coördinate their sittings and to follow up with them when the show is ready to hang, as well as to arrange furnishing each artist with a complimentary digital file of their portrait after the show has hung. We won’t spam you and we won’t share your contact information without your explicit consent.&nbsp;<a href="#mnref1" a><span class="sr-only">Back to content&nbsp;</span>↩︎</a>
    </li>
  </ul>

</footer>
