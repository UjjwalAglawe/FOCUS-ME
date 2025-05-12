// const blockList = ["facebook.com", "instagram.com"];

// chrome.webNavigation.onBeforeNavigate.addListener((details) => {
//   const url = new URL(details.url);
//   const isBlocked = blockList.some(domain => url.hostname.includes(domain));

//   if (!isBlocked) return;

//   chrome.storage.local.get(["focusEndTime"], (data) => {
//     const now = Date.now();
//     const endTime = data.focusEndTime;

//     if (endTime && now < endTime) {
//       chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("focus.html") });
//     }
//   });
// }, { url: [{ schemes: [".*"] }] });

const blockList = ["facebook.com", "instagram.com","youtube.com"];

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);
  const isBlocked = blockList.some(domain => url.hostname.includes(domain));

  chrome.storage.local.get(["focusEndTime"], (data) => {
    const now = Date.now();
    console.log("Focus End Time:", data.focusEndTime);
    console.log("Current Time:", now);

    if (isBlocked && data.focusEndTime && now < data.focusEndTime) {
      console.log("Blocking access to:", url.hostname);
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("focus.html") });
    } else {
      console.log("Not blocking:", url.hostname);
    }
  });

}, { url: [{ urlMatches: ".*" }] });

