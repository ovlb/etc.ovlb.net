 /**
  * Make an AJAX request
  *
  * @param {String} fMethod GET or POST
  * @param {String} fUrl The URL that will be targeted
  * @param {Array} fData Data to be sent/requested, in JS. Will be
  * stringified in the function.
  * @param {String} fDataType What kind of data we want to be parsed
  */
var xmlRequest = function xmlRequest (fMethod, fUrl, fData, fDataType) {
  var request = new XMLHttpRequest();
  var method = fMethod || 'GET';
  var data = JSON.stringify.fData;
  var dataType = fDataType || 'text/plain';
  var bustCache = '?' + new Date().getTime();
  var url = fUrl + bustCache;

  request.open(method, url, true);
  request.setRequestHeader('Content-Type', dataType);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var response = JSON.parse(request.responseText);
    } else {
      var response = "Es gab einen Fehler."
    };
    console.log(response);
  };
  request.send(fData);

  return response;
};
