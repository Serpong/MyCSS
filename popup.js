$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

new Promise(async function(resolve, reject){
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    resolve(tabs[0].url);
	});
}).then(function(url){
	
	chrome.runtime.sendMessage({
		"type": "getData",
		"url": url,
	}, function(page_data){
		if(page_data && page_data.is_on && page_data.data.length)
		{
			$('#input_is_on').checked = page_data.data[0].is_on;
			$('#input_name').value = page_data.data[0].name;
			$('#input_css').value = page_data.data[0].css;
		}
	});
})

function upload_data(){
	new Promise(async function(resolve, reject){
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		    resolve(tabs[0].url);
		});
	}).then(function(url){

		chrome.runtime.sendMessage({
			"type":"setData",
			"is_on":$('#input_is_on').checked,
			"name":$('#input_name').value,
			"css":$('#input_css').value,
			"url":url,
		}, function(page_data){
			if(!page_data.success)
				alert('오류?');

			return true;
		});
	});
};
$("#btn_update").onclick = upload_data;