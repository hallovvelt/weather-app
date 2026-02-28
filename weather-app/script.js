// ---- DEĞIŞKENLER ----

const API_KEY = "58657a47509eefdebe56e515fa517df7";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";


// ---- HTML ELEMENTLERİNİ BAĞLAMA ----
// JavaScript'e "bu id'li elementi bul ve kullan" diyoruz

const cityInput   = document.getElementById("city-input");
const searchBtn   = document.getElementById("search-btn");
const weatherCard = document.getElementById("weather-card");
const cityName    = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity    = document.getElementById("humidity");
const wind        = document.getElementById("wind");
const errorMessage = document.getElementById("error-message");
const loading     = document.getElementById("loading");


// ---- HAVA DURUMU VERİSİNİ ÇEKEN FONKSİYON ----

async function getWeather(city) {
// async → bu fonksiyon içinde internet isteği var, beklemek gerekiyor

  loading.classList.remove("hidden");
  // Arama başlayınca loading spinner'ı göster

  weatherCard.classList.add("hidden");
  errorMessage.classList.add("hidden");
  // Önceki sonucu ve hatayı temizle

  try {
  // try → "şunu dene, hata olursa catch bloğuna git"

    const response = await fetch(
      `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=en`
    );
    // fetch → API'ye istek at
    // await → cevap gelene kadar bekle
    // units=metric → sıcaklık Celsius gelsin
    // template literal (`) → ${} içine değişken yazabiliyoruz

    if (!response.ok) {
      throw new Error("City not found");
      // Şehir bulunamadıysa kasıtlı hata fırlat, catch'e düş
    }

    const data = await response.json();
    // Gelen cevabı JavaScript objesine çevir
    // Artık data.name, data.main.temp gibi değerlere ulaşabiliriz

    // ---- VERİYİ EKRANA YAZ ----

    cityName.textContent = data.name + ", " + data.sys.country;
    // data.name → şehir adı | data.sys.country → ülke kodu (DE, TR)

    temperature.textContent = "🌡 " + Math.round(data.main.temp) + "°C";
    // Math.round → 21.7'yi 22'ye yuvarlar

    description.textContent = "☁ " + data.weather[0].description;
    // data.weather bir dizi, ilk elemanın açıklamasını alıyoruz

    humidity.textContent = "💧 Humidity: " + data.main.humidity + "%";
    // data.main.humidity → nem oranı

    wind.textContent = "💨 Wind: " + Math.round(data.wind.speed * 3.6) + " km/h";
    // data.wind.speed metre/saniye gelir, 3.6 ile çarpınca km/h olur

    // ---- ARKA PLANI DEĞİŞTİR ----
    changeBackground(data.weather[0].main);
    // data.weather[0].main → "Clear", "Rain", "Clouds" gibi ana kategori

    // ---- KARTI GÖSTER ----
    loading.classList.add("hidden");
    // Spinner'ı gizle
    weatherCard.classList.remove("hidden");
    // Sonuç kartını göster

  } catch (error) {
  // Hata olursa buraya düşüyoruz

    loading.classList.add("hidden");
    // Spinner'ı gizle
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = "❌ City not found. Please try again.";
  }
}


// ---- ARKA PLAN RENGİ FONKSİYONU ----

function changeBackground(weather) {
// weather → "Clear", "Rain", "Clouds", "Snow", "Thunderstorm" gibi değerler

  if (weather === "Clear") {
    document.body.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
    // Güneşli → sarı-turuncu

  } else if (weather === "Rain" || weather === "Drizzle") {
    document.body.style.background = "linear-gradient(135deg, #373b44, #4286f4)";
    // Yağmurlu → koyu gri-mavi

  } else if (weather === "Snow") {
    document.body.style.background = "linear-gradient(135deg, #e0eafc, #cfdef3)";
    // Karlı → açık mavi-beyaz

  } else if (weather === "Clouds") {
    document.body.style.background = "linear-gradient(135deg, #606c88, #3f4c6b)";
    // Bulutlu → koyu gri

  } else if (weather === "Thunderstorm") {
    document.body.style.background = "linear-gradient(135deg, #0f0c29, #302b63)";
    // Fırtına → koyu mor

  } else {
    document.body.style.background = "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)";
    // Varsayılan → orijinal koyu mavi
  }
}


// ---- BUTON VE KLAVYE OLAYLARI ----

searchBtn.addEventListener("click", function() {
// "Search butonuna tıklanınca şunu yap"

  const city = cityInput.value.trim();
  // .value → input içindeki yazı | .trim() → baştaki/sondaki boşlukları sil

  if (city === "") {
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = "❌ Please enter a city name.";
    return;
    // Boş aramayı durdur
  }

  getWeather(city);
  // Fonksiyonu çağır
});

cityInput.addEventListener("keydown", function(event) {
// Input'ta tuşa basılınca çalışır

  if (event.key === "Enter") {
    searchBtn.click();
    // Enter'a basınca butona tıklamış gibi davran
  }
});