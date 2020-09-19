const fb = document.getElementsByClassName('to_facebook');
const tw = document.getElementsByClassName('to_twitter');
const cp = document.getElementsByClassName('copy_link');
const source = document.getElementById('source');
const download = document.getElementById('download');
const img = document.getElementById('result_image');

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

if (fb) {
  Array.from(fb).forEach(
    fb => fb.addEventListener("click", () => {
      window.open("https://www.facebook.com/sharer/sharer.php"
        + "?u=" + encodeURIComponent(window.location.href)
      );
    })
  )
}

if (tw) {
  Array.from(tw).forEach(
    tw => tw.addEventListener("click", () => {
      window.open("https://twitter.com/intent/tweet?="
        + "&url=" + encodeURIComponent(window.location.href)
      );
    })
  )
}

if (cp) {
  Array.from(cp).forEach(
    cp => cp.addEventListener("click", copyToClipboard)
  )
}

if (source) {
  source.addEventListener('change', changeInputImage)
}

if (download) {
  download.addEventListener('click', downloadImage);
}

if (img) {
  img.addEventListener('change', function (event) {
    download.removeAttribute('disabled');
  })
}
function downloadImage() {
  const a = document.createElement('a');
  a.style.cssText = "display: none;";
  a.href = img.src;
  a.download = 'result.png';
  document.body.appendChild(a);
  a.click();
}

function changeInputImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  document.getElementById('filename').innerText = file.name;
  document.getElementById('submit').removeAttribute('disabled');
  reader.onload = (progressEvent) => {
    document.getElementById('your_image').src = progressEvent.target.result;
  };

  reader.readAsDataURL(file);
}

function copyToClipboard() {
  var t = document.createElement("textarea");
  document.body.appendChild(t);
  t.value = document.location.href;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
}

function uploadFile() {
  const input = document.getElementById('source');
  input.click();
}

document.getElementById("submit").onclick = () => {
  document.getElementById("submit").setAttribute('disabled', '');
  // document.getElementById("errorbox").innerHTML = "";
  const formData = new FormData();
  try {
    if (document.querySelector('input[name=face]:checked') == null) {
      throw Error("Please Choose face type");
    }
    else if (document.getElementById('source').files[0] === undefined) {
      throw Error("Please upload image file");
    }
  } catch (e) {
    // document.getElementById("errorbox").innerHTML = e;
    document.getElementById("submit").removeAttribute('disabled');
    alert(e);
    return;
  }

  const check_model = document.querySelector('input[name=face]:checked').value
  const source = document.getElementById('source').files[0]

  formData.append('source', source)
  formData.append('check_model', check_model)

  fetch(
    'https://master-stargan-v2-psi1104.endpoint.ainize.ai//predict',
    {
      method: 'POST',
      body: formData,
    }
  )
    .then(async response => {
      if (response.status == 200) {
        return response
      }
      else if (response.status == 413) {
        throw Error("This image file is larger than 1MB.")
      }
      else {
        throw Error((await response.clone().json()).message)
      }
    })
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
    .then(imageURL => {
      document.getElementById("result_image").src = imageURL;
      document.getElementById("download").removeAttribute('disabled');
    })
    .catch(e => {
      document.getElementById("download").removeAttribute('disabled');
      alert(e)
    })
}