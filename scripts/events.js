
function processResult(result) {
    if (result == null || result.length == 0) {
        setContent("No articles found.", true);
    }
    else {
        setContent("", true);
        clearTable();
        if (result.error != null) {
        	setError(result.error);
        }
        else {
        	// a lookup on a specific ID will return a single article
        	if (result.article != null) {
        		setContent(result.article, true);
        		clearTable();
        	}
        	else { // otherwise we may get an array of articles - use a table
		        $.each(result, function(index, item) {
		            addTableRow(index, item.id, item.topics.join(), item.headline);
		        });
		        displayTable();
        	}
        }
    }
}

function setContentHeaders(heading, subheading, showSpinner) {
    $('#contentHeader').text(heading);
    $('#contentSubHeader').text(subheading);
    if (showSpinner) {
    	$('#spinner').show();
    }
    else {
    	$('#spinner').hide();
    }
}

function setContent(content, clearError) {
    if (clearError) {
        $('#error').text("");
        $('#error').hide();
    }
    $('#content').html(content);
}

function setError(error, clearContent) {
    if (clearContent) {
        $('#content').text("");
        $('#contentTitle').text("");
        clearTable();
    }
    $('#spinner').hide();
    $('#error').text(error);
    $('#error').show();
}

function displayTable() {
	$('#contentTable').css('display', 'table');
}

function clearTable() {
    $('#contentTable').css('display', 'none');
    $('#contentTableBody').empty();
}

function addTableRow(index, id, topics, headline) {
    var row = "<tr class=";
    if (index % 2 == 0) {
      row += "'rowEven'";
    }
    else {
      row += "'rowOdd'";
    }
    row += " id='" + id + "'><td>" 
        + id + "</td><td>" 
        + topics + "</td><td>" 
        + headline + "</td></tr>";
    $('#contentTableBody').append(row);
}

//helper
function objToString(o) {
    var s = '{\n';
    for (var p in o)
        s += '    "' + p + '": "' + o[p] + '"\n';
    return s + '}';
}

// helper
function elementToString(n, useRefs) {
    var attr = "", nest = "", a = n.attributes;
    for (var i=0; a && i < a.length; i++)
        attr += ' ' + a[i].nodeName + '="' + a[i].nodeValue + '"';

    if (n.hasChildNodes == false)
        return "<" + n.nodeName + "\/>";

    for (var i=0; i < n.childNodes.length; i++) {
        var c = n.childNodes.item(i);
        if (c.nodeType == 1)       nest += elementToString(c);
        else if (c.nodeType == 2)  attr += " " + c.nodeName + "=\"" + c.nodeValue + "\" ";
        else if (c.nodeType == 3)  nest += c.nodeValue;
    }
    var s = "<" + n.nodeName + attr + ">" + nest + "<\/" + n.nodeName + ">";
    return useRefs ? s.replace(/</g,'&lt;').replace(/>/g,'&gt;') : s;
}
