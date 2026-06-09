-- docs/schema.sql
-- Esquema completo de la base de datos PostgreSQL para Catálogo Panadería.
-- Ejecutar en Supabase: Dashboard → SQL Editor → New query → pegar y ejecutar.

-- =============================================================
-- TABLAS
-- =============================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      varchar(100) NOT NULL,
  email       varchar(255) UNIQUE NOT NULL,
  imagen      text,
  -- valores posibles: cliente, admin
  rol         varchar(20)  NOT NULL DEFAULT 'cliente',
  creado_en   timestamp    DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cuentas_auth (
  id            uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    uuid  NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  -- valores posibles: credentials, google
  proveedor     varchar(50) NOT NULL,
  -- ID que devuelve Google; null si el proveedor es credentials
  proveedor_id  text,
  -- null si el proveedor es Google
  password_hash text,
  creado_en     timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categorias (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      varchar(100) NOT NULL,
  descripcion text,
  imagen      text
);

CREATE TABLE IF NOT EXISTS productos (
  id           uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid           NOT NULL REFERENCES categorias(id),
  nombre       varchar(150)   NOT NULL,
  descripcion  text           NOT NULL,
  precio       decimal(10,2)  NOT NULL,
  stock        integer        NOT NULL DEFAULT 0,
  imagen       text           NOT NULL,
  disponible   boolean        NOT NULL DEFAULT true,
  creado_en    timestamp      DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  uuid          NOT NULL REFERENCES usuarios(id),
  -- valores posibles: pendiente, pagado, cancelado
  estado      varchar(20)   NOT NULL DEFAULT 'pendiente',
  total       decimal(10,2) NOT NULL,
  creado_en   timestamp     DEFAULT now()
);

CREATE TABLE IF NOT EXISTS detalle_pedidos (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id        uuid          NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id      uuid          NOT NULL REFERENCES productos(id),
  cantidad         integer       NOT NULL,
  -- precio al momento de la compra, no el precio actual del producto
  precio_unitario  decimal(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagos (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  -- UNIQUE porque la relación con pedidos es 1 a 1
  pedido_id   uuid          UNIQUE NOT NULL REFERENCES pedidos(id),
  -- valores posibles: Wompi, MercadoPago
  proveedor   varchar(50)   NOT NULL,
  -- ID de la transacción en la pasarela de pago
  referencia  varchar(255)  NOT NULL,
  -- valores posibles: pendiente, aprobado, rechazado
  estado      varchar(20)   NOT NULL DEFAULT 'pendiente',
  monto       decimal(10,2) NOT NULL,
  fecha_pago  timestamp
);

-- =============================================================
-- DATOS DE PRUEBA
-- =============================================================

INSERT INTO categorias (id, nombre, descripcion, imagen) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Masa Madre',  'Panes artesanales fermentados de forma natural con masa madre viva',         null),
  ('22222222-2222-2222-2222-222222222222', 'Pastelería',  'Croissants, hojaldres y panes dulces elaborados con mantequilla francesa',   null),
  ('33333333-3333-3333-3333-333333333333', 'Repostería',  'Tortas, brownies y postres caseros horneados a diario',                      null),
  ('44444444-4444-4444-4444-444444444444', 'Bebidas',     'Café de origen colombiano, chocolate y bebidas calientes de temporada',      null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, imagen, disponible) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Pan de Masa Madre',
    'Hogaza de pan rústico elaborada con masa madre de 48 horas. Corteza crujiente y miga alveolada con sabor ligeramente ácido.',
    18000.00, 15, '/images/pan-masa-madre.jpg', true
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Baguette de Masa Madre',
    'Baguette artesanal de fermentación lenta. Perfecta para acompañar con mantequilla o quesos locales.',
    12000.00, 20, '/images/baguette-masa-madre.jpg', true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Croissant de Mantequilla',
    'Croissant hojaldrado con mantequilla francesa 84% materia grasa. Dorado por fuera, suave y laminado por dentro.',
    5500.00, 30, '/images/croissant-mantequilla.jpg', true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Torta de Chocolate',
    'Torta húmeda de chocolate negro 70% cacao, con ganache y cobertura de cacao en polvo. Porción individual.',
    42000.00, 8, '/images/torta-chocolate.jpg', true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Café Americano',
    'Café negro de origen Huila, tostado medio, preparado en prensa francesa. Acidez suave y notas a caramelo.',
    3500.00, 100, '/images/cafe-americano.jpg', true
  );
