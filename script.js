let item_code = "";
let bipped;
document.querySelector("#scan_button").addEventListener("click", function () {
  let selectedDeviceId;
  // document.querySelector("#video_container").classList.remove('visually-hidden')
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById("sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;
      if (videoInputDevices.length >= 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement("option");
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });
        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };
        const close_button = document.getElementById("close_button");
        close_button.style.display = "block";
        const sourceSelectPanel = document.getElementById("sourceSelectPanel");
        sourceSelectPanel.style.display = "block";
        const video_container = document.querySelector("#video_container");
        video_container.style.display = "block";
        document.querySelector("#button_container").style.display = "block";
      }
      document.getElementById("startButton").addEventListener("click", () => {
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          (result, err) => {
            if (result) {
              console.log(result);
              document.getElementById("result").textContent = result.text;
              document.querySelector("#search_content").value = result.text;
              const son = new Audio();
              son.src = "./bip_sound.mp3";
            
              son.play().then(() => {
                setTimeout(() => {
                  document.getElementById("search_button").click();
                }, "800");
              });
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
              console.error(err);
              document.getElementById("result").textContent = err;
            }
          }
        );

        console.log(
          `Started continous decode from camera with id ${selectedDeviceId}`
        );
      });
      document.getElementById("resetButton").addEventListener("click", () => {
        codeReader.reset();
        document.getElementById("result").textContent = "";
        console.log("Reset.");
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

document.getElementById('close_button').addEventListener('click', function(){
  const close_button = document.getElementById("close_button");
  close_button.style.display = "none";
  const sourceSelectPanel = document.getElementById("sourceSelectPanel");
  sourceSelectPanel.style.display = "none";
  const video_container = document.querySelector("#video_container");
  video_container.style.display = "none";
  document.querySelector("#button_container").style.display = "none";


})

let urlParams = new URLSearchParams(window.location.search);
item_code = urlParams.get("codabar");
console.log(item_code);

if (item_code == null || item_code == "") {
  item_code = `5997523313111`;
}

fetch(`https://world.openfoodfacts.org/api/v3/product/${item_code}`)
  .then((response) => response.json())
  .then((data) => {
        
    if (data.status == 'failure') {
      document.querySelector("#content").innerHTML = `<p class="text-center">produit  ${item_code} non trouvé </p>`;
    }else{

      let nutri_image =""
      let nutri_text_color =""

      switch (data.product.nutriscore_grade) {
        case "a":
            nutri_image = "./assets/img/A.svg"
            nutri_text_color = "text-success"
            break;
        case "b":
            nutri_image = "./assets/img/B.svg"
            nutri_text_color = "text-success"
            break;
        case "c":
            nutri_image = "./assets/img/C.svg"
            nutri_text_color = "text-warning"
            break;
        case "d":
            nutri_image = "./assets/img/D.svg"
            nutri_text_color = "text-warning"
            break;

        case "e":
            nutri_image = "./assets/img/E.svg"
            nutri_text_color = "text-danger"
            break;
        default:
            nutri_image = "./assets/img/IDK.svg"
            nutri_text_color = "text-secondary"
            break;
    }

    let green_score_image = ""
    let green_score_info = ""
    let green_score_color = ""

    switch (data.product.ecoscore_grade) {
        case "a":
            green_score_image = "assets/img/green-score-a.svg"
            green_score_info = "Très faible impact environnemental"
            green_score_color = "text-success"
            break;

        case "b":
            green_score_image = "assets/img/green-score-b.svg"
            green_score_info = "Faible impact environnemental"
            green_score_color = "text-success"
            break;
        case "c":
            green_score_image = "assets/img/green-score-c.svg"
            green_score_info = "Impact modéré sur l'environnement"
            green_score_color = "text-warning"
            break;
        case "d":
            green_score_image = "assets/img/green-score-d.svg"
            green_score_info = "Impact environnemental élevé"
            green_score_color = "text-warning"
            break;
        case "e":
            green_score_image = "assets/img/green-score-e.svg"
            green_score_info = "Impact environnemental très élevé"
            green_score_color = "text-danger"
            break;

        case "f":
            green_score_image = "assets/img/green-score-f.svg"
            green_score_info = "Impact environnemental très élevé"
            green_score_color = "text-danger"
            break;

        default:
            green_score_image = "assets/img/green-score-not-applicable.svg"
            green_score_info = "Non applicable pour la catégorie : Eaux"
            green_score_color = "text-secondary"
            break;
    }




      document.querySelector("#content").innerHTML += `
    <img class="col-sm-3 mb-5" src="${data.product.selected_images.front.display.fr}">
    <div class="col-sm-6" >
         <div>
         <h1><b>${data.product.product_name}</b></h1>
         <p><b>Code à Bar : </b> ${data.code}.</p>
         <p><b>Ingrédients : </b> ${data.product.ingredients_text_fr}</p>
         <p><b>Marque(s) : </b> ${data.product.brands}</p>
         </div>   
    </div>
    
    <div class="d-flex gap-2 align-items-center col-sm-5 m-2 border bg-secondary-subtle rounded-4">
    <img class="img-fluid" src="${nutri_image}" alt="Nutri-Score ${data.product.nutriscore_grade}">
    <p class="fs-2 ${nutri_text_color}"><b>Nutri-Score : ${data.product.nutriscore_grade.toUpperCase()}</b></p>
    </div>
    <div class="d-flex gap-2 align-items-center col-sm-5 m-2 border bg-secondary-subtle rounded-4">
    <img class="img-fluid" src="${green_score_image}" alt="">
    <p class="fs-2 ${nutri_text_color}"><b>${green_score_info}</b></p>
    </div>
    `;
    }

    
  });
