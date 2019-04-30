// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
function modifyDOM() {
  //You can play with your DOM here or check URL against your regex
  let officeLevels = [].slice.call(document.getElementsByClassName("_2pio"));
  console.log(officeLevels);
  for(let officeLevel in officeLevels){
    if(officeLevel %2 === 0) {
      var officials = officeLevels[officeLevel].childNodes;
      let officeLevelTitle = officials[0].childNodes[0].firstChild;
      console.log(officeLevelTitle);
      let officeMembers = [].slice.call(officials).slice(1);
      for(let officer in officeMembers){
        let officeMemember = officeMembers[officer].firstChild.childNodes[1].firstChild.firstChild.firstChild.innerText;
        console.log(officeMemember);
        (async () => {
          fetch('https://news-collector-agent.herokuapp.com/https://news.google.com/search?q=%22' +officeMemember+'%22&hl=en-US&gl=US&ceid=US', {
            method: 'GET',
          }).then(function (response) {
            response.text().then(function(text) {
              parser = new DOMParser();
              let officeMemberNewsDoc = parser.parseFromString(text, "text/html");
              console.log(officeMemberNewsDoc);
              let officeMemberNewsDocDivs = [].slice.call(officeMemberNewsDoc.getElementsByClassName("xrnccd")).slice(0,5);
              for(let officeMemberNewsDocDiv in officeMemberNewsDocDivs){
                console.log(officeMemberNewsDocDivs[officeMemberNewsDocDiv].getElementsByTagName("a"));
                let links = [].slice.call(officeMemberNewsDocDivs[officeMemberNewsDocDiv].getElementsByTagName("a"));
                for(let link in links){
                  links[link].href = links[link].href.replace("./","https://news.google.com");
                }
                officeMemberNewsDocDivs[officeMemberNewsDocDiv].className = "_2pio";
                let elements = officeMemberNewsDocDivs[officeMemberNewsDocDiv].getElementsByTagName('div');
                while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
                elements = officeMemberNewsDocDivs[officeMemberNewsDocDiv].getElementsByTagName('figure');
                while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
                officeMembers[officer].append(officeMemberNewsDocDivs[officeMemberNewsDocDiv]);
              }
              console.log(officeMemberNewsDocDivs);
            });
          });
        })();
      }
    }
  }
}

chrome.webNavigation.onCompleted.addListener(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: '(' + modifyDOM + ')();'});
  });
}, {url: [{urlEquals : 'https://www.facebook.com/townhall/?tab=directory'}]});
