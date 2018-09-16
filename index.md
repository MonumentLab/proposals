---
layout: default
collection: monuments
class: home
---

<div class="textbox">

{{ "In 2017, we invited Philadelphians and visitors to reflect on these prototypes, and on the city itself, and to offer their own proposals for Philadelphia monuments. Each proposal is an idea to be considered, an inspiration to be admired, and an additional perspective on our history and our future. They were collected at learning labs in public squares and city parks, adjacent to the prototype monuments.

The public proposals collected at the labs represent an astonishing range and depth of perspectives about our city. Taken as a collection of individual public proposals, they remind us of the powerfully diverse city in which we live, where many histories coexist, only a few of which are called out as statues, plaques, and markers." | markdownify }}

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