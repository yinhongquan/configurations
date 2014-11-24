var sessions = {},
    Frames = {},
    ActiveTabs = {},
    TabHistory = {},
    LastUsedTabs = [];

var httpRequest = function(request) {
  return new Promise(function(acc, rej) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request.url);
    xhr.addEventListener('load', function() {
      acc(request.json ? JSON.parse(xhr.responseText) : xhr.responseText);
    });
    xhr.addEventListener('error', function() {
      rej(Error('cVim Error: Unable to resolve ' + request.url));
    });
    xhr.send();
  });
};

chrome.storage.local.get('sessions', function(e) {
  if (e.sessions === void 0) {
    chrome.storage.local.set({ sessions: {} });
  } else {
    sessions = e.sessions;
  }
});

function getTab(sender, reverse, count, first, last) {
  chrome.tabs.query({windowId: sender.tab.windowId}, function(tabs) {
    if (first) {
      return chrome.tabs.update(tabs[0].id, {active: true});
    } else if (last) {
      return chrome.tabs.update(tabs[tabs.length - 1].id, {active: true});
    } else {
      return chrome.tabs.update(tabs[((((reverse ? -count : count) + sender.tab.index) % tabs.length) + tabs.length) % tabs.length].id, {active: true});
    }
  });
}

var Listeners = {

  tabs: {
    onUpdated: function(id, changeInfo) {
      if (changeInfo.hasOwnProperty('url')) {
        History.shouldRefresh = true;
        if (TabHistory.hasOwnProperty(id)) {
          if (TabHistory[id].links.indexOf(changeInfo.url) === -1) {
            if (TabHistory.state !== void 0 && TabHistory[id].state + 1 !== TabHistory[id].length) {
              TabHistory[id].links.splice(TabHistory[id].state);
            }
            TabHistory[id].links.push(changeInfo.url);
            TabHistory[id].state = TabHistory[id].state + 1;
          } else {
            TabHistory[id].state = TabHistory[id].links.indexOf(changeInfo.url);
          }
        } else {
          TabHistory[id] = {};
          TabHistory[id].links = [changeInfo.url];
          TabHistory[id].state = 0;
        }
      }
    },
    onActivated: function(tab) {
      LastUsedTabs.push(tab.tabId);
      if (LastUsedTabs.length > 2) {
        LastUsedTabs.shift();
      }
      if (ActiveTabs[tab.windowId] === void 0) {
        ActiveTabs[tab.windowId] = [];
      }
      ActiveTabs[tab.windowId].push(tab.tabId);
      if (ActiveTabs[tab.windowId].length > 2) {
        ActiveTabs[tab.windowId].shift();
      }
    },
    onRemoved: function(id, removeInfo) {
      if (ActiveTabs[removeInfo.windowId] !== void 0) {
        ActiveTabs[removeInfo.windowId] = ActiveTabs[removeInfo.windowId].filter(function(e) {
          return e !== id;
        });
      }
      if (TabHistory[id] !== void 0) {
        delete TabHistory[id];
      }
      delete Frames[id];
    }
  },

  windows: {
    onRemoved: function(windowId) { delete ActiveTabs[windowId]; }
  },

  extension: {
    onConnect: function(port) {
      port.postMessage({type: 'hello'});
      port.onMessage.addListener(function(request) {
        Actions(request, null, port.postMessage.bind(port));
      });
    }
  },

  runtime: { onMessage: Actions },
  
  commands: {
    onCommand: function(command) {
      switch (command) {
        case 'togglecVim':
          Popup.toggleEnabled({});
          break;
        case 'nextTab':
        case 'previousTab':
          chrome.tabs.query({active: true, currentWindow: true}, function(e) {
            return getTab({tab: e[0]}, false, (command === 'nextTab' ? 1 : -1), false, false);
          });
          break;
        case 'nextCompletionResult':
          chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {action: 'nextCompletionResult'}, function() {
              chrome.windows.create({url: 'chrome://newtab'});
            });
          });
          break;
        case 'deleteBackWord':
          chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {action: 'deleteBackWord'});
          });
          break;
        case 'closeTab':
          chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
            chrome.tabs.remove(tab[0].id);
          });
          break;
        case 'reloadTab':
          chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
            chrome.tabs.reload(tab[0].id);
          });
          break;
        case 'newTab':
          chrome.tabs.create({url: chrome.runtime.getURL('pages/blank.html')});
          break;
        default:
          break;
      }
    }
  }

};

(function() {
  for (var api in Listeners) {
    for (var method in Listeners[api]) {
      chrome[api][method].addListener(Listeners[api][method]);
    }
  }
})();
