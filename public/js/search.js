var client = algoliasearch('P9R2R1LI94', '2b949398099e9ee44619187ca4ea9809');
var index = client.initIndex('ArtworkSchema');
var myAutocomplete = autocomplete('#search-input', { hint: false }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
    displayKey: 'title',
    templates: {
      suggestion: function(suggestion) {
        var sugTemplate =
          "<a href='/artwork_details/" +
          suggestion.objectID +
          "'><img src='" +
          suggestion.cover +
          "'/><span>" +
          suggestion._highlightResult.title.value +
          '</span></a>';
        return sugTemplate;
      }
    }
  }
]).on('autocomplete:selected', function(event, suggestion, dataset) {
  console.log(suggestion, dataset);
});

document
  .querySelector(".searchbox [type='reset']")
  .addEventListener('click', function() {
    document.querySelector('.aa-input').focus();
    this.classList.add('hide');
    myAutocomplete.autocomplete.setVal('');
  });

document.querySelector('#search-input').addEventListener('keyup', function() {
  var searchbox = document.querySelector('.aa-input');
  var reset = document.querySelector(".searchbox [type='reset']");
  if (searchbox.value.length === 0) {
    reset.classList.add('hide');
  } else {
    reset.classList.remove('hide');
  }
});
