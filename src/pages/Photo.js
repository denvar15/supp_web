import React, { useState } from "react";
import Select from 'react-select'
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "./scanner.css";
import { useNavigate } from "react-router";

const quality_marks = ['GMP', 'ISO', 'NSF', 'HACCP', 'SQF', 'FSSC'].map(v => v.toLowerCase())
const important_array = ['Titanium Dioxide', 'kava', 'Magnesium Silicate', 'Magnesium Stearate', 'Talc', 'Hydrogenated Oil',
    'Lead', 'Mercury', 'Polychlorinated biphenyls', 'PCBs', 'Sibutramine', 'Yohimbe', 'chaparral',
    'Sibutramine', 'Kava Kava', 'Piper methysticum', 'DMAA', '1,3-dimethylamylamine', 'dimethylamylamine',
    'Comfrey', 'Symphytum', 'Glucosamine'].map(v => v.toLowerCase())
const important_array_ru = ['Диоксид титана', 'Диоксид титана', 'Силикат магния', 'Стеарат магния', 'Тальк', 'Гидрогенизированное масло',
'Свинец', 'Ртуть', 'Полихлорированные бифенилы', 'ПХБ', 'Сибутрамин', 'Йохимбе', 'Чапараль',
'Сибутрамин', 'Кава-кава', 'Piper methysticum', 'ДМАА', '1,3-диметиламиламин', 'диметиламиламин',
'Окопник', 'Симфитум', 'Глюкозамин'].map(v => v.toLowerCase())
const bee_products_array = ['Bee Pollen', 'Royal Jelly', 'Propolis', 'Honey', 'Bee Venom', 'Manuka Honey'].map(v => v.toLowerCase())
const bee_products_array_ru = ['Пчелиная пыльца', 'Маточное молочко', 'Прополис', 'Мед', 'Пчелиный яд', 'Мед манука'].map(v => v.toLowerCase())
const allergens_array = ['Milk', 'Egg', 'Peanuts', 'Almonds', 'Walnuts', 'Cashews', 'Wheat', 'Soybeans', 'Soy',
'Fish', 'Shellfish', 'Sesame Seeds', 'Gluten', 'Casein', 'Lactose', 'Corn', 'Barley', 
'Rye', 'Mustard', 'Celery', 'Curcumin', 'Ginkgo', 'Biloba', 'Ginseng Extract'].map(v => v.toLowerCase())
const allergens_array_ru = ['Молоко', 'Яйцо', 'Арахис', 'Миндаль', 'Грецкие орехи', 'Кешью', 'Пшеница', 'Соевые бобы', 'Соя', 'Рыба', 'Моллюски', 'Семена кунжута', 'Глютен', 'Казеин', 'Лактоза', 'Кукуруза', 'Ячмень',
'Рожь', 'Горчица', 'Сельдерей', 'Куркумин', 'Гинкго', 'Билоба', 'Экстракт женьшеня'].map(v => v.toLowerCase())
const sweeteners_array = ['Acesulfame K', 'E950', 'Advantame', 'E969', 'Aspartame', 'E951', 'Neotame',
 'E961', 'Stevia', 'Steviol glycosides', 'Stevia rebaudiana', 'Sucralose', 'Е955'].map(v => v.toLowerCase())
const sweeteners_array_ru = ['Ацесульфам К', 'E950', 'Адвантам', 'E969', 'Аспартам', 'E951', 'Неотам',
  'E961', 'Стевия', 'Стевиолгликозиды', 'Stevia rebaudiana', 'Сукралоза', 'Е955'].map(v => v.toLowerCase())
const categories_dict = {'Bee products': bee_products_array, 'Allergens': allergens_array, 'Sweeteners': sweeteners_array}
const categories_dict_ru = {'Bee products': bee_products_array_ru, 'Allergens': allergens_array_ru, 'Sweeteners': sweeteners_array_ru}

const optionsLang = [
  { value: 'eng', label: 'English' },
  { value: 'rus', label: 'Russian' },
]

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

  async function getData(url="", data={}) {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "X-Api-Key": process.env.REACT_APP_API_KEY
      },
      redirect: "follow",
      referrerPolicy: "no-referrer"
    })
    return await response.json()
  }

const Photo = () => {
  const [name, setName] = useState("");
  const [harmfulText, setHarmfulText] = useState(""); 
  const [categoryText, setCategoryText] = useState(""); 
  const [okayText, setOkayText] = useState(""); 
  const [qualityText, setQualityText] = useState(""); 
  const [userCategory, setUserCategory] = useState("Bee products"); 
  const [lang, setLang] = useState("eng"); 
  const [description, setDescription] = useState(""); 
  const navigate = useNavigate();

  function searchArrays(ar_message, ar_message_pairs) {
        let founded_compounds = []
        let category_compounds = []
        let quality_compounds = []
        console.log("userCategory search ", userCategory)
        let search_category = []
        let main_array = []
        if (lang === 'eng') {
          search_category = categories_dict[userCategory]
          main_array = important_array
        } else {
          search_category = categories_dict_ru[userCategory]
          main_array = important_array_ru
        }
        for (let i of ar_message) {
            if (main_array.includes(i)) {
              founded_compounds.push(i)
            }
            if (search_category.includes(i)) {
              category_compounds.push(i)
            }
            if (quality_marks.includes(i)) {
              quality_compounds.push(i)
            }
        }
        for (let i of ar_message_pairs) {
            if (main_array.includes(i)) {
                founded_compounds.push(i)
            }
            if (search_category.includes(i)) {
                category_compounds.push(i)
            }
        }
        if (quality_compounds.length > 0) {
          setQualityText("Found quality marks " + quality_compounds + " so, compounds may be correct")
        } else {
          setQualityText("No quality marks found so, compounds may be not correct")
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
        getDescription(ar_message)
    }

  async function handleTakePhoto (dataUri) {
    var dimensions = await getImageDimensions(dataUri)
    const approxSize = dataUri.length
    const scaler = 1024000 / approxSize
    resizeBase64Img(dataUri, scaler * dimensions.w, scaler * dimensions.h).then((result)=>{
        postData('https://api.ocr.space/parse/image', {"base64Image": result, "language": lang}).then((data) => {
            let text = data['ParsedResults'][0]['ParsedText'].toLowerCase()
            const regex = /\r\n|\r|\n|[.]/;
            const ar_message = text.split(regex)
            const ar_message_pairs = []
            for (let i of ar_message) {
                for (let j of ar_message) {
                    if (j !== i) {
                        ar_message_pairs.push(i + ' ' + j)
                    }
                }
            } 
            console.log("ar_message ", ar_message);  
            searchArrays(ar_message, ar_message_pairs)
          });
    });
  }

  async function getDescription(ar) {
    let final_text = ''
    for (let i of ar) {
      if (i !== '' && !quality_marks.includes(i)) {
        let info = await getData('https://api.ods.od.nih.gov/dsld/v9/search-filter?q=' + i)
        console.log("info ", info)
        let infoLabel = await getData('https://api.ods.od.nih.gov/dsld/v9/label/' + info['hits'][0]['_id'])
        final_text += '\n' + i + '\n' + infoLabel['statements'][3]['notes'] + "\n" + 
                    infoLabel['statements'][4]['notes']
      }
    }
    setDescription(final_text)
  }

  const handleSubmit = () => {
    if (harmfulText !== '') {
      alert("Stop! " + harmfulText)
    } else {
      window.localStorage.setItem("Name", name)
      window.localStorage.setItem("CategoryText", categoryText)
      navigate("/notifications")
    }   
  }

  return (
    <div className="container">
      <h1 style={{marginLeft: "10vw"}}>Supplement Assistant</h1>
      <h2 style={{marginLeft: "10vw"}}>Here you can input name of your supplement:</h2>
      <input 
        style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh"}}
        type="text" 
        placeholder="Your protein..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{width:"80vw", margin: "auto"}}>
        <Select placeholder="Text language..." options={optionsLang}
            onChange={(newValue) => setLang(newValue['value'])}/>
      </div>
      <div style={{margin:"25px"}}>
        <Camera
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
          />
      </div>
      <div style={{width:"80vw", margin: "auto"}}>
        <Select placeholder="Search category..." options={options}
            onChange={(newValue) => setUserCategory(newValue['label'])}/>
      </div>
      <h1 style={{color: "red", marginLeft: "10vw"}}>{harmfulText}</h1>
      <h1 style={{color: "orange", marginLeft: "10vw"}}>{categoryText}</h1>
      <h1 style={{color: "green", marginLeft: "10vw"}}>{okayText}</h1>

      <h2 style={{marginLeft: "10vw"}}>{qualityText}</h2>

      <h2 style={{marginLeft: "10vw"}}>{description}</h2>
      <div style={{marginTop: "2vh"}}> </div>
      <button style={{marginLeft: "10vw"}} onClick={handleSubmit}>Create individual notification</button>
      <div style={{marginTop: "2vh"}}> </div>
    </div>
  );
};

export default Photo;
