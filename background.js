// javascript page that has logistics of extensions, needed for running extensions
// adds rules and declarative content
// no rules currently

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostContains:''
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});