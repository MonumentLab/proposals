---
layout: default
collection: monuments
class: home
---

<div class="textbox">

{{ "In 2017, Monument Lab and our partners at Mural Arts Philadelphia conducted a citywide, participatory research project. We worked with twenty leading contemporary artists to install prototype monuments in public squares and parks, and opened ten adjacent research labs staffed by research teams facilitating dialogue and gathering public proposals. The project was driven by a central question: *What is an appropriate monument for the current City Philadelphia?* Over 250,000 people engaged in person, over a million on social media platforms, and over 4,500 left their own proposals at one of the labs. It was one of the largest participatory research projects of its kind in Philadelphia.

The tools and technologies for the Monument Lab research process: People in public spaces, at ten labs around the city, were handed a clipboard with a paper form and a Sharpie. The information network for gathering the data was created by a team of local artists, activists, educators, and youth researchers who were employed at each lab. Each team invited Philadelphians and visitors to offer their own answers to the project’s guiding question and to fill out a research form about their imagined monument. The form had space for a name for the monument, and asked people to write down where they would like to see the monument, and to include, if they chose, their home zip code, age, and a name they’d like to use to get credit for their idea. After people handed in the form, the team scanned the forms into a data system, where each field in each proposal was transcribed and mapped by the data team, just like any piece of civic data or city statistic. In our system, the data are created from stories, memories, values, worries, and desires.

Each proposal is an idea to be considered, an inspiration to be admired, and an additional perspective on our history and our future. They were collected at learning labs in public squares and city parks, adjacent to the prototype monuments. The public proposals collected at the labs represent an astonishing range and depth of perspectives about our city. Taken as a collection of individual public proposals, they remind us of the powerfully diverse city in which we live, where many histories coexist, only a few of which are called out as statues, plaques, and markers.

Now that the research has been transcribed, mapped, and will soon be uploaded to Open Data Philly, the *Report to the City*, a summary of findings written by the Monument Lab curatorial team, offers a reading and reflection on the immense creativity and critical energies by public participants, as well as key findings from an examination of the data. The field of responses is a stunning, unprecedented glimpse into the historical imagination of Philadelphians. This was not about what is practical or about finding a solution to a particular problem. It was an exercise in turning to cultural memory as a source and force for democracy." | markdownify }}

</div>

<div id="wax-gallery"></div>

{%- assign the_collection = site.data[page.collection] -%}

<script type="text/javascript">
  // create items
  var container= $('#wax-gallery');
  container.prepend("<div id='gallery'></div>");
  var gallery = $('#gallery');

  let i = 0;

var collection = [];

{% for item in the_collection %}

collection.push({
    pid: "{{ item.pid | downcase }}",
    image_file_name: "{{ item.image_file_name }}",
    title: "{{ item.title }}"
})

{% endfor %}

var index = Math.floor(Math.random() * collection.length);
if (index < 1000) { index = [0, 999]; }
else if (index > collection.length) { index = [collection.length-1000, collection.length]; }
else { index = [index - 1000, index]; }

var subset = collection.slice(index[0], index[1]);
for (i in subset) {

  gallery.append("<div class='gallery-item all'><a href='{{ site.baseurl }}/{{ page.collection }}/" + subset[i]['pid'] + "/'><div class='hovereffect'><img class='img-responsive gallery-thumb' data-src='{{ site.ml.endpoint }}thumbs/" + subset[i]['image_file_name'] + "'><div class='overlay'><p class='info'>" + subset[i]['title'] + "</p></div></div></a></div>");
}

if ( i == 999 )

(function(w, d){
var b = d.getElementsByTagName('body')[0];
var s = d.createElement("script"); 
var v = !("IntersectionObserver" in w) ? "8.15.0" : "10.17.0";
s.async = true; 
s.src = "https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/" + v + "/lazyload.min.js";
w.lazyLoadOptions = {
  elements_selector: '.gallery-thumb'
};
b.appendChild(s);
}(window, document));

</script>