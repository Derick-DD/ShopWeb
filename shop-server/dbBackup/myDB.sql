--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    phone character varying(20) NOT NULL,
    district character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    "addressName" character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    "addressDetail" character varying(255) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    count integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "productId" uuid NOT NULL,
    "userId" uuid NOT NULL
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    total numeric(10,2) NOT NULL,
    pend boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    name character varying(50) NOT NULL,
    phone character varying(20) NOT NULL,
    "addressInfo" character varying(255) NOT NULL,
    pay_time timestamp with time zone,
    "paypalId" character varying,
    currency character varying(10) DEFAULT 'HKD'::character varying NOT NULL,
    payee character varying(80) NOT NULL,
    hide boolean DEFAULT false NOT NULL,
    "toRefund" boolean DEFAULT false NOT NULL,
    "ifRefund" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    count integer NOT NULL,
    "orderId" uuid,
    name character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    "imagePath" character varying(255) DEFAULT 'default-product-img.png'::character varying NOT NULL,
    "productId" character varying NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(17) NOT NULL,
    password character varying NOT NULL,
    email character varying(80) NOT NULL,
    avatar character varying(100) DEFAULT ''::character varying NOT NULL,
    biography character varying(255) DEFAULT ''::character varying NOT NULL,
    role smallint DEFAULT '0'::smallint NOT NULL,
    refresh_token character varying DEFAULT ''::character varying NOT NULL,
    recovery_key character varying DEFAULT ''::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_banned boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "googleId" character varying,
    "googleEmail" character varying(80)
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    name character varying(50) NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    name character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    description character varying(255),
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "categoryId" uuid,
    "imagePath" character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    description character varying(255) DEFAULT ''::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    "categoryId" uuid,
    "imagePath" character varying(255) DEFAULT 'default-product-img.png'::character varying NOT NULL
);


ALTER TABLE public.product_entity OWNER TO postgres;

