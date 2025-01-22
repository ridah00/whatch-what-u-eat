let item_code = "";



document.querySelector('#scan_button').addEventListener('click', function () {
  let selectedDeviceId;
  // document.querySelector("#video_container").classList.remove('visually-hidden')
  const codeReader = new ZXing.BrowserMultiFormatReader()
  console.log('ZXing code reader initialized')
  codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
          const sourceSelect = document.getElementById('sourceSelect')
          selectedDeviceId = videoInputDevices[0].deviceId
          if (videoInputDevices.length >= 1) {
              videoInputDevices.forEach((element) => {
                  const sourceOption = document.createElement('option')
                  sourceOption.text = element.label
                  sourceOption.value = element.deviceId
                  sourceSelect.appendChild(sourceOption)
              })
              sourceSelect.onchange = () => {
                  selectedDeviceId = sourceSelect.value;
              };
              const sourceSelectPanel = document.getElementById('sourceSelectPanel')
              sourceSelectPanel.style.display = 'block'
              const video_container = document.querySelector('#video_container')
              video_container.style.display = 'block'
              document.querySelector('#button_container').style.display='block'
          }
          document.getElementById('startButton').addEventListener('click', () => {
              codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                  if (result) {
                      console.log(result)
                      document.getElementById('result').textContent = result.text
                      document.querySelector("#search_content").value = result.text
                      document.getElementById('search_button').click()

                  }
                  if (err && !(err instanceof ZXing.NotFoundException)) {
                      console.error(err)
                      document.getElementById('result').textContent = err
                  }
              })
              console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
          })
          document.getElementById('resetButton').addEventListener('click', () => {
              codeReader.reset()
              document.getElementById('result').textContent = '';
              console.log('Reset.')
          })
      })
      .catch((err) => {

          console.error(err)
      })
})




































console.log(result.text);



let urlParams = new URLSearchParams(window.location.search);
item_code = urlParams.get("codabar")
console.log(item_code);

if (item_code == null || item_code == "") {
  item_code = `5997523313111`
}



fetch(`https://world.openfoodfacts.org/api/v3/product/${item_code}`)
.then(response => response.json())
.then(data=> {
    console.log(data);
    console.log(data.code);
    console.log(data.product.product_name);
    console.log(data.product.quantity);
    
    if (data.result.id == "product_not_found") {
        document.querySelector("#content").innerHTML =`product " item_code " not found`
    }

    document.querySelector("#content").innerHTML += `
    <img class="col-sm-2 px-5" src="${data.product.selected_images.front.display.fr}">
    <div class="col-sm-6 px-5" >
         <div>
         <h1>${data.product.product_name}</h1>
         <p>Code à Bar : ${data.code}.</p>
         <p>Quantité : ${data.product.quantity}. </p>
         <p>ingrédients :</p>
         <p></p>
         </div>   
    </div>
    
    `
    
})

