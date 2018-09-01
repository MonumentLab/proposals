// ---
// layout: none
// ---
// $.getJSON("{{ site.baseurl }}/js/lunr-index.json", function(index_json) {
$.getJSON("/js/lunr-index.json", function(index_json) {
window.index = new elasticlunr.Index;
window.store = index_json;
index.saveDocument(false);
index.setRef('lunr_id');
index.addField('pid');
index.addField('title');
index.addField('location_transcription');
index.addField('zipcode');
index.addField('neighborhood');
index.addField('age');
index.addField('age_range');
index.addField('instagram');
index.addField('image_file_name');
index.addField('proposal_transcription');
index.addField('topic');
index.addField('topic_summary');
index.addField('type');
index.addField('keywords_other');
index.addField('credit');
index.addField('image_labels');
index.addField('twitter');
index.addField('facebook');
// add docs
for (let i in store){index.addDoc(store[i]);}
$('input#search').on('keyup', function() {
var results_div = $('#results');
var query = $(this).val();
var results = index.search(query, { boolean: 'AND', expand: true });
results_div.empty();
if (results.length > 10) {
results_div.prepend("<p><small>Displaying 10 of " + results.length + " results.</small></p>");
}
for (let r in results.slice(0, 9)) {
var ref = results[r].ref;
var item = store[ref];var pid = item.pid;
var title = item.title;
var location_transcription = item.location_transcription;
var zipcode = item.zipcode;
var neighborhood = item.neighborhood;
var age = item.age;
var age_range = item.age_range;
var instagram = item.instagram;
var image_file_name = item.image_file_name;
var proposal_transcription = item.proposal_transcription;
var topic = item.topic;
var topic_summary = item.topic_summary;
var type = item.type;
var keywords_other = item.keywords_other;
var credit = item.credit;
var image_labels = item.image_labels;
var twitter = item.twitter;
var facebook = item.facebook;

      //   var result = '<div class="result"><a href="' + link + '"><img class="sq-thumb-sm" src="/assets/monument/thumbs/"' + item.image_file_name + '/>&nbsp;&nbsp;&nbsp;<p><span class="title">' + title + '.</span><br>' + meta + '</p></a></div>';
      //   results_div.append(result);
      // }

var meta    = '';

if (item.topic){ meta += item.location + ', ';}
if (item.keywords_other){ meta += item._date + '. ';}
if (item['type']){ meta += item['type'] + '. ';}

var result = '<div class="result"><a href="/monuments/' + item.pid + '"><img class="sq-thumb-sm" src="/assets/monuments/thumbs/' + item.image_file_name.toUpperCase().replace('JPG','jpg') + '"/>&nbsp;&nbsp;&nbsp;<p><span class="title">' + title + '.</span><br>' + meta + '</p></a></div>';
results_div.append(result);
}
});
});