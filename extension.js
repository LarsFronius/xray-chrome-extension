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
			lastTraceURL = "https://console.aws.amazon.com/xray/home?region=us-east-1#/traces/" + traceId
			chrome.browserAction.setIcon({path: "link.png"})
			chrome.browserAction.setTitle({title: "Take me to trace " + traceId})
			console.log("Found trace" + lastTraceURL)
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