--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, name, phone, district, created_at, updated_at, "userId", "addressName", address, "addressDetail") FROM stdin;
b0403ef0-f304-46b1-81dd-afcf9ee6e669	test	852-61000000	Tsuen Wan	2024-04-11 11:05:41.828399+00	2024-04-11 11:05:41.828399+00	a1b5a179-ffb6-4b40-b03d-1b867a32520e	Yan Chai Hospital A Block	3/f, 121-129 Tsuen Wan Market St, Tsuen Wan	B1 
163b8509-51fe-43ea-8b61-85f845e04826	superName	852-90000000	Sham Shui Po	2024-04-11 16:00:35.903346+00	2024-04-11 16:00:35.903346+00	87fac5cd-56ca-4916-bbbc-10e1c8238dc7	Super Tower	17 Dianthus Road|4 Cassia Road	test
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, count, created_at, updated_at, "productId", "userId") FROM stdin;
eeb895d5-64ef-4da8-a343-aaff660ff98a	1	2024-04-13 17:03:03.091533+00	2024-04-13 17:03:03.091533+00	9212a08d-7884-4cf6-a241-cf18b0857466	a1b5a179-ffb6-4b40-b03d-1b867a32520e
133f4fc2-8d08-4ef0-b195-7126382946e9	1	2024-03-31 14:12:30.372227+00	2024-03-31 14:12:30.372227+00	2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53	ea3e0f9b-113b-4ff7-9671-d3f8ed63f32c
65d83f5c-aef2-46db-88b4-d9a2dd1df96c	10	2024-05-10 10:16:34.492362+00	2024-05-10 10:16:34.492362+00	9212a08d-7884-4cf6-a241-cf18b0857466	87fac5cd-56ca-4916-bbbc-10e1c8238dc7
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, created_at, updated_at) FROM stdin;
73b32cab-d4fb-4cc7-901e-994af87bdc64	Electronic	2024-03-17 09:39:44.581721+00	2024-05-02 09:14:37.828335+00
0224875f-074c-4233-be98-9b54cb2e5107	Clothes	2024-03-17 09:39:59.158262+00	2024-05-02 09:38:16.458398+00
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, total, pend, created_at, updated_at, "userId", name, phone, "addressInfo", pay_time, "paypalId", currency, payee, hide, "toRefund", "ifRefund") FROM stdin;
51a7d08d-b333-416a-8b4b-d223e2b78288	49.99	t	2024-04-13 16:28:16.951922+00	2024-04-13 16:28:31.653107+00	a1b5a179-ffb6-4b40-b03d-1b867a32520e	test	852-61000000	{"addressName":"Yan Chai Hospital A Block","address":"3/f, 121-129 Tsuen Wan Market St, Tsuen Wan","district":"Tsuen Wan","addressDetail":"B1 "}	2024-04-13 16:28:31.647+00	\N	HKD	sb-5mytv30277445@business.example.com	f	f	f
e6aa4bcc-a140-4da1-aac9-f537d06efeb1	2999.98	f	2024-05-10 08:17:34.680997+00	2024-05-10 08:17:34.680997+00	87fac5cd-56ca-4916-bbbc-10e1c8238dc7	superName	852-90000000	{"addressName":"Super Tower","address":"17 Dianthus Road|4 Cassia Road","district":"Sham Shui Po","addressDetail":"test"}	\N	\N	HKD	sb-5mytv30277445@business.example.com	f	f	f
ddbd0fa8-b1e5-4065-94db-839ee37ea3a0	2999.98	f	2024-05-10 08:18:07.368411+00	2024-05-10 08:18:07.368411+00	87fac5cd-56ca-4916-bbbc-10e1c8238dc7	superName	852-90000000	{"addressName":"Super Tower","address":"17 Dianthus Road|4 Cassia Road","district":"Sham Shui Po","addressDetail":"test"}	\N	\N	HKD	sb-5mytv30277445@business.example.com	f	f	f
c71fcc27-60f6-406e-80ba-b424ff4ff707	8499.98	f	2024-05-10 08:31:13.887506+00	2024-05-10 08:31:13.887506+00	87fac5cd-56ca-4916-bbbc-10e1c8238dc7	superName	852-90000000	{"addressName":"Super Tower","address":"17 Dianthus Road|4 Cassia Road","district":"Sham Shui Po","addressDetail":"test"}	\N	\N	HKD	sb-5mytv30277445@business.example.com	f	f	f
d4c8ed52-abc2-4d1e-ac0b-b4a7f7fcba25	8499.98	f	2024-05-10 08:33:44.558259+00	2024-05-10 08:33:44.558259+00	87fac5cd-56ca-4916-bbbc-10e1c8238dc7	superName	852-90000000	{"addressName":"Super Tower","address":"17 Dianthus Road|4 Cassia Road","district":"Sham Shui Po","addressDetail":"test"}	\N	\N	HKD	sb-5mytv30277445@business.example.com	f	f	f
4b5729ef-5c22-431b-a524-633599d13418	199.98	t	2024-05-10 08:35:40.998361+00	2024-05-10 08:35:54.071234+00	87fac5cd-56ca-4916-bbbc-10e1c8238dc7	superName	852-90000000	{"addressName":"Super Tower","address":"17 Dianthus Road|4 Cassia Road","district":"Sham Shui Po","addressDetail":"test"}	2024-05-10 08:35:54.065+00	\N	HKD	sb-5mytv30277445@business.example.com	f	f	f
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, count, "orderId", name, price, "imagePath", "productId") FROM stdin;
07809bb3-7472-48fb-91d0-bf5e56db6007	1	51a7d08d-b333-416a-8b4b-d223e2b78288	Jeans	49.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/067bb8da-a71c-41b9-b9ce-27ada1711b49-jeans.jpg	067bb8da-a71c-41b9-b9ce-27ada1711b49
8b63bbed-f2a5-4abf-aff3-e647974dd1a9	2	e6aa4bcc-a140-4da1-aac9-f537d06efeb1	Headphones	1499.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/9212a08d-7884-4cf6-a241-cf18b0857466-headphone.jpg	9212a08d-7884-4cf6-a241-cf18b0857466
34ea14de-c5e8-4630-a4c5-efef506670b6	2	ddbd0fa8-b1e5-4065-94db-839ee37ea3a0	Headphones	1499.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/9212a08d-7884-4cf6-a241-cf18b0857466-headphone.jpg	9212a08d-7884-4cf6-a241-cf18b0857466
d8395f8e-feeb-453a-a926-5cbbdfde5425	1	c71fcc27-60f6-406e-80ba-b424ff4ff707	Headphones	1499.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/9212a08d-7884-4cf6-a241-cf18b0857466-headphone.jpg	9212a08d-7884-4cf6-a241-cf18b0857466
7817cd5d-02d9-44f0-8dca-8371756d0f4e	1	c71fcc27-60f6-406e-80ba-b424ff4ff707	Smartphone	6999.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53-smartphone.jpg	2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53
28dc29d4-dfc7-422d-b6e2-3c692bc48454	1	d4c8ed52-abc2-4d1e-ac0b-b4a7f7fcba25	Headphones	1499.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/9212a08d-7884-4cf6-a241-cf18b0857466-headphone.jpg	9212a08d-7884-4cf6-a241-cf18b0857466
a61cbf02-8f39-4b22-903b-35605ef765d6	1	d4c8ed52-abc2-4d1e-ac0b-b4a7f7fcba25	Smartphone	6999.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53-smartphone.jpg	2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53
e039714c-40e8-4cfd-9ad1-513c7caa1c47	2	4b5729ef-5c22-431b-a524-633599d13418	T-Shirt	99.99	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/13e7de03-1e6b-4b33-bc2f-6742d2de804c-T-shirt.jpg	13e7de03-1e6b-4b33-bc2f-6742d2de804c
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, username, password, email, avatar, biography, role, refresh_token, recovery_key, is_active, is_banned, created_at, updated_at, "googleId", "googleEmail") FROM stdin;
87fac5cd-56ca-4916-bbbc-10e1c8238dc7	super	$argon2id$v=19$m=65536,t=3,p=4$pM7EvqY9Dje/qIfILUrh1A$zgZ9cC5MMqC3D1/BuE6s5Ht1qhodmecNqyqHBm/Xs/g	super@super.com			2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3ZmFjNWNkLTU2Y2EtNDkxNi1iYmJjLTEwZTFjODIzOGRjNyIsInVzZXJuYW1lIjoic3VwZXIiLCJpYXQiOjE3MTIzMTQ3Mjc1NTJ9.ROuPjn9JglUHOSrAnmS-vbxDuRVnuc-75JvEkpK4oqA		t	f	2024-03-11 15:30:56.25292+00	2024-04-05 10:58:47.556585+00	\N	\N
a1b5a179-ffb6-4b40-b03d-1b867a32520e	derickd	$argon2id$v=19$m=65536,t=3,p=4$MYeeHREggvxMikRK1rw23Q$RREB2BUCnaeHvFk73vn+vPPRvCz0E66K4kcA8ennFno	2564363682@qq.com			0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImExYjVhMTc5LWZmYjYtNGI0MC1iMDNkLTFiODY3YTMyNTIwZSIsInVzZXJuYW1lIjoiZGVyaWNrZCIsImlhdCI6MTcxMjczNTkwNTg0N30.twOomPb3aXkiEtEZOq3knUZr6F5ux3FW-buHuCy768c		t	f	2024-04-07 16:04:03.321637+00	2024-04-10 07:58:25.851752+00	\N	\N
197bc223-3765-4e3a-aac1-b7339be0a4e1	derick	test123	846765391@qq.com			0			t	f	2024-05-10 09:53:04.07771+00	2024-05-10 09:53:04.07771+00	101999460026934884482	2564363682@qq.com
ea3e0f9b-113b-4ff7-9671-d3f8ed63f32c	normal	$argon2id$v=19$m=65536,t=3,p=4$pI3/6qObS7J/lGHq1SStxw$Q1fkwudI23siXVit8yUCVrySXMUcam2Kj7O4SLTPZS4	normal@163.com			0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhM2UwZjliLTExM2ItNGZmNy05NjcxLWQzZjhlZDYzZjMyYyIsInVzZXJuYW1lIjoibm9ybWFsIiwiaWF0IjoxNzExODk0NDEzNzgwfQ.K1mVdC1GMrWoEuWn0FV2fMTnVQi2vFOJXNPL1vq4vno		t	f	2024-03-30 15:43:25.671156+00	2024-04-01 07:48:19.882387+00	\N	\N
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (name, id, created_at, updated_at) FROM stdin;
Clothes	ac817453-3103-4ece-8c43-9bf6a02a6082	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
Electronic	90bb0109-18f0-4a63-a3ea-ac833bab265c	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (name, price, description, id, "categoryId", "imagePath", created_at, updated_at) FROM stdin;
Jeans	49.99	Classic denim jeans that are durable and stylish.	fc6d3dd1-048f-4762-a7a4-2bcdf05e52ed	ac817453-3103-4ece-8c43-9bf6a02a6082	uploads/aa3173d7-a659-4fdf-854a-61a7057af076-jeans.jpg	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
T-shirt	19.99	A good T-shirt	ad3019b6-3466-44ca-8136-17ff15465b8a	ac817453-3103-4ece-8c43-9bf6a02a6082	uploads/d4f485eb-58e8-4682-9670-84e0100a3e53-T-shirt.jpg	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
Laptop	999.90	A powerful and sleek laptop for all your computing needs.	ce0867f8-ee75-4e89-8677-38112886bf12	90bb0109-18f0-4a63-a3ea-ac833bab265c	uploads/d0596ad5-4e40-423c-b991-e53bc2e75b34-Laptop.jpg	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
Laptop2	99.90	Demo description for a product.	0ebbeeb3-05df-45fd-865b-d70742671e44	90bb0109-18f0-4a63-a3ea-ac833bab265c	uploads/demo.jpeg	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
Smartphone	99.90	A cutting-edge smartphone with advanced features and a sleek design.	d0b28ec4-7bfe-4af7-a033-ea00cfff2385	90bb0109-18f0-4a63-a3ea-ac833bab265c	uploads/21d83b80-09c9-4622-8863-794400526fb4-smartphone.jpg	2024-04-01 17:09:39.003482	2024-04-01 17:09:39.003482
\.


