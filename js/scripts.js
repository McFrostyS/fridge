/***************************************** OBTENER IMAGENES ***************************************************************/
const ACCESS_KEY = "bwY0VaODlnwsNQ6ESnV9GtaAzvCBFiOg6BM_yKG0yFo";
// Define la función para obtener la URL de la primera imagen del alimento
async function obtenerImagenAlimento(nombreAlimento) {
    try {
        // Realiza una solicitud a la API de Unsplash para obtener imágenes relacionadas con el alimento
        const respuesta = await fetch(
            `https://api.unsplash.com/search/photos?query=${nombreAlimento}&per_page=1&client_id=${ACCESS_KEY}`
        );
        const data = await respuesta.json();
        // Extrae la URL de la primera imagen de la respuesta de la API de Unsplash
        const imagen = data.results[0].urls.regular;

        return imagen;
    } catch (error) {
        console.error("Error al obtener la imagen del alimento:", error);
        const imagenDefault = "img/imagenDefault.jpeg"; // Si no se puede obtener la imagen, se usa una imagen por defecto
        return imagenDefault;
    }
}

/**************************************************************************************************************************/

/***************************************** GENERAR ALIMENTOS **************************************************************/

const btnNew = document.querySelector(".new");
const productos = document.querySelector(".products");
let alimentos = [];
let countdownId = 1;
let countdownIntervals = {};

btnNew.addEventListener("click", async function () {
    const nombre = document.querySelector(".nombre").value;
    const caduca = document.querySelector(".caduca").value;
    const cantidad = document.querySelector(".cantidad").value;
    const tipo = document.querySelector(".tipo").value;

    const alimento = {
        nombre: nombre,
        cantidad: cantidad,
        tipo: tipo,
        caduca: caduca,
        countdownId: countdownId,
    };

    alimentos.push(alimento);

    const producto = document.createElement("p");

    producto.innerHTML =
        "<span><img src=''></span>" +
        "<br>" +
        "<span class='name'>" +
        alimento.nombre +
        "</span>" +
        "\nQuantity: " +
        alimento.cantidad +
        "<br>" +
        "\nType: " +
        alimento.tipo +
        "<br>" +
        "\nExpires in: " +
        `<span class='caduca-span-${alimento.countdownId}'>` +
        alimento.caduca +
        "</span>";

    productos.appendChild(producto);

    const imagen = await obtenerImagenAlimento(alimento.nombre);
    const imagenElemento = producto.querySelector("img");
    imagenElemento.src = imagen;

    startCountdown(alimento.countdownId, alimento.caduca);
    countdownId++;
});

/**************************************************************************************************************************/

/***************************************** CUENTA REGRESIVA **************************************************************/

function startCountdown(countdownId, caduca) {
    const caducaSpan = document.querySelector(`.caduca-span-${countdownId}`);

    const inputSeconds = parseInt(caduca, 10);

    if (!isNaN(inputSeconds) && inputSeconds > 0) {
        let remainingSeconds = inputSeconds;

        countdownIntervals[countdownId] = setInterval(function () {
            caducaSpan.innerHTML = formatCountdown(remainingSeconds);

            remainingSeconds--;

            if (remainingSeconds < 0) {
                clearInterval(countdownIntervals[countdownId]);
                caducaSpan.innerHTML = "Expired";
                caducaSpan.style.color = "red";
            } else {
                caducaSpan.style.color = "green";
            }
        }, 1000);
    } else {
        alert("Por favor, ingrese un número válido");
    }
}

// Limpiar las cuentas regresivas de los alimentos caducados antes de agregar uno nuevo
function clearCountdowns() {
    for (let countdownId in countdownIntervals) {
        clearInterval(countdownIntervals[countdownId]);
    }
    countdownIntervals = {};
}

function formatCountdown(seconds) {
    var days = Math.floor(seconds / (24 * 60 * 60));
    var hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var remainingSeconds = seconds % 60;

    return days + "d " + hours + "h " + minutes + "m " + remainingSeconds + "s ";
}

/**************************************************************************************************************************/
