import React, { useState } from "react";
import Select from 'react-select'
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "./scanner.css";

const important_array = ['Titanium Dioxide', 'Titanium Dioxide.', 'Magnesium Silicate', 'Magnesium Stearate', 'Talc', 'Hydrogenated Oil',
    'Lead', 'Mercury', 'Polychlorinated biphenyls', 'PCBs', 'Sibutramine', 'Yohimbe', 'chaparral',
    'Sibutramine', 'Kava Kava', 'Piper methysticum', 'DMAA', '1,3-dimethylamylamine', 'dimethylamylamine',
    'Comfrey', 'Symphytum', 'Glucosamine'].map(v => v.toLowerCase())
const bee_products_array = ['Bee Pollen', 'Royal Jelly', 'Propolis', 'Honey', 'Bee Venom', 'Manuka Honey'].map(v => v.toLowerCase())
const allergens_array = ['Milk', 'Egg', 'Peanuts', 'Almonds', 'Walnuts', 'Cashews', 'Wheat', 'Soybeans', 'Soy',
'Fish', 'Shellfish', 'Sesame Seeds', 'Gluten', 'Casein', 'Lactose', 'Corn', 'Barley', 
'Rye', 'Mustard', 'Celery', 'Curcumin', 'Ginkgo', 'Biloba', 'Ginseng Extract'].map(v => v.toLowerCase())
const sweeteners_array = ['Acesulfame K', 'E950', 'Advantame', 'E969', 'Aspartame', 'E951', 'Neotame',
 'E961', 'Stevia', 'Steviol glycosides', 'Stevia rebaudiana', 'Sucralose', 'Е955'].map(v => v.toLowerCase())
const categories_dict = {'Bee products': bee_products_array, 'Allergens': allergens_array, 'Sweeteners': sweeteners_array}

const options = [
    { value: 'Bee products', label: 'Bee products' },
    { value: 'Allergens', label: 'Allergens' },
    { value: 'Sweeteners', label: 'Sweeteners' }
  ]

function resizeBase64Img(base64, newWidth, newHeight) {
    return new Promise((resolve, reject)=>{
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        let context = canvas.getContext("2d");
        let img = document.createElement("img");
        img.src = base64;
        
        img.onload = function () {
            context.filter = 'grayscale(100%)'
            context.scale(newWidth/img.width,  newHeight/img.height);
            context.drawImage(img, 0, 0); 
            resolve(canvas.toDataURL());               
        }
    });
}

function getImageDimensions(file) {
    return new Promise (function (resolved, rejected) {
      var i = new Image()
      i.onload = function(){
        resolved({w: i.width, h: i.height})
      };
      i.src = file
    })
  }

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        // "Content-Type": "application/json",
        "apikey": process.env.REACT_APP_API_OCR_KEY,
        "Content-Type": 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: new URLSearchParams({
            'base64Image': data['base64Image'],
            'language': data['language'],
        }), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

const Photo = () => {
  const [harmfulText, setHarmfulText] = useState(); 
  const [categoryText, setCategoryText] = useState(); 
  const [okayText, setOkayText] = useState(); 
  const [userCategory, setUserCategory] = useState("Bee products"); 

  function searchArrays(ar_message, ar_message_pairs) {
        let founded_compounds = []
        let category_compounds = []
        console.log("userCategory search ", userCategory)
        for (let i of ar_message) {
            if (important_array.includes(i)) {
                // current_arrays[update.message.from_user['id']].append(i)
                founded_compounds.push(i)
            }
            if (categories_dict[userCategory].includes(i)) {
                // current_arrays[update.message.from_user['id']].append(i)
                category_compounds.push(i)
            }
        }
        for (let i of ar_message_pairs) {
            if (important_array.includes(i)) {
                // current_arrays[update.message.from_user['id']].append(i)
                founded_compounds.push(i)
            }
            if (categories_dict[userCategory].includes(i)) {
                // current_arrays[update.message.from_user['id']].append(i)
                category_compounds.push(i)
            }
        }
        if (founded_compounds.length > 0) {
            setHarmfulText("Harmful components detected\n" + founded_compounds)
            if (category_compounds.length > 0) {
                setCategoryText("From category " + userCategory + " there exists\n" + category_compounds)
            } else {
                setCategoryText("")  
            }
            setOkayText("")
        } else {
            if (category_compounds.length > 0) {
                setCategoryText("From category " + userCategory + " there exists\n" + category_compounds)
                setHarmfulText("")
                setOkayText("")
            }
            else {
                    setHarmfulText("")
                    setCategoryText("")
                    setOkayText("Everything is okay!")
                }
        }
    }

  async function handleTakePhoto (dataUri) {
    var dimensions = await getImageDimensions(dataUri)
    const approxSize = dataUri.length
    console.log("FACING_MODES ", FACING_MODES)
    const scaler = 1024000 / approxSize
    console.log('takePhoto ', process.env.REACT_APP_API_OCR_KEY);
    resizeBase64Img(dataUri, scaler * dimensions.w, scaler * dimensions.h).then((result)=>{
        postData('https://api.ocr.space/parse/image', {"base64Image": result, "language": 'eng'}).then((data) => {
            let text = data['ParsedResults'][0]['ParsedText'].toLowerCase()
            const regex = /\r\n|\r|\n/;
            let newText = text.replace(regex, ' ')
            // setOcrtext(newText)
            const ar_message = text.split(regex)
            const ar_message_pairs = []
            for (let i of ar_message) {
                for (let j of ar_message) {
                    if (j !== i) {
                        ar_message_pairs.push(i + ' ' + j)
                    }
                }
            } 
            console.log("ar_message ", ar_message); // JSON data parsed by `response.json()` call  
            // console.log("ar_message_pairs ", ar_message_pairs); // JSON data parsed by `response.json()` call  
            searchArrays(ar_message, ar_message_pairs)
          });
    });
  }

  return (
    <div className="container">
      <Camera
      idealFacingMode={FACING_MODES.ENVIRONMENT}
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
    />
    <Select options={options}
          onChange={(newValue) => setUserCategory(newValue['label'])}/>
    <h1 style={{color: "red"}}>{harmfulText}</h1>
    <h1 style={{color: "orange"}}>{categoryText}</h1>
    <h1 style={{color: "green"}}>{okayText}</h1>
    </div>
  );
};

export default Photo;
