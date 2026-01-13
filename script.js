const API_KEY='00e5de2d5b2263b0b717cf493d2f18f4';
const CURRENT_URL='https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL='https://api.openweathermap.org/data/2.5/forecast';

const loader=document.getElementById('loader');
const error=document.getElementById('error');
const current=document.getElementById('currentWeather');

document.getElementById('searchBtn').onclick=()=>getByCity();
document.getElementById('locBtn').onclick=()=>getByLocation();

function showLoader(v){loader.style.display=v?'block':'none';}

async function getByCity(){
  const city=document.getElementById('cityInput').value.trim();
  if(!city) return showError('Enter a city name');
  fetchWeather(`${CURRENT_URL}?q=${city}&units=metric&appid=${API_KEY}`);
  fetchForecast(`${FORECAST_URL}?q=${city}&units=metric&appid=${API_KEY}`);
}

function getByLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    const {lat,lon}=pos.coords;
    fetchWeather(`${CURRENT_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    fetchForecast(`${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  },()=>showError('Location access denied'));
}

async function fetchWeather(url){
  try{
    showLoader(true); error.textContent='';
    const res=await fetch(url);
    if(!res.ok) throw new Error('Weather not found');
    const d=await res.json();
    renderCurrent(d);
    setBackground(d.weather[0].main);
  }catch(e){showError(e.message);}
  finally{showLoader(false);}
}

async function fetchForecast(url){
  const res=await fetch(url);
  const d=await res.json();
  renderForecast(d.list);
}

function renderCurrent(d){
  current.style.display='block';
  document.getElementById('temp').textContent=Math.round(d.main.temp)+'°C';
  document.getElementById('condition').textContent=d.weather[0].description;
  document.getElementById('icon').src=`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`;
  document.getElementById('city').textContent=d.name;
  document.getElementById('time').textContent=new Date().toLocaleString();
  document.getElementById('humidity').textContent=d.main.humidity;
  document.getElementById('wind').textContent=d.wind.speed;
  document.getElementById('feels').textContent=Math.round(d.main.feels_like);
}

function renderForecast(list){
  const box=document.getElementById('forecast');
  box.innerHTML='';
  list.filter((_,i)=>i%8===0).forEach(item=>{
    const div=document.createElement('div');
    div.innerHTML=`<p>${item.dt_txt.split(' ')[0]}</p>
                   <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                   <p>${Math.round(item.main.temp)}°C</p>`;
    box.appendChild(div);
  });
}

function setBackground(condition){
  document.body.className='';
  const map={
    Clear:'clear',
    Clouds:'clouds',
    Rain:'rain',
    Snow:'snow',
    Thunderstorm:'thunderstorm',
    Mist:'mist',
    Haze:'mist',
    Fog:'mist'
  };
  document.body.classList.add(map[condition]||'clear');
}

function showError(msg){error.textContent=msg;}
