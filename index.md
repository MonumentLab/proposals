---
layout: default
collection: monuments
class: home
---

<div class="textbox">

<h2>CREATIVE SPECULATIONS FOR PHILADELPHIA</h2>

<p>In 2017, Monument Lab and our partners at Mural Arts Philadelphia conducted a citywide, participatory research project. We worked with twenty leading contemporary artists to install prototype monuments in public squares and parks, and opened ten adjacent research labs staffed by research teams facilitating dialogue and gathering public proposals. The project was driven by a central question: *What is an appropriate monument for the current City Philadelphia?*  Over 250,000 people engaged in person, over a million on social media platforms, and over 4,500 left their own proposals at one of the labs. It was one of the largest participatory research projects of its kind in Philadelphia.</p>

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

{% for item in the_collection %}collection.push({ pid: "{{ item.pid | downcase }}", image_file_name: "{{ item.image_file_name }}", title: "{{ item.title }}" });{% endfor %}

var index = Math.floor(Math.random() * collection.length);
if (index < 1000) { index = [0, 1000]; }
else if (index > collection.length) { index = [collection.length-1000, collection.length]; }
else { index = [index - 1000, index]; }

var subset = collection.slice(index[0], index[1]);

for( i in subset ){
  gallery.append("<div class='gallery-item all'><a href='{{ site.baseurl }}/{{ page.collection }}/" + subset[i]['pid'] + "/'><div class='hovereffect'><img class='img-responsive gallery-thumb' data-src='{{ site.ml.endpoint }}thumbs/" + subset[i]['image_file_name'] + "'><div class='overlay'><p class='info'>" + subset[i]['title'] + "</p></div></div></a></div>");
}

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
}(window,document));

</script>