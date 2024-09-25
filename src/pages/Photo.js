import React, { useState } from "react";
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import "./scanner.css";
import { useNavigate } from "react-router";
import { Heading, Text, Select, TextInput, Button } from 'grommet';

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

const optionsLang = {"English" : 'eng', "Russian": "rus"}

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
  const [lang, setLang] = useState("English"); 
  const [description, setDescription] = useState(""); 
  const navigate = useNavigate();

  function searchArrays(ar_message, ar_message_pairs) {
        let founded_compounds = []
        let category_compounds = []
        let quality_compounds = []
        console.log("userCategory search ", userCategory)
        let search_category = []
        let main_array = []
        if (lang === 'English') {
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
    console.log("LANG ", lang)
    resizeBase64Img(dataUri, scaler * dimensions.w, scaler * dimensions.h).then((result)=>{
        postData('https://api.ocr.space/parse/image', {"base64Image": result, "language": optionsLang[lang]}).then((data) => {
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
        if (info['hits'].length > 0) {
          let infoLabel = await getData('https://api.ods.od.nih.gov/dsld/v9/label/' + info['hits'][0]['_id'])
          final_text += '\n' + i + '\n' + infoLabel['statements'][3]['notes'] + "\n" + 
                      infoLabel['statements'][4]['notes']
        }
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
    <div>
      <Text style={{fontSize: "25px", fontWeight: "750", display: "block", border: "3px solid rgb(125, 76, 219)",
                 padding: "10px", color: "rgb(111, 255, 176)", borderRadius: "5px", textAlign: "center"}}>
        Supplement <Text style={{fontSize: "25px", fontWeight: "750", color: "white"}}>Assistant</Text>
      </Text>
      <Heading style={{display: "block", marginLeft: "10vw", color: "rgb(111, 255, 176)"}}>
        Take <Text style={{fontSize: "50px", fontWeight: "750", color: "white"}}>Photo</Text>
      </Heading>
      <div style={{margin: "auto"}}>
        <Camera
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
            imageCompression = {0.8}
          />
      </div>
      <div style={{marginTop: "2vh"}}> </div>
      <Text style={{fontSize: "22px", display: "block", fontWeight: "750", marginLeft: "10vw"}}>
        Here you can input name of your <Text style={{fontSize: "25px", color: "rgb(111, 255, 176)"}}>supplement</Text> 
        </Text>
      <div style={{marginTop: "2vh"}}> </div>
      <TextInput 
        style={{width:"80vw", marginLeft: "10vw", marginBottom: "2vh",
          borderWidth: "1px", borderColor: "rgb(125, 76, 219)"
        }}
        type="text" 
        placeholder="Your supplement..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div style={{width:"80vw", marginLeft: "10vw"}}>
        <Select style={{width: "75vw", border: "1px solid rgb(125, 76, 219)"}}
            placeholder="Text language..." options={['English', 'Russian']}
            onChange={({ option }) => setLang(option)}/>
      </div>
      <div style={{marginTop: "2vh"}}> </div>
      <div style={{width:"80vw", marginLeft: "10vw"}}>
        <Select style={{width: "75vw", border: "1px solid rgb(125, 76, 219)"}}
            placeholder="Search category..." options={['Bee products', 'Allergens', 'Sweeteners']}
            onChange={({ option }) => setUserCategory(option)}/>
      </div>
      <div style={{marginTop: "2vh"}}> </div>
      {harmfulText !== '' ? 
      <div><Text style={{fontWeight: "750", display: "block", color: "rgb(111, 255, 176)", marginLeft: "10vw"}}>{harmfulText}</Text><br></br></div> : ''}
      {categoryText !== '' ? 
      <div><Text style={{fontWeight: "750", display: "block", color: "rgb(125, 76, 219)", marginLeft: "10vw"}}>{categoryText}</Text><br></br></div> : ''}
      {okayText !== '' ? 
      <div><Text style={{fontWeight: "750", display: "block", color: "white", marginLeft: "10vw"}}>{okayText}</Text><br></br></div> : ''}
      <div style={{marginTop: "2vh"}}> </div>
      {qualityText !== '' ? 
      <div><Text style={{color: "rgb(111, 255, 176)", display: "block", marginLeft: "10vw"}}>{qualityText}</Text><div style={{marginTop: "2vh"}}> </div></div> : ''}
      {description !== '' ? 
      <div><Text style={{width:"80vw", marginLeft: "10vw", display: "block"}}>{description}</Text><div style={{marginTop: "2vh"}}> </div></div> : ''}
      <Button primary style={{marginLeft: "10vw", padding: "10px", color: "black",
        fontWeight: "750", backgroundColor: "rgb(111, 255, 176)",}}
       onClick={handleSubmit}>Create individual notification</Button>
      <div style={{marginTop: "2vh"}}> </div>
    </div>
  );
};

export default Photo;
