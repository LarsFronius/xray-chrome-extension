var lastTraceURL = "";

chrome.webRequest.onHeadersReceived.addListener(
	function(details) {
		var found = details.responseHeaders.find(function(element) {
			return element.name.toLowerCase() == "x-amzn-trace-id";
		});
		if (found != null) {
			var traceSections = found.value.split(";")
			var rootSection = traceSections.find(function(section) {
				return section.startsWith("Root=")
			})
			var traceId = rootSection.replace("Root=","")
			chrome.browserAction.setIcon({path: "link.png"})
			lastTraceURL = "https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/" + traceId
			console.log(lastTraceURL)
		}
	},
	{
		urls: ["<all_urls>"]
	},["responseHeaders"]
);

chrome.browserAction.onClicked.addListener(
	function(tab) {
		chrome.tabs.create( { url: lastTraceURL } );
	}
)
