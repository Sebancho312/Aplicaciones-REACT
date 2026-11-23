
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function DetalleProducto({ productos, agregarAlCarrito }) {

    // Obtener el ID desde la URL
    const { id } = useParams();

    const [producto, setProducto] = useState(null);

    const [cargando, setCargando] = useState(true);

    // Consultar el producto cuando se carga la página
    useEffect(() => {

        async function cargarProducto() {

            setCargando(true);

            try {

                // Buscar primero en el inventario compartido
                const productoInventario = productos.find(
                    p => String(p.id) === String(id)
                );

                // Si existe en el inventario, utilizar sus datos
                if (productoInventario) {

                    setProducto(productoInventario);
                    setCargando(false);
                    return;

                }

                // Si no existe, consultar DummyJSON
                let idAPI = id.replace("api-", "");

                const respuesta = await fetch(
                    `https://dummyjson.com/products/${idAPI}`
                );

                if (!respuesta.ok) {
                    throw new Error("Producto no encontrado");
                }

                const datos = await respuesta.json();

                const productoAPI = {

                    id: `api-${datos.id}`,
                    nombre: datos.title,
                    precio: datos.price,
                    stock: datos.stock,
                    categoria: datos.category,
                    imagen: datos.thumbnail,
                    descripcion: datos.description,
                    origen: "api"

                };

                setProducto(productoAPI);

            } catch (error) {

                console.error("Error al cargar el producto:", error);

                setProducto(null);

            }

            setCargando(false);

        }

        cargarProducto();

    }, [id, productos]);

    // Agregar producto al carrito
    function agregarProducto() {

        if (producto) {

            agregarAlCarrito({

                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                descuento: 0

            });

        }

    }

    // Mostrar mensaje de carga
    if (cargando) {

        return (

            <div className="container bg-white p-4 rounded text-center">

                <h3 className="text-primary">
                    Cargando producto...
                </h3>

            </div>

        );

    }

    // Mostrar mensaje si no existe el producto
    if (!producto) {

        return (

            <div className="container bg-white p-4 rounded text-center">

                <h3 className="text-danger">
                    Producto no encontrado
                </h3>

                <Link to="/buscar" className="btn btn-primary mt-3">
                    Volver al buscador
                </Link>

            </div>

        );

    }

    // Obtener el stock actualizado del inventario
    const productoInventario = productos.find(
        p => String(p.id) === String(producto.id)
    );

    const stockActual = productoInventario
        ? productoInventario.stock
        : producto.stock;

    return (

        <div className="container bg-white p-4 rounded">

            <h2 className="text-center text-primary fw-bold mb-4">
                Detalle del Producto
            </h2>

            <div className="row align-items-center">

                {/* Imagen del producto */}
                <div className="col-md-5 text-center">

                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="img-fluid"
                        style={{
                            maxHeight: "350px",
                            objectFit: "contain"
                        }}
                    />

                </div>

                {/* Información del producto */}
                <div className="col-md-7">

                    <h3 className="fw-bold text-dark">
                        {producto.nombre}
                    </h3>

                    <p>
                        <strong>ID:</strong> {producto.id}
                    </p>

                    <p>
                        <strong>Categoría:</strong> {producto.categoria}
                    </p>

                    <p>
                        <strong>Precio:</strong> ${producto.precio.toFixed(2)}
                    </p>

                    <p>
                        <strong>Precio con IVA:</strong> $
                        {(producto.precio * 1.15).toFixed(2)}
                    </p>

                    <p>
                        <strong>Descripción:</strong>
                        <br />
                        {producto.descripcion || "Sin descripción disponible"}
                    </p>

                    <p>
                        <strong>Stock disponible:</strong> {stockActual}
                    </p>

                    {/* Advertencia de últimas unidades */}
                    {stockActual > 0 && stockActual < 10 && (

                        <div className="alert alert-warning fw-bold">
                            ¡Últimas unidades!
                        </div>

                    )}

                    {/* Mensaje de producto agotado */}
                    {stockActual <= 0 && (

                        <div className="alert alert-danger fw-bold">
                            Producto agotado
                        </div>

                    )}

                    <button
                        className="btn btn-primary w-100 mb-2"
                        onClick={agregarProducto}
                        disabled={stockActual <= 0}
                    >
                        Agregar al Carrito
                    </button>

                    <Link
                        to="/buscar"
                        className="btn btn-outline-secondary w-100"
                    >
                        Volver al Buscador
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default DetalleProducto;
