var storageMethod = 'local',
    Settings = {},
    Options = {};

var defaultSettings = {
  searchlimit: 25,
  scrollstep: 70,
  fullpagescrollpercent: 0,
  typelinkhintsdelay: 300,
  qmarks: {},
  sites: {},
  searchengines: {},
  searchaliases: {},
  hud: true,
  regexp: true,
  linkanimations: false,
  ignorecase: true,
  numerichints: false,
  cncpcompletion: false,
  smartcase: true,
  incsearch: true,
  autohidecursor: false,
  typelinkhints: false,
  autofocus: true,
  insertmappings: true,
  defaultnewtabpage: false,
  dimhintcharacters: true,
  smoothscroll: true,
  autoupdategist: false,
  scrollduration: 500,
  zoomfactor: 0.10,
  locale: '',
  mapleader: '\\',
  timeoutlen: 1000,
  defaultengine: 'google',
  hintcharacters: 'asdfgqwertzxcvb',
  homedirectory: '',
  activehighlight: '#ff9632',
  highlight: '#ffff00',
  completionengines: [],
  nextmatchpattern: '((?!first)(next|older|more|>|›|»|forward| )+)',
  previousmatchpattern: '((?!last)(prev(ious)?|newer|back|«|less|<|‹| )+)',
  barposition: 'top',
  blacklists: [],
  MAPPINGS: '',
  GISTURL: '',
  COMMANDBARCSS: '#cVim-link-container, .cVim-link-hint, #cVim-command-bar, #cVim-command-bar-mode, #cVim-command-bar-input, #cVim-command-bar-search-results, .cVim-completion-item, .cVim-completion-item .cVim-full, .cVim-completion-item .cVim-left, .cVim-completion-item .cVim-right, #cVim-hud, #cVim-status-bar {\n  font-family: Helvetica, Helvetica Neue, Neue, sans-serif, monospace, Arial;\n  font-size: 10pt !important;\n  -webkit-font-smoothing: antialiased !important;\n}\n\n#cVim-link-container {\n  position: absolute;\n  pointer-events: none;\n  width: 100%; left: 0;\n  height: 100%; top: 0;\n  z-index: 2147483647;\n}\n\n.cVim-link-hint {\n  border-radius: 2px;\n  color: #ddd;\n  padding: 2px !important;\n  font-size: 11pt !important;\n  font-weight: bold !important;\n  display: inline-block !important;\n  border: 1px solid #ccc;\n  vertical-align: middle !important;\n  text-align: center !important;\n  box-shadow: 2px 2px 1px rgba(0,0,0,0.25) !important;\n  position: absolute !important;\n  background: linear-gradient(to bottom, #636363 0%,#3f3f3f 39%,#3f3f3f 39%,#000000 100%);\n}\n\n.cVim-link-hint_match {\n  color: #888;\n}\n\n#cVim-command-bar {\n  position: fixed !important;\n  z-index: 2147483646 !important;\n  background-color: #1b1d1e !important;\n  color: #bbb !important;\n  display: none;\n  box-sizing: content-box !important;\n  box-shadow: 0 3px 3px rgba(0,0,0,0.4);\n  left: 0 !important;\n  width: 100% !important;\n  height: 20px !important;\n}\n\n#cVim-command-bar-mode {\n  display: inline-block;\n  vertical-align: middle;\n  box-sizing: border-box !important;\n  padding-left: 2px !important;\n  height: 100% !important;\n  width: 10px !important;\n  padding-top: 2px !important;\n  color: #888 !important;\n}\n\n#cVim-command-bar-input {\n  background-color: #1b1d1e !important;\n  color: #bbb !important;\n  height: 100% !important;\n  right: 0 !important;\n  top: 0 !important;\n  width: calc(100% - 10px) !important;\n  position: absolute !important;\n}\n\n#cVim-command-bar-search-results {\n  position: fixed;\n  width: 100% !important;\n  overflow: hidden;\n  z-index: 2147483647 !important;\n  left: 0;\n  box-shadow: 0 3px 3px rgba(0,0,0,0.4);\n  background-color: rgba(44, 44, 44, 1);\n}\n\n.cVim-completion-item, .cVim-completion-item .cVim-full, .cVim-completion-item .cVim-left, .cVim-completion-item .cVim-right {\n  text-overflow: ellipsis;\n  padding: 1px;\n  display: inline-block;\n  box-sizing: border-box;\n  vertical-align: middle;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n.cVim-completion-item:nth-child(even) {\n  background-color: #282828;\n}\n\n.cVim-completion-item {\n  width: 100%; left: 0;\n  color: #fff;\n}\n\n.cVim-completion-item .cVim-left {\n  color: #fff;\n  width: 37%;\n}\n\n.cVim-completion-item .cVim-right {\n  font-style: italic;\n  color: #888;\n  width: 57%;\n}\n\n#cVim-hud {\n  background-color: rgba(28,28,28,0.9);\n  position: fixed !important;\n  transition: right 0.2s ease-out;\n  z-index: 24724289;\n}\n\n#cVim-hud span {\n  padding: 2px;\n  padding-left: 4px;\n  padding-right: 4px;\n  color: #8f8f8f;\n  font-size: 10pt;\n}\n\n#cVim-frames-outline {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  right: 0;\n  z-index: 9999999999;\n  box-sizing: border-box;\n  border: 3px solid yellow;\n}\n'
};

