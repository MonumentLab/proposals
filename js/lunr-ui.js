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
index.addField('gen_neighborhood');
index.addField('outside_phl');
index.addField('age');
// index.addField('age_range');
// index.addField('instagram');
index.addField('image_file_name');
index.addField('proposal_transcription');
index.addField('topic');
index.addField('type');
index.addField('keywords_other');
index.addField('credit');
// index.addField('image_labels');
// index.addField('twitter');
// index.addField('facebook');
// add docs
for (let i in store){index.addDoc(store[i]);}
$('input#search').on('keyup', function() {
var results_div = $('#results');
var query = $(this).val();
var results = index.search(query, { boolean: 'AND', expand: true });
results_div.empty();

var results_string = '<p><small>Showing ';
results_string += results.length > 500 ? '500  of ' + results.length : results.length; 
results_string += " results.</small></p>";
 
results_div.prepend(results_string);

var resultsArray = []

for (let r in results.slice(0, 500)) {
let ref = results[r].ref;
let item = store[ref];
resultsArray.push(item);
}

for (let r in resultsArray.sort(nameSort)){

let item = resultsArray[r];
var meta = '';

if (item.age){ meta += '<strong>Age ' + item.age + '. ';}
if (item.neighborhood){ meta += 'From ' + item.neighborhood.split(',')[0] + '. ';}
meta += "</strong>";
if (item.proposal_transcription){ meta += '<br/>' + item.proposal_transcription.slice(0,140) + '... ';}

var result = '<div class="result"><a href="/monuments/' + item.pid.toLowerCase() + '"><img class="sq-thumb-sm" src="/assets/monuments/thumbs/' + item.image_file_name.toLowerCase().replace('JPG','jpg') + '"/>&nbsp;&nbsp;&nbsp;<p><span class="title">' + item.title + '.</span><br>' + meta + '</p></a></div>';
results_div.append(result);
}

});
});

function nameSort(a,b) {
    let title_a = a.title.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    let title_b = b.title.replace(/[\[\].,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    return title_a > title_b ? 1 : -1;
}