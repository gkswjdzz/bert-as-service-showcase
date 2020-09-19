// for tabs
function openTab(evt, tabName) {
  console.log(evt);
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
  console.log('click');
  if (site === 'fb') {
    window.open("https://www.facebook.com/sharer/sharer.php"
      + "?u=" + encodeURIComponent(window.location.href)
    )
  } else if (site === 'tw') {
    window.open("https://twitter.com/intent/tweet?="
      + "&url=" + encodeURIComponent(window.location.href)
    );
  } else if (site === 'ainizer') {
    // Todo
  }
}

// Raw tab submit

document.getElementById("submit").onclick = () => {
  document.getElementById("submit").disabled = true;
  // document.getElementById("errorbox").innerHTML = ""

  //  const loading = document.getElementById("statusBox");
  //loading.innerHTML = "Loading..."
  waiting();

  const texts = document.getElementById("box_input").value.split('.').filter(text => text);
  const is_tokenized = false // document.getElementById("tokenized").checked

  const data = {
    id: '',
    texts,
    is_tokenized
  };

  console.log(data.texts[0]);

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
        console.log(response.status)
        return (await response.json());
      }
      else {
        throw Error(JSON.stringify(await response.json()))
      }
    })
    .then(result => {
      document.getElementById("box_output").value = JSON.stringify(result);
      stopWaiting();

      document.getElementById("submit").disabled = false
    })
    .catch(e => {
      // document.getElementById("errorbox").innerHTML = e;
      document.getElementById("submit").disabled = false;
      stopWaiting();
    })
  console.log("out")
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