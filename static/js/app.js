// for tabs
function openTab(evt, tabName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();


// for redirecting community
function openSite(site) {
  if (site === 'fb') {
    window.open("https://www.facebook.com/sharer/sharer.php"
      + "?u=" + encodeURIComponent(window.location.href)
    )
  } else if (site === 'tw') {
    window.open("https://twitter.com/intent/tweet?="
      + "&url=" + encodeURIComponent(window.location.href)
    );
  }
}

// Raw tab submit

document.getElementById("submit").onclick = () => {
  document.getElementById("submit").disabled = true;

  waiting();

  const texts = document.getElementById("box_input").value.split('.').filter(text => text);
  const is_tokenized = false

  const data = {
    texts,
    id: '',
    is_tokenized
  };

  fetch(
    `https://korean-bert-as-service-gkswjdzz.endpoint.ainize.ai/encode`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(data),
    }
  )
    .then(async response => {
      if (response.status == 200) {
        return (await response.json());
      }
      else {
        throw Error(JSON.stringify(await response.json()))
      }
    })
    .then(result => {
      if (data.is_tokenized) {
        data.is_tokenized = 'True';
      } else {
        data.is_tokenized = 'False';
      }
      document.getElementById("box_output").value = JSON.stringify(result);
      document.getElementById("code_result").innerText = 
      `requests.post('https://korean-bert-as-service-gkswjdzz.endpoint.ainize.ai/encode', json=${JSON.stringify(data)})`
      Prism.highlightElement(document.getElementById("code_result"));
      
      stopWaiting();

      document.getElementById("submit").disabled = false
    })
    .catch(e => {
      document.getElementById("submit").disabled = false;
      stopWaiting();
    })
}

function waiting() {
  var spining = document.getElementById("loader");
  const submit = document.getElementById("submit_text");
  submit.style.display = 'none';
  spining.style.display = 'inline-block';
}

function stopWaiting() {
  var spining = document.getElementById("loader");
  const submit = document.getElementById("submit_text");
  submit.style.display = 'inline-block';
  spining.style.display = "none";
}