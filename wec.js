'use strict';

(function () {
  var apiResponse = document.getElementById('feedback');
  var scanButton = document.getElementById('start-check');
  var userInput = document.getElementById('to-check');

  function toggleSpinner(state) {
    if (state) {
      console.log('spinning');
    } else {
      console.log('done spinning');
    }
  }

  function updateUi(message) {
    apiResponse.innerHTML = message;
  }

  function checkUrl(url, endpoint) {
    fetch(url + endpoint, {
      method: 'get',
      mode: 'cors'

    }).then(function(response) {
      toggleSpinner(true);
      return response.json();

    }).then(function(r) {
      toggleSpinner(false);
      updateUi(r.length + ' user name(s) have been found, consider installing https://wordpress.org/plugins/stop-user-enumeration/');

    }).catch(function(err) {
      if(endpoint === '/wp-json/wp/v2/users') {
        checkUrl(url, '?author=1')
      } else {
        toggleSpinner(false);
        updateUi('This website seems to be safe, congrats. You can perform advanced scan with https://wpscan.org/');
      }
    });
  }

  function cleanInput(input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;');
  }

  function handleUserInput() {
    if (userInput.value) {
      checkUrl(cleanInput(userInput.value), '/wp-json/wp/v2/users');
    } else {
      updateUi('Please enter a valid URL');
    }
  }

  scanButton.onclick = handleUserInput;
})();
