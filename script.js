//scroll infinito

let OFFSET = 0;
let lastGifTemplate;

const observadorFunction = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            OFFSET += 20;
            if (valueInput) {
                searchHistoria(valueInput);
            }
            else {
                trending();
            }
        }
    })
}, {
    rootMargin: '0px 0px 100px 0px',
    threshold: 1.0
});



const apiID ='p127toSTO3ZLM39q1ZytbncxL9lFFDYQ';
const URL = 'https://api.giphy.com/v1/gifs/';
const maximoBusquedas =  3

const button = document.querySelector('.buscar');
const resultados = document.querySelector('#resultados');
const formulario = document.querySelector('#formulario');
const input = document.querySelector('#input');
const buttonTop = document.querySelector('.buttonTop');
const busquedas = document.querySelector('#busquedas');

let valueInput = '';

const figure = (element) => {
    const { title, images } = element;
    const figure = document.createElement('figure');
    const img = document.createElement('img');
   

    img.src = images.original.url;
    img.alt = title;

    figure.appendChild(img);
    figure.className = 'contenedor_gif1';
    return figure;
};

const getApiGif = async (param) => {
    const apiTrending = `${URL}trending?api_key=${apiID}&limit=25&rating=g`;
    const apiSearch = `${URL}search?api_key=${apiID}&q=${param}&limit=25&rating=g`;

    if (param) {
        const res = await fetch(apiSearch);
       const {data} = await res.json();

        return data
    }
    else {
        const res = await fetch(apiTrending);
        const {data} = await res.json();


        return data
}};
 
const trending = async () => {
    const data = await getApiGif();

    const elem = data.map(item => figure(item));

    resultados.append(...elem);

    if (lastGifTemplate) {
        observadorFunction.unobserve(lastGifTemplate);
    }

    lastGifTemplate = elem.pop();

    observadorFunction.observe(lastGifTemplate);
};

const searchFunction = () => {

    valueInput = input.value;
    if (!valueInput) {

        validateSearch('Debe ingresar una búsqueda');
        return;

    } else {
        OFFSET = 0
        document.getElementById('alert-error');
        input.classList.remove('error_input');
        searchHistoria(valueInput);
        crearHistorial(valueInput);
    }
}
const validateSearch = (error) => {
    const titleError = document.getElementById('alert-error');

    if (!titleError) {
        const title = document.createElement('p');
        title.textContent = error;
        title.id = 'alert-error';
        input.classList.add('error_input');
        setTimeout(function () {
            input.classList.remove("bounce");
        }, 1000);
        document.querySelector('.nav').appendChild(title);
    }
}

const lastSearchFunction = (e) => {
    e.preventDefault();

    OFFSET = 0;
    valueInput = e.target.value;

    searchHistoria(valueInput);
}
const alertMessage = (msg) => {
    const divData = document.createElement('div');
    divData.classList.add('data');
    const pSubData = document.createElement('p');
    pSubData.textContent = msg
    pSubData.classList.add('sub');

    divData.append(pSubData);
    const mostrarAlerta = document.getElementById('mostrar_alerta');
    // alertSHow.innerHTML = elem;
    mostrarAlerta.append(divData);
}
const searchHistoria = async (searchParam) => {

    const data = await getApiGif(searchParam);

    if (data.length === 0) {
        alertMessage('No existen resultados, intenta con otra búsqueda')
        return
    }

    if (OFFSET == 0) {
        resultados.innerHTML = '';
    }

    const elem = data.map(item => figure(item));

  resultados.append(...elem);

    if (lastGifTemplate) {
        observadorFunction.unobserve(lastGifTemplate);
    }

    lastGifTemplate = elem.pop();

    observadorFunction.observe(lastGifTemplate);
}

const crearHistorial = (searchParam) => {
    const history = JSON.parse(localStorage.getItem('searchHistoria') || '[]');

    const isHistoryMaxed = history.length === maximoBusquedas;
    const workingHistory = isHistoryMaxed ? history.slice(1) : history;
    const updatedHistory = workingHistory.concat(searchParam);

    localStorage.setItem('searchHistoria', JSON.stringify(updatedHistory));

    updateSearchHistory();
}

const updateSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('searchHistoria') || '[]');

    busquedas.innerHTML = '';

    let div = document.createElement('div');

    busquedas.append(history.map(a => {
        let span = document.createElement('span');
        span.textContent = a;
        span.className = 'texto';
        span.value = a
     busquedas.appendChild(span);
        span.addEventListener('click', lastSearchFunction);
    }).join(''));


}
const scrollFunction = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        buttonTop.style.display = "block";
    } else {
        buttonTop.style.display = "none";
    }
}

const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

window.onscroll = () => {
    scrollFunction();
};

//AddEventListener
button.addEventListener('click', searchFunction);
buttonTop.addEventListener('click', topFunction);

//call function
trending();
updateSearchHistory();
