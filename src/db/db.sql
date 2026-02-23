--
-- PostgreSQL database dump
--

\restrict D8vd5YXgtBzeLby9sZxBhusZrODtSKxnk3bXgi69plbX5YP4dYEv4E7n7z0xtkr

-- Dumped from database version 18.1 (Ubuntu 18.1-1.pgdg24.04+2)
-- Dumped by pg_dump version 18.1 (Ubuntu 18.1-1.pgdg24.04+2)

-- Started on 2026-02-23 17:08:20 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 21160)
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 21159)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO postgres;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 221
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- TOC entry 223 (class 1259 OID 21179)
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: aryan
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO aryan;

--
-- TOC entry 220 (class 1259 OID 21144)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 21143)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3316 (class 2604 OID 21163)
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 3314 (class 2604 OID 21147)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3479 (class 0 OID 21160)
-- Dependencies: 222
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, user_id, title, content, created_at, updated_at) FROM stdin;
2	1	first note bym e	hello buddy light weight	2026-02-23 15:39:49.362446	2026-02-23 15:39:49.362446
3	1	first note bym e	hello buddy light weight	2026-02-23 15:56:49.723538	2026-02-23 15:56:49.723538
\.


--
-- TOC entry 3480 (class 0 OID 21179)
-- Dependencies: 223
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: aryan
--

COPY public.user_sessions (sid, sess, expire) FROM stdin;
GAH4XmA40yZjTIEttj0Ph6skC2SCzoQD	{"cookie":{"originalMaxAge":86400000,"expires":"2026-02-24T10:24:53.938Z","secure":false,"httpOnly":true,"path":"/"},"userId":1}	2026-02-24 15:59:43
\.


--
-- TOC entry 3477 (class 0 OID 21144)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at) FROM stdin;
1	aryan	aryan26zzz@gmail.com	$2b$10$aAHTWucdWuByyQ/cmo67v.oTl0SlQCtKDPOW9mUO4lEZzlIJZc9vm	2026-02-23 12:41:48.423316
\.


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 221
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_seq', 3, true);


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 3324 (class 2606 OID 21173)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 21188)
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: aryan
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 3320 (class 2606 OID 21158)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3322 (class 2606 OID 21156)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 1259 OID 21189)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: aryan
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- TOC entry 3328 (class 2606 OID 21174)
-- Name: notes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-02-23 17:08:20 IST

--
-- PostgreSQL database dump complete
--

\unrestrict D8vd5YXgtBzeLby9sZxBhusZrODtSKxnk3bXgi69plbX5YP4dYEv4E7n7z0xtkr