chrome.storage.onChanged.addListener(function(changes) {
  if (!changes.hasOwnProperty('sessions')) {
    Settings = changes.settings ? changes.settings.newValue : defaultSettings;
  }
});

Options.refreshSettings = function(callback) {
  for (var key in defaultSettings) {
    if (Settings[key] === void 0) {
      Settings[key] = defaultSettings[key];
    }
  }
  if (callback) {
    callback();
  }
};

Options.saveSettings = function(request) {
  Settings = request.settings;
  for (var key in Settings.qmarks) {
    Quickmarks[key] = Settings.qmarks[key];
  }
  this.refreshSettings(function() {
    chrome.storage[storageMethod].set({settings: Settings});
    if (request.sendSettings) {
      Options.sendSettings();
    }
  });
};

Options.sendSettings = function() {
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0; i < tabs.length; ++i) {
      if (tabs[i]) {
        chrome.tabs.sendMessage(tabs[i].id, {
          action: 'sendSettings',
          settings: Settings
        });
      }
    }
  });
};

Options.getSettings = function(request, sender) {
  this.refreshSettings(function() {
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'sendSettings',
      settings: request.reset ? defaultSettings : Settings
    });
  });
};

Options.setDefaults = function() {
  Settings = defaultSettings;
  this.saveSettings(Settings);
};

Options.getDefaults = function(request, sender) {
  chrome.tabs.sendMessage(sender.tab.id, {
    action: 'sendDefaultSettings',
    settings: defaultSettings
  });
};

Options.updateBlacklistsMappings = function() {
  var mappings = Settings.MAPPINGS.split(/\n+/).compress(),
      i, index, line;
  if (Settings.BLACKLISTS) {
    Settings.blacklists = Settings.BLACKLISTS.split(/\n+/);
    delete Settings.BLACKLISTS;
  }
  for (i = 0; i < mappings.length; ++i) {
    if (/ *let *blacklists *= */.test(mappings[i])) {
      mappings.splice(i, 1);
      index = i;
    }
  }
  Settings.blacklists = Settings.blacklists.unique();
  if (Settings.blacklists.length) {
    line = 'let blacklists = ' + JSON.stringify(Settings.blacklists);
    if (index) {
      mappings = mappings.slice(0, index).concat(line).concat(mappings.slice(index));
    } else {
      mappings.push(line);
    }
  }
  Settings.MAPPINGS = mappings.join('\n');
  Options.saveSettings({settings: Settings});
};

Options.fetchGist = function() {
  httpRequest({
    url: Settings.GISTURL + (Settings.GISTURL.indexOf('raw') === -1 &&
             Settings.GISTURL.indexOf('github') !== -1 ? '/raw' : '')
  }).then(function(res) {
    var updated = RCParser.parse(res);
    updated.GISTURL = Settings.GISTURL;
    updated.COMMANDBARCSS = Settings.COMMANDBARCSS;
    Options.saveSettings({
      settings: updated,
      sendSettings: true
    });
    if (updated.autoupdategist) {
      window.setTimeout(Options.fetchGist, 1000 * 60 * 60);
    }
  });
};

chrome.storage[storageMethod].get('settings', function(data) {
  if (data.settings) {
    Settings = data.settings;
    Quickmarks = Settings.qmarks;
  }
  this.refreshSettings();
  this.updateBlacklistsMappings();
  if (Settings.autoupdategist && Settings.GISTURL) {
    this.fetchGist();
  }
}.bind(Options));

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (Options.hasOwnProperty(request.action)) {
    Options[request.action](request, sender);
  }
});
