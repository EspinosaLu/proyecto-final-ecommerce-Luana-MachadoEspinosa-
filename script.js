console.log("El archivo script.js se cargó correctamente");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado en la página actual.");

    const cardContainer = document.querySelector(".card-container");
    if (cardContainer) {
        console.log("Inicializando funcionalidad para Productos.");
        inicializarLogicaProductos();
        inicializarCarrito();
    }

    const carritoContainer = document.getElementById("carrito-container");
    if (carritoContainer) {
        console.log("Inicializando funcionalidad para Carrito.");
        inicializarPaginaCarrito();
        inicializarCarrito();
    }

    const contactForm = document.getElementById('submitForm');
    if (contactForm) {
        console.log("Inicializando funcionalidad para Contacto.");
        inicializarLogicaContacto();
        inicializarCarrito();
    }

    const mainContainer = document.querySelector("main.container");
    if (mainContainer) {
        console.log("Inicializando obtención y renderizado de datos desde la API.");
        iniciarCargaDatos();
        inicializarCarrito();
    }
});

function inicializarCarrito() {
    console.log("Inicializando carrito de compras.");

    const cartTotalElement = document.getElementById("cart-total-header");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const calcularTotalCarrito = () => {
        return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const actualizarTotalCarrito = () => {
        cartTotalElement.textContent = calcularTotalCarrito();
    };

    actualizarTotalCarrito();

    const botonesAgregarCarrito = document.querySelectorAll(".agregar-carrito");
    botonesAgregarCarrito.forEach((boton) => {
        boton.addEventListener("click", (evento) => {
            const producto = {
                id: boton.dataset.id,
                nombre: boton.dataset.nombre,
                precio: parseFloat(boton.dataset.precio),
                cantidad: 1,
            };

            const productoExistente = cart.find((item) => item.id === producto.id);
            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                cart.push(producto);
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            actualizarTotalCarrito();
        });
    });
}

function inicializarPaginaCarrito() {
    console.log("Inicializando lógica para la página del carrito.");

    const listaCarrito = document.getElementById("lista-carrito");
    const cartTotalElement = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const calcularTotalCarrito = () => {
        const total = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
        return total.toFixed(2);
    };

    const guardarCarrito = () => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const renderizarCarrito = () => {
        listaCarrito.innerHTML = "";

        cart.forEach((producto, index) => {
            const item = document.createElement("li");
            item.innerHTML = `
                ${producto.nombre} - $${producto.precio} x ${producto.cantidad}
                <button class="btn-editar" data-index="${index}">Editar</button>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            listaCarrito.appendChild(item);
        });

        cartTotalElement.textContent = calcularTotalCarrito();
    };

    const editarProducto = (index) => {
        const nuevaCantidad = prompt(`Introduce la nueva cantidad para ${cart[index].nombre}:`, cart[index].cantidad);

        if (nuevaCantidad !== null && !isNaN(nuevaCantidad) && nuevaCantidad > 0) {
            cart[index].cantidad = parseInt(nuevaCantidad);
            guardarCarrito();
            renderizarCarrito();
        }
    };

    const eliminarProducto = (index) => {
        if (confirm(`¿Estás seguro de eliminar ${cart[index].nombre} del carrito?`)) {
            cart.splice(index, 1);
            guardarCarrito();
            renderizarCarrito();
        }
    };

    const manejarCompra = () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
        } else {
            alert(`Compra realizada con éxito. Total: $${calcularTotalCarrito()}`);
            cart = [];
            guardarCarrito();
            renderizarCarrito();
        }
    };

    renderizarCarrito();

    listaCarrito.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("btn-editar")) {
            const index = parseInt(evento.target.dataset.index);
            editarProducto(index);
        } else if (evento.target.classList.contains("btn-eliminar")) {
            const index = parseInt(evento.target.dataset.index);
            eliminarProducto(index);
        }
    });

    checkoutButton.addEventListener("click", manejarCompra);
}

function inicializarLogicaProductos() {
    console.log("Lista de productos disponibles:");
    const productos = [
        { id: 1, nombre: "Pollo entero", precio: 50 },
        { id: 2, nombre: "Milanesa de pollo", precio: 15 },
        { id: 3, nombre: "Pamplona", precio: 25 },
        { id: 4, nombre: "Pechuga", precio: 30 }
    ];

    productos.forEach(producto => {
        console.log(`ID: ${producto.id}, Nombre: ${producto.nombre}, Precio: $${producto.precio}`);
    });

    const enlacesVerMas = document.querySelectorAll(".ver-mas");
    console.log("Enlaces 'Ver más' encontrados:", enlacesVerMas.length);

    enlacesVerMas.forEach(enlace => {
        enlace.addEventListener("click", (evento) => {
            evento.preventDefault();
            const titulo = enlace.previousElementSibling.previousElementSibling.textContent;
            const descripcion = enlace.getAttribute("data-descripcion");

            const descripcionTitulo = document.getElementById("descripcion-titulo");
            const descripcionDetalle = document.getElementById("descripcion-detalle");
            const descripcionAmpliada = document.getElementById("descripcion-ampliada");

            if (descripcionTitulo && descripcionDetalle && descripcionAmpliada) {
                descripcionTitulo.textContent = titulo;
                descripcionDetalle.textContent = descripcion;
                descripcionAmpliada.style.display = "block";
            } else {
                console.error("No se encontraron los elementos de descripción.");
            }
        });
    });
}

function inicializarLogicaContacto() {
    document.getElementById('submitForm').addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            console.error("Por favor, completa todos los campos del formulario.");
        } else {
            console.log("Formulario enviado correctamente.");
        }
    });
}

async function obtenerDatosDeAPI() {
    try {
        const respuesta = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=12");

        if (!respuesta.ok) {
            throw new Error(`Error en la API: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        return [];
    }
}

function renderizarDatos(datos) {
    const contenedor = document.querySelector("main.container");
    contenedor.innerHTML = "";

    datos.forEach((item) => {
        const cardHTML = `
            <div class="card">
                <img src="${item.thumbnailUrl}" alt="${item.title}" />
                <h3>${item.title}</h3>
                <p>ID: ${item.id}</p>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

async function iniciarCargaDatos() {
    console.log("Cargando datos de la API...");
    const datos = await obtenerDatosDeAPI();
    renderizarDatos(datos);
}