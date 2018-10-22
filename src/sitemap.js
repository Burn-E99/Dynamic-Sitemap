// Counter init to 0
var c = 0;
function build(_cl, _cli, _pid, _purl) {
	/* Recursive Function notes:
	 * cl = current list to build
	 * cli = current list's index
	 * pid = parent id (container for the current list)
	 * purl = parent URL ("" means start anew)
	 */
	// Increment the counter used for ID's
	c++;

	console.log(c,_cl,_cli,_pid,_purl);

	if(_cl[_cli].children.length > 0) {
		// What this is going to do:
		// Make the node for this next list and start building the next list

		// Create the elements needed
		var li = document.createElement("li");
		var cb = document.createElement("input");
		var lk = document.createElement("a");
		var lb = document.createElement("label");
		var dc = document.createTextNode(" - " + _cl[_cli].desc);
		var ul = document.createElement("ul");
		
		// Make the "checkbox"
		cb.type = "checkbox";
		cb.id = "c" + c;
		li.appendChild(cb);

		// Set up the link
		lk.href = _purl + _cl[_cli].url;
		lk.innerText = _cl[_cli].url;

		// Give the link the description by finalizing the setup of the label
		lb.classList.add("tree_label");
		lb.setAttribute("for", "c" + c);
		lb.appendChild(lk);
		lb.appendChild(dc);
		li.appendChild(lb);

		// Make the ul to hold this node's children
		ul.id = "p" + c;
		li.appendChild(ul);

		// Put it to the page
		var pt = document.getElementById(_pid);
		pt.appendChild(li);

		// Build this node's children
		build(_cl[_cli].children, 0, "p" + c, _purl + _cl[_cli].url);
	} else {
		// What this is going to do:
		// Make the node

		// Create the elements needed
		var li = document.createElement("li");
		var lk = document.createElement("a");
		var lb = document.createElement("span");
		var dc = document.createTextNode(" - " + _cl[_cli].desc);

		// Set up the link
		lk.href = _purl + _cl[_cli].url;
		lk.innerText = _cl[_cli].url;

		// Give the link the description by finalizing the setup of the label
		lb.classList.add("tree_label");
		lb.setAttribute("for", "c" + c);
		lb.appendChild(lk);
		lb.appendChild(dc);
		li.appendChild(lb);

		// Put it to the page
		var pt = document.getElementById(_pid);
		pt.appendChild(li);
	}

	// This node (and its' children, if any) have been built, step to the next node in the current list
	if(_cli == 0) {
		// Make sure we actually have more items to loop through
		if(_cl.length > 1) {
			// Force the first step
			_cli++;

			// Loop through and build the rest of the nodes in the current list
			for(var i = _cli; i < _cl.length; i++) {
				// Step to the next item in the list
				build(_cl, i, _pid, _purl);
			}
		}
	}
}

// Get the sitemap
var b = new XMLHttpRequest();
b.open('GET', "sitemap.json");
b.setRequestHeader("Cache-Control", "max-age=0");
b.onreadystatechange = function() {
	if(b.readyState === XMLHttpRequest.DONE && b.status === 200) {
		// build the tree
		var sm = JSON.parse(b.responseText);
		build(sm, 0, "tree-container", "");
	} else if(b.status === 404) {
		alert("Sitemap missing. :/");
	}
}
b.send();
