function get_new_el(id, tag){
	if(document.querySelector("#"+id))
	{
		el = document.querySelector("#"+id);
		el.innerHTML = "";
	}
	else
	{
		el = document.createElement(tag);
		el.id = ""+id;
		
		// document.head.appendChild(el);
		document.documentElement.appendChild(el);
	}
	return el;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type == "reload_css"){
		load_css();
		sendResponse({status: true});
		return true;
	}
	else if (request.type == "??"){

	}

});

function load_css(){
	chrome.runtime.sendMessage({
		"type":"getData",
	}, function(page_data){
		if(page_data && page_data.is_on)
		{
			var style = get_new_el('exex_style', "style");

			for (var i = 0; i < page_data.data.length; i++)
			{
				if(page_data.data[i].is_on)
					style.innerHTML += page_data.data[i].css;
			}
		}
	});
}
load_css();