'use strict';
function modifyDOM() {
  let officeLevels = [].slice.call(document.getElementsByClassName("_2pio"));
  for(let officeLevelIndex in officeLevels){
    if(officeLevelIndex %2 === 0) {
      var officials = officeLevels[officeLevelIndex].childNodes;
      let officeMembers = [].slice.call(officials).slice(1);
      for(let officerIndex in officeMembers){
        let officeMember = officeMembers[officerIndex].firstChild.childNodes[1].firstChild.firstChild.firstChild.innerText;
        let newsUrl = 'https://news-collector-agent.herokuapp.com/https://news.google.com/search?q=%22' +officeMember+'%22&hl=en-US&gl=US&ceid=US';
        (async () => {
          fetch(newsUrl, {
            method: 'GET',
          }).then(function (response) {
            response.text().then(function(text) {
              const parser = new DOMParser();
              let officeMemberNewsDoc = parser.parseFromString(text, "text/html");
              let officeMemberNewsDocDivs = [].slice.call(officeMemberNewsDoc.getElementsByClassName("xrnccd")).slice(0,5);
              if(officeMemberNewsDocDivs.length === 0){
                let noNewsDiv = document.createElement("div");
                noNewsDiv.className = "_2pio";
                noNewsDiv.style.textAlign = "center";
                noNewsDiv.innerText = "No News Found";
                officeMembers[officerIndex].append(noNewsDiv);
              }else {
                for (let officeMemberNewsDocDivIndex in officeMemberNewsDocDivs) {
                  let links = [].slice.call(officeMemberNewsDocDivs[officeMemberNewsDocDivIndex].getElementsByTagName("a"));
                  for (let link in links) {
                    links[link].href = links[link].href.replace("./", "https://news.google.com");
                    links[link].target = "_blank";
                  }
                  officeMemberNewsDocDivs[officeMemberNewsDocDivIndex].className = "_2pio";
                  let elements = officeMemberNewsDocDivs[officeMemberNewsDocDivIndex].getElementsByTagName('div');
                  while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
                  elements = officeMemberNewsDocDivs[officeMemberNewsDocDivIndex].getElementsByTagName('figure');
                  while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
                  officeMembers[officerIndex].append(officeMemberNewsDocDivs[officeMemberNewsDocDivIndex]);
                }
                let moreNewsDiv = document.createElement("div");
                let moreNewsButton = document.createElement("button");
                moreNewsButton.onclick = function(){window.open(newsUrl, '_blank');};
                moreNewsButton.textContent = "More News";
                moreNewsDiv.append(moreNewsButton);
                moreNewsDiv.style.textAlign = "center";
                moreNewsDiv.className = "_2pio";
                officeMembers[officerIndex].append(moreNewsDiv);
              }
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
