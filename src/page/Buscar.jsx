
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import CardProducto from "../components/CardProducto";

function Buscar({ productos, setProductos, agregarAlCarrito }) {

    const [parametros, setParametros] = useSearchParams();

    const [busqueda, setBusqueda] = useState(
        parametros.get("q") || ""
    );

    const [resultados, setResultados] = useState([]);

    const [cargando, setCargando] = useState(false);

    const [buscado, setBuscado] = useState(false);

    // Buscar productos en la API
    async function buscarProductos(e) {

        e.preventDefault();

        if (busqueda.trim() === "") {
            alert("Ingrese el nombre de un producto");
            return;
        }

        setCargando(true);
        setBuscado(false);

        // Guardar la búsqueda en la URL
        setParametros({ q: busqueda });

        try {

            const respuesta = await fetch(
                `https://dummyjson.com/products/search?q=${encodeURIComponent(busqueda)}`
            );

            const datos = await respuesta.json();

            // Convertir los productos de la API
            const productosAPI = datos.products.map(producto => ({

                id: `api-${producto.id}`,
                nombre: producto.title,
                precio: producto.price,
                stock: producto.stock,
                categoria: producto.category,
                imagen: producto.thumbnail,
                descripcion: producto.description,
                origen: "api"

            }));

            setResultados(productosAPI);

            // Guardar los productos en el inventario general
            setProductos(productosActuales => {

                const nuevosProductos = [...productosActuales];

                productosAPI.forEach(producto => {

                    const existe = nuevosProductos.some(
                        p => p.id === producto.id
                    );

                    if (!existe) {
                        nuevosProductos.push(producto);
                    }

                });

                return nuevosProductos;

            });

            setBuscado(true);

        } catch (error) {

            console.error("Error al buscar productos:", error);

            alert("No se pudieron cargar los productos");

        }

        setCargando(false);

    }

    // Limpiar búsqueda
    function limpiarBusqueda() {

        setBusqueda("");
        setResultados([]);
        setBuscado(false);
        setParametros({});

    }

    return (

        <div className="container bg-white p-4 rounded">

            <h2 className="text-center text-primary fw-bold mb-4">
                Buscar Productos
            </h2>

            {/* Formulario de búsqueda */}
            <form onSubmit={buscarProductos}>

                <div className="input-group mb-3">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cargando}
                    >
                        {cargando ? "Buscando..." : "Buscar"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={limpiarBusqueda}
                    >
                        Limpiar
                    </button>

                </div>

            </form>

            {/* Mensaje de carga */}
            {cargando && (

                <div className="text-center text-primary fw-bold">
                    Buscando productos...
                </div>

            )}

            {/* Cantidad de resultados */}
            {buscado && (

                <p className="fw-bold text-primary">
                    Resultados encontrados: {resultados.length}
                </p>

            )}

            {/* Mostrar productos */}
            <div className="row g-3">

                {resultados.map(producto => {

                    // Buscar el producto actualizado en el inventario
                    const productoInventario = productos.find(
                        p => p.id === producto.id
                    );

                    return (

                        <div className="col-md-4" key={producto.id}>

                            <div className="card h-100 shadow-sm">

                                <img
                                    src={producto.imagen}
                                    className="card-img-top p-3"
                                    alt={producto.nombre}
                                    style={{
                                        height: "200px",
                                        objectFit: "contain"
                                    }}
                                />

                                <div className="card-body">

                                    <h5 className="fw-bold">
                                        {producto.nombre}
                                    </h5>

                                    <p>
                                        Precio: ${producto.precio.toFixed(2)}
                                    </p>

                                    <p>
                                        Stock: {
                                            productoInventario
                                                ? productoInventario.stock
                                                : producto.stock
                                        }
                                    </p>

                                    <button
                                        className="btn btn-primary w-100 mb-2"
                                        onClick={() => agregarAlCarrito({
                                            id: producto.id,
                                            nombre: producto.nombre,
                                            precio: producto.precio,
                                            descuento: 0
                                        })}
                                        disabled={
                                            !productoInventario ||
                                            productoInventario.stock <= 0
                                        }
                                    >
                                        Agregar al Carrito
                                    </button>

                                    <Link
                                        to={`/producto/${producto.id}`}
                                        className="btn btn-outline-dark w-100"
                                    >
                                        Ver Detalle
                                    </Link>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            {/* Mensaje cuando no existen resultados */}
            {buscado && resultados.length === 0 && (

                <p className="text-danger fw-bold text-center mt-4">
                    No hay productos que coincidan con la búsqueda.
                </p>

            )}

            <div className="text-center mt-4">

                <Link
                    to="/productos"
                    className="btn btn-outline-primary"
                >
                    Volver a Productos
                </Link>

            </div>

        </div>

    );

}

export default Buscar;
