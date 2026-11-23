
import { useState } from "react";
import { Link } from "react-router-dom";

function CardProducto({ producto, agregarAlCarrito }) {

    const [descuento, setDescuento] = useState("0");

    let iva = 0.15;

    let precioConIVA = producto.precio * (1 + iva);

    let porcentaje = Number(descuento) || 0;

    if (porcentaje > 100) {
        porcentaje = 100;
    }

    if (porcentaje < 0) {
        porcentaje = 0;
    }

    let totalDescuento = precioConIVA -
        (precioConIVA * porcentaje / 100);

    // Agregar producto al carrito
    function agregarProducto() {

        agregarAlCarrito({

            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            descuento: porcentaje

        });

    }

    return (

        <div className="card h-100 shadow-sm">

            <div className="card-body">

                <h5 className="card-title text-black fw-bold">
                    {producto.nombre}
                </h5>

                <p className="fw-bold">
                    Precio: ${producto.precio.toFixed(2)}
                </p>

                <p className="fw-bold">
                    Precio con IVA: ${precioConIVA.toFixed(2)}
                </p>

                <span className={`badge ${
                    producto.stock > 0 ? 'bg-success' : 'bg-danger'
                }`}>
                    {producto.stock > 0 ? 'Disponible' : 'Agotado'}
                </span>

                <br /><br />

                <span className={
                    producto.stock > 10 ? 'bg-success badge' :
                    producto.stock < 5 ? 'bg-danger badge' :
                    'bg-warning badge'
                }>
                    {producto.stock > 10
                        ? `Disponible (${producto.stock})`
                        : producto.stock <= 0
                            ? 'Sin stock'
                            : `Stock Bajo (${producto.stock})`
                    }
                </span>

                <br /><br />

                <button
                    onClick={agregarProducto}
                    className="btn btn-primary w-100 mb-2"
                    disabled={producto.stock <= 0}
                >
                    Agregar al Carrito
                </button>

                <button
                    className="btn btn-warning w-100 mb-2"
                    onClick={agregarProducto}
                    disabled={producto.stock <= 0}
                >
                    Comprar Ahora
                </button>

                {/* Ir al detalle del producto */}
                {typeof producto.id === "number" ||
                 String(producto.id).startsWith("api-") ? (

                    <Link
                        to={`/producto/${producto.id}`}
                        className="btn btn-outline-dark w-100"
                    >
                        Ver Detalle
                    </Link>

                ) : null}

                <label className="form-label fw-bold mt-3">
                    Descuento (%)
                </label>

                <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    placeholder="Ingrese el descuento"
                    value={descuento}
                    onChange={(e) => setDescuento(e.target.value)}
                />

                <p className="mt-2 mb-0">
                    Total con descuento:
                </p>

                <h5 className="text-success fw-bold">
                    ${totalDescuento.toFixed(2)}
                </h5>

            </div>

        </div>

    );

}

export default CardProducto;
