'use strict';

(function () {
  var defaultform = document.getElementById('form-check');
  var scanButton = document.getElementById('start-check');
  var Resulttext = document.getElementById('feedback');
  var checkAgain = document.getElementById('new-check');
  var fomResult = document.getElementById('form-result');
  var userInput = document.getElementById('to-check');

  function toggleSpinner(state) {
    if (state) {
      console.log('spinning');
    } else {
      console.log('done spinning');
    }
  }

  function showResultBanner() {
    defaultform.classList.add('go');
    fomResult.classList.add('come');
  }

  function showFormBanner() {
    defaultform.classList.remove('go');
    fomResult.classList.remove('come');
  }

  function updateUi(message) {
    Resulttext.innerHTML = message;
    showResultBanner();
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
      updateUi(r.length + ' username(s) are accessible to public 😷');

    }).catch(function(err) {
      if(endpoint === '/wp-json/wp/v2/users') {
        checkUrl(url, '?author=1')
      } else {
        toggleSpinner(false);
        updateUi('Your website seems to be safe, congrats 😌');
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
  checkAgain.onclick = showFormBanner;
})();
