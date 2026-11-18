
import { useState, useEffect } from 'react';

function CatalogoWeb({ productos, setProductos, agregarAlCarrito }) {

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const cargarProductos = async () => {

            try {

                const response = await fetch("https://dummyjson.com/products");

                if (!response.ok) {
                    throw new Error("Error al consultar los productos");
                }

                const data = await response.json();

                const productosAPI = data.products.map(producto => ({

                    id: `api-${producto.id}`,
                    nombre: producto.title,
                    precio: producto.price,
                    stock: producto.stock,
                    imagen: producto.thumbnail,
                    categoria: "Catalogo Web",
                    origen: "api"

                }));

                // Agregar los productos al inventario general
                setProductos(prevProductos => {

                    let nuevosProductos = productosAPI.filter(producto =>
                        !prevProductos.some(p => p.id === producto.id)
                    );

                    return [...prevProductos, ...nuevosProductos];

                });

                console.log("Productos recibidos:", productosAPI);

            } catch (error) {

                console.log(error);
                setError("No se pudieron cargar los productos");

            } finally {

                setCargando(false);

            }

        };

        if (!productos.some(p => p.origen === "api")) {
            cargarProductos();
        } else {
            setCargando(false);
        }

    }, []);

    let productosAPI = productos.filter(
        producto => producto.origen === "api"
    );

    return (

        <div className="container mt-4">

            <h2 className="text-center mb-4 text-white">
                Catálogo de Productos
            </h2>

            {cargando ? (

                <p className="text-center text-white">
                    Cargando productos...
                </p>

            ) : error ? (

                <p className="text-danger text-center">
                    {error}
                </p>

            ) : (

                <div className="row">

                    {productosAPI.map(producto => (

                        <div className="col-md-4 mb-3" key={producto.id}>

                            <div className="card p-3 h-100">

                                <img
                                    src={producto.imagen}
                                    className="card-img-top"
                                    alt={producto.nombre}
                                    style={{
                                        height: "180px",
                                        objectFit: "contain"
                                    }}
                                />

                                <div className="card-body">

                                    <h5>{producto.nombre}</h5>

                                    <p>Precio: ${producto.precio}</p>

                                    <p>Stock: {producto.stock}</p>

                                    <button
                                        className="btn btn-primary w-100"
                                        disabled={producto.stock <= 0}
                                        onClick={() => agregarAlCarrito({
                                            id: producto.id,
                                            nombre: producto.nombre,
                                            precio: producto.precio,
                                            descuento: 0
                                        })}
                                    >
                                        {producto.stock > 0
                                            ? "Agregar al carrito"
                                            : "Agotado"
                                        }
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default CatalogoWeb;
