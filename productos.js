const maquinas = [
    { id: "1", nombre: "Wahl Home Cut & Detail", precio: 52900, disponibilidad: true, descuento: 10, stock: 26 },
    { id: "2", nombre: "clipper NG-411 WMARK", precio: 106990, disponibilidad: true, descuento: 25, stock: 21 },
    { id: "3", nombre: "Kemei Recargable", precio: 56600, disponibilidad: true, descuento: 5, stock: 42 },
    { id: "4", nombre: "VGR V-001 9000 RPM Rojo", precio: 63329, disponibilidad: true, descuento: false, stock: 22 },
];
const afeitadoras = [
    { id: "5", nombre: "Shaver Care By Gadnic Recargable Usb", precio: 62100, disponibilidad: true, descuento: 20, stock: 20 },
    { id: "6", nombre: "Babyliss Foilfx02 Afeitadora Doble Hoja", precio: 119990, disponibilidad: true, descuento: false, stock: 40 },
    { id: "7", nombre: "Shaver Vgr V-323", precio: 57588, disponibilidad: true, descuento: 20, stock: 15 },
    { id: "8", nombre: "BabylissPRO Profesional Foil FX01 Black", precio: 53743, disponibilidad: true, descuento: false, stock: 30 },
];
const combos = [
    { id: "9", nombre: "Combo Maquina Homecut 8 Piezas + Kit Tijeras y Navajin", precio: 129266, disponibilidad: true, descuento: 10, stock: 12 },
    { id: "10", nombre: "Tijeras Barbero Cabello Estilista Inoxidable Portátil Kit", precio: 46490, disponibilidad: true, descuento: false, stock: 25 },
    { id: "11", nombre: "Combo Peluqueria Barberia Tijeras + Navaja + Capa Corte", precio: 48591, disponibilidad: true, descuento: false, stock: 10 },
    { id: "12", nombre: "Kit Peluqueria Profesional Tijeras, Secador, Planchita", precio: 765589, disponibilidad: true, descuento: 15, stock: 5 },
];

const Productos = [...maquinas, ...combos, ...afeitadoras];
const Carrito = [];

let botonesAgregar = document.querySelectorAll(".boton");
const listaProductos = document.querySelector("#lista");
const contenidoCarrito = document.querySelector("#carrito-container");
const subtotal = document.querySelector(".total");
const comprar = document.querySelector(".comprar");


function cargarProductos() {
    Productos.forEach((Producto) => {
        const divProductos = document.createElement("div");
        divProductos.innerHTML = `
        <h2>${Producto.nombre}</h2>
        <h3>Precio: $${Producto.precio}</h3>
        <p>(Stock: ${Producto.stock})</p>
        <button class="boton" id="${Producto.id}">Agregar al carrito</button>`;
        listaProductos.appendChild(divProductos);
    });
    actualizarBoton();
}
cargarProductos();

function actualizarBoton() {
    botonesAgregar = document.querySelectorAll(".boton");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", agregarAcarrito);
    });
}

function calcularTotal() {
    return Carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
}

function renderizarCarrito() {
    contenidoCarrito.innerHTML = ``;
    Carrito.forEach(Producto => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h2>${Producto.nombre}</h2>
            <h3>Precio: $${Producto.precio}</h3>
            <p>Cantidad: ${Producto.cantidad}</p>
            <button class="botonEliminar" id="${Producto.id}">Eliminar</button>
        `;
        contenidoCarrito.appendChild(div);
    });
    actualizarBotonEliminar();
    subtotal.textContent = `SubTotal $${calcularTotal()}`;
}

function agregarAcarrito(e) {
    const botonid = e.currentTarget.id;
    const productoAgregado = Productos.find(
        (Producto) => Producto.id === botonid
    );

    if (Carrito.some((Producto) => Producto.id === botonid)) {
        const index = Carrito.findIndex((Producto) => Producto.id === botonid);
        Carrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        Carrito.push(productoAgregado);
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
    const botonid = e.currentTarget.id;
    const index = Carrito.findIndex((Producto) => Producto.id === botonid);
    if (index !== -1) {
        Carrito.splice(index, 1);
    }
    renderizarCarrito();
}

function finalizarCompra() {
    const total = calcularTotal()
    renderizarCarrito();
    if (Carrito.length === 0) { alert("No tiene productos seleccionados") }
    else {
        alert(`Muchas gracias por su compra! Su compra es de $${total}`);
    }
}

comprar.addEventListener("click", finalizarCompra);

renderizarCarrito();