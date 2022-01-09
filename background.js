chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	const url = sender.tab ? sender.tab.url : request.url;
	const domain = url.replace(/^\w+:\/\/(www\.)?/, '').replace(/\/.*$/, '');
	const url_key = 'page@'+domain.replace(/[^\w]/ig,'');


	if (request.type == "getData")
	{
		new Promise(async function(resolve, reject){
			chrome.storage.sync.get(url_key, function(page_data) {
				resolve(page_data[url_key]);
			});
		}).then(function(resolved_data){
			if(sender.tab)
			{
				if(resolved_data && resolved_data.is_on && resolved_data.data.length && resolved_data.data[0].is_on)
				{
					chrome.action.setBadgeText({tabId:sender.tab.id, text:'ON'});
					chrome.action.setBadgeBackgroundColor({tabId:sender.tab.id, color: '#1bb13b'});
				}
				else
				{
					chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
						if(tabs.length){
							chrome.action.setBadgeText({tabId:tabs[0].id, text:'OFF'});
							chrome.action.setBadgeBackgroundColor({tabId:tabs[0].id, color: '#959595'});
						}
					});
				}
			}
			sendResponse(resolved_data);
		});
		
		return true;
	}
	else if (request.type == "setData")
	{
		new Promise(async function(resolve, reject){
			chrome.storage.sync.set({
				[url_key]:{
					is_on: true,
					data:[
						{
							"is_on":request.is_on,
							"name":request.name,
							"css":request.css,
						},
					]
				}
			});
			resolve(true);
		}).then(function(resolved_data){
			chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {type: "reload_css"}, function(response){
					console.log('called reload');
				});
			});
			sendResponse({success:resolved_data && 1});

		});
		
		return true;
	}
	else
		console.log("error");
});