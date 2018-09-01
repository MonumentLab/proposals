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
  {% for item in the_collection limit: 100 %}

  gallery.append("<div class='gallery-item {{ item[page.facet_by] }} all'><a href='{{ site.baseurl }}/{{ page.collection }}/{{ item.pid }}/'><div class='hovereffect'><img class='img-responsive gallery-thumb' src='{{ site.ml.endpoint }}thumbs/{{ item.image_file_name }}'><div class='overlay'><p class='info'>{{ item.title }}</p></div></div></a></div>");
  {% endfor %}

  {% if page.facet_by %}
      container.prepend('<div id="facet-buttons"></div><br>');

      var buttonDiv = $('#facet-buttons');
      var facets = Array.from(new Set([{%- for item in the_collection -%}'{{ item[page.facet_by] }}'{% unless forloop.last %}, {% endunless %}{%- endfor -%}]));

      // create buttons
      buttonDiv.append("<button class='btn facet active' data-filter='all'>show all</button>");
      for (i in facets) {
        buttonDiv.append("<button class='btn facet' data-filter=" + facets[i]+ ">" + facets[i] + "</button>");
      }


      // filter on button click
      $(document).ready(function(){
          // clicking button with class "category-button"
          $(".facet").click(function(){
              // get the data-filter value of the button
              var filterValue = $(this).attr('data-filter');
              // show all items
              if(filterValue == "all") {
                  $(".all").show("slow");
              }
              else {
                  // hide all items
                  $(".all").hide("slow");
                  // and then, show only items with selected data-filter value
                  $('.'+filterValue).show("slow");
              }
          });
      });
    {% endif %}
</script>