const url = 'https://dummyjson.com/products'
let Carrito = [];
let Productos = [];

let botonesAgregar = document.querySelectorAll(".boton");
const listaProductos = document.querySelector("#lista");
const contenidoCarrito = document.querySelector("#carrito-container");
const subtotal = document.querySelector(".total");
const comprar = document.querySelector(".comprar");
const comprarealizada = document.querySelector(".comprarealizada");
const eliminarhistorial = document.querySelector(".eliminarcompra");


function cargarProductos() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            Productos = data.products;

            Productos.forEach(products => {
                const divProductos = document.createElement("div");
                divProductos.innerHTML = `
            <h1>${products.title}</h1>
            <img src="${products.thumbnail}"/>
            <h2>${products.description}</h2>
            <h3>Precio: $${products.price}</h3>
            <p>(Stock: ${products.stock})</p>
            <button class="boton" id="${products.id}">Agregar al carrito</button>`;
                listaProductos.appendChild(divProductos);
            });
            actualizarBoton();
        })
        .catch(error => {
            console.error('Hubo un problema:', error);
        });
}
cargarProductos();

function actualizarBoton() {
    botonesAgregar = document.querySelectorAll(".boton");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", agregarAcarrito);
    });
}

function calcularTotal() {
    return Carrito.reduce((total, producto) => total + (producto.price * producto.cantidad), 0);
}

function renderizarCarrito() {
    contenidoCarrito.innerHTML = ``;
    Carrito.forEach(Producto => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h2>${Producto.title}</h2>
            <img src="${Producto.thumbnail}"/>
            <h3>Precio: $${Producto.price}</h3>
            <p>Cantidad: ${Producto.cantidad}</p>
            <button class="botonEliminar" id="${Producto.id}">Eliminar</button>
        `;
        contenidoCarrito.appendChild(div);
    });
    actualizarBotonEliminar();
    subtotal.textContent = `SubTotal $${calcularTotal()}`;
}

function agregarAcarrito(e) {
    const botonid = parseInt(e.currentTarget.id);
    const productoAgregado = Productos.find(
        (Producto) => Producto.id === botonid
    );

    if (Carrito.some((Producto) => Producto.id === botonid)) {
        const index = Carrito.findIndex((Producto) => Producto.id === botonid);
        Carrito[index].cantidad++;
    } else {
        if (productoAgregado) {
            productoAgregado.cantidad = 1;
            Carrito.push({ ...productoAgregado });
        }
    }
    renderizarCarrito();
}

function actualizarBotonEliminar() {
    const botonesEliminar = document.querySelectorAll(".botonEliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", eliminarBoton);
    });
}

function eliminarBoton(e) {
    const botonid = parseInt(e.currentTarget.id);
    const index = Carrito.findIndex((Producto) => Producto.id === botonid);
    if (index !== -1) {
        Carrito.splice(index, 1);
    }
    renderizarCarrito();
}

function finalizarCompra() {
    const total = calcularTotal()

    if (Carrito.length === 0) {
        Swal.fire({
            icon: "error",
            title: "No tiene productos seleccionados",
            text: "Seleccione un producto para realizar una compra!",
        });
    }
    else {
        localStorage.setItem("productosComprados", JSON.stringify(Carrito));
        Swal.fire({
            title: `Muchas gracias por su compra! Su compra es de $${total}`,
            icon: "success",
            draggable: true
        });
        Carrito = [];
        renderizarCarrito();
    }

}

comprar.addEventListener("click", finalizarCompra);
comprar.addEventListener("click", () => {
    const productosCompradosJSON = localStorage.getItem("productosComprados");
    let historial = [];
    let totalcompra = 0;

    if (productosCompradosJSON) {
        historial = JSON.parse(productosCompradosJSON);
        totalcompra = historial.reduce((total, producto) => total + (producto.price * producto.cantidad), 0);
    }

    if (historial.length === 0) {
        comprarealizada.innerHTML = `<h1>Historial de compra: No tiene productos comprados</h1>`;
    } else {
        let detalleHtml = `<h1>Historial de compra: Total de $${totalcompra}</h1>`;
        detalleHtml += `<h2>Productos comprados:</h2><ul>`;
        historial.forEach(producto => {
            detalleHtml += `<li>${producto.title} - Cantidad: ${producto.cantidad}</li>`;
        });
        detalleHtml += `</ul>`;
        comprarealizada.innerHTML = detalleHtml;
    }
});

eliminarhistorial.addEventListener("click", () => {
    localStorage.removeItem("productosComprados");
    comprarealizada.innerHTML = `<h1> Historial de compra vacío </h1>`;
});

renderizarCarrito();