--
-- Data for Name: product_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_entity (id, name, price, description, created_at, updated_at, "categoryId", "imagePath") FROM stdin;
9212a08d-7884-4cf6-a241-cf18b0857466	Headphones	1499.99	Premium headphones that deliver exceptional sound quality and comfort. test edit	2024-03-17 12:37:29.092463+00	2024-05-02 09:38:25.958315+00	73b32cab-d4fb-4cc7-901e-994af87bdc64	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/9212a08d-7884-4cf6-a241-cf18b0857466-headphone.jpg
2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53	Smartphone	6999.99	A cutting-edge smartphone with advanced features and a sleek design.	2024-03-17 12:39:03.197415+00	2024-05-02 09:38:32.02661+00	73b32cab-d4fb-4cc7-901e-994af87bdc64	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/2a50de25-15c8-4e3a-b2dc-6d9f1e3f0c53-smartphone.jpg
13e7de03-1e6b-4b33-bc2f-6742d2de804c	T-Shirt	99.99	A comfortable and stylish t-shirt for everyday wear.	2024-03-17 12:40:01.727787+00	2024-05-02 09:38:41.388024+00	0224875f-074c-4233-be98-9b54cb2e5107	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/13e7de03-1e6b-4b33-bc2f-6742d2de804c-T-shirt.jpg
067bb8da-a71c-41b9-b9ce-27ada1711b49	Jeans	199.99	Classic denim jeans that are durable and stylish.	2024-03-17 12:39:36.145674+00	2024-05-02 09:38:48.047876+00	0224875f-074c-4233-be98-9b54cb2e5107	https://shopxx-bucket.s3.ap-northeast-2.amazonaws.com/products/067bb8da-a71c-41b9-b9ce-27ada1711b49-jeans.jpg
\.


--
-- Name: Cart PK_012c8ac0dc98012aed2f7766e01; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "PK_012c8ac0dc98012aed2f7766e01" PRIMARY KEY (id);


--
-- Name: Order PK_3d5a3861d8f9a6db372b2b317b7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "PK_3d5a3861d8f9a6db372b2b317b7" PRIMARY KEY (id);


--
-- Name: OrderItem PK_6bdc02af31674c4216a6b0a8b39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "PK_6bdc02af31674c4216a6b0a8b39" PRIMARY KEY (id);


--
-- Name: product_entity PK_6e8f75045ddcd1c389c765c896e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_entity
    ADD CONSTRAINT "PK_6e8f75045ddcd1c389c765c896e" PRIMARY KEY (id);


--
-- Name: Address PK_9034683839599c80ebe9ebb0891; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "PK_9034683839599c80ebe9ebb0891" PRIMARY KEY (id);


--
-- Name: User PK_9862f679340fb2388436a5ab3e4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY (id);


--
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- Name: Category PK_c2727780c5b9b0c564c29a4977c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "PK_c2727780c5b9b0c564c29a4977c" PRIMARY KEY (id);


--
-- Name: User UQ_02dec29f4ca814ab6efa2d4f0c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UQ_02dec29f4ca814ab6efa2d4f0c4" UNIQUE ("googleId");


--
-- Name: Category UQ_0ac420e8701e781dbf1231dc230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "UQ_0ac420e8701e781dbf1231dc230" UNIQUE (name);


--
-- Name: Order UQ_0e02315d1ac00c15896fb9fdd81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "UQ_0e02315d1ac00c15896fb9fdd81" UNIQUE ("paypalId");


--
-- Name: product UQ_22cc43e9a74d7498546e9a63e77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE (name);


--
-- Name: category UQ_23c05c292c439d77b0de816b500; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE (name);


--
-- Name: User UQ_29a05908a0fa0728526d2833657; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UQ_29a05908a0fa0728526d2833657" UNIQUE (username);


--
-- Name: User UQ_4a257d2c9837248d70640b3e36e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE (email);


--
-- Name: User UQ_57ecefbce2a5323ada1b359cee0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "UQ_57ecefbce2a5323ada1b359cee0" UNIQUE ("googleEmail");


--
-- Name: product_entity UQ_ebbac2bbbf7cb3bbec225dcf1e1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_entity
    ADD CONSTRAINT "UQ_ebbac2bbbf7cb3bbec225dcf1e1" UNIQUE (name);


--
-- Name: Address FK_08a96a002044d5ca902ce834d97; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "FK_08a96a002044d5ca902ce834d97" FOREIGN KEY ("userId") REFERENCES public."User"(id);


--
-- Name: product_entity FK_641188cadea80dfe98d4c769ebf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_entity
    ADD CONSTRAINT "FK_641188cadea80dfe98d4c769ebf" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id);


--
-- Name: Cart FK_82319cc9ffd1aae85a80975efc6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "FK_82319cc9ffd1aae85a80975efc6" FOREIGN KEY ("productId") REFERENCES public.product_entity(id);


--
-- Name: Cart FK_c93d6f0ae7b8bcae9439e871ab1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "FK_c93d6f0ae7b8bcae9439e871ab1" FOREIGN KEY ("userId") REFERENCES public."User"(id);


--
-- Name: OrderItem FK_c94ace27164b9ffde93ebdbe95c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "FK_c94ace27164b9ffde93ebdbe95c" FOREIGN KEY ("orderId") REFERENCES public."Order"(id);


--
-- Name: Order FK_cdc25a0a42e8f451020a26680b3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "FK_cdc25a0a42e8f451020a26680b3" FOREIGN KEY ("userId") REFERENCES public."User"(id);


--
-- Name: product FK_ff0c0301a95e517153df97f6812; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES public.category(id);


--
-- PostgreSQL database dump complete
--

