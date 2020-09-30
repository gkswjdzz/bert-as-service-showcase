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
const raw = document.getElementById("raw");
raw.getElementsByClassName("submit")[0].onclick = () => {
  raw.getElementsByClassName("submit")[0].disabled = true;

  waiting(raw);

  const texts = raw.getElementsByClassName("box_input")[0].value.split('.').filter(text => text);
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
      raw.getElementsByClassName("box_output")[0].value = JSON.stringify(result);
      raw.getElementsByClassName("code_result")[0].innerText = 
      `requests.post('https://korean-bert-as-service-gkswjdzz.endpoint.ainize.ai/encode', json=${JSON.stringify(data)})`
      Prism.highlightElement(raw.getElementsByClassName("code_result")[0]);
      
      stopWaiting(raw);

      raw.getElementsByClassName("submit")[0].disabled = false
    })
    .catch(e => {
      raw.getElementsByClassName("submit")[0].disabled = false;
      stopWaiting(raw);
    })
}

function waiting(tab) {
  const spining = tab.getElementsByClassName("loader")[0];
  const submit = tab.getElementsByClassName("submit_text")[0];
  submit.style.display = 'none';
  spining.style.display = 'inline-block';
}

function stopWaiting(tab) {
  const spining = tab.getElementsByClassName("loader")[0];
  const submit = tab.getElementsByClassName("submit_text")[0];
  submit.style.display = 'inline-block';
  spining.style.display = "none";
}