--
-- PostgreSQL database dump
--

\restrict eO9YCnFWoqIMuo9Gv1HMmNwRRse2QlMliMTXDZWZARog8vlnTgkcQc9Cyi6t2gf

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2026-03-09 23:55:15

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

--
-- TOC entry 5 (class 2615 OID 128359)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5306 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 929 (class 1247 OID 128448)
-- Name: ApplyStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApplyStatus" AS ENUM (
    'PENDING',
    'VIEWED',
    'SELECTED',
    'NOTSELECT',
    'INTOUCH'
);


ALTER TYPE public."ApplyStatus" OWNER TO postgres;

--
-- TOC entry 905 (class 1247 OID 128378)
-- Name: AuthType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuthType" AS ENUM (
    'EMAIL',
    'OAUTH'
);


ALTER TYPE public."AuthType" OWNER TO postgres;

--
-- TOC entry 917 (class 1247 OID 128406)
-- Name: Degree; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Degree" AS ENUM (
    'BACHELOR',
    'MASTER',
    'PHD'
);


ALTER TYPE public."Degree" OWNER TO postgres;

--
-- TOC entry 911 (class 1247 OID 128390)
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- TOC entry 926 (class 1247 OID 128438)
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."JobStatus" AS ENUM (
    'PENDING',
    'ACTIVE',
    'EXPIRED',
    'REJECTED'
);


ALTER TYPE public."JobStatus" OWNER TO postgres;

--
-- TOC entry 914 (class 1247 OID 128398)
-- Name: Level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Level" AS ENUM (
    'NATIVE',
    'FLUENT',
    'BASIC'
);


ALTER TYPE public."Level" OWNER TO postgres;

--
-- TOC entry 908 (class 1247 OID 128384)
-- Name: OTPFor; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OTPFor" AS ENUM (
    'VERIFICATION',
    'FORGOT_PASSWORD'
);


ALTER TYPE public."OTPFor" OWNER TO postgres;

--
-- TOC entry 938 (class 1247 OID 128482)
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'SUCCESSFUL',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 128460)
-- Name: RecruiterPackageStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RecruiterPackageStatus" AS ENUM (
    'ACTIVE',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."RecruiterPackageStatus" OWNER TO postgres;

--
-- TOC entry 902 (class 1247 OID 128370)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'RECRUITER',
    'CANDIDATE'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 935 (class 1247 OID 128468)
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'CREATED',
    'ACTIVE',
    'PAUSED',
    'CANCELLED',
    'COMPLETED',
    'HALTED'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO postgres;

--
-- TOC entry 923 (class 1247 OID 128422)
-- Name: TeamSizeRange; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TeamSizeRange" AS ENUM (
    'ZERO_TO_ONE',
    'TWO_TO_TEN',
    'ELEVEN_TO_FIFTY',
    'FIFTY_ONE_TO_TWO_HUNDRED',
    'TWO_HUNDRED_ONE_TO_FIVE_HUNDRED',
    'FIVE_HUNDRED_ONE_TO_ONE_THOUSAND',
    'OVER_ONE_THOUSAND'
);


ALTER TYPE public."TeamSizeRange" OWNER TO postgres;

--
-- TOC entry 920 (class 1247 OID 128414)
-- Name: WorkPlace; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkPlace" AS ENUM (
    'ONSITE',
    'REMOTE',
    'HYBRID'
);


ALTER TYPE public."WorkPlace" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 253 (class 1259 OID 128668)
-- Name: Apply; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Apply" (
    id integer NOT NULL,
    "applyDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."ApplyStatus" DEFAULT 'PENDING'::public."ApplyStatus" NOT NULL,
    "companyId" integer NOT NULL,
    "candidateProfileId" integer NOT NULL,
    "jobId" integer NOT NULL
);


ALTER TABLE public."Apply" OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 128667)
-- Name: Apply_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Apply_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Apply_id_seq" OWNER TO postgres;

--
-- TOC entry 5308 (class 0 OID 0)
-- Dependencies: 252
-- Name: Apply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Apply_id_seq" OWNED BY public."Apply".id;


--
-- TOC entry 223 (class 1259 OID 128512)
-- Name: AuthOTP; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuthOTP" (
    id integer NOT NULL,
    "otpCode" integer,
    "expiresAt" timestamp(3) without time zone,
    "lastOtpSentAt" timestamp(3) without time zone,
    "resendCount" integer DEFAULT 0 NOT NULL,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockUntil" timestamp(3) without time zone,
    "otpFor" public."OTPFor" DEFAULT 'VERIFICATION'::public."OTPFor" NOT NULL,
    "resetToken" text,
    "userId" integer NOT NULL
);


ALTER TABLE public."AuthOTP" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 128511)
-- Name: AuthOTP_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuthOTP_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuthOTP_id_seq" OWNER TO postgres;

--
-- TOC entry 5309 (class 0 OID 0)
-- Dependencies: 222
-- Name: AuthOTP_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuthOTP_id_seq" OWNED BY public."AuthOTP".id;


--
-- TOC entry 250 (class 1259 OID 128653)
-- Name: Benefit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Benefit" (
    name text NOT NULL
);


ALTER TABLE public."Benefit" OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 128556)
-- Name: CandidateEducation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CandidateEducation" (
    major text NOT NULL,
    degree public."Degree" DEFAULT 'BACHELOR'::public."Degree" NOT NULL,
    "yearStart" integer NOT NULL,
    "yearEnd" integer NOT NULL,
    "candidateProfileId" integer NOT NULL,
    "educationId" integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."CandidateEducation" OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 130027)
-- Name: CandidateEducation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CandidateEducation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CandidateEducation_id_seq" OWNER TO postgres;

--
-- TOC entry 5310 (class 0 OID 0)
-- Dependencies: 266
-- Name: CandidateEducation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CandidateEducation_id_seq" OWNED BY public."CandidateEducation".id;


--
-- TOC entry 236 (class 1259 OID 128581)
-- Name: CandidateExperience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CandidateExperience" (
    id integer NOT NULL,
    "companyName" text NOT NULL,
    department text NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date,
    "position" text NOT NULL,
    description text NOT NULL,
    "currentlyWorking" boolean DEFAULT false NOT NULL,
    "workPlace" public."WorkPlace" DEFAULT 'ONSITE'::public."WorkPlace" NOT NULL,
    location text NOT NULL,
    "candidateProfileId" integer NOT NULL
);


ALTER TABLE public."CandidateExperience" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 128580)
-- Name: CandidateExperience_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CandidateExperience_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CandidateExperience_id_seq" OWNER TO postgres;

--
-- TOC entry 5311 (class 0 OID 0)
-- Dependencies: 235
-- Name: CandidateExperience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CandidateExperience_id_seq" OWNED BY public."CandidateExperience".id;


--
-- TOC entry 227 (class 1259 OID 128541)
-- Name: CandidateLanguage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CandidateLanguage" (
    level public."Level" DEFAULT 'BASIC'::public."Level" NOT NULL,
    "candidateProfileId" integer NOT NULL,
    "languageName" text NOT NULL
);


ALTER TABLE public."CandidateLanguage" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 128524)
-- Name: CandidateProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CandidateProfile" (
    id integer NOT NULL,
    "fullName" text NOT NULL,
    gender public."Gender" NOT NULL,
    phone text NOT NULL,
    cv text,
    "birthDate" date NOT NULL,
    address text NOT NULL,
    "openToWork" boolean DEFAULT false NOT NULL,
    status boolean DEFAULT true NOT NULL,
    "userId" integer NOT NULL,
    summary text NOT NULL
);


ALTER TABLE public."CandidateProfile" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 128523)
-- Name: CandidateProfile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CandidateProfile_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CandidateProfile_id_seq" OWNER TO postgres;

--
-- TOC entry 5312 (class 0 OID 0)
-- Dependencies: 224
-- Name: CandidateProfile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CandidateProfile_id_seq" OWNED BY public."CandidateProfile".id;


--
-- TOC entry 234 (class 1259 OID 128574)
-- Name: CandidateSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CandidateSkill" (
    id integer NOT NULL,
    "candidateProfileId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."CandidateSkill" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 128573)
-- Name: CandidateSkill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CandidateSkill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CandidateSkill_id_seq" OWNER TO postgres;

--
-- TOC entry 5313 (class 0 OID 0)
-- Dependencies: 233
-- Name: CandidateSkill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CandidateSkill_id_seq" OWNED BY public."CandidateSkill".id;


--
-- TOC entry 265 (class 1259 OID 128728)
-- Name: Chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Chat" (
    id integer NOT NULL,
    "candidateProfileId" integer NOT NULL,
    "companyId" integer NOT NULL,
    "chatRoomId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "candidateUnreadCount" integer DEFAULT 0 NOT NULL,
    "companyUnreadCount" integer DEFAULT 0 NOT NULL,
    "lastMessage" text,
    "lastMessageAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Chat" OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 128727)
-- Name: Chat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Chat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Chat_id_seq" OWNER TO postgres;

--
-- TOC entry 5314 (class 0 OID 0)
-- Dependencies: 264
-- Name: Chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Chat_id_seq" OWNED BY public."Chat".id;


--
-- TOC entry 257 (class 1259 OID 128687)
-- Name: CheckLimitForRecruiter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CheckLimitForRecruiter" (
    id integer NOT NULL,
    "jobCount" integer DEFAULT 0 NOT NULL,
    "recruiterId" integer NOT NULL
);


ALTER TABLE public."CheckLimitForRecruiter" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 128686)
-- Name: CheckLimitForRecruiter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CheckLimitForRecruiter_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CheckLimitForRecruiter_id_seq" OWNER TO postgres;

--
-- TOC entry 5315 (class 0 OID 0)
-- Dependencies: 256
-- Name: CheckLimitForRecruiter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CheckLimitForRecruiter_id_seq" OWNED BY public."CheckLimitForRecruiter".id;


--
-- TOC entry 238 (class 1259 OID 128592)
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    address text,
    "mapLink" text,
    "websiteUrl" text,
    "teamSizeLabel" public."TeamSizeRange",
    "totalEmployees" integer NOT NULL,
    "establishedDate" timestamp(3) without time zone NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    views integer DEFAULT 0,
    "userId" integer NOT NULL
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 128603)
-- Name: CompanyImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CompanyImage" (
    id integer NOT NULL,
    "imageUrl" text NOT NULL,
    "companyId" integer NOT NULL
);


ALTER TABLE public."CompanyImage" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 128602)
-- Name: CompanyImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CompanyImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CompanyImage_id_seq" OWNER TO postgres;

--
-- TOC entry 5316 (class 0 OID 0)
-- Dependencies: 239
-- Name: CompanyImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CompanyImage_id_seq" OWNED BY public."CompanyImage".id;


--
-- TOC entry 244 (class 1259 OID 128621)
-- Name: CompanyIndustry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CompanyIndustry" (
    id integer NOT NULL,
    "companyId" integer NOT NULL,
    "industryId" integer NOT NULL
);


ALTER TABLE public."CompanyIndustry" OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 128620)
-- Name: CompanyIndustry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."CompanyIndustry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CompanyIndustry_id_seq" OWNER TO postgres;

--
-- TOC entry 5317 (class 0 OID 0)
-- Dependencies: 243
-- Name: CompanyIndustry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."CompanyIndustry_id_seq" OWNED BY public."CompanyIndustry".id;


--
-- TOC entry 237 (class 1259 OID 128591)
-- Name: Company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Company_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Company_id_seq" OWNER TO postgres;

--
-- TOC entry 5318 (class 0 OID 0)
-- Dependencies: 237
-- Name: Company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Company_id_seq" OWNED BY public."Company".id;


--
-- TOC entry 229 (class 1259 OID 128548)
-- Name: Education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Education" (
    id integer NOT NULL,
    name text NOT NULL,
    map text NOT NULL
);


ALTER TABLE public."Education" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 128547)
-- Name: Education_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Education_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Education_id_seq" OWNER TO postgres;

--
-- TOC entry 5319 (class 0 OID 0)
-- Dependencies: 228
-- Name: Education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Education_id_seq" OWNED BY public."Education".id;


--
-- TOC entry 242 (class 1259 OID 128612)
-- Name: Industry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Industry" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Industry" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 128611)
-- Name: Industry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Industry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Industry_id_seq" OWNER TO postgres;

--
-- TOC entry 5320 (class 0 OID 0)
-- Dependencies: 241
-- Name: Industry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Industry_id_seq" OWNED BY public."Industry".id;


--
-- TOC entry 248 (class 1259 OID 128637)
-- Name: Job; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Job" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    responsibilities text NOT NULL,
    requirements text NOT NULL,
    location text NOT NULL,
    workplace public."WorkPlace" NOT NULL,
    status public."JobStatus" NOT NULL,
    "salaryMin" integer NOT NULL,
    "salaryMax" integer NOT NULL,
    "postedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "applicationDeadline" date NOT NULL,
    "updateAt" timestamp(3) without time zone,
    totalview integer DEFAULT 0 NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "companyId" integer NOT NULL,
    "postById" integer NOT NULL,
    "jobRoleId" integer NOT NULL
);


ALTER TABLE public."Job" OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 128660)
-- Name: JobBenefit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobBenefit" (
    "jobId" integer NOT NULL,
    "benefitName" text NOT NULL
);


ALTER TABLE public."JobBenefit" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 128628)
-- Name: JobRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobRole" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."JobRole" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 128627)
-- Name: JobRole_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JobRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."JobRole_id_seq" OWNER TO postgres;

--
-- TOC entry 5321 (class 0 OID 0)
-- Dependencies: 245
-- Name: JobRole_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JobRole_id_seq" OWNED BY public."JobRole".id;


--
-- TOC entry 249 (class 1259 OID 128648)
-- Name: JobSkill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JobSkill" (
    "jobId" integer NOT NULL,
    "skillId" integer NOT NULL
);


ALTER TABLE public."JobSkill" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 128636)
-- Name: Job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Job_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Job_id_seq" OWNER TO postgres;

--
-- TOC entry 5322 (class 0 OID 0)
-- Dependencies: 247
-- Name: Job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Job_id_seq" OWNED BY public."Job".id;


--
-- TOC entry 226 (class 1259 OID 128534)
-- Name: Language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Language" (
    name text NOT NULL
);


ALTER TABLE public."Language" OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 132346)
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "chatId" integer NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 132345)
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO postgres;

--
-- TOC entry 5323 (class 0 OID 0)
-- Dependencies: 269
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- TOC entry 255 (class 1259 OID 128677)
-- Name: Package; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Package" (
    id integer NOT NULL,
    "planId" text NOT NULL,
    label text NOT NULL,
    price double precision NOT NULL,
    "jobPostLimit" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Package" OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 128676)
-- Name: Package_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Package_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Package_id_seq" OWNER TO postgres;

--
-- TOC entry 5324 (class 0 OID 0)
-- Dependencies: 254
-- Name: Package_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Package_id_seq" OWNED BY public."Package".id;


--
-- TOC entry 263 (class 1259 OID 128717)
-- Name: PaymentHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentHistory" (
    id integer NOT NULL,
    "razorpayPaymentId" text,
    "razorpaySubscriptionId" text,
    amount double precision NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    status public."PaymentStatus" NOT NULL,
    "paymentMethod" text,
    "failureReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."PaymentHistory" OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 128716)
-- Name: PaymentHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PaymentHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PaymentHistory_id_seq" OWNER TO postgres;

--
-- TOC entry 5325 (class 0 OID 0)
-- Dependencies: 262
-- Name: PaymentHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PaymentHistory_id_seq" OWNED BY public."PaymentHistory".id;


--
-- TOC entry 259 (class 1259 OID 128695)
-- Name: RecruiterPackage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RecruiterPackage" (
    id integer NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" date,
    "razorpaySubscriptionId" text,
    status public."RecruiterPackageStatus" NOT NULL,
    "billingCycleCount" integer DEFAULT 0,
    "userId" integer NOT NULL,
    "packageId" integer NOT NULL
);


ALTER TABLE public."RecruiterPackage" OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 128694)
-- Name: RecruiterPackage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RecruiterPackage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RecruiterPackage_id_seq" OWNER TO postgres;

--
-- TOC entry 5326 (class 0 OID 0)
-- Dependencies: 258
-- Name: RecruiterPackage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RecruiterPackage_id_seq" OWNED BY public."RecruiterPackage".id;


--
-- TOC entry 221 (class 1259 OID 128502)
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshToken" (
    id integer NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 128501)
-- Name: RefreshToken_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RefreshToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RefreshToken_id_seq" OWNER TO postgres;

--
-- TOC entry 5327 (class 0 OID 0)
-- Dependencies: 220
-- Name: RefreshToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RefreshToken_id_seq" OWNED BY public."RefreshToken".id;


--
-- TOC entry 268 (class 1259 OID 132322)
-- Name: SaveJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SaveJob" (
    id integer NOT NULL,
    "candidateProfileId" integer NOT NULL,
    "jobId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SaveJob" OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 132321)
-- Name: SaveJob_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SaveJob_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SaveJob_id_seq" OWNER TO postgres;

--
-- TOC entry 5328 (class 0 OID 0)
-- Dependencies: 267
-- Name: SaveJob_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SaveJob_id_seq" OWNED BY public."SaveJob".id;


--
-- TOC entry 232 (class 1259 OID 128565)
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 128564)
-- Name: Skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Skill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skill_id_seq" OWNER TO postgres;

--
-- TOC entry 5329 (class 0 OID 0)
-- Dependencies: 231
-- Name: Skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Skill_id_seq" OWNED BY public."Skill".id;


--
-- TOC entry 261 (class 1259 OID 128706)
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    id integer NOT NULL,
    "razorpaySubscriptionId" text NOT NULL,
    "razorpayPlanId" text NOT NULL,
    status public."SubscriptionStatus" NOT NULL,
    "startAt" timestamp(3) without time zone,
    "endAt" timestamp(3) without time zone,
    "totalCount" integer,
    "paidCount" integer,
    currency text DEFAULT 'INR'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "recruiterId" integer NOT NULL,
    "packageId" integer NOT NULL,
    "nextPayment" timestamp(3) without time zone
);


ALTER TABLE public."Subscription" OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 128705)
-- Name: Subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Subscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Subscription_id_seq" OWNER TO postgres;

--
-- TOC entry 5330 (class 0 OID 0)
-- Dependencies: 260
-- Name: Subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Subscription_id_seq" OWNED BY public."Subscription".id;


--
-- TOC entry 219 (class 1259 OID 128490)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    role public."Role" DEFAULT 'CANDIDATE'::public."Role" NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "authType" public."AuthType" DEFAULT 'EMAIL'::public."AuthType" NOT NULL,
    "ProviderAuthId" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 128489)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 5331 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 217 (class 1259 OID 128360)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4955 (class 2604 OID 130037)
-- Name: Apply id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Apply" ALTER COLUMN id SET DEFAULT nextval('public."Apply_id_seq"'::regclass);


--
-- TOC entry 4928 (class 2604 OID 130038)
-- Name: AuthOTP id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthOTP" ALTER COLUMN id SET DEFAULT nextval('public."AuthOTP_id_seq"'::regclass);


--
-- TOC entry 4938 (class 2604 OID 130039)
-- Name: CandidateEducation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateEducation" ALTER COLUMN id SET DEFAULT nextval('public."CandidateEducation_id_seq"'::regclass);


--
-- TOC entry 4941 (class 2604 OID 130059)
-- Name: CandidateExperience id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateExperience" ALTER COLUMN id SET DEFAULT nextval('public."CandidateExperience_id_seq"'::regclass);


--
-- TOC entry 4932 (class 2604 OID 130060)
-- Name: CandidateProfile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateProfile" ALTER COLUMN id SET DEFAULT nextval('public."CandidateProfile_id_seq"'::regclass);


--
-- TOC entry 4940 (class 2604 OID 130061)
-- Name: CandidateSkill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateSkill" ALTER COLUMN id SET DEFAULT nextval('public."CandidateSkill_id_seq"'::regclass);


--
-- TOC entry 4971 (class 2604 OID 130043)
-- Name: Chat id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat" ALTER COLUMN id SET DEFAULT nextval('public."Chat_id_seq"'::regclass);


--
-- TOC entry 4960 (class 2604 OID 130044)
-- Name: CheckLimitForRecruiter id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckLimitForRecruiter" ALTER COLUMN id SET DEFAULT nextval('public."CheckLimitForRecruiter_id_seq"'::regclass);


--
-- TOC entry 4944 (class 2604 OID 130062)
-- Name: Company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company" ALTER COLUMN id SET DEFAULT nextval('public."Company_id_seq"'::regclass);


--
-- TOC entry 4947 (class 2604 OID 130063)
-- Name: CompanyImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyImage" ALTER COLUMN id SET DEFAULT nextval('public."CompanyImage_id_seq"'::regclass);


--
-- TOC entry 4949 (class 2604 OID 130047)
-- Name: CompanyIndustry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyIndustry" ALTER COLUMN id SET DEFAULT nextval('public."CompanyIndustry_id_seq"'::regclass);


--
-- TOC entry 4936 (class 2604 OID 130064)
-- Name: Education id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Education" ALTER COLUMN id SET DEFAULT nextval('public."Education_id_seq"'::regclass);


--
-- TOC entry 4948 (class 2604 OID 130065)
-- Name: Industry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Industry" ALTER COLUMN id SET DEFAULT nextval('public."Industry_id_seq"'::regclass);


--
-- TOC entry 4951 (class 2604 OID 130050)
-- Name: Job id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job" ALTER COLUMN id SET DEFAULT nextval('public."Job_id_seq"'::regclass);


--
-- TOC entry 4950 (class 2604 OID 130051)
-- Name: JobRole id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobRole" ALTER COLUMN id SET DEFAULT nextval('public."JobRole_id_seq"'::regclass);


--
-- TOC entry 4978 (class 2604 OID 132349)
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- TOC entry 4958 (class 2604 OID 130052)
-- Name: Package id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Package" ALTER COLUMN id SET DEFAULT nextval('public."Package_id_seq"'::regclass);


--
-- TOC entry 4968 (class 2604 OID 130053)
-- Name: PaymentHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentHistory" ALTER COLUMN id SET DEFAULT nextval('public."PaymentHistory_id_seq"'::regclass);


--
-- TOC entry 4962 (class 2604 OID 130054)
-- Name: RecruiterPackage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecruiterPackage" ALTER COLUMN id SET DEFAULT nextval('public."RecruiterPackage_id_seq"'::regclass);


--
-- TOC entry 4926 (class 2604 OID 130055)
-- Name: RefreshToken id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken" ALTER COLUMN id SET DEFAULT nextval('public."RefreshToken_id_seq"'::regclass);


--
-- TOC entry 4976 (class 2604 OID 132325)
-- Name: SaveJob id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaveJob" ALTER COLUMN id SET DEFAULT nextval('public."SaveJob_id_seq"'::regclass);


--
-- TOC entry 4939 (class 2604 OID 130066)
-- Name: Skill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill" ALTER COLUMN id SET DEFAULT nextval('public."Skill_id_seq"'::regclass);


--
-- TOC entry 4965 (class 2604 OID 130057)
-- Name: Subscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription" ALTER COLUMN id SET DEFAULT nextval('public."Subscription_id_seq"'::regclass);


--
-- TOC entry 4922 (class 2604 OID 130067)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 5283 (class 0 OID 128668)
-- Dependencies: 253
-- Data for Name: Apply; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Apply" (id, "applyDate", status, "companyId", "candidateProfileId", "jobId") FROM stdin;
48	2026-03-04 14:33:56.814	SELECTED	36	20	57
89	2026-03-05 10:22:14.739	INTOUCH	34	20	62
45	2026-03-04 14:33:20.953	SELECTED	26	20	48
90	2026-03-05 12:30:42.982	PENDING	37	20	67
91	2026-03-05 12:30:47.646	PENDING	37	20	64
88	2026-03-04 16:57:40.623	INTOUCH	26	39	48
42	2026-03-04 14:33:03.229	PENDING	26	20	44
43	2026-03-04 14:33:05.034	PENDING	26	20	45
44	2026-03-04 14:33:11.525	PENDING	26	20	46
47	2026-03-04 14:33:53.785	PENDING	36	20	58
49	2026-03-04 14:34:26.499	PENDING	36	20	56
50	2026-03-04 14:34:30.709	PENDING	36	20	55
53	2026-03-04 14:35:42.007	PENDING	29	20	50
55	2026-03-04 14:40:20.112	PENDING	26	21	45
56	2026-03-04 14:40:21.988	PENDING	26	21	46
57	2026-03-04 14:40:23.461	PENDING	26	21	47
58	2026-03-04 14:40:27.981	PENDING	26	21	48
59	2026-03-04 16:47:38.508	PENDING	26	22	44
60	2026-03-04 16:47:39.736	PENDING	26	22	45
61	2026-03-04 16:47:40.999	PENDING	26	22	46
62	2026-03-04 16:47:42.225	PENDING	26	22	47
63	2026-03-04 16:47:44.225	PENDING	26	22	48
64	2026-03-04 16:50:17.979	PENDING	26	23	44
65	2026-03-04 16:50:19.343	PENDING	26	23	45
66	2026-03-04 16:50:20.644	PENDING	26	23	46
67	2026-03-04 16:50:22.842	PENDING	26	23	47
68	2026-03-04 16:50:24.094	PENDING	26	23	48
69	2026-03-04 16:53:26.995	PENDING	26	24	44
70	2026-03-04 16:53:28.213	PENDING	26	24	45
71	2026-03-04 16:53:29.469	PENDING	26	24	46
72	2026-03-04 16:53:30.587	PENDING	26	24	47
73	2026-03-04 16:53:32.128	PENDING	26	24	48
74	2026-03-04 16:54:01.608	PENDING	26	25	44
75	2026-03-04 16:54:02.716	PENDING	26	25	45
76	2026-03-04 16:54:03.878	PENDING	26	25	46
77	2026-03-04 16:54:05.381	PENDING	26	25	47
78	2026-03-04 16:54:06.816	PENDING	26	25	48
79	2026-03-04 16:55:53.637	PENDING	26	26	44
80	2026-03-04 16:55:55.001	PENDING	26	26	45
81	2026-03-04 16:55:56.6	PENDING	26	26	46
82	2026-03-04 16:55:57.915	PENDING	26	26	47
83	2026-03-04 16:55:59.307	PENDING	26	26	48
84	2026-03-04 16:57:34.706	PENDING	26	39	44
85	2026-03-04 16:57:35.94	PENDING	26	39	45
86	2026-03-04 16:57:37.416	PENDING	26	39	46
87	2026-03-04 16:57:38.965	PENDING	26	39	47
54	2026-03-04 14:40:18.532	INTOUCH	26	21	44
51	2026-03-04 14:35:35.65	INTOUCH	29	20	53
52	2026-03-04 14:35:37.832	SELECTED	29	20	52
46	2026-03-04 14:33:28.84	SELECTED	29	20	51
\.


--
-- TOC entry 5253 (class 0 OID 128512)
-- Dependencies: 223
-- Data for Name: AuthOTP; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuthOTP" (id, "otpCode", "expiresAt", "lastOtpSentAt", "resendCount", "failedLoginAttempts", "lockUntil", "otpFor", "resetToken", "userId") FROM stdin;
23	\N	\N	\N	0	0	\N	VERIFICATION	\N	32
17	\N	\N	\N	3	0	\N	VERIFICATION	\N	17
20	\N	\N	\N	3	0	\N	VERIFICATION	\N	29
12	\N	\N	\N	3	0	\N	VERIFICATION	\N	12
13	\N	\N	\N	3	0	\N	VERIFICATION	\N	13
18	\N	\N	\N	3	0	\N	FORGOT_PASSWORD	\N	24
15	\N	\N	\N	3	0	\N	VERIFICATION	\N	15
10	\N	\N	\N	3	0	\N	VERIFICATION	\N	10
16	\N	\N	\N	3	0	\N	VERIFICATION	\N	16
11	\N	\N	\N	3	0	\N	VERIFICATION	\N	11
19	\N	\N	\N	3	0	\N	FORGOT_PASSWORD	\N	28
26	\N	\N	\N	0	0	\N	VERIFICATION	\N	35
22	\N	\N	\N	3	0	\N	VERIFICATION	\N	31
7	744330	2026-01-28 19:12:25.748	2026-01-28 19:09:25.748	2	0	\N	FORGOT_PASSWORD	\N	1
8	\N	\N	\N	3	0	\N	VERIFICATION	\N	5
21	\N	\N	\N	3	0	\N	VERIFICATION	\N	30
9	\N	\N	\N	3	0	\N	VERIFICATION	\N	6
14	\N	\N	\N	3	0	\N	VERIFICATION	\N	14
\.


--
-- TOC entry 5280 (class 0 OID 128653)
-- Dependencies: 250
-- Data for Name: Benefit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Benefit" (name) FROM stdin;
medical converage
dental insurance
vision insurance
life insurance
mental health coverage
\.


--
-- TOC entry 5260 (class 0 OID 128556)
-- Dependencies: 230
-- Data for Name: CandidateEducation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CandidateEducation" (major, degree, "yearStart", "yearEnd", "candidateProfileId", "educationId", id) FROM stdin;
Bachelor of Science in Computer Science	BACHELOR	2021	2225	20	2	6
B.Tech IT	BACHELOR	2021	2025	20	2	8
B.Tech Civil	BACHELOR	2026	2026	39	1	26
MBA	MASTER	2026	2030	39	21	27
\.


--
-- TOC entry 5266 (class 0 OID 128581)
-- Dependencies: 236
-- Data for Name: CandidateExperience; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CandidateExperience" (id, "companyName", department, "startDate", "endDate", "position", description, "currentlyWorking", "workPlace", location, "candidateProfileId") FROM stdin;
6	Zoom	Backend	2026-02-04	\N	SDE1	Built and maintained backend APIs using Node.js, Express, and TypeScript for internal web applications.\nImplemented authentication systems using JWT and secure session management.\nIntegrated third-party services and handled API request validation using Zod and middleware.\nParticipated in code reviews and improved code quality through best backend practices. 	f	REMOTE	Banglore	20
19	Google	Backend Developers	2026-02-19	\N	SDE2	i am working at google as full stack developer	t	REMOTE	India	39
8	Star Link	Backend	2025-04-10	2026-03-03	SDE1	Developed microservices for handling user data, job applications, and notifications.\nUsed Redis caching to improve performance and reduce database load on frequently accessed endpoints.\nWorked with Docker containers for development and deployment environments.\nMaintained database schemas using Prisma ORM and PostgreSQL. 	f	REMOTE	Banglore	20
\.


--
-- TOC entry 5257 (class 0 OID 128541)
-- Dependencies: 227
-- Data for Name: CandidateLanguage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CandidateLanguage" (level, "candidateProfileId", "languageName") FROM stdin;
FLUENT	20	English
NATIVE	20	Gujarati
FLUENT	39	English
NATIVE	39	Gujarati
NATIVE	39	Hindi
\.


--
-- TOC entry 5255 (class 0 OID 128524)
-- Dependencies: 225
-- Data for Name: CandidateProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CandidateProfile" (id, "fullName", gender, phone, cv, "birthDate", address, "openToWork", status, "userId", summary) FROM stdin;
21	Rohan Vaghela	MALE	1234567891	1765106066427-715343647-Testing_pdf.pdf	2000-12-30	Rajkot, Gujarat	t	t	12	Results-driven Full Stack Developer experienced in building modern web\napplications using JavaScript, TypeScript, React, and Express.js. Skilled\nin designing REST APIs and working with databases like MongoDB and\nPostgreSQL to build efficient backend systems.
22	Raj Patel	MALE	1234567892	1765106176030-800985700-Testing_pdf.pdf	2000-12-30	Rajkot, Gujarat	t	t	13	Detail-oriented Full Stack Developer with strong experience in frontend\ndevelopment using React and backend development using Node.js. I enjoy\nbuilding scalable systems and optimizing application performance while\nmaintaining clean and reusable code.
23	Jay koli	MALE	1234567893	1765106225833-838535530-Testing_pdf.pdf	2000-12-30	Rajkot, Gujarat	t	t	14	Full Stack Developer passionate about building responsive and reliable\nweb applications. Experienced in React, Next.js, Node.js, and modern\ndatabase technologies. I enjoy working in collaborative environments\nand contributing to impactful products.
24	Harsh Parmar	MALE	1234567894	1765106267491-441732623-Testing_pdf.pdf	2000-12-30	Rajkot, Gujarat	t	t	15	Software developer specializing in full stack web development with\nexperience in building production-grade applications. Skilled in\nJavaScript, React, Node.js, and cloud-based deployments. Always eager\nto learn new tools and improve system architecture.
25	Meet Doshi	MALE	1234567895	1765106376320-487931170-Testing_pdf.pdf	2000-12-30	Rajkot, Gujarat	t	t	16	Creative Full Stack Developer focused on building user-friendly\napplications and scalable backend systems. Experienced in working\nwith modern JavaScript frameworks and API-driven architectures.\nStrong interest in performance optimization and clean code practices.
26	Kartik Pandya	MALE	1234567896	1765116170390-292543088-Testing_pdf.pdf	2000-12-30	Rajkot, Gujarat	t	t	17	Full Stack Engineer with hands-on experience developing web platforms\nusing React, Node.js, Express, and MongoDB. Passionate about building\nproducts that solve real-world problems while ensuring great user\nexperience and system reliability.
39	Mihir Thakar	FEMALE	1111111111	1770740868861-554126785-dev1.pdf	2026-02-11	sdaa	t	t	24	Motivated Full Stack Developer experienced in designing and developing\nweb applications from concept to deployment. Skilled in modern\nfrontend frameworks and backend services with a focus on performance,\nsecurity, and maintainability.
20	Tirth Rojara	MALE	1234567890	1772713818077-726324026-Tirth_Rojara_Resume.docx.pdf	2004-04-06	Rajkot, Gujarat, India	t	t	1	Full Stack Developer with a strong background in JavaScript ecosystems\nincluding React, Next.js, and Node.js. Experienced in building APIs,\nworking with relational and NoSQL databases, and deploying scalable\napplications in cloud environments.
\.


--
-- TOC entry 5264 (class 0 OID 128574)
-- Dependencies: 234
-- Data for Name: CandidateSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CandidateSkill" (id, "candidateProfileId", "skillId") FROM stdin;
14	39	1
15	39	2
16	39	3
18	20	1
19	20	2
20	20	10
21	20	11
22	20	12
23	20	13
25	20	54
26	20	56
27	20	57
28	20	60
29	20	61
30	20	64
31	20	62
32	20	65
33	20	66
39	20	67
\.


--
-- TOC entry 5295 (class 0 OID 128728)
-- Dependencies: 265
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chat" (id, "candidateProfileId", "companyId", "chatRoomId", "createdAt", "candidateUnreadCount", "companyUnreadCount", "lastMessage", "lastMessageAt", "updatedAt") FROM stdin;
16	24	26	chat_26_24	2026-03-04 18:42:04.379	0	0	I enjoy collaborating with designers and translating design systems into reusable components.\n	2026-03-04 18:51:50.417	2026-03-05 16:25:12.353
17	20	29	chat_29_20	2026-03-05 09:27:15.555	1	0	Great! I’ll arrange a quick technical call with our engineering team later this week.	2026-03-05 09:49:20.309	2026-03-05 09:49:20.371
14	22	26	chat_26_22	2026-03-04 17:52:36.706	0	1	That sounds great. Please share the job description, and let me know a suitable time for the technical discussion.	2026-03-04 18:31:56.559	2026-03-04 18:31:56.594
15	39	26	chat_26_39	2026-03-04 18:33:25.355	0	2	I’ve worked with MongoDB extensively and also used Redis for caching in one of my projects.	2026-03-04 18:36:58.134	2026-03-04 18:36:58.17
20	20	26	chat_26_20	2026-03-05 10:31:17.021	0	0	r5	2026-03-05 16:27:52.47	2026-03-05 16:28:39.966
18	20	36	chat_36_20	2026-03-05 10:02:54.841	1	0	Perfect. I’ll share the job description and schedule a technical discussion if that works for you.	2026-03-05 10:07:12.657	2026-03-05 10:07:12.686
19	20	34	chat_34_20	2026-03-05 10:22:46.201	0	1	hii	2026-03-05 12:32:42.177	2026-03-05 16:22:03.744
\.


--
-- TOC entry 5287 (class 0 OID 128687)
-- Dependencies: 257
-- Data for Name: CheckLimitForRecruiter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CheckLimitForRecruiter" (id, "jobCount", "recruiterId") FROM stdin;
2	36	10
3	5	11
4	5	28
5	4	30
1	17	5
\.


--
-- TOC entry 5268 (class 0 OID 128592)
-- Dependencies: 238
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Company" (id, name, description, location, address, "mapLink", "websiteUrl", "teamSizeLabel", "totalEmployees", "establishedDate", "isApproved", views, "userId") FROM stdin;
29	BlueWave Technologies	BlueWave Technologies develops AI-powered analytics platforms designed for the finance and healthcare industries. The company focuses on transforming large volumes of data into meaningful insights that help businesses make strategic decisions. Its engineers work on machine learning pipelines, real-time data processing, and scalable cloud systems. BlueWave serves both startups and large enterprises across multiple global markets.	Hyderabad, India	HITEC City, Hyderabad, Telangana	https://maps.google.com/?q=HITEC+City+Hyderabad	bluewavetech.ai	FIFTY_ONE_TO_TWO_HUNDRED	145	2016-09-09 00:00:00	f	0	10
36	GreenByte Labs	GreenByte Labs is a technology startup focused on building sustainable and energy-efficient software solutions. The company develops platforms that help businesses reduce energy consumption and monitor environmental impact. Its products combine IoT, analytics, and cloud technology to improve sustainability initiatives. GreenByte works with industries such as manufacturing, logistics, and renewable energy.	Pune, India	Baner Road, Pune, Maharashtra	https://maps.google.com/?q=Baner+Road+Pune	greenbytelabs.com	ELEVEN_TO_FIFTY	34	2020-03-10 00:00:00	f	0	11
34	CloudSphere Systems	CloudSphere Systems provides enterprise-grade cloud infrastructure solutions and DevOps consulting services. The company specializes in Kubernetes, container orchestration, and scalable deployment pipelines for modern applications. Its platform helps organizations migrate legacy systems to cloud-native architectures efficiently. CloudSphere works with global clients across fintech, e-commerce, and enterprise software sectors.	Gurgaon, India	Cyber City, Gurgaon, Haryana\n	https://maps.google.com/?q=Cyber+City+Gurgaon	cloudsphere.io	TWO_HUNDRED_ONE_TO_FIVE_HUNDRED	278	2015-06-17 00:00:00	f	0	28
37	DataForge Analytics	DataForge Analytics is a modern data engineering consultancy helping startups and enterprises build scalable data platforms. The company designs robust data pipelines, analytics dashboards, and machine learning workflows. Its team works with technologies such as Spark, Kafka, and cloud data warehouses. DataForge empowers organizations to transform raw data into actionable insights.	Mumbai, India	Andheri East, Mumbai, Maharashtra	https://maps.google.com/?q=Andheri+East+Mumbai	dataforgeanalytics.com	ELEVEN_TO_FIFTY	41	2020-03-17 00:00:00	f	0	30
26	TechNova Solutions	TechNova Solutions is a fast-growing SaaS company focused on building scalable cloud platforms for global enterprises. The company specializes in distributed systems, microservices architecture, and modern DevOps practices. Its engineering team works with cutting-edge technologies to deliver reliable and high-performance software solutions. TechNova partners with companies worldwide to help them modernize their digital infrastructure.	Bangalore, India	Koramangala 5th Block, Bangalore, Karnataka	https://maps.google.com/?q=Koramangala+Bangalore	https://technovasolutions.com	FIFTY_ONE_TO_TWO_HUNDRED	85	2018-04-14 00:00:00	f	10	5
\.


--
-- TOC entry 5270 (class 0 OID 128603)
-- Dependencies: 240
-- Data for Name: CompanyImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CompanyImage" (id, "imageUrl", "companyId") FROM stdin;
\.


--
-- TOC entry 5274 (class 0 OID 128621)
-- Dependencies: 244
-- Data for Name: CompanyIndustry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CompanyIndustry" (id, "companyId", "industryId") FROM stdin;
58	29	1
59	36	1
61	34	1
62	37	1
63	37	2
64	26	2
57	26	1
\.


--
-- TOC entry 5259 (class 0 OID 128548)
-- Dependencies: 229
-- Data for Name: Education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Education" (id, name, map) FROM stdin;
1	Harvard University	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
2	Stanford University	https://maps.app.goo.gl/49sahvX93NuwFaXY8
3	California Institute of Technology	https://maps.app.goo.gl/qxn9bG5mQVr7894P9
17	IIT Kharagpur	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
18	IIT Bombay	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
19	IIT Madras	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
20	IIT Gandhinagar	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
21	Gujarat Technological University (GTU)	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
22	Indian Institute of Information Technology Surat (IIIT Surat)	https://maps.app.goo.gl/S9XNcoozcmWp5znL7
\.


--
-- TOC entry 5272 (class 0 OID 128612)
-- Dependencies: 242
-- Data for Name: Industry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Industry" (id, name) FROM stdin;
1	IT
2	Finance
3	Healthcare
4	Education
5	Retail
\.


--
-- TOC entry 5278 (class 0 OID 128637)
-- Dependencies: 248
-- Data for Name: Job; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Job" (id, title, description, responsibilities, requirements, location, workplace, status, "salaryMin", "salaryMax", "postedAt", "applicationDeadline", "updateAt", totalview, "isDeleted", "companyId", "postById", "jobRoleId") FROM stdin;
44	Full Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Bangalore, India	HYBRID	ACTIVE	40000	50000	2026-03-03 19:27:53.017	2026-05-13	2026-03-03 19:39:10.447	0	f	26	5	2
45	Backend Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail. 	Bangalore, India	REMOTE	ACTIVE	35000	45000	2026-03-03 19:32:16.068	2026-05-14	2026-03-03 19:34:30.459	0	f	26	5	2
46	MERN Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Bangalore, India	REMOTE	ACTIVE	45000	50000	2026-03-03 19:36:50.607	2026-05-13	2026-03-03 19:39:36.514	0	f	26	5	2
47	Frontend Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Bangalore, India	HYBRID	ACTIVE	40000	45000	2026-03-03 19:41:38.688	2026-05-13	2026-03-03 19:42:06.931	0	f	26	5	2
48	Full Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe. 	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Bangalore, India	REMOTE	ACTIVE	100000	120000	2026-03-03 19:45:32.783	2026-05-13	2026-03-04 14:19:25.949	0	f	26	5	4
49	Frontend Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Hyderabad, India	HYBRID	ACTIVE	60000	80000	2026-03-03 19:57:19.256	2026-05-29	2026-03-03 19:57:48.656	0	f	29	10	4
50	React Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Hyderabad, India	REMOTE	ACTIVE	30000	40000	2026-03-04 08:22:09.524	2026-05-29	2026-03-04 08:22:59.762	0	f	29	10	2
51	MERN Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Hyderabad, India	ONSITE	ACTIVE	80000	100000	2026-03-04 08:25:27.925	2026-05-30	2026-03-04 08:26:39.532	0	f	29	10	4
52	Node.js Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Hyderabad, India	ONSITE	ACTIVE	45000	55000	2026-03-04 08:29:51.831	2026-05-27	2026-03-04 08:30:55.197	0	f	29	10	2
53	Full Stack Gen Ai Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Hyderabad, India	ONSITE	ACTIVE	50000	70000	2026-03-04 08:33:09.361	2026-05-30	2026-03-04 08:34:08.98	0	f	29	10	3
54	Frontend Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Pune, India	REMOTE	ACTIVE	10000	15000	2026-03-04 08:44:38.957	2026-06-29	2026-03-04 08:45:13.094	0	f	36	11	1
55	Backend Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Pune, India	REMOTE	ACTIVE	45000	50000	2026-03-04 13:36:13.676	2026-06-29	2026-03-04 13:37:16.839	0	f	36	11	2
56	Full Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Pune, India	HYBRID	ACTIVE	50000	55000	2026-03-04 13:38:30.813	2026-05-29	2026-03-04 13:39:38.753	0	f	36	11	2
57	MERN Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Pune, India	HYBRID	ACTIVE	70000	85000	2026-03-04 13:41:20.551	2026-05-30	2026-03-04 13:42:10.593	0	f	36	11	4
58	Full Stack Developer	We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.	Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.	Bachelor’s degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.	Pune, India	REMOTE	ACTIVE	80000	95000	2026-03-04 13:43:51.794	2026-03-27	2026-03-04 13:44:45.765	0	f	36	11	4
60	DevOps Engineer	We are looking for a skilled Cloud & DevOps Engineer to design, implement,\nand maintain scalable cloud infrastructure and deployment pipelines.\nYou will work closely with software engineers, security teams,\nand infrastructure teams to build reliable and automated systems.\nThe role involves managing CI/CD pipelines, monitoring infrastructure,\nand improving deployment reliability across multiple environments.\nYou will help optimize system performance, automate operational tasks,\nand ensure high availability for mission-critical applications.\nThis position offers the opportunity to work with modern cloud technologies,\ncontainer orchestration platforms, and infrastructure automation tools.	Design, implement, and maintain cloud infrastructure using AWS, Azure, or GCP.\nDevelop and maintain CI/CD pipelines to automate software delivery.\nManage containerized applications using Docker and Kubernetes.\nMonitor infrastructure health and troubleshoot production incidents.\nImplement infrastructure as code using tools like Terraform or Pulumi.\nCollaborate with development teams to improve deployment workflows.\nEnsure system reliability, scalability, and security best practices.\nOptimize infrastructure costs and resource utilization across environments.	Bachelor’s degree in Computer Science, Engineering, or a related field.\nExperience with cloud platforms such as AWS, Azure, or Google Cloud.\nStrong knowledge of containerization tools like Docker and Kubernetes.\nExperience building CI/CD pipelines using tools like GitHub Actions or Jenkins.\nKnowledge of infrastructure as code tools such as Terraform or CloudFormation.\nUnderstanding of networking, security practices, and monitoring systems.\nExperience with Linux systems and scripting languages such as Bash or Python.\nStrong troubleshooting skills and ability to work in distributed environments.	Gurgaon, India	HYBRID	ACTIVE	90000	105000	2026-03-04 13:56:29.281	2026-05-30	2026-03-04 13:56:33.931	0	f	34	28	4
59	Cloud Engineer	We are looking for a skilled Cloud & DevOps Engineer to design, implement,\nand maintain scalable cloud infrastructure and deployment pipelines.\nYou will work closely with software engineers, security teams,\nand infrastructure teams to build reliable and automated systems.\nThe role involves managing CI/CD pipelines, monitoring infrastructure,\nand improving deployment reliability across multiple environments.\nYou will help optimize system performance, automate operational tasks,\nand ensure high availability for mission-critical applications.\nThis position offers the opportunity to work with modern cloud technologies,\ncontainer orchestration platforms, and infrastructure automation tools.	Design, implement, and maintain cloud infrastructure using AWS, Azure, or GCP.\nDevelop and maintain CI/CD pipelines to automate software delivery.\nManage containerized applications using Docker and Kubernetes.\nMonitor infrastructure health and troubleshoot production incidents.\nImplement infrastructure as code using tools like Terraform or Pulumi.\nCollaborate with development teams to improve deployment workflows.\nEnsure system reliability, scalability, and security best practices.\nOptimize infrastructure costs and resource utilization across environments.	Bachelor’s degree in Computer Science, Engineering, or a related field.\nExperience with cloud platforms such as AWS, Azure, or Google Cloud.\nStrong knowledge of containerization tools like Docker and Kubernetes.\nExperience building CI/CD pipelines using tools like GitHub Actions or Jenkins.\nKnowledge of infrastructure as code tools such as Terraform or CloudFormation.\nUnderstanding of networking, security practices, and monitoring systems.\nExperience with Linux systems and scripting languages such as Bash or Python.\nStrong troubleshooting skills and ability to work in distributed environments.	Gurgaon, India	REMOTE	ACTIVE	50000	60000	2026-03-04 13:53:56.952	2026-05-28	2026-03-04 13:54:19.238	0	f	34	28	3
61	Cloud Infrastructure Engineer	We are looking for a skilled Cloud & DevOps Engineer to design, implement,\nand maintain scalable cloud infrastructure and deployment pipelines.\nYou will work closely with software engineers, security teams,\nand infrastructure teams to build reliable and automated systems.\nThe role involves managing CI/CD pipelines, monitoring infrastructure,\nand improving deployment reliability across multiple environments.\nYou will help optimize system performance, automate operational tasks,\nand ensure high availability for mission-critical applications.\nThis position offers the opportunity to work with modern cloud technologies,\ncontainer orchestration platforms, and infrastructure automation tools.	Design, implement, and maintain cloud infrastructure using AWS, Azure, or GCP.\nDevelop and maintain CI/CD pipelines to automate software delivery.\nManage containerized applications using Docker and Kubernetes.\nMonitor infrastructure health and troubleshoot production incidents.\nImplement infrastructure as code using tools like Terraform or Pulumi.\nCollaborate with development teams to improve deployment workflows.\nEnsure system reliability, scalability, and security best practices.\nOptimize infrastructure costs and resource utilization across environments.	Bachelor’s degree in Computer Science, Engineering, or a related field.\nExperience with cloud platforms such as AWS, Azure, or Google Cloud.\nStrong knowledge of containerization tools like Docker and Kubernetes.\nExperience building CI/CD pipelines using tools like GitHub Actions or Jenkins.\nKnowledge of infrastructure as code tools such as Terraform or CloudFormation.\nUnderstanding of networking, security practices, and monitoring systems.\nExperience with Linux systems and scripting languages such as Bash or Python.\nStrong troubleshooting skills and ability to work in distributed environments.	Gurgaon, India	ONSITE	ACTIVE	110000	120000	2026-03-04 13:58:12.255	2026-05-29	2026-03-04 13:58:18.097	0	f	34	28	4
62	DevOps Engineer	We are looking for a skilled Cloud & DevOps Engineer to design, implement,\nand maintain scalable cloud infrastructure and deployment pipelines.\nYou will work closely with software engineers, security teams,\nand infrastructure teams to build reliable and automated systems.\nThe role involves managing CI/CD pipelines, monitoring infrastructure,\nand improving deployment reliability across multiple environments.\nYou will help optimize system performance, automate operational tasks,\nand ensure high availability for mission-critical applications.\nThis position offers the opportunity to work with modern cloud technologies,\ncontainer orchestration platforms, and infrastructure automation tools.	Design, implement, and maintain cloud infrastructure using AWS, Azure, or GCP.\nDevelop and maintain CI/CD pipelines to automate software delivery.\nManage containerized applications using Docker and Kubernetes.\nMonitor infrastructure health and troubleshoot production incidents.\nImplement infrastructure as code using tools like Terraform or Pulumi.\nCollaborate with development teams to improve deployment workflows.\nEnsure system reliability, scalability, and security best practices.\nOptimize infrastructure costs and resource utilization across environments.	Bachelor’s degree in Computer Science, Engineering, or a related field.\nExperience with cloud platforms such as AWS, Azure, or Google Cloud.\nStrong knowledge of containerization tools like Docker and Kubernetes.\nExperience building CI/CD pipelines using tools like GitHub Actions or Jenkins.\nKnowledge of infrastructure as code tools such as Terraform or CloudFormation.\nUnderstanding of networking, security practices, and monitoring systems.\nExperience with Linux systems and scripting languages such as Bash or Python.\nStrong troubleshooting skills and ability to work in distributed environments.	Gurgaon, India	ONSITE	ACTIVE	50000	65000	2026-03-04 13:59:54.174	2026-06-29	2026-03-04 13:59:59.549	0	f	34	28	2
63	Cloud Engineer	We are looking for a skilled Cloud & DevOps Engineer to design, implement,\nand maintain scalable cloud infrastructure and deployment pipelines.\nYou will work closely with software engineers, security teams,\nand infrastructure teams to build reliable and automated systems.\nThe role involves managing CI/CD pipelines, monitoring infrastructure,\nand improving deployment reliability across multiple environments.\nYou will help optimize system performance, automate operational tasks,\nand ensure high availability for mission-critical applications.\nThis position offers the opportunity to work with modern cloud technologies,\ncontainer orchestration platforms, and infrastructure automation tools.	Design, implement, and maintain cloud infrastructure using AWS, Azure, or GCP.\nDevelop and maintain CI/CD pipelines to automate software delivery.\nManage containerized applications using Docker and Kubernetes.\nMonitor infrastructure health and troubleshoot production incidents.\nImplement infrastructure as code using tools like Terraform or Pulumi.\nCollaborate with development teams to improve deployment workflows.\nEnsure system reliability, scalability, and security best practices.\nOptimize infrastructure costs and resource utilization across environments.	Bachelor’s degree in Computer Science, Engineering, or a related field.\nExperience with cloud platforms such as AWS, Azure, or Google Cloud.\nStrong knowledge of containerization tools like Docker and Kubernetes.\nExperience building CI/CD pipelines using tools like GitHub Actions or Jenkins.\nKnowledge of infrastructure as code tools such as Terraform or CloudFormation.\nUnderstanding of networking, security practices, and monitoring systems.\nExperience with Linux systems and scripting languages such as Bash or Python.\nStrong troubleshooting skills and ability to work in distributed environments.	Gurgaon, India	ONSITE	ACTIVE	150000	170000	2026-03-04 14:05:47.991	2026-06-24	2026-03-04 14:05:54.22	0	f	34	28	4
64	Financial Analyst	We are looking for a detail-oriented finance professional to join our growing finance team.\nThe candidate will support financial planning, reporting, and analysis activities\nthat help drive strategic business decisions across the organization.\nYou will work closely with senior finance leaders, operations teams,\nand external stakeholders to ensure financial transparency and compliance.\nThe role involves analyzing financial performance, monitoring budgets,\nand identifying opportunities for cost optimization and growth.\nThis position offers an opportunity to work in a fast-paced environment\nwhile contributing to the financial stability and expansion of the company.	Prepare and analyze financial statements, reports, and forecasts.\nMonitor company budgets and track expenses against financial targets.\nAssist in financial planning, budgeting, and variance analysis.\nEnsure compliance with financial regulations and company policies.\nCollaborate with internal departments to support financial decision making.\nEvaluate investment opportunities and financial risks.\nSupport audits and maintain accurate financial documentation.\nIdentify cost-saving opportunities and recommend financial improvements.	Bachelor’s degree in Finance, Accounting, Economics, or a related field.\nStrong understanding of financial reporting and accounting principles.\nExperience working with financial models and budgeting tools.\nProficiency in Microsoft Excel or financial analysis software.\nKnowledge of financial regulations, taxation, and compliance standards.\nStrong analytical thinking and problem-solving abilities.\nExcellent attention to detail and organizational skills.\nAbility to communicate financial insights to non-financial stakeholders.	Mumbai, India	ONSITE	ACTIVE	40000	55000	2026-03-04 14:09:34.063	2026-05-27	2026-03-04 14:09:47.424	0	f	37	30	2
65	Investment Analyst	We are looking for a detail-oriented finance professional to join our growing finance team.\nThe candidate will support financial planning, reporting, and analysis activities\nthat help drive strategic business decisions across the organization.\nYou will work closely with senior finance leaders, operations teams,\nand external stakeholders to ensure financial transparency and compliance.\nThe role involves analyzing financial performance, monitoring budgets,\nand identifying opportunities for cost optimization and growth.\nThis position offers an opportunity to work in a fast-paced environment\nwhile contributing to the financial stability and expansion of the company.	Prepare and analyze financial statements, reports, and forecasts.\nMonitor company budgets and track expenses against financial targets.\nAssist in financial planning, budgeting, and variance analysis.\nEnsure compliance with financial regulations and company policies.\nCollaborate with internal departments to support financial decision making.\nEvaluate investment opportunities and financial risks.\nSupport audits and maintain accurate financial documentation.\nIdentify cost-saving opportunities and recommend financial improvements.	Bachelor’s degree in Finance, Accounting, Economics, or a related field.\nStrong understanding of financial reporting and accounting principles.\nExperience working with financial models and budgeting tools.\nProficiency in Microsoft Excel or financial analysis software.\nKnowledge of financial regulations, taxation, and compliance standards.\nStrong analytical thinking and problem-solving abilities.\nExcellent attention to detail and organizational skills.\nAbility to communicate financial insights to non-financial stakeholders.	Mumbai, India	ONSITE	ACTIVE	80000	100000	2026-03-04 14:11:24.957	2026-06-27	2026-03-04 14:11:32.634	0	f	37	30	4
66	Risk Analyst	We are looking for a detail-oriented finance professional to join our growing finance team.\nThe candidate will support financial planning, reporting, and analysis activities\nthat help drive strategic business decisions across the organization.\nYou will work closely with senior finance leaders, operations teams,\nand external stakeholders to ensure financial transparency and compliance.\nThe role involves analyzing financial performance, monitoring budgets,\nand identifying opportunities for cost optimization and growth.\nThis position offers an opportunity to work in a fast-paced environment\nwhile contributing to the financial stability and expansion of the company.	Prepare and analyze financial statements, reports, and forecasts.\nMonitor company budgets and track expenses against financial targets.\nAssist in financial planning, budgeting, and variance analysis.\nEnsure compliance with financial regulations and company policies.\nCollaborate with internal departments to support financial decision making.\nEvaluate investment opportunities and financial risks.\nSupport audits and maintain accurate financial documentation.\nIdentify cost-saving opportunities and recommend financial improvements.	Bachelor’s degree in Finance, Accounting, Economics, or a related field.\nStrong understanding of financial reporting and accounting principles.\nExperience working with financial models and budgeting tools.\nProficiency in Microsoft Excel or financial analysis software.\nKnowledge of financial regulations, taxation, and compliance standards.\nStrong analytical thinking and problem-solving abilities.\nExcellent attention to detail and organizational skills.\nAbility to communicate financial insights to non-financial stakeholders.	Mumbai, India	ONSITE	ACTIVE	50000	65000	2026-03-04 14:13:21.328	2026-06-29	2026-03-04 14:13:29.713	0	f	37	30	2
67	Financial Analyst	We are looking for a detail-oriented finance professional to join our growing finance team.\nThe candidate will support financial planning, reporting, and analysis activities\nthat help drive strategic business decisions across the organization.\nYou will work closely with senior finance leaders, operations teams,\nand external stakeholders to ensure financial transparency and compliance.\nThe role involves analyzing financial performance, monitoring budgets,\nand identifying opportunities for cost optimization and growth.\nThis position offers an opportunity to work in a fast-paced environment\nwhile contributing to the financial stability and expansion of the company.	Prepare and analyze financial statements, reports, and forecasts.\nMonitor company budgets and track expenses against financial targets.\nAssist in financial planning, budgeting, and variance analysis.\nEnsure compliance with financial regulations and company policies.\nCollaborate with internal departments to support financial decision making.\nEvaluate investment opportunities and financial risks.\nSupport audits and maintain accurate financial documentation.\nIdentify cost-saving opportunities and recommend financial improvements.	Bachelor’s degree in Finance, Accounting, Economics, or a related field.\nStrong understanding of financial reporting and accounting principles.\nExperience working with financial models and budgeting tools.\nProficiency in Microsoft Excel or financial analysis software.\nKnowledge of financial regulations, taxation, and compliance standards.\nStrong analytical thinking and problem-solving abilities.\nExcellent attention to detail and organizational skills.\nAbility to communicate financial insights to non-financial stakeholders.	Mumbai, India	ONSITE	ACTIVE	130000	145000	2026-03-04 14:14:52.646	2026-06-29	2026-03-04 14:15:00.976	0	f	37	30	4
\.


--
-- TOC entry 5281 (class 0 OID 128660)
-- Dependencies: 251
-- Data for Name: JobBenefit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobBenefit" ("jobId", "benefitName") FROM stdin;
44	medical converage
45	medical converage
46	medical converage
47	medical converage
48	medical converage
49	life insurance
49	medical converage
50	medical converage
50	life insurance
51	medical converage
51	life insurance
52	medical converage
52	life insurance
53	medical converage
53	life insurance
55	life insurance
55	medical converage
56	life insurance
56	medical converage
57	medical converage
57	life insurance
58	medical converage
58	life insurance
59	life insurance
60	life insurance
61	life insurance
62	life insurance
63	life insurance
64	life insurance
64	medical converage
65	medical converage
65	life insurance
66	medical converage
66	life insurance
67	medical converage
67	life insurance
48	life insurance
\.


--
-- TOC entry 5276 (class 0 OID 128628)
-- Dependencies: 246
-- Data for Name: JobRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobRole" (id, name) FROM stdin;
1	internship
2	fresher
3	junior
4	senior
\.


--
-- TOC entry 5279 (class 0 OID 128648)
-- Dependencies: 249
-- Data for Name: JobSkill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JobSkill" ("jobId", "skillId") FROM stdin;
44	1
44	2
44	10
44	11
44	12
44	13
44	57
44	65
45	2
45	11
45	12
45	65
45	66
45	57
45	54
45	56
45	63
45	64
45	60
45	62
46	1
46	2
46	10
46	11
46	12
46	13
46	57
46	65
47	1
47	2
47	7
47	8
47	10
47	13
47	65
48	1
48	2
48	10
48	11
48	12
48	13
48	54
48	56
48	57
48	65
48	60
49	1
49	2
49	7
49	8
49	10
49	13
50	10
50	2
50	1
50	13
51	1
51	2
51	10
51	11
51	12
51	13
51	55
51	57
51	64
51	65
51	63
51	56
52	1
52	2
52	11
52	12
52	54
52	56
52	57
52	64
52	65
53	1
53	2
53	10
53	11
53	12
53	13
53	54
53	55
53	56
53	57
53	63
53	64
53	65
54	1
54	7
54	8
54	10
55	1
55	2
55	11
55	12
55	54
55	56
55	57
55	64
55	65
55	66
56	1
56	2
56	10
56	11
56	12
56	13
56	56
56	54
56	57
56	65
56	64
56	66
57	1
57	2
57	10
57	11
57	12
57	57
57	64
57	65
58	1
58	2
58	10
58	11
58	12
58	13
58	54
58	56
58	57
58	62
58	60
58	64
58	65
58	66
\.


--
-- TOC entry 5256 (class 0 OID 128534)
-- Dependencies: 226
-- Data for Name: Language; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Language" (name) FROM stdin;
Spanish
Japanese
Korean
French
Italian
English
Gujarati
Hindi
\.


--
-- TOC entry 5300 (class 0 OID 132346)
-- Dependencies: 270
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "chatId", "senderId", "receiverId", content, "isRead", "createdAt") FROM stdin;
166	14	5	13	Hi Raj, I came across your profile and noticed your experience with React and Node.js. We have an opening for a Full Stack Developer at our company. Would you be interested in discussing this opportunity?	t	2026-03-04 18:04:38.258
167	14	13	5	Hello! Thank you for reaching out. Yes, I’d definitely be interested in learning more about the role.	t	2026-03-04 18:06:45.928
168	14	5	13	Great! The position involves building scalable web applications using React, Node.js, and PostgreSQL. Do you have experience working with REST APIs and backend services?	t	2026-03-04 18:07:19.376
169	14	13	5	Yes, I have worked on several projects where I developed REST APIs using Express.js and integrated them with React applications.	t	2026-03-04 18:08:45.73
170	14	5	13	That’s great to hear. Could you also share if you have any experience with cloud platforms like AWS or Docker?	t	2026-03-04 18:09:36.898
171	14	13	5	I have basic experience with Docker and have deployed a few applications on AWS using EC2 and S3.	t	2026-03-04 18:29:41.348
172	14	5	13	Perfect. I’ll share the job description and schedule a technical discussion if that works for you.	t	2026-03-04 18:30:31.982
173	14	13	5	That sounds great. Please share the job description, and let me know a suitable time for the technical discussion.	f	2026-03-04 18:31:56.558
174	15	5	24	Hi Mihir, I found your profile while searching for backend developers with Node.js and database experience. Are you currently open to new opportunities?	t	2026-03-04 18:33:51.151
175	15	24	5	Hi! Yes, I am currently exploring new opportunities, especially backend-focused roles.\n	t	2026-03-04 18:35:25.557
176	15	5	24	Excellent. This role mainly focuses on designing scalable APIs and working with MongoDB and Redis for high-performance systems.\n	t	2026-03-04 18:36:16.894
177	15	24	5	That sounds interesting.	f	2026-03-04 18:36:47.78
178	15	24	5	I’ve worked with MongoDB extensively and also used Redis for caching in one of my projects.	f	2026-03-04 18:36:58.133
179	16	5	15	Hello Harsh, I saw your profile and noticed your strong experience with React and modern frontend technologies. We have a frontend developer opening. Would you like to know more?	t	2026-03-04 18:42:37.997
180	16	15	5	Hi! Yes, I’d be happy to hear more about the role.	t	2026-03-04 18:48:31.385
181	16	5	15	The position focuses on building responsive web interfaces using React, TypeScript, and Next.js. Do you have experience with these technologies?	t	2026-03-04 18:48:53.768
182	16	15	5	Yes	t	2026-03-04 18:49:26.635
183	16	15	5	I have been working with React for about 3 years and recently started using Next.js for server-side rendering.\n	t	2026-03-04 18:50:03.652
184	16	5	15	That’s great. The role also involves working closely with UI/UX designers to improve user experience.	t	2026-03-04 18:51:06.285
195	18	11	1	Great! The position involves building scalable web applications using React, Node.js, and PostgreSQL. Do you have experience working with REST APIs and backend services?	t	2026-03-05 10:05:12.6
186	17	10	1	Hi Tirth, I found your profile while searching for backend developers with Node.js and database experience. Are you currently open to new opportunities?	t	2026-03-05 09:27:20.039
187	17	1	10	 Hi! Yes, I am currently exploring new opportunities, especially backend-focused roles.	t	2026-03-05 09:46:43.548
188	17	10	1	Excellent. This role mainly focuses on designing scalable APIs and working with MongoDB and Redis for high-performance systems.	t	2026-03-05 09:47:22.864
189	17	1	10	That sounds interesting. I’ve worked with MongoDB extensively and also used Redis for caching in one of my projects.	t	2026-03-05 09:48:03.291
190	17	10	1	That’s good to know. The team also follows microservices architecture. Have you worked with microservices before?	t	2026-03-05 09:48:25.001
191	17	1	10	Yes, I have worked on a microservices-based project using Node.js and Docker.	t	2026-03-05 09:48:40.49
192	17	10	1	Great! I’ll arrange a quick technical call with our engineering team later this week.	f	2026-03-05 09:49:20.309
196	18	1	11	Yes, I have worked on several projects where I developed REST APIs using Express.js and integrated them with React applications.	t	2026-03-05 10:05:25.265
193	18	11	1	 Hi Tirth, I came across your profile and noticed your experience with React and Node.js. We have an opening for a Full Stack Developer at our company. Would you be interested in discussing this opportunity?	t	2026-03-05 10:03:39.927
194	18	1	11	Hello! Thank you for reaching out. Yes, I’d definitely be interested in learning more about the role.	t	2026-03-05 10:04:57.372
197	18	11	1	That’s great to hear. Could you also share if you have any experience with cloud platforms like AWS or Docker?	t	2026-03-05 10:06:13.098
198	18	1	11	I have basic experience with Docker and have deployed a few applications on AWS using EC2 and S3.	t	2026-03-05 10:06:49.794
199	18	11	1	Perfect. I’ll share the job description and schedule a technical discussion if that works for you.	f	2026-03-05 10:07:12.657
201	20	5	1	Hi Tirth, I found your profile while searching for backend developers with Node.js and database experience. Are you currently open to new opportunities?	t	2026-03-05 10:31:59.961
202	20	1	5	Hi! Yes, I am currently exploring new opportunities, especially backend-focused roles.	t	2026-03-05 10:33:01.576
203	20	5	1	Excellent. This role mainly focuses on designing scalable APIs and working with MongoDB and Redis for high-performance systems.	t	2026-03-05 10:33:14.615
204	20	1	5	That sounds interesting. I’ve worked with MongoDB extensively and also used Redis for caching in one of my projects.	t	2026-03-05 10:33:33.957
205	20	5	1	That’s good to know. The team also follows microservices architecture. Have you worked with microservices before?	t	2026-03-05 10:33:51.336
200	19	28	1	Hi Tirth, I noticed your experience with Docker and CI/CD pipelines. We’re currently hiring a DevOps Engineer and your profile looks like a good match.	t	2026-03-05 10:23:33.926
207	19	1	28	hii	f	2026-03-05 12:32:42.176
206	20	1	5	Yes, I have worked on a microservices-based project using Node.js and Docker.	t	2026-03-05 10:34:44.235
208	20	5	1	test	t	2026-03-05 12:39:32.655
185	16	15	5	I enjoy collaborating with designers and translating design systems into reusable components.\n	t	2026-03-04 18:51:50.416
209	20	1	5	c1	t	2026-03-05 16:26:49.429
210	20	5	1	r1	t	2026-03-05 16:26:57.957
211	20	5	1	r2	t	2026-03-05 16:27:10.561
212	20	5	1	r3	t	2026-03-05 16:27:15.358
213	20	1	5	c2	t	2026-03-05 16:27:26.722
214	20	5	1	r4	t	2026-03-05 16:27:49.974
215	20	5	1	r5	t	2026-03-05 16:27:52.468
\.


--
-- TOC entry 5285 (class 0 OID 128677)
-- Dependencies: 255
-- Data for Name: Package; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Package" (id, "planId", label, price, "jobPostLimit", "isActive") FROM stdin;
4	Free	342352	0	100	t
1	Basic	plan_SFzFpMUsPBCG1c	399	10	t
2	Pro	plan_SFzGPoz26mfv0h	699	25	t
\.


--
-- TOC entry 5293 (class 0 OID 128717)
-- Dependencies: 263
-- Data for Name: PaymentHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentHistory" (id, "razorpayPaymentId", "razorpaySubscriptionId", amount, currency, status, "paymentMethod", "failureReason", "createdAt", "updatedAt", "userId") FROM stdin;
1	pay_SG5iIKEAIAwXxB	sub_SG5hspcH5O5CkJ	399	INR	SUCCESSFUL	upi	\N	2026-02-14 16:26:30	2026-02-14 16:26:48.905	5
2	pay_SG63f6ISFRZfZ0	sub_SG63LZ8tLqrHQf	399	INR	SUCCESSFUL	upi	\N	2026-02-14 16:46:43	2026-02-14 16:47:02.826	5
9	pay_SG6C4eEO0Vll64	sub_SG6ArjqkHSh0cr	399	INR	SUCCESSFUL	upi	\N	2026-02-14 16:54:41	2026-02-14 16:55:03.822	5
14	pay_SG6E2RzGzRwsig	sub_SG6Do9bUtAtz7H	399	INR	SUCCESSFUL	upi	\N	2026-02-14 16:56:32	2026-02-14 16:56:54.097	5
23	pay_SG6VQKh637nb2H	sub_SG6UN4R8QIqTk6	399	INR	SUCCESSFUL	upi	\N	2026-02-14 17:13:00	2026-02-14 17:13:20.277	5
27	pay_SG6YeQhcVIBl8C	sub_SG6YGeWawxjS9A	399	INR	SUCCESSFUL	upi	\N	2026-02-14 17:16:03	2026-02-14 17:16:21.284	5
32	pay_SG6g1bCr1z0pmm	sub_SG6fmF11vbQAYq	399	INR	SUCCESSFUL	upi	\N	2026-02-14 17:23:02	2026-02-14 17:23:31.199	5
34	pay_SG6kfsBm2G8PKo	sub_SG6iABhtMdq6oh	399	INR	SUCCESSFUL	card	\N	2026-02-14 17:27:26	2026-02-14 17:27:57.632	5
35	pay_SG6nWmbOqnskIC	sub_SG63LZ8tLqrHQf	399	INR	SUCCESSFUL	upi	\N	2026-02-14 17:30:08	2026-02-14 17:33:05.223	5
37	pay_SG6vEzU3m3TUG6	sub_SG6uLuWa3cXJxT	399	INR	SUCCESSFUL	upi	\N	2026-02-14 17:37:26	2026-02-14 17:37:46.733	5
41	pay_SG7JAC9FJuGcfv	sub_SG7Itr1t3oDEyi	399	INR	SUCCESSFUL	upi	\N	2026-02-14 18:00:05	2026-02-14 18:00:23.015	5
42	pay_SG7MkS0Hf7JJa7	sub_SG7JT6KRAiCC2I	699	INR	SUCCESSFUL	upi	\N	2026-02-14 18:03:29	2026-02-14 18:06:18.899	5
51	pay_SGVno1JIWssnOQ	sub_SGVnRU9djZKD91	399	INR	SUCCESSFUL	upi	\N	2026-02-15 17:57:44	2026-02-15 17:57:54.182	5
52	pay_SGmswzZXye37kb	sub_SGmseLn2cujrLh	399	INR	SUCCESSFUL	upi	\N	2026-02-16 10:40:24	2026-02-16 10:40:34.517	5
53	pay_SGuP0ZHRTksUxa	sub_SGuOiJ4NbbWfkl	399	INR	SUCCESSFUL	upi	\N	2026-02-16 18:01:36	2026-02-16 18:06:07.052	5
54	pay_SGuQJALc3GE9e6	sub_SGuQ3wTciNS8s0	399	INR	SUCCESSFUL	upi	\N	2026-02-16 18:02:50	2026-02-16 18:06:15.564	5
55	pay_SHAhgnVXSmHmxp	sub_SHAhFmtHC3cKuj	399	INR	SUCCESSFUL	upi	\N	2026-02-17 09:58:23	2026-02-17 09:58:45.035	5
56	pay_SHAwANJ4oUdr4e	sub_SHAvugXi4Y38m4	399	INR	SUCCESSFUL	upi	\N	2026-02-17 10:12:06	2026-02-17 10:12:13.953	5
57	pay_SHBDTAP5W99Gzt	sub_SHBDCljdPaXh5d	399	INR	SUCCESSFUL	upi	\N	2026-02-17 10:28:28	2026-02-17 10:28:44.928	5
58	pay_SHBJ00SfJAk5zi	sub_SHBIl15xzlqdMX	699	INR	SUCCESSFUL	upi	\N	2026-02-17 10:33:43	2026-02-17 10:33:53.91	5
59	pay_SHBeqyqbdqqb31	sub_SHBecJzXrG6BiW	399	INR	SUCCESSFUL	upi	\N	2026-02-17 10:54:24	2026-02-17 10:54:32.592	5
60	pay_SHH85W7RCpDhTn	\N	399	INR	FAILED	upi	\N	2026-02-17 16:15:32	2026-02-17 16:15:33.749	5
61	pay_SHH5rvhGt317jp	\N	399	INR	FAILED	upi	\N	2026-02-17 16:13:26	2026-02-17 16:15:50.551	5
62	pay_SHGw4HbQoabo4T	\N	399	INR	FAILED	upi	\N	2026-02-17 16:04:10	2026-02-17 16:15:50.758	5
63	pay_SHH3KXQuuY878c	sub_SHH2xsDVFeiM5A	399	INR	FAILED	upi	\N	2026-02-17 16:11:02	2026-02-17 16:18:17.706	5
64	pay_SHHCF8tXl0ue6U	sub_SHH2xsDVFeiM5A	399	INR	FAILED	upi	\N	2026-02-17 16:19:28	2026-02-17 16:19:42.476	5
65	pay_SHGmyOwc8bFMz4	sub_SHGmU2uP9ZXMDd	399	INR	FAILED	upi	\N	2026-02-17 15:55:33	2026-02-17 16:19:53.51	5
66	pay_SHHE3PhSwevZHV	sub_SHH2xsDVFeiM5A	399	INR	FAILED	upi	\N	2026-02-17 16:21:11	2026-02-17 16:21:12.822	5
67	pay_SHHEFZekwpRvHL	sub_SHH2xsDVFeiM5A	399	INR	SUCCESSFUL	upi	\N	2026-02-17 16:21:22	2026-02-17 16:21:31.707	5
68	pay_SHGqwp34prgmlM	sub_SHGmU2uP9ZXMDd	399	INR	FAILED	upi	\N	2026-02-17 15:59:19	2026-02-17 16:22:55.759	5
69	pay_SHGucmSbjEbiAk	sub_SHGuTYUnLUZsjG	399	INR	FAILED	upi	\N	2026-02-17 16:02:48	2026-02-17 16:25:57.046	5
70	pay_SNYBqJ2aN0oWpf	sub_SNYBUlHdi6210o	399	INR	SUCCESSFUL	upi	\N	2026-03-05 12:50:54	2026-03-05 12:51:09.484	5
71	pay_SNY0n07yrBSsoH	sub_SNY0PmYbID93qn	399	INR	SUCCESSFUL	upi	\N	2026-03-05 12:40:26	2026-03-05 12:51:29.669	5
\.


--
-- TOC entry 5289 (class 0 OID 128695)
-- Dependencies: 259
-- Data for Name: RecruiterPackage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RecruiterPackage" (id, "startDate", "endDate", "razorpaySubscriptionId", status, "billingCycleCount", "userId", "packageId") FROM stdin;
1	2025-12-05 19:25:34.483	\N	\N	ACTIVE	0	10	4
3	2025-12-07 10:54:44.08	\N	\N	ACTIVE	0	11	4
5	2026-01-21 05:22:48.449	\N	\N	ACTIVE	0	24	4
6	2026-01-21 05:33:43.29	\N	\N	ACTIVE	0	28	4
7	2026-01-21 05:41:55.463	\N	\N	ACTIVE	0	30	4
8	2026-01-21 11:46:45.584	\N	\N	ACTIVE	0	31	4
2	2026-03-23 12:56:09	2026-03-24	sub_SNYHGx1QRVgfwG	ACTIVE	0	5	2
\.


--
-- TOC entry 5251 (class 0 OID 128502)
-- Dependencies: 221
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, token, "createdAt", "expiresAt", "userId") FROM stdin;
111	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyMDkxLCJleHAiOjE3Njk0OTY4OTF9.nLW868vB979-BZjD-YTfUq86nsJHzUgG-hg-7EGrEx4	2026-01-20 06:54:51.966	2026-01-27 06:54:51.964	1
112	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyMTgwLCJleHAiOjE3Njk0OTY5ODB9.79OGRAIrFwUcw-LNYXhwa3sXBf4UbfQIlNIQa_GADHI	2026-01-20 06:56:20.889	2026-01-27 06:56:20.888	1
113	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyMjI3LCJleHAiOjE3Njk0OTcwMjd9.WUMrctYl5KTgvbT6DE85LPGEJJmAiuh4Kp5C4SnuJ3w	2026-01-20 06:57:07.097	2026-01-27 06:57:07.096	1
114	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyMzY1LCJleHAiOjE3Njk0OTcxNjV9.a0HkjZWU4cV0awMBpwQ-2g0jREbI8PLco_6OE0PsfvM	2026-01-20 06:59:25.209	2026-01-27 06:59:25.208	1
115	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyNTMzLCJleHAiOjE3Njk0OTczMzN9.2Duqok532Jf1ZuROTnF4cMIa3O8QTumk2SLoQ0KAvwk	2026-01-20 07:02:13.509	2026-01-27 07:02:13.507	1
116	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyNTU0LCJleHAiOjE3Njk0OTczNTR9.oiPkx_tTVdBl4goD3krsA1hYZS0C7Qm0ii8ZdFhO8Zw	2026-01-20 07:02:34.985	2026-01-27 07:02:34.983	5
117	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyNjYwLCJleHAiOjE3Njk0OTc0NjB9.ZRNwNrwgE3NC-v6mXMQtPcNPNZjpFZ7Zbo5_fa6HQE4	2026-01-20 07:04:20.806	2026-01-27 07:04:20.805	1
118	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkyODg2LCJleHAiOjE3Njk0OTc2ODZ9.rUceVLeJleyAdH_x7OfuThCXUddNl4jkIz2Ppbl41vY	2026-01-20 07:08:06.403	2026-01-27 07:08:06.402	1
119	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODkzMjg4LCJleHAiOjE3Njk0OTgwODh9.LuwEE-Z4fE97mhuQ1FK4NcVGUAtTZK1W2Sra58KjOLU	2026-01-20 07:14:48.999	2026-01-27 07:14:48.997	1
120	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0MzQ0LCJleHAiOjE3Njk0OTkxNDR9.R_EwrHhjR3DHf_JPF8gk_Hi5ijaAD79QPvIRxYf2Erg	2026-01-20 07:32:24.152	2026-01-27 07:32:24.151	1
121	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0NDM5LCJleHAiOjE3Njk0OTkyMzl9.-lz4mLFe3lXxfW-A00FXnXp2s3VnZpP4k40wGwku0z4	2026-01-20 07:33:59.163	2026-01-27 07:33:59.162	1
122	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0NTIyLCJleHAiOjE3Njk0OTkzMjJ9.K3YJr__Qkcz1okjb12JW7Wan-ypdjiqlztD804cSLCM	2026-01-20 07:35:22.076	2026-01-27 07:35:22.075	1
123	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0NTQ2LCJleHAiOjE3Njk0OTkzNDZ9.DNkaybWX2jRw3eYPgPt3GPINkhtnk693DBvcIizFcKc	2026-01-20 07:35:46.438	2026-01-27 07:35:46.437	1
124	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0Njc2LCJleHAiOjE3Njk0OTk0NzZ9.6y1wqhdIMlxtFanqhtOAhVz54JuWuoKOEwg7emSNZyM	2026-01-20 07:37:56.141	2026-01-27 07:37:56.14	1
125	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0Njk0LCJleHAiOjE3Njk0OTk0OTR9.DO4M2805dVHC8BKJQbcz69oMdfv_-OWxp30MXt7g8Yw	2026-01-20 07:38:14.319	2026-01-27 07:38:14.317	1
126	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0Njk2LCJleHAiOjE3Njk0OTk0OTZ9.Ps709NQHwAOVnknu1yShRw96XP2v77wPyPDH0lwKhAg	2026-01-20 07:38:16.164	2026-01-27 07:38:16.163	1
299	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkxMzExLCJleHAiOjE3NzAwOTYxMTF9.ZERdtonNVqBy6zUOVB9JdFuz1hncIT3sxH79D7z2uv8	2026-01-27 05:21:51.045	2026-02-03 05:21:51.042	1
300	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkxMzYyLCJleHAiOjE3NzAwOTYxNjJ9.oXItU0TfxX81f0lrQiW9w_AJsurp23dWf-LcoXBaFO0	2026-01-27 05:22:42.663	2026-02-03 05:22:42.661	5
130	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0Njk3LCJleHAiOjE3Njk0OTk0OTd9.tUF7SVYC_ZGRV-vzwA_70jbsT5rwtdQpz7RbS6a-LYE	2026-01-20 07:38:17.036	2026-01-27 07:38:17.035	1
301	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkxMzgyLCJleHAiOjE3NzAwOTYxODJ9.qcQ88eXz3v52Rm2Xz0_d3QRRJU1J1EzSujCxH20D_Gc	2026-01-27 05:23:02.558	2026-02-03 05:23:02.557	1
132	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0NzYzLCJleHAiOjE3Njk0OTk1NjN9.6lFtKkI_0H2sF4AHA6haik198-tcTaYxiVZcHwrxvvQ	2026-01-20 07:39:23.763	2026-01-27 07:39:23.761	1
133	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0ODIwLCJleHAiOjE3Njk0OTk2MjB9.jSJNmHaqLG6wcx137bKieUVcig6XW2IaVYqv2oqEim4	2026-01-20 07:40:20.117	2026-01-27 07:40:20.115	1
134	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0ODIxLCJleHAiOjE3Njk0OTk2MjF9.wauTM5SFee69zkHVUrsNOqOo4GE8IGLidThaIXt5TqI	2026-01-20 07:40:21.323	2026-01-27 07:40:21.321	1
135	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0ODIyLCJleHAiOjE3Njk0OTk2MjJ9.4Fl2Fo9dayPeQZMx1Zj7RhlLo7OH0eXAEVBuT9ybWd0	2026-01-20 07:40:22.035	2026-01-27 07:40:22.034	1
306	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkyNTE4LCJleHAiOjE3NzAwOTczMTh9.IEKxndROLRFRCV_LMXJZt9PsW7q7Atd4ML1WVP-TZDA	2026-01-27 05:41:58.751	2026-02-03 05:41:58.749	1
307	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkyNTUxLCJleHAiOjE3NzAwOTczNTF9.VaAmlIVWTfYeznTZLjH6wPL7u-eBNxwTo44R318KopY	2026-01-27 05:42:31.763	2026-02-03 05:42:31.761	5
138	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk0ODM2LCJleHAiOjE3Njk0OTk2MzZ9.Zoq5_m2SayCCXY-O-VMK6jUVMUpCkdjwkwhpuxmNj6o	2026-01-20 07:40:36.633	2026-01-27 07:40:36.632	1
139	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk2NTM1LCJleHAiOjE3Njk1MDEzMzV9.CgQbsiBsFbfwfzTERNicHF7-a5wKfi5KvGAIPmv6ilM	2026-01-20 08:08:55.202	2026-01-27 08:08:55.201	1
140	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk2ODk4LCJleHAiOjE3Njk1MDE2OTh9.AxxvvZmEKebAd40_FNaCVz8jES--DSmjoOHnhuhSItA	2026-01-20 08:14:58.091	2026-01-27 08:14:58.089	1
141	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk2OTI1LCJleHAiOjE3Njk1MDE3MjV9.IQU3anOjLrc_Emxzh3CVrStgYaEOfgWO8O-QerS1Lso	2026-01-20 08:15:25.696	2026-01-27 08:15:25.695	1
142	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4ODk2OTYzLCJleHAiOjE3Njk1MDE3NjN9.DbpljTh36ire0mQ9fV5R4TrbYww0dlNqQBc-9KwCi5I	2026-01-20 08:16:03.313	2026-01-27 08:16:03.311	1
310	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDk4ODE4LCJleHAiOjE3NzAxMDM2MTh9.Nkt0RgfsQH6iI4d-L9Cpb9l2gs7lRaEkK3hRaYIbcBk	2026-01-27 07:26:58.043	2026-02-03 07:26:58.042	5
314	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NTIzNTkyLCJleHAiOjE3NzAxMjgzOTJ9.FGzNs_KsAeGTJ1OMgZxWJQ5XbH1PqXTHzZ6Wj_5kYpQ	2026-01-27 14:19:52.108	2026-02-03 14:19:52.106	5
319	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM0MDI4LCJleHAiOjE3NzAxMzg4Mjh9.zSj7syjTwoAeTMtYZqU6cdyuJV2t2RrW2rTZ_FFEAj8	2026-01-27 17:13:48.779	2026-02-03 17:13:48.777	5
302	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkxNTc5LCJleHAiOjE3NzAwOTYzNzl9.MRPYZpPn4a1R3VH3q6ROjbmj7W3eRNaI1mGV5ICoSPo	2026-01-27 05:26:19.339	2026-02-03 05:26:19.337	5
308	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDk0NTAzLCJleHAiOjE3NzAwOTkzMDN9.TehAo7bCNat50WddZci5nc9DBUarlFzWcgClyP67VyQ	2026-01-27 06:15:03.902	2026-02-03 06:15:03.9	5
311	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NTAyMTkzLCJleHAiOjE3NzAxMDY5OTN9.ZUL_h__Q9bvjzAlUNmYjwOFrjKTmNs2dzdNLYgLiaMg	2026-01-27 08:23:13.627	2026-02-03 08:23:13.626	5
158	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTIyODg3LCJleHAiOjE3Njk1Mjc2ODd9.b-6VoCGT2OldTkiXNIwdzu8l92x21pBalyvkbn4-5Ro	2026-01-20 15:28:07.952	2026-01-27 15:28:07.95	1
159	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTI0MjQ0LCJleHAiOjE3Njk1MjkwNDR9.-KAb3A1Eh2o_MdpJ3CpOTFUMRNW5LHwK3HuMdF86ebM	2026-01-20 15:50:44.511	2026-01-27 15:50:44.51	1
160	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTczMjg4LCJleHAiOjE3Njk1NzgwODh9.JxM1h6FQpEr7Ieb4cemJv3iP2HpjG840JueITwHmVgo	2026-01-21 05:28:08.644	2026-01-28 05:28:08.641	24
161	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY4OTczNjU2LCJleHAiOjE3Njk1Nzg0NTZ9.vKHzEeNEybFjiMy2nAZMvTXEUDMcKPzLrGQ-YUM_D2Y	2026-01-21 05:34:16.515	2026-01-28 05:34:16.513	28
162	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI5LCJlbWFpbCI6ImRldjNAZ21haWwuY29tIiwiaWF0IjoxNzY4OTczODM0LCJleHAiOjE3Njk1Nzg2MzR9.PXQhmbwLMnx8kpYpV--D8_RgiQD87FzHdZOLziECmGc	2026-01-21 05:37:14.037	2026-01-28 05:37:14.036	29
163	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMwLCJlbWFpbCI6ImRldjRAZ21haWwuY29tIiwiaWF0IjoxNzY4OTc0MTMwLCJleHAiOjE3Njk1Nzg5MzB9.kj1gAdqfUxjRgr7PQotNghjvueweF9k15L_qwCcXLq8	2026-01-21 05:42:10.2	2026-01-28 05:42:10.198	30
164	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTc2MTA4LCJleHAiOjE3Njk1ODA5MDh9.M5efrrOgbewKMRYcRAOrzILymLroHej9ryLTYW3oh1Y	2026-01-21 06:15:08.591	2026-01-28 06:15:08.59	1
165	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTc2MzE4LCJleHAiOjE3Njk1ODExMTh9.G68TIMG2wyOQ7q1YiKOkPJ6y_LcGlABVWsBxpFIG3Xk	2026-01-21 06:18:38.783	2026-01-28 06:18:38.781	1
166	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTc4NzQ0LCJleHAiOjE3Njk1ODM1NDR9.hMIJqder_S8DUCKyEktdWFs6vfR59cnnpQWva7uHg1c	2026-01-21 06:59:04.396	2026-01-28 06:59:04.395	1
167	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTc5MzkzLCJleHAiOjE3Njk1ODQxOTN9.9BdtGv8fCs-yJ3cCcwnu6875T-MA0SeXKkN12LtdmTc	2026-01-21 07:09:53.336	2026-01-28 07:09:53.335	1
168	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTgyNzU5LCJleHAiOjE3Njk1ODc1NTl9.HN35IySCJFpIhrEnWN9EoA_QpEKzHPflf6tiII2AD70	2026-01-21 08:05:59.742	2026-01-28 08:05:59.74	1
169	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTgzMDk1LCJleHAiOjE3Njk1ODc4OTV9.-97m-zvKLKWX0fIhQvx-sY1jSqdeP9D3s8YwubiejAg	2026-01-21 08:11:35.44	2026-01-28 08:11:35.439	1
170	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTgzNjAzLCJleHAiOjE3Njk1ODg0MDN9.rhxv5dOzrt7g0ki7UbGUnaBdtzgfZdjU1v1sh3y-mSo	2026-01-21 08:20:03.422	2026-01-28 08:20:03.42	1
171	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTgzNzc2LCJleHAiOjE3Njk1ODg1NzZ9.PN2RLRObFBdg0LaJ6YQG_c8lFv0zRUm--HX_Mf56pAY	2026-01-21 08:22:57.001	2026-01-28 08:22:57	1
172	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg0MDU4LCJleHAiOjE3Njk1ODg4NTh9.NXR7MsLPTHWvOzCfURY5411gqW3AS60JlhlpPe4RJ0Y	2026-01-21 08:27:38.621	2026-01-28 08:27:38.619	1
173	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg0NTE4LCJleHAiOjE3Njk1ODkzMTh9.2f0MPxRyqOnwbLgTNiUZry9Q7cAqYPr_0ILhAsMWvJI	2026-01-21 08:35:18.407	2026-01-28 08:35:18.405	1
174	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg0NjYwLCJleHAiOjE3Njk1ODk0NjB9.330_D2uI6I-DVZuJC2h44A9LUQQMyCU2JsWPRMR5RvQ	2026-01-21 08:37:40.271	2026-01-28 08:37:40.269	1
175	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg3NTA0LCJleHAiOjE3Njk1OTIzMDR9.ASU1lzQnh4Xr4LXvJ96VW_1KeWIbmxUqsOLRHHBiIeY	2026-01-21 09:25:04.374	2026-01-28 09:25:04.372	1
176	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg3ODU1LCJleHAiOjE3Njk1OTI2NTV9.QB9pN3dDCIk2qDEuMZ2agfPnv2j8x979PR9EkcmyUYI	2026-01-21 09:30:55.268	2026-01-28 09:30:55.267	1
177	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg3OTQ0LCJleHAiOjE3Njk1OTI3NDR9.l18MKMB3hpc2yh4ANpZs87m-hqgJZPE6xOh15zrqaXA	2026-01-21 09:32:24.171	2026-01-28 09:32:24.171	1
178	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg4MTI4LCJleHAiOjE3Njk1OTI5Mjh9.-RjucIfGSmJJw2j60b_QLM51szeC8K8T98XPNFTTOsw	2026-01-21 09:35:28.583	2026-01-28 09:35:28.582	1
179	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg4MjAyLCJleHAiOjE3Njk1OTMwMDJ9.MPWQkSYu78j918YRGWZHkAGpcBRFvytL-t8TUQg45vw	2026-01-21 09:36:42.404	2026-01-28 09:36:42.402	1
180	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg4NTQzLCJleHAiOjE3Njk1OTMzNDN9.achJ0qkO3AwrJY7zmjDCEPPn4pWzSMAFn1UOtioOp7E	2026-01-21 09:42:23.812	2026-01-28 09:42:23.811	1
181	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg4NjIwLCJleHAiOjE3Njk1OTM0MjB9.Tw9KCg1cwsq6xwF-yYR7GVc6kyHgpCWO4ZKRwgTu8VI	2026-01-21 09:43:40.41	2026-01-28 09:43:40.409	1
182	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg4ODAxLCJleHAiOjE3Njk1OTM2MDF9.r6Ft9qMoJa42KXm3dBpn-iEYQMY-HWkDf_aakujR0vY	2026-01-21 09:46:41.223	2026-01-28 09:46:41.222	1
183	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg5MjQxLCJleHAiOjE3Njk1OTQwNDF9.FcpaeMuVUf7fZKumkjQSd13tECEKDQh4tWJsXzvWn8w	2026-01-21 09:54:01.529	2026-01-28 09:54:01.528	1
184	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTg5ODIzLCJleHAiOjE3Njk1OTQ2MjN9.4bmer7WhJXKLqLO4E9TXLR72MVnhmFK9X0TP3sEasKg	2026-01-21 10:03:43.784	2026-01-28 10:03:43.783	1
185	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTkwMTMxLCJleHAiOjE3Njk1OTQ5MzF9.rwzO9JAKJlXQhLWfN6XVr4hddyfWFbDxveB9_sr5JEs	2026-01-21 10:08:51.572	2026-01-28 10:08:51.571	1
186	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTkwMTczLCJleHAiOjE3Njk1OTQ5NzN9.J284qYhw7gmhR5D6NHBRNkuTvj8dTtRl1CxxMeKg07g	2026-01-21 10:09:33.507	2026-01-28 10:09:33.506	1
187	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTkwMjQ2LCJleHAiOjE3Njk1OTUwNDZ9.ZIB7JcBhNuXd04dQLPzDzwvO26UoGgyIQj5PPRjn1Vs	2026-01-21 10:10:46.861	2026-01-28 10:10:46.859	1
188	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY4OTkxNzE4LCJleHAiOjE3Njk1OTY1MTh9.cCv87VzVXYuO_Dy5VtoZwfjQ48zCbnUijOeDkI4mx7o	2026-01-21 10:35:18.688	2026-01-28 10:35:18.686	1
189	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDE3MjQ1LCJleHAiOjE3Njk2MjIwNDV9.AMA5tIlBDLXOLORndmbiWMwScAkt6nlzUQRcOn6iu3U	2026-01-21 17:40:45.083	2026-01-28 17:40:45.082	24
190	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDE3NjMxLCJleHAiOjE3Njk2MjI0MzF9.U9xOTbFf55LeDRixyB4HUjVvHzZaWe52XiDSExxU-Rg	2026-01-21 17:47:11.493	2026-01-28 17:47:11.49	24
191	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDE3OTQ2LCJleHAiOjE3Njk2MjI3NDZ9.BBtVmRPPpbEcXUskBVqM57mRY_0XR-FwZJzuJs6DXzc	2026-01-21 17:52:26.44	2026-01-28 17:52:26.438	24
192	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDE4MDgwLCJleHAiOjE3Njk2MjI4ODB9.1nhpXt-o68coVCNZqprT-iLqbCmOQofiImaomnh4C-g	2026-01-21 17:54:40.861	2026-01-28 17:54:40.86	24
193	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDIyMzEzLCJleHAiOjE3Njk2MjcxMTN9.bCaR1f79mkfnLpiOs9PMUeeNnESSify42t1WRBS6Pbw	2026-01-21 19:05:13.565	2026-01-28 19:05:13.564	1
194	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDU2MjU0LCJleHAiOjE3Njk2NjEwNTR9.1rov-XdhSR8WLdUOOJcqT44aDOeH5gE7OVI1ucCV8qI	2026-01-22 04:30:54.761	2026-01-29 04:30:54.76	24
198	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMyLCJlbWFpbCI6InRpcnRoNzQ0Y2xnQGdtYWlsLmNvbSIsImlhdCI6MTc2OTA2OTgyMiwiZXhwIjoxNzY5Njc0NjIyfQ.kg8sHT3d4rzXbDk0BB7Ze3bnCPuSKxZ5Qj7EFTlmyF8	2026-01-22 08:17:02.317	2026-01-29 08:17:02.315	32
204	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5MDc1MDYzLCJleHAiOjE3Njk2Nzk4NjN9.tbn5Dl5od0K2ESp4p4QQRRmP9X21PKpJbGDBvHWjEL4	2026-01-22 09:44:23.587	2026-01-29 09:44:23.585	24
205	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MDc3OTQxLCJleHAiOjE3Njk2ODI3NDF9.30BE68_y7rujltCFkGoEc03L5mguifzuYBsKzE0U8Sk	2026-01-22 10:32:21.629	2026-01-29 10:32:21.627	5
206	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MDc5MTA4LCJleHAiOjE3Njk2ODM5MDh9.mJ5M0Uwyncx99aHuz-piqVsBg_s9Of67Kk6Zp07nytE	2026-01-22 10:51:48.793	2026-01-29 10:51:48.791	28
207	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MDc5OTY5LCJleHAiOjE3Njk2ODQ3Njl9.SUrPMwfzr2ghR0Y3NiSIYOMHoAzaXFbe5YgLnMpw3Ew	2026-01-22 11:06:09.268	2026-01-29 11:06:09.266	5
208	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MDgxOTUzLCJleHAiOjE3Njk2ODY3NTN9.njjit49X6STN-2P4zqujFyuhYw0Iw7lCL6JH6kNOChc	2026-01-22 11:39:13.382	2026-01-29 11:39:13.381	5
210	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MDk5NTk4LCJleHAiOjE3Njk3MDQzOTh9.1ZI72eyIx0V3idXEzIFVLpVTqYaNkD3l25jevgFQsDU	2026-01-22 16:33:18.79	2026-01-29 16:33:18.788	28
211	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTAzODU3LCJleHAiOjE3Njk3MDg2NTd9.m_CymWIRIm2VqPiWfORYkmhU6-aHUciBFCb4TgC4xF0	2026-01-22 17:44:17.895	2026-01-29 17:44:17.893	5
213	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTA3Mzg2LCJleHAiOjE3Njk3MTIxODZ9.RB3Iq2iXJ5L9n_hyyNNAr4OMxKoVJBIzMC4uKRsmb-Q	2026-01-22 18:43:06.984	2026-01-29 18:43:06.982	28
214	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTA3NDE3LCJleHAiOjE3Njk3MTIyMTd9.xCr9LhOf_WqI5cv530fTJe-eBjiqo6qXzMGEPhX_nO0	2026-01-22 18:43:37.152	2026-01-29 18:43:37.15	5
215	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTA3Nzk1LCJleHAiOjE3Njk3MTI1OTV9.mpcpWWdO5PFtFfOUd9LP2wJQ6lueZz3Imy4y3IlrP0Q	2026-01-22 18:49:56	2026-01-29 18:49:55.999	28
216	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTQyODQzLCJleHAiOjE3Njk3NDc2NDN9.7NLx4tD76vE6YukaFVO3BXjSYNx4Xzrk9WVTXImPZpk	2026-01-23 04:34:03.125	2026-01-30 04:34:03.123	28
217	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTQyOTQ4LCJleHAiOjE3Njk3NDc3NDh9.e0SLY2C1k1BiiGyi94XxeuGkfi0c98XqicDCrvoVsic	2026-01-23 04:35:48.602	2026-01-30 04:35:48.6	5
218	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTQ3NzQ0LCJleHAiOjE3Njk3NTI1NDR9.v15P0ss4eBPrkfloIhkyvskMEVjNAwtHVQL9YFyW1ic	2026-01-23 05:55:44.99	2026-01-30 05:55:44.988	28
219	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTQ3ODU0LCJleHAiOjE3Njk3NTI2NTR9.95pufKx4YLnKf2jUurGkoym8IdsdmyfQlT1Yb4iykG8	2026-01-23 05:57:34.479	2026-01-30 05:57:34.478	5
220	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTQ5MDYzLCJleHAiOjE3Njk3NTM4NjN9.zT0HT_HrZMoVWs95_CYeuCuflnTdwTT3oJSKVC8WawA	2026-01-23 06:17:43.515	2026-01-30 06:17:43.514	28
221	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTQ5MDgyLCJleHAiOjE3Njk3NTM4ODJ9.XEfJBuJG-8QeKbhrPa47ZCPf4zt5hyGVLuAVjJet-Mw	2026-01-23 06:18:02.27	2026-01-30 06:18:02.269	5
222	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTUxOTE0LCJleHAiOjE3Njk3NTY3MTR9.TwWNXG-AG4MrTOpQzlvhNVvI2t_uWT_gV1FXG7fxciA	2026-01-23 07:05:14.639	2026-01-30 07:05:14.637	28
223	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTUyMTgyLCJleHAiOjE3Njk3NTY5ODJ9.Jj4cZ5k5eLh7ty8K_H8QLxyuiMlBUuY7DeKwTozmLfQ	2026-01-23 07:09:42.098	2026-01-30 07:09:42.097	5
225	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTYyODg1LCJleHAiOjE3Njk3Njc2ODV9.gMOJZKTeO0QABkNMd_W1UfZz_ubGEwOxmcj7QC7JpL0	2026-01-23 10:08:05.774	2026-01-30 10:08:05.773	28
228	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTg5Nzk4LCJleHAiOjE3Njk3OTQ1OTh9.kuLhIeYP4gzUawtDTesR6AUL6ath5FuAZIhDaJe2Xd4	2026-01-23 17:36:38.35	2026-01-30 17:36:38.348	5
229	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTkwNzA5LCJleHAiOjE3Njk3OTU1MDl9.OzKFVs395vZnQRsGhquTeMgAy0JlBEvjmLz4xYp2x9E	2026-01-23 17:51:49.475	2026-01-30 17:51:49.474	5
230	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTk1MDQxLCJleHAiOjE3Njk3OTk4NDF9.3NKooCC56yHTo-WKZ5DReLMCCerdB-YUZ1rAbHX82Ow	2026-01-23 19:04:01.4	2026-01-30 19:04:01.398	5
233	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MTk2NjMwLCJleHAiOjE3Njk4MDE0MzB9.JeVAur-uRmAsy4v3O8a-AzUMK2VQthYE_pR_yCgh8bc	2026-01-23 19:30:30.475	2026-01-30 19:30:30.473	5
242	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MjU2OTM4LCJleHAiOjE3Njk4NjE3Mzh9.otTiGKZq9Wygrbel62J7RbCWwk8ds80itmRn_HUm1cw	2026-01-24 12:15:38.938	2026-01-31 12:15:38.937	5
243	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5MjU2OTYxLCJleHAiOjE3Njk4NjE3NjF9.k8VdSz-Hq8lug5rtMsm_hJKQ52yFPYGohbMRfF9CpY0	2026-01-24 12:16:01.151	2026-01-31 12:16:01.149	1
244	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5MjU3NzExLCJleHAiOjE3Njk4NjI1MTF9.UXg6KVhZuRHVWOPeftafy90kDjDER57azEg1Mvqw8zg	2026-01-24 12:28:31.276	2026-01-31 12:28:31.273	5
303	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkyMTgxLCJleHAiOjE3NzAwOTY5ODF9.Lwxfb5N7lhGgPEp3PNfENUE1vFFrL1sHx14CGtCrdEA	2026-01-27 05:36:21.732	2026-02-03 05:36:21.73	1
304	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkyMjQxLCJleHAiOjE3NzAwOTcwNDF9.Aw2kypKRC4p13ql5sWuCrnUF-3vlEvM6is9W3Dw04XU	2026-01-27 05:37:21.741	2026-02-03 05:37:21.739	1
305	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDkyMzA3LCJleHAiOjE3NzAwOTcxMDd9.3g4b-2McqGLDdxnB58lh_J-wkQqMxwEwa-WXGvkRVkI	2026-01-27 05:38:27.007	2026-02-03 05:38:27.005	5
309	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDk2MTEwLCJleHAiOjE3NzAxMDA5MTB9.toiDAZixCGHlLcej78vLcDKt53FSO9PpWxKvb7Cb5Yg	2026-01-27 06:41:50.254	2026-02-03 06:41:50.252	5
312	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NTEyNTAzLCJleHAiOjE3NzAxMTczMDN9.h28SOdMZJ2oX7OXjgrLeEiGJbB-qDrR3WI2VRi4mcuA	2026-01-27 11:15:03.977	2026-02-03 11:15:03.974	5
251	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5MjY0OTMwLCJleHAiOjE3Njk4Njk3MzB9.4TdzwpaQUf1WsfmAA9JYZ4MxehRsPG0IouD7O7v0Kv0	2026-01-24 14:28:50.668	2026-01-31 14:28:50.667	1
252	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5MjY1OTgwLCJleHAiOjE3Njk4NzA3ODB9.HWtNZKGbgmFmaOvdQ7LNQh3rY5Sdy0xSqMtO8o-lAG8	2026-01-24 14:46:20.052	2026-01-31 14:46:20.051	1
253	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5Mjc4NjQ3LCJleHAiOjE3Njk4ODM0NDd9.Zd0qfqu9MoPCMoUhPXwRAR4vm3JaIZs3UdzYxM7q5hM	2026-01-24 18:17:27.014	2026-01-31 18:17:27.012	1
254	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5MjgwNzk2LCJleHAiOjE3Njk4ODU1OTZ9.Lq17Wj80hI86XFbYoA-l0HdXTD0qFdeZjpl9rRBXUvU	2026-01-24 18:53:16.777	2026-01-31 18:53:16.774	1
313	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NTEyNTU0LCJleHAiOjE3NzAxMTczNTR9.nAYgjQJEL1tsJIDNxGXT4g5kSdN6h2SnUB9dwX_XP_0	2026-01-27 11:15:54.615	2026-02-03 11:15:54.614	5
257	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTI4MzMzMCwiZXhwIjoxNzY5ODg4MTMwfQ.YsBJr4WJrSS78C7-gdFShBFodOipoW15a9v9EYjnrzk	2026-01-24 19:35:30.407	2026-01-31 19:35:30.406	10
258	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTMyMTY5NCwiZXhwIjoxNzY5OTI2NDk0fQ.mMLMFx9NRdtanvqnoXtvFijCkh24xs8ghb8XPV_TTBc	2026-01-25 06:14:54.166	2026-02-01 06:14:54.163	10
259	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTMzMzI3MCwiZXhwIjoxNzY5OTM4MDcwfQ.KF4kKUgd-6d4rMRp3x3FttVcXhBs4BQUlafqgC8ej64	2026-01-25 09:27:50.585	2026-02-01 09:27:50.584	10
260	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTMzNDE5OSwiZXhwIjoxNzY5OTM4OTk5fQ.qT3NZb0v713a4TSMk_Kq0OqZXC61jeVmTvr53Fy8d-M	2026-01-25 09:43:19.017	2026-02-01 09:43:19.014	10
261	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTMzNTEwNSwiZXhwIjoxNzY5OTM5OTA1fQ.0o9ut14Phr0acN52B3SS_6GyuDH49Ye-Hj9lBeLoW98	2026-01-25 09:58:25.91	2026-02-01 09:58:25.908	10
262	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTMzNjIzMSwiZXhwIjoxNzY5OTQxMDMxfQ.fEf_QlyQoJeYhr7FL5jagWbRMGwzCIr_shzrbK613FE	2026-01-25 10:17:11.971	2026-02-01 10:17:11.969	10
318	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTMwMzgyLCJleHAiOjE3NzAxMzUxODJ9.SmVUGNLfmaOfnqug84UYeWXT84gDslSIoQPVUfS63T0	2026-01-27 16:13:02.259	2026-02-03 16:13:02.257	1
320	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM1MDg0LCJleHAiOjE3NzAxMzk4ODR9.h4uaLzzkcHkAz5m9iI0vj7TgeQJOhGtTurtMBzUSabs	2026-01-27 17:31:24.157	2026-02-03 17:31:24.155	1
321	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM1Mjc0LCJleHAiOjE3NzAxNDAwNzR9.vGITp-JWPNAooCZgbKfAJ6cMb_7EFNaGwUb84kKVxPE	2026-01-27 17:34:34.023	2026-02-03 17:34:34.021	5
267	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTM0MjcyOSwiZXhwIjoxNzY5OTQ3NTI5fQ.zzFYCB3sBOZtzFf6C7dVkEfP7QK_Naeu-bThu2VVM8k	2026-01-25 12:05:29.736	2026-02-01 12:05:29.734	10
268	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTM0NjQwMywiZXhwIjoxNzY5OTUxMjAzfQ.Yi0pafVVwpE7evn8T2lByUjxXuIANs2pr5jZOJTOzUQ	2026-01-25 13:06:43.032	2026-02-01 13:06:43.031	10
322	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM1Mjg2LCJleHAiOjE3NzAxNDAwODZ9.aHNGCdcJgJib0-u_AYIFA5g-0sNBzNtgJukejn6iG_0	2026-01-27 17:34:46.521	2026-02-03 17:34:46.52	1
323	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM3MTg1LCJleHAiOjE3NzAxNDE5ODV9.DMP7fa10APMPAB6Ern84RVwB6R5e_CEhDnaJMqMOdOw	2026-01-27 18:06:25.19	2026-02-03 18:06:25.189	1
271	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTM0ODQwNywiZXhwIjoxNzY5OTUzMjA3fQ._Ylu27IDr25PK6Cu1j5FkTVdNrS3j9dznY18dPLwQGY	2026-01-25 13:40:07.148	2026-02-01 13:40:07.146	10
324	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM4Njc0LCJleHAiOjE3NzAxNDM0NzR9.FU0g5pY3xj7ekuhb51OoRa3x_jfI34PwQGrOs67Cg7s	2026-01-27 18:31:14.66	2026-02-03 18:31:14.658	1
325	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTM5OTc1LCJleHAiOjE3NzAxNDQ3NzV9.Pu7Lfa7mlPhuoopGrWh_jBI4j4w3HY-Z0nj6R5cXRbs	2026-01-27 18:52:55.865	2026-02-03 18:52:55.863	1
279	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJlbWFpbCI6InRlc3Q0QGdtYWlsLmNvbSIsImlhdCI6MTc2OTQwNDU0NywiZXhwIjoxNzcwMDA5MzQ3fQ.AyUPte2qEESe-9KbHLjcSGeipjihD7_MlooC4qdXBak	2026-01-26 05:15:47.279	2026-02-02 05:15:47.278	10
280	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDA0NjA1LCJleHAiOjE3NzAwMDk0MDV9.eblVI8-kLkQqm6_d1loqi13lbpQcBXWPGrHc88_Pn28	2026-01-26 05:16:45.825	2026-02-02 05:16:45.823	1
281	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDA0OTk5LCJleHAiOjE3NzAwMDk3OTl9.ZRBVQprwRVAabAQ8eEZYJCnLkB7WeV19sEuWMm8eINs	2026-01-26 05:23:19.122	2026-02-02 05:23:19.121	5
283	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDEzMDgzLCJleHAiOjE3NzAwMTc4ODN9.6peehVoP_8ZMRLTlHxXGVTAcRm0coRwgYdDKFV4jWao	2026-01-26 07:38:03.987	2026-02-02 07:38:03.984	5
284	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDEzMDk5LCJleHAiOjE3NzAwMTc4OTl9.lzBZiAq4hZdFhEADlQEEq3GOr1UyUx3GqTM47NrRbPE	2026-01-26 07:38:19.74	2026-02-02 07:38:19.738	1
285	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDE0NTkzLCJleHAiOjE3NzAwMTkzOTN9.jw5vnvqKUybNq7ckt4qjzQ1BODmek7za8qFMzlsy1IQ	2026-01-26 08:03:13.387	2026-02-02 08:03:13.386	1
286	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NDE0ODE5LCJleHAiOjE3NzAwMTk2MTl9.8Cb11nRrgM6WEqnda7j3osE07dYidVAUcUgi0tevNpw	2026-01-26 08:06:59.096	2026-02-02 08:06:59.095	5
287	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NDE0ODU5LCJleHAiOjE3NzAwMTk2NTl9.OlbLTgrk49bJPGaFZMAcJ7xO2HDc4NydnQ4-vYbWDM8	2026-01-26 08:07:39.95	2026-02-02 08:07:39.949	1
326	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTc1NjIwLCJleHAiOjE3NzAxODA0MjB9.hPtMIvM4gekVY2mGCiCW0A2oTYK8y17YsrzoIUfy07Q	2026-01-28 04:47:00.141	2026-02-04 04:47:00.14	1
327	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTc2NTI2LCJleHAiOjE3NzAxODEzMjZ9.XDq9m0KVMQzY2UUUkirI5xoOLpMtotBX5ywmw9_Shcw	2026-01-28 05:02:06.495	2026-02-04 05:02:06.492	1
329	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTgxNTM3LCJleHAiOjE3NzAxODYzMzd9.e6LGiTfcKpdaGCcpezTQDyCJUSGUxrMH7ukduqroF2g	2026-01-28 06:25:37.013	2026-02-04 06:25:37.012	1
330	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6InRlc3QxMUBnbWFpbC5jb20iLCJpYXQiOjE3Njk1ODQ0OTgsImV4cCI6MTc3MDE4OTI5OH0.LsHfgzcv5VjTg9t8wy6D7lDHAQieMOLhz33Qyx43K9U	2026-01-28 07:14:58.945	2026-02-04 07:14:58.944	17
331	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3LCJlbWFpbCI6InRlc3QxMUBnbWFpbC5jb20iLCJpYXQiOjE3Njk1ODU0MjUsImV4cCI6MTc3MDE5MDIyNX0.KEieZFgtVf8JhbXHP2WYWPxLJalBTo1eSxgwsnkq5xw	2026-01-28 07:30:25.954	2026-02-04 07:30:25.953	17
332	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTg1NTA4LCJleHAiOjE3NzAxOTAzMDh9.g5Xs94A1paRdP062Yo43gLNHxWA4MoPFiU0mLxBBgrs	2026-01-28 07:31:48.335	2026-02-04 07:31:48.333	1
335	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTkwMDIxLCJleHAiOjE3NzAxOTQ4MjF9.9-a21snBjMCDp9SMW6M8ApL5e7aIBMsyususOZSB-yk	2026-01-28 08:47:01.044	2026-02-04 08:47:01.042	1
336	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NTkwNzkyLCJleHAiOjE3NzAxOTU1OTJ9.ZkfHMobdchqWfq1rWKP6v5kBoDsoYzasjsYguR8hfo4	2026-01-28 08:59:52.807	2026-02-04 08:59:52.806	1
339	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5NjAyMDYyLCJleHAiOjE3NzAyMDY4NjJ9.MKlQi-FL9FSV7PIJ6YLY4mxmjkpnPN71jkUM7uj86mw	2026-01-28 12:07:42.573	2026-02-04 12:07:42.572	24
340	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NjAyMDgyLCJleHAiOjE3NzAyMDY4ODJ9.BR5cliLzxlK0ljtEoymao3Hn8BsefrebYmYg1yuqKQk	2026-01-28 12:08:02.036	2026-02-04 12:08:02.034	1
341	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6InRlc3Q2QGdtYWlsLmNvbSIsImlhdCI6MTc2OTYwMjE0NCwiZXhwIjoxNzcwMjA2OTQ0fQ.hfFDnPJMJdsPVfgfI72Xlm6KsZa49ZLzfSHlFUiU_pw	2026-01-28 12:09:04.62	2026-02-04 12:09:04.619	12
344	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NjAzNzAxLCJleHAiOjE3NzAyMDg1MDF9.tF7ISiLgU2DqSeF9vB8apvC2HROPlm0Yrb3o90zD4jo	2026-01-28 12:35:01.444	2026-02-04 12:35:01.442	1
345	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NjA0ODI0LCJleHAiOjE3NzAyMDk2MjR9.75_oNck9J-uBK6NVo17ngtDpumFJjt5xCTSl5OqmQkg	2026-01-28 12:53:44.462	2026-02-04 12:53:44.46	1
347	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NjA1OTUzLCJleHAiOjE3NzAyMTA3NTN9.YLFYRN6moSpFCwN6U0PKGXpZ9iuq1Xcaobur-vW-ga0	2026-01-28 13:12:33.213	2026-02-04 13:12:33.211	1
357	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NjI3NDc5LCJleHAiOjE3NzAyMzIyNzl9.UDnHdnqJsUwxm2ZMkU1Mrc1UK0BAyLGlolaIxSZrhj4	2026-01-28 19:11:19.917	2026-02-04 19:11:19.915	1
375	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NjgzNTE2LCJleHAiOjE3NzAyODgzMTZ9.62-BpPkwAdlEmRlYwZT-CE53mSQA5R6iSE8sleXWj64	2026-01-29 10:45:16.188	2026-02-05 10:45:16.187	5
380	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5Njg0NTg4LCJleHAiOjE3NzAyODkzODh9.dP0H5SW3QtQu2F3uIlhVTSHS5ueWeM37cMECTz0Gfi4	2026-01-29 11:03:08.153	2026-02-05 11:03:08.151	5
381	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5Njg2Mjc0LCJleHAiOjE3NzAyOTEwNzR9.9kACULzrtZSknEvfSZZFZAsAY3I22LrJhg2Gm-qi-UA	2026-01-29 11:31:14.318	2026-02-05 11:31:14.316	5
382	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NzA5OTY2LCJleHAiOjE3NzAzMTQ3NjZ9.MCPLLwTEhW5F2lvmxKXtG7DrPVG1Sm5X6aGxIRsesFI	2026-01-29 18:06:06.109	2026-02-05 18:06:06.108	5
383	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NzUzNjkxLCJleHAiOjE3NzAzNTg0OTF9.cURa_cBjq_m0n_uv_VHRHqQI0PO5xXTONuqJr7FZ85g	2026-01-30 06:14:51.961	2026-02-06 06:14:51.959	5
384	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5NzU0NzAyLCJleHAiOjE3NzAzNTk1MDJ9.pUpJ5qNADX7vpauZwxYRTXwe7rm81iD3U7w1hY3ix6E	2026-01-30 06:31:42.237	2026-02-06 06:31:42.235	5
385	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5NzY3NDU4LCJleHAiOjE3NzAzNzIyNTh9.xdMWHbNiz_SSOH3mzZfE9wYwOWMCQy6q4mm_kGZkIr0	2026-01-30 10:04:18.974	2026-02-06 10:04:18.972	1
386	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5Nzk1OTE4LCJleHAiOjE3NzA0MDA3MTh9.lFqSm8CDsaWqG9aUnsgbsgjx8O_8vRorIf3Z0Jp3E44	2026-01-30 17:58:38.215	2026-02-06 17:58:38.213	5
387	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5Nzk4NzYxLCJleHAiOjE3NzA0MDM1NjF9.TtxQ92gEVCiVPlzvpRnNuimp3UJRFmh5zRz02e7vBYI	2026-01-30 18:46:01.375	2026-02-06 18:46:01.372	5
388	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzY5ODAwNDA5LCJleHAiOjE3NzA0MDUyMDl9.nSvdIVRWomGR9vHO_HQ1Lr6tFPiOLpH1Ksl4FcXlqEM	2026-01-30 19:13:29.91	2026-02-06 19:13:29.908	5
393	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTE5NjM2LCJleHAiOjE3NzA1MjQ0MzZ9.Kl2BIQwGsZiZ6ofrWa6v3FgX6YhpmBpVgF0qkM_ejRQ	2026-02-01 04:20:36.036	2026-02-08 04:20:36.034	1
394	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTIwNTYzLCJleHAiOjE3NzA1MjUzNjN9.etjQmhjfUZk2N5NN9ilRXsfuzEzPovBqeZ6jgKe5O4g	2026-02-01 04:36:03.165	2026-02-08 04:36:03.164	1
395	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTIxNTMxLCJleHAiOjE3NzA1MjYzMzF9.8DiBxih0UsDU-PB3zKgPtn33ij0q37_fEHlGMa2CXaA	2026-02-01 04:52:11.7	2026-02-08 04:52:11.698	24
400	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTIyODEyLCJleHAiOjE3NzA1Mjc2MTJ9.NjTJYJp39j2mql4fVNuUH2jV69XJHdOxjI_vxLU0kt4	2026-02-01 05:13:32.965	2026-02-08 05:13:32.963	1
401	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTI1NDkzLCJleHAiOjE3NzA1MzAyOTN9.emAguQ-Xxrz7vUQMPCRz3MLFmLSA68atg0Il5ON7SCc	2026-02-01 05:58:13.769	2026-02-08 05:58:13.768	24
404	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTUzOTY2LCJleHAiOjE3NzA1NTg3NjZ9.cVwZHm5v9JYNrvkXPf6Mm1joi5X12E8pmkW-qsyrdqY	2026-02-01 13:52:46.09	2026-02-08 13:52:46.086	24
405	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTU2MzUwLCJleHAiOjE3NzA1NjExNTB9.m1tGbxwHNpiOJvpWKiEKIML8awjkYxew5RuYK_8q1bE	2026-02-01 14:32:30.165	2026-02-08 14:32:30.164	1
406	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTU3NDY2LCJleHAiOjE3NzA1NjIyNjZ9.9AjPwSdiIaN4esjNynRZGcACbWFqzj4t3pXBvVIhG5k	2026-02-01 14:51:06.733	2026-02-08 14:51:06.731	1
407	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTU4NjY5LCJleHAiOjE3NzA1NjM0Njl9.tq6k8xQ3q004Fxp00PN9X9aKHVJIAi-4eKWYKzDGziM	2026-02-01 15:11:09.175	2026-02-08 15:11:09.173	1
408	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTU4ODIwLCJleHAiOjE3NzA1NjM2MjB9.7aHsmz758IZB1PPojUEPsV2mLzmrIJdU8GHD3L6WWNY	2026-02-01 15:13:40.804	2026-02-08 15:13:40.802	24
409	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTU4ODQ4LCJleHAiOjE3NzA1NjM2NDh9.pXXFS1d58QUkXkFeYAmO0pL85tn50rIkBYVfQaB7Dw0	2026-02-01 15:14:08.981	2026-02-08 15:14:08.98	1
505	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTc0NTQwLCJleHAiOjE3NzIxNzkzNDB9.RiuiN73QUqQlbCmRX5RO_cVXhl7tvVRxQx9AabmrlmA	2026-02-20 08:02:20.448	2026-02-27 08:02:20.447	5
411	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzY5OTY2Mzk5LCJleHAiOjE3NzA1NzExOTl9.zppSq_f7ZrmKejsV6Jl_zOkIAgDiz8Ab569_IB76vq8	2026-02-01 17:19:59.717	2026-02-08 17:19:59.716	1
413	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMDA1NTU4LCJleHAiOjE3NzA2MTAzNTh9.dfzpePS5sPW-gtC-VnsFINYcJgHWc0659D9Li1s9YEg	2026-02-02 04:12:38.387	2026-02-09 04:12:38.384	1
414	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMDA3NzIyLCJleHAiOjE3NzA2MTI1MjJ9.5c-4-tdG0dONIomUNJ9268WVyy9bU4Jzu4lgSYOWZuQ	2026-02-02 04:48:42.472	2026-02-09 04:48:42.471	1
416	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMDEwMDYzLCJleHAiOjE3NzA2MTQ4NjN9.eUTRieJy3sxbbo8L7IG2L6PJzkHIbi6ojbpGX0RDMdA	2026-02-02 05:27:43.931	2026-02-09 05:27:43.928	1
417	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMDEzNTkyLCJleHAiOjE3NzA2MTgzOTJ9.Sd0IN1pofutrdvVg5Is8DJOvt__Zzxl6l1tJp8RtG2w	2026-02-02 06:26:32.345	2026-02-09 06:26:32.343	1
419	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMDE2NTY0LCJleHAiOjE3NzA2MjEzNjR9.pnjKoZ-CP-RnLVz_6cj-q3NRMFgK8neI_cZGdJIHros	2026-02-02 07:16:04.975	2026-02-09 07:16:04.973	1
420	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMDE4NzkzLCJleHAiOjE3NzA2MjM1OTN9.fcEYcJDxm-XVWVRRJNAe9WKV14Jlf-I_8_Eg8B6Oo_U	2026-02-02 07:53:13.635	2026-02-09 07:53:13.632	1
423	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTI1Mzg0LCJleHAiOjE3NzA3MzAxODR9.If_TLKedXvJddkzriNolIgJ-Txf2CscfN9ZPJhVxP_U	2026-02-03 13:29:44.726	2026-02-10 13:29:44.723	1
424	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTI1ODI2LCJleHAiOjE3NzA3MzA2MjZ9.4JIKvOciqwejT8ceZV46-nlnpR_kS4qPJllYvz9fHcU	2026-02-03 13:37:06.671	2026-02-10 13:37:06.67	24
426	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTQwMTQ2LCJleHAiOjE3NzA3NDQ5NDZ9.PfZPqxPkmxF5nTJNZGp3gpDqMtpwF9tcKUSHMHAqA68	2026-02-03 17:35:46.267	2026-02-10 17:35:46.265	1
427	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTQ2MDMzLCJleHAiOjE3NzA3NTA4MzN9.tBHvmjZtLKAY4wU4qXvZ2JCf3YAv8yQ1OWnQ8pbsGY8	2026-02-03 19:13:53.124	2026-02-10 19:13:53.122	1
429	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTg5MjYwLCJleHAiOjE3NzA3OTQwNjB9.MOahu8eoPiMCJk5WPNTZm4tl81FcVNdx-ed-MiaRSuY	2026-02-04 07:14:20.273	2026-02-11 07:14:20.27	1
430	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTkyMTE0LCJleHAiOjE3NzA3OTY5MTR9.P4th2AgX7r0UY-uRlzoExwrYNh1uUUBzS6ZIWllbGlA	2026-02-04 08:01:54.065	2026-02-11 08:01:54.063	1
431	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTkyMTc4LCJleHAiOjE3NzA3OTY5Nzh9.oAxQmrJYH2eBCfZn_urqm6CIRWFm6IjwOKL2CgUiQ74	2026-02-04 08:02:58.273	2026-02-11 08:02:58.272	24
432	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTkyMjExLCJleHAiOjE3NzA3OTcwMTF9.-nfxc_Zwn9yOC1b-kxNnjBxd_aa_QpkGBo0Vvix89oo	2026-02-04 08:03:31.66	2026-02-11 08:03:31.658	24
433	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTkzMTk4LCJleHAiOjE3NzA3OTc5OTh9.6ify9JRnbAFrJlbHBrdaRiEM3vRSM3vPlJz4TJTHWLM	2026-02-04 08:19:58.49	2026-02-11 08:19:58.489	24
434	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwMTk0MTk3LCJleHAiOjE3NzA3OTg5OTd9.-DnIHx5pNuMDnPXKEeSbl2tJM6SrL18guYBbiFyRS2I	2026-02-04 08:36:37.556	2026-02-11 08:36:37.555	1
436	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI0LCJlbWFpbCI6ImRldjFAZ21haWwuY29tIiwiaWF0IjoxNzcwNzA3OTY4LCJleHAiOjE3NzEzMTI3Njh9.xeIJ8LtoinOmiAD7c7Gwq2UWR62R5f0ZAF0Kj0Mr-oA	2026-02-10 07:19:28.004	2026-02-17 07:19:28.002	24
437	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwNzA4MjIzLCJleHAiOjE3NzEzMTMwMjN9.NnO050hO6X_-w9TGCh8s7QSQC_Ftf4EWV49Aciqur3g	2026-02-10 07:23:43.475	2026-02-17 07:23:43.474	1
438	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcwNzA5MTM5LCJleHAiOjE3NzEzMTM5Mzl9.O9DA--joUQHXwGm3p3L8V0Nrhry3kW_Qwll1cWAcnrk	2026-02-10 07:38:59.371	2026-02-17 07:38:59.368	1
446	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODA1NDgxLCJleHAiOjE3NzE0MTAyODF9.uMlwUYrza_yxxBx682aJZXDXlKloTS_Lkp34W_boc4I	2026-02-11 10:24:41.56	2026-02-18 10:24:41.558	5
447	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODA2NjIzLCJleHAiOjE3NzE0MTE0MjN9.x7CsaCYMZUNMn8-r4nRl8qJbnPypInNb7tofWUuqrc0	2026-02-11 10:43:43.382	2026-02-18 10:43:43.379	5
448	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODc0MjEwLCJleHAiOjE3NzE0NzkwMTB9.UD3ert-mSnTsmaBwGJY2yaOjS8OJhhZCGlKPt8kVhXk	2026-02-12 05:30:10.798	2026-02-19 05:30:10.797	5
449	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODc3NjQ2LCJleHAiOjE3NzE0ODI0NDZ9.Vvr_8NHhc7lyQuRj-PXpv-NzxyNnCSIkzSHv8jcMark	2026-02-12 06:27:26.994	2026-02-19 06:27:26.993	5
450	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODgyNTQ3LCJleHAiOjE3NzE0ODczNDd9.loHhSQmQAMktyh87Q5mzPdVLQZ4rDWQoEGDRTuoh7mg	2026-02-12 07:49:07.71	2026-02-19 07:49:07.708	5
453	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODkxMTM2LCJleHAiOjE3NzE0OTU5MzZ9.TtVg8ETKJfduqWZPmQCB-yD0KOT93Hrgm_vzxaK9PMQ	2026-02-12 10:12:16.436	2026-02-19 10:12:16.435	5
456	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODk1ODE5LCJleHAiOjE3NzE1MDA2MTl9.0zvwxrrVQVPRrc9sWxipyTapo9dQTUkMdrjKNeUhhbQ	2026-02-12 11:30:19.193	2026-02-19 11:30:19.19	5
457	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODk3MDYzLCJleHAiOjE3NzE1MDE4NjN9.s6EjgFkG5j-NjhPTwJ9KhV_kQdgbq0vr-q6pGbvNFr0	2026-02-12 11:51:03.361	2026-02-19 11:51:03.36	5
460	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwODk4OTM0LCJleHAiOjE3NzE1MDM3MzR9.nUXh-uR7ZE-DSH-2i0ZQOJVxrHBh5owfAOik50JvPH4	2026-02-12 12:22:14.963	2026-02-19 12:22:14.961	5
506	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTc0ODQzLCJleHAiOjE3NzIxNzk2NDN9.KuGMckKwoj0V5tMAKh4_6WbUw8QXRD0X5yQPj4d-pl0	2026-02-20 08:07:23.275	2026-02-27 08:07:23.274	1
507	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTc5NjM2LCJleHAiOjE3NzIxODQ0MzZ9.6dWc81Uv1tpgiJy8WkVv-UUm5SD2IG1nMQ7dP3HPfuQ	2026-02-20 09:27:16.856	2026-02-27 09:27:16.854	1
463	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwOTE0NjE2LCJleHAiOjE3NzE1MTk0MTZ9.dbpfdRJmBuBhIbDO0fh4cvzpP-uduEabRkLxy0WS5J4	2026-02-12 16:43:36.838	2026-02-19 16:43:36.836	5
464	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwOTU5NTIzLCJleHAiOjE3NzE1NjQzMjN9.o0wCGERa_tRGuKoicUfuSh_H2wDHDZe0Gy8kgM6CW5M	2026-02-13 05:12:03.008	2026-02-20 05:12:03.005	5
465	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcwOTYwOTk2LCJleHAiOjE3NzE1NjU3OTZ9.odepHtkijYiDkGgTToh2Mw17EFblUnJKo1wB21RTALw	2026-02-13 05:36:36.147	2026-02-20 05:36:36.145	5
508	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTgwNDA1LCJleHAiOjE3NzIxODUyMDV9.b0bkpN7pshbpc7DWNUvNDo6gNaV_qvpmaZwdb7CgfN8	2026-02-20 09:40:05.145	2026-02-27 09:40:05.142	5
468	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMDUyODE0LCJleHAiOjE3NzE2NTc2MTR9.gML9l27EFFgB4EOQjVToD0CdjTT8U5plDAhTb5YOvP4	2026-02-14 07:06:54.511	2026-02-21 07:06:54.51	5
469	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMDUyODQ5LCJleHAiOjE3NzE2NTc2NDl9.33ngZlOG1ebcEXLiB6ESJrkUsXDvjqt1Jz0lwrfzznw	2026-02-14 07:07:29.014	2026-02-21 07:07:29.011	5
470	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMDY2MTYwLCJleHAiOjE3NzE2NzA5NjB9.Xq-3Byqa3K2nuiWrt_iae1ZTrXgfMfL8qUCsA6ThZw4	2026-02-14 10:49:20.191	2026-02-21 10:49:20.188	5
471	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMDg2NTEwLCJleHAiOjE3NzE2OTEzMTB9.hRoZeDMSiwodg6wKQhXhqtS0P_9SiPC1_Tc7mp5oVFg	2026-02-14 16:28:30.308	2026-02-21 16:28:30.307	5
472	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMTQxNjY0LCJleHAiOjE3NzE3NDY0NjR9.0LZmFAjl-lzZK5ABHDxK2B-7lWCU7_dKZuqvmXYYxWc	2026-02-15 07:47:44.072	2026-02-22 07:47:44.071	5
473	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMTc0NDM1LCJleHAiOjE3NzE3NzkyMzV9.bAe64qMK0pywOJVsCQ4Uj2n-N8mfOjfFH3oWDIrR3iM	2026-02-15 16:53:55.246	2026-02-22 16:53:55.244	5
474	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMTc2NjU4LCJleHAiOjE3NzE3ODE0NTh9.Ct8Ffr1Hcq4Q63JLWj7y08bd053cvc4zX_PK3MwFIBQ	2026-02-15 17:30:58.663	2026-02-22 17:30:58.661	5
475	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMTc4MzU2LCJleHAiOjE3NzE3ODMxNTZ9.IBFsuIvC_EjNlGMNEYRP6OpOk80aBylhSxzfKjL1lJs	2026-02-15 17:59:16.215	2026-02-22 17:59:16.213	5
476	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMjI0OTc3LCJleHAiOjE3NzE4Mjk3Nzd9.4MSIyIvP3NaAmALr2xHLZ5wgURDmlZrgEmk3zeHIN4o	2026-02-16 06:56:17.296	2026-02-23 06:56:17.294	5
477	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMjMwMjc0LCJleHAiOjE3NzE4MzUwNzR9.MxjEVRTVYBI_vzmwV56M5oYo44Bv3dP6hLSQsCt5Mks	2026-02-16 08:24:34.766	2026-02-23 08:24:34.764	5
478	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMjMxMTY3LCJleHAiOjE3NzE4MzU5Njd9.JvDbLipwhumw-aHkdDhaiLP86FxcHPck9PMOVxv4qmA	2026-02-16 08:39:27.665	2026-02-23 08:39:27.664	5
479	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzcxMjMxMjg1LCJleHAiOjE3NzE4MzYwODV9.fEl07SCBtUOkdPwacWOV9b7wHe8rfVu0BtXavwM83pw	2026-02-16 08:41:25.859	2026-02-23 08:41:25.857	28
511	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTgzMTU5LCJleHAiOjE3NzIxODc5NTl9.kVIA85T1QC-bL4zFmTcSrezQiKQsl8gUjfI4yi8awVg	2026-02-20 10:25:59.73	2026-02-27 10:25:59.728	1
512	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJlbWFpbCI6InRlc3Q3QGdtYWlsLmNvbSIsImlhdCI6MTc3MTU4NDYwNCwiZXhwIjoxNzcyMTg5NDA0fQ.nv9IonW2VkW67wGtUX53czuIsenARUA_AWmDT1AxWik	2026-02-20 10:50:04.492	2026-02-27 10:50:04.491	13
484	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMjM3NzgyLCJleHAiOjE3NzE4NDI1ODJ9.OfSlr6PCuZ0nZe6bniYIbN2OmWiH3KAyilC8bHOc-yo	2026-02-16 10:29:42.763	2026-02-23 10:29:42.761	5
485	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMzI4NDU3LCJleHAiOjE3NzE5MzMyNTd9.s9o4nJAnR_jGRcUuAm0JW5EQaHsRWfuMKA-chRsxsJo	2026-02-17 11:40:57.403	2026-02-24 11:40:57.402	5
486	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4LCJlbWFpbCI6ImRldjJAZ21haWwuY29tIiwiaWF0IjoxNzcxMzM2NzE1LCJleHAiOjE3NzE5NDE1MTV9.7lmNFyHTZ1Tp-f8N1DSaXCCfYWF8WkApEU6B82yBGZI	2026-02-17 13:58:35.682	2026-02-24 13:58:35.681	28
487	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMzM2ODYyLCJleHAiOjE3NzE5NDE2NjJ9.BuzrSj3bTgPZa5mK4E9IYkGKJYEG8XZHzz2vFvN3-Co	2026-02-17 14:01:02.399	2026-02-24 14:01:02.397	5
488	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMzM4NjYwLCJleHAiOjE3NzE5NDM0NjB9.jurdkKnu6FH9CDwSDgt7dKcmRjhnJQdm1tXM48ittf8	2026-02-17 14:31:00.645	2026-02-24 14:31:00.643	5
491	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxMzUwMjMwLCJleHAiOjE3NzE5NTUwMzB9.5hWNJljl_C5h5oFzYkLClL2CSVgeEOyXJcZN9oxJLLU	2026-02-17 17:43:50.038	2026-02-24 17:43:50.034	5
492	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNDAxNjMyLCJleHAiOjE3NzIwMDY0MzJ9.d8vST9R1qwCgu4g98wLc9XkcynExGh72HsdavUHxNTQ	2026-02-18 08:00:32.712	2026-02-25 08:00:32.71	5
493	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNDAzOTY3LCJleHAiOjE3NzIwMDg3Njd9.4Ba4iN4IlKvE8tKzfx6TbLcFDPVdXJkKcErPMa_SbPo	2026-02-18 08:39:27.508	2026-02-25 08:39:27.507	5
494	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNDMzMjk3LCJleHAiOjE3NzIwMzgwOTd9.U_A6KRChUk1IR30RU6J4iB3XEKV8lPl27WXzXqvT2Tw	2026-02-18 16:48:17.693	2026-02-25 16:48:17.691	5
495	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTE1NDI0LCJleHAiOjE3NzIxMjAyMjR9.wef5zyxvWO1jkOWBw-DhbFTR9Kv1egkOobrLpGEeXHc	2026-02-19 15:37:04.175	2026-02-26 15:37:04.17	5
496	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTE3OTA5LCJleHAiOjE3NzIxMjI3MDl9.iaLo-rmNu6nb10VAcUcr-2HbIZmieL9tzpmzyQJXifM	2026-02-19 16:18:29.625	2026-02-26 16:18:29.624	5
499	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTcwNjQzLCJleHAiOjE3NzIxNzU0NDN9.GZreaEuydz1Fe3RH7KPjo_PX-TZeKsb76XrbGWfa8jM	2026-02-20 06:57:23.021	2026-02-27 06:57:23.019	1
500	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTcwNzI3LCJleHAiOjE3NzIxNzU1Mjd9.raFgD3Lj1YJBfs3zfBlsB_gGurSSrhI3TYAgXK3Ap-o	2026-02-20 06:58:47.288	2026-02-27 06:58:47.287	5
513	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTg1ODk3LCJleHAiOjE3NzIxOTA2OTd9.U-ozOfDpAzyEytgb2ykXahLCtB5AFDEn9Mvp31BG_9c	2026-02-20 11:11:37.962	2026-02-27 11:11:37.96	5
514	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTg1OTI5LCJleHAiOjE3NzIxOTA3Mjl9.DcJ0BBEs8EBBa355jpKPUUjQgDl2jALbISfz-OnQFDY	2026-02-20 11:12:09.919	2026-02-27 11:12:09.918	1
515	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTg2MDAzLCJleHAiOjE3NzIxOTA4MDN9.DXbGt3zT71GBHDqxFWi9Ezdw9CWX-O4CS3-AbtLyL9o	2026-02-20 11:13:23.912	2026-02-27 11:13:23.91	5
516	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTg2MDMzLCJleHAiOjE3NzIxOTA4MzN9.tOtLZU3C4wzkFE48aVB6Ngs2TA9-RV7mJeRirJJfS3Q	2026-02-20 11:13:53.722	2026-02-27 11:13:53.721	1
517	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNTg2MjU4LCJleHAiOjE3NzIxOTEwNTh9.H_cN4YLBRrp2uUXlTNJHZTO9smYjkaUkz7t4AQXxw68	2026-02-20 11:17:38.797	2026-02-27 11:17:38.795	5
518	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNTg2MzMxLCJleHAiOjE3NzIxOTExMzF9.G98Av-Yr-UNaWszzcvIN-lPdeD6oNw-uL4vN11mUi_g	2026-02-20 11:18:51.588	2026-02-27 11:18:51.587	1
523	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNjcwMzI4LCJleHAiOjE3NzIyNzUxMjh9.UBROymCpO2qsJCbtuiHwVNwkkgyfGvlhdBvViWOwwp0	2026-02-21 10:38:48.364	2026-02-28 10:38:48.362	1
524	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNjcwNTUyLCJleHAiOjE3NzIyNzUzNTJ9.RIesMVgs-jq4-R_6J5CGaa70QVYCJHQEHeJUGGA3bv8	2026-02-21 10:42:32.239	2026-02-28 10:42:32.237	5
525	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNjcyMjc3LCJleHAiOjE3NzIyNzcwNzd9.lxV8Mc4uqorKBUFJchPISLv8e42p4vtBXt7dK0BpWg8	2026-02-21 11:11:17.539	2026-02-28 11:11:17.538	5
526	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNjcyMzE5LCJleHAiOjE3NzIyNzcxMTl9.9L0Obw60BVIBnMDWYii_wlZ_ERxAvZXrL9VJOA4iB4E	2026-02-21 11:11:59.359	2026-02-28 11:11:59.358	1
527	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNjcyMzc4LCJleHAiOjE3NzIyNzcxNzh9.Y7fJ-T6tzbfPczebuq_xHdvOMdZoOTQ0ohVDQ5N-p0w	2026-02-21 11:12:58.005	2026-02-28 11:12:58.004	5
528	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxNjczNzYxLCJleHAiOjE3NzIyNzg1NjF9.Gpans_gZzOjbWW89VHx4loOxFzKjVTMVD9TJr6iu5CE	2026-02-21 11:36:01.725	2026-02-28 11:36:01.723	5
529	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNjc0MzkwLCJleHAiOjE3NzIyNzkxOTB9.qsRMLQDch2pMk-V2KseCCK-mHAdq98m2nGUXCwgxzU8	2026-02-21 11:46:30.106	2026-02-28 11:46:30.105	1
530	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxNjc5MDc0LCJleHAiOjE3NzIyODM4NzR9.Hol2-Y6VEw9FFOygQVKDEonqRiHHdwLE3tnoQwvP2NQ	2026-02-21 13:04:34.786	2026-02-28 13:04:34.785	1
531	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxODQwMTY3LCJleHAiOjE3NzI0NDQ5Njd9.-WGGaN1Rga84bKhFUiwW_hzb9JWnVK0bW47MMCx2g7c	2026-02-23 09:49:27.4	2026-03-02 09:49:27.398	1
532	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxODQyNTQ4LCJleHAiOjE3NzI0NDczNDh9.5NYNhfx4OBeXP212gySSHIUmyR-xMXFu2wBDHiisfmI	2026-02-23 10:29:08.087	2026-03-02 10:29:08.086	1
533	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxODQyNTY4LCJleHAiOjE3NzI0NDczNjh9.LuEfgUFV6MbjCnfejTA7594dlnP6ZPHzjDrVtjLi1KM	2026-02-23 10:29:28.387	2026-03-02 10:29:28.385	5
534	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxODQzNTkzLCJleHAiOjE3NzI0NDgzOTN9.j8sPAUvrVWg27kCCyNdVKGjK_JXsboeAIimXVLxhT4c	2026-02-23 10:46:33.351	2026-03-02 10:46:33.35	5
535	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcxODQzNjgwLCJleHAiOjE3NzI0NDg0ODB9.KrdZ8XoF41LGDfWPmFtJ_HcPQQy8O-36Koj3KVpaV9Y	2026-02-23 10:48:00.609	2026-03-02 10:48:00.608	1
536	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxODQzNzE4LCJleHAiOjE3NzI0NDg1MTh9.Za5uNI0D78XjVSioHE0zusncHgB7J-8ROx_tdDugDwk	2026-02-23 10:48:38.233	2026-03-02 10:48:38.232	5
537	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcxODYyNzcxLCJleHAiOjE3NzI0Njc1NzF9.zX28bNzkwWxz6HMyZcreRU0SYn6e0mY4lQNYJKwK-XE	2026-02-23 16:06:11.546	2026-03-02 16:06:11.541	5
538	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyMTk3OTg0LCJleHAiOjE3NzI4MDI3ODR9.RJ9PDuiLL6XswLRGMcHHx0Xj9K3cLAXG8wxGYQOKh8U	2026-02-27 13:13:04.574	2026-03-06 13:13:04.572	5
539	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyMjAwMTc3LCJleHAiOjE3NzI4MDQ5Nzd9.q4EIBqPiv5u2nWif0hh_mcPgjAuqM65ioKYVjvpm6SM	2026-02-27 13:49:37.469	2026-03-06 13:49:37.467	5
540	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyMjAzNzc4LCJleHAiOjE3NzI4MDg1Nzh9.Ac-5QHN4s0eJnQaKcp-SYjjX4a8vQehqw1btbTsq-KM	2026-02-27 14:49:38.548	2026-03-06 14:49:38.547	5
542	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyMzAyMTc3LCJleHAiOjE3NzI5MDY5Nzd9.0l3PLQ3GIfuRxu1kx5YhCI3jTdHbOjG3bzcZQODncFE	2026-02-28 18:09:37.332	2026-03-07 18:09:37.329	5
543	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyMzY2Nzk1LCJleHAiOjE3NzI5NzE1OTV9.0DpvR5TKgVJuszz0rlWGWSRhCE3W3Qndvfy_kkblvTU	2026-03-01 12:06:35.765	2026-03-08 12:06:35.761	5
544	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyMzY4MTU1LCJleHAiOjE3NzI5NzI5NTV9.t9P9Kn-E6jveWS7GLVTEZqqZj8b0AbI2cpA7Fs_O79Y	2026-03-01 12:29:15.221	2026-03-08 12:29:15.219	1
545	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyMzY4MTczLCJleHAiOjE3NzI5NzI5NzN9.iuwcQ83HQwJbONq3cUIUJzX8elY2KiZWcTJlP1UjMh0	2026-03-01 12:29:33.8	2026-03-08 12:29:33.798	1
546	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyMzcwMjAwLCJleHAiOjE3NzI5NzUwMDB9.9XtQkZJLSikw-7F5vqM6K-nsLKsQM0jp_KjQF27TEo8	2026-03-01 13:03:20.202	2026-03-08 13:03:20.2	1
547	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyMzcwMjE3LCJleHAiOjE3NzI5NzUwMTd9._aWALniSNz2b-X3l_Z053i-tyPs_jdX05S2fl1ejzI0	2026-03-01 13:03:37.641	2026-03-08 13:03:37.64	5
566	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyNjM0NzI0LCJleHAiOjE3NzMyMzk1MjR9.9nJke-yjRvRmW0ovFbfrC4FdBr7qsoBBmw8rwNQqwBg	2026-03-04 14:32:04.031	2026-03-11 14:32:04.029	1
567	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoidGVzdDNAZ21haWwuY29tIiwiaWF0IjoxNzcyNjM1MDMwLCJleHAiOjE3NzMyMzk4MzB9.J8CA5RcXffSrVdShNZFVJK0NDw541jB9zTf3pgb4B4o	2026-03-04 14:37:10.8	2026-03-11 14:37:10.799	6
576	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMyLCJlbWFpbCI6InRpcnRoNzQ0Y2xnQGdtYWlsLmNvbSIsImlhdCI6MTc3MjY0MzYwOCwiZXhwIjoxNzczMjQ4NDA4fQ.DOgD1AZT_fdmjusBQJ1C3UUgeLvpvZVZwqDc2ZQs320	2026-03-04 17:00:08.374	2026-03-11 17:00:08.373	32
591	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyNzAzNjk2LCJleHAiOjE3NzMzMDg0OTZ9.LCyv7wu0-V7bUv5Cc_y5lwvanzxxoEjAKw-KkKC4Eow	2026-03-05 09:41:36.347	2026-03-12 09:41:36.345	1
592	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyNzA0NTg5LCJleHAiOjE3NzMzMDkzODl9.PTfSzU0g-03drDHaom6zNH3Mvkz4TMx9FXOgYQOJET4	2026-03-05 09:56:29.971	2026-03-12 09:56:29.97	1
599	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyNzE0MTM0LCJleHAiOjE3NzMzMTg5MzR9.AD_H36qjaghGrs0XLy_2IPsuOk-ollIwOsVMfeQeuHc	2026-03-05 12:35:34.376	2026-03-12 12:35:34.374	5
603	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM1LCJlbWFpbCI6IndvcmsudGlydGhyb2phcmFAZ21haWwuY29tIiwiaWF0IjoxNzcyNzI2OTY5LCJleHAiOjE3NzMzMzE3Njl9.-luKe85q5mSmWC3UdlOJYh8guY0QK8n1oVoxdr8LQKI	2026-03-05 16:09:29.388	2026-03-12 16:09:29.387	35
606	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM1LCJlbWFpbCI6IndvcmsudGlydGhyb2phcmFAZ21haWwuY29tIiwiaWF0IjoxNzcyNzI3NTYzLCJleHAiOjE3NzMzMzIzNjN9.FSRlN5kooNRGpTyir0fs3DepRJ1qZqIrOCQGC_5TBc4	2026-03-05 16:19:23.957	2026-03-12 16:19:23.956	35
608	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyNzI3NjI4LCJleHAiOjE3NzMzMzI0Mjh9.-jLwwhHrEIeYbMnXCVyj34tpEOy3oSFu23urfIxGI-Q	2026-03-05 16:20:28.261	2026-03-12 16:20:28.26	1
609	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyOTg5NjIzLCJleHAiOjE3NzM1OTQ0MjN9.W9Fa3P_5KZSH-nneOsJqRGMiiT6tcqLDxDmxAwzusio	2026-03-08 17:07:03.123	2026-03-15 17:07:03.122	1
610	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwiaWF0IjoxNzcyOTg5NjY2LCJleHAiOjE3NzM1OTQ0NjZ9.EzBzPP27deilDGJsU9AgXhzROR80bi0TcYOROOGD7oo	2026-03-08 17:07:46.879	2026-03-15 17:07:46.878	1
611	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwiaWF0IjoxNzcyOTkwMzgwLCJleHAiOjE3NzM1OTUxODB9.CfR5eMsxNB8bLZFLEepRsIZVGAhpg-BVZ0vqIFfwEJU	2026-03-08 17:19:40.041	2026-03-15 17:19:40.039	5
\.


--
-- TOC entry 5298 (class 0 OID 132322)
-- Dependencies: 268
-- Data for Name: SaveJob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SaveJob" (id, "candidateProfileId", "jobId", "createdAt") FROM stdin;
52	20	45	2026-03-04 14:33:07.527
53	20	44	2026-03-04 14:33:08.882
54	20	46	2026-03-04 14:33:14.647
55	20	47	2026-03-04 14:33:18.004
56	20	48	2026-03-04 14:33:21.974
57	20	50	2026-03-04 14:33:25.88
58	20	57	2026-03-04 14:34:24.172
59	20	56	2026-03-04 14:34:27.839
60	20	55	2026-03-04 14:34:29.818
62	20	67	2026-03-05 12:30:50.131
63	20	66	2026-03-05 12:30:51.711
65	20	65	2026-03-05 12:30:59.247
66	20	63	2026-03-05 12:31:01.427
\.


--
-- TOC entry 5262 (class 0 OID 128565)
-- Dependencies: 232
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" (id, name) FROM stdin;
1	JavaScript
2	TypeScript
3	Java
4	C++
5	C#
6	C
7	HTML
8	CSS
9	Python
10	ReactJs
11	NodeJs
12	ExpressJs
13	NextJs
53	SpringBoot
54	Prisma
55	SQL
56	Postgresql
57	Mongodb
58	Go
59	Rust
60	Docker
61	CI/CD
62	Jest
63	Gen Ai
64	Postman
65	Git
66	Redis
67	Socket.io
\.


--
-- TOC entry 5291 (class 0 OID 128706)
-- Dependencies: 261
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscription" (id, "razorpaySubscriptionId", "razorpayPlanId", status, "startAt", "endAt", "totalCount", "paidCount", currency, "createdAt", "updatedAt", "recruiterId", "packageId", "nextPayment") FROM stdin;
55	sub_SHBecJzXrG6BiW	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-17 10:54:11.281	\N	12	2	INR	2026-02-17 10:54:11.283	2026-02-17 10:54:32.591	5	1	2026-03-16 18:30:00
45	sub_SGuQ3wTciNS8s0	plan_SFzFpMUsPBCG1c	CANCELLED	2026-02-16 18:02:36.27	\N	12	2	INR	2026-02-16 18:02:36.271	2026-02-17 09:50:11.629	5	1	\N
44	sub_SGuOiJ4NbbWfkl	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-16 18:01:19.721	\N	12	2	INR	2026-02-16 18:01:19.723	2026-02-16 18:06:07.356	5	1	2026-03-15 18:30:00
56	sub_SHGmU2uP9ZXMDd	plan_SFzFpMUsPBCG1c	CREATED	2026-02-17 15:55:06.405	\N	12	0	INR	2026-02-17 15:55:06.406	2026-02-17 15:55:06.406	5	1	\N
57	sub_SHGuTYUnLUZsjG	plan_SFzFpMUsPBCG1c	CREATED	2026-02-17 16:02:40.055	\N	12	0	INR	2026-02-17 16:02:40.057	2026-02-17 16:02:40.057	5	1	\N
46	sub_SHAhFmtHC3cKuj	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-17 09:57:59.802	\N	12	2	INR	2026-02-17 09:57:59.804	2026-02-17 09:58:45.025	5	1	2026-03-16 18:30:00
47	sub_SHAoNo077lsrdv	plan_SFzFpMUsPBCG1c	CREATED	2026-02-17 10:04:44.505	\N	12	0	INR	2026-02-17 10:04:44.507	2026-02-17 10:04:44.507	5	1	\N
48	sub_SHAqGhe1Omr0A6	plan_SFzFpMUsPBCG1c	CREATED	2026-02-17 10:06:31.834	\N	12	0	INR	2026-02-17 10:06:31.835	2026-02-17 10:06:31.835	5	1	\N
43	sub_SGmseLn2cujrLh	plan_SFzFpMUsPBCG1c	PAUSED	2026-02-16 10:40:07.454	\N	12	2	INR	2026-02-16 10:40:07.456	2026-02-16 18:09:07.867	5	1	\N
58	sub_SHGvuJyyDZeOzd	plan_SFzFpMUsPBCG1c	CREATED	2026-02-17 16:04:01.423	\N	12	0	INR	2026-02-17 16:04:01.424	2026-02-17 16:04:01.424	5	1	\N
49	sub_SHAvugXi4Y38m4	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-17 10:11:52.176	\N	12	2	INR	2026-02-17 10:11:52.178	2026-02-17 10:12:13.947	5	1	2026-03-16 18:30:00
60	sub_SNY0PmYbID93qn	plan_SFzFpMUsPBCG1c	CANCELLED	2026-03-05 12:40:13.63	\N	12	2	INR	2026-03-05 12:40:13.632	2026-03-05 12:56:01.227	5	1	\N
50	sub_SHAz4P9R8fBuDm	plan_SFzGPoz26mfv0h	CANCELLED	2026-02-17 10:14:51.022	\N	12	1	INR	2026-02-17 10:14:51.023	2026-02-17 10:22:29.234	5	2	\N
59	sub_SHH2xsDVFeiM5A	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-17 16:10:42.095	\N	12	1	INR	2026-02-17 16:10:42.096	2026-02-17 16:21:31.703	5	1	2026-03-16 18:30:00
51	sub_SHBDCljdPaXh5d	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-17 10:28:14.532	\N	12	2	INR	2026-02-17 10:28:14.534	2026-02-17 10:28:45.558	5	1	2026-03-16 18:30:00
52	sub_SHBE35UlhwbvEr	plan_SFzGPoz26mfv0h	CANCELLED	2026-02-17 10:29:01.703	\N	12	1	INR	2026-02-17 10:29:01.704	2026-02-17 10:29:41.404	5	2	\N
25	sub_SG631YgcpahIKi	plan_SFzFpMUsPBCG1c	CREATED	2026-02-14 16:46:18.944	\N	12	0	INR	2026-02-14 16:46:18.946	2026-02-14 16:46:18.946	5	1	\N
37	sub_SG7Itr1t3oDEyi	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 18:00:02.361	\N	12	2	INR	2026-02-14 18:00:02.364	2026-02-14 18:00:23.592	5	1	2026-03-13 18:30:00
53	sub_SHBIdKSFhqS2jg	plan_SFzFpMUsPBCG1c	CREATED	2026-02-17 10:33:22.944	\N	12	0	INR	2026-02-17 10:33:22.945	2026-02-17 10:33:22.945	5	1	\N
27	sub_SG6ArjqkHSh0cr	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 16:53:44.341	\N	12	1	INR	2026-02-14 16:53:44.343	2026-02-14 16:55:03.941	5	1	2026-03-13 18:30:00
28	sub_SG6Do9bUtAtz7H	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 16:56:31.928	\N	12	1	INR	2026-02-14 16:56:31.929	2026-02-14 16:56:54.088	5	1	2026-03-13 18:30:00
38	sub_SG7JT6KRAiCC2I	plan_SFzGPoz26mfv0h	ACTIVE	2026-02-14 18:00:34.045	\N	12	2	INR	2026-02-14 18:00:34.047	2026-02-14 18:06:18.895	5	2	2026-04-01 18:30:00
29	sub_SG6UN4R8QIqTk6	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 17:12:12.39	\N	12	1	INR	2026-02-14 17:12:12.391	2026-02-14 17:13:20.271	5	1	2026-03-13 18:30:00
39	sub_SGVmFvirtbOrit	plan_SFzFpMUsPBCG1c	CREATED	2026-02-15 17:56:16.975	\N	12	0	INR	2026-02-15 17:56:16.976	2026-02-15 17:56:16.976	5	1	\N
30	sub_SG6YGeWawxjS9A	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 17:15:53.648	\N	12	1	INR	2026-02-14 17:15:53.649	2026-02-14 17:16:21.277	5	1	2026-03-13 18:30:00
40	sub_SGVmTh3yUQTzf8	plan_SFzFpMUsPBCG1c	CREATED	2026-02-15 17:56:29.33	\N	12	0	INR	2026-02-15 17:56:29.331	2026-02-15 17:56:29.331	5	1	\N
31	sub_SG6fmF11vbQAYq	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 17:23:00.39	\N	12	1	INR	2026-02-14 17:23:00.392	2026-02-14 17:23:31.191	5	1	2026-03-13 18:30:00
32	sub_SG6iABhtMdq6oh	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 17:25:15.724	\N	12	1	INR	2026-02-14 17:25:15.725	2026-02-14 17:27:57.781	5	1	2026-03-13 18:30:00
26	sub_SG63LZ8tLqrHQf	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 16:46:37.344	\N	12	2	INR	2026-02-14 16:46:37.345	2026-02-14 17:33:05.218	5	1	2026-04-13 18:30:00
33	sub_SG6taS5YjUjsxn	plan_SFzFpMUsPBCG1c	CREATED	2026-02-14 17:36:04.57	\N	12	0	INR	2026-02-14 17:36:04.572	2026-02-14 17:36:04.572	5	1	\N
34	sub_SG6u5p4NQXQnYY	plan_SFzGPoz26mfv0h	CREATED	2026-02-14 17:36:33.465	\N	12	0	INR	2026-02-14 17:36:33.467	2026-02-14 17:36:33.467	5	2	\N
35	sub_SG6uLuWa3cXJxT	plan_SFzFpMUsPBCG1c	ACTIVE	2026-02-14 17:36:47.904	\N	12	1	INR	2026-02-14 17:36:47.906	2026-02-14 17:37:46.797	5	1	2026-03-13 18:30:00
36	sub_SG6vyNiLyuhCUc	plan_SFzGPoz26mfv0h	CREATED	2026-02-14 17:38:19.409	\N	12	0	INR	2026-02-14 17:38:19.41	2026-02-14 17:38:19.41	5	2	\N
62	sub_SNYHGx1QRVgfwG	plan_SFzGPoz26mfv0h	CANCELLED	2026-03-05 12:56:10.063	\N	12	1	INR	2026-03-05 12:56:10.064	2026-03-05 12:56:58.258	5	2	\N
54	sub_SHBIl15xzlqdMX	plan_SFzGPoz26mfv0h	CANCELLED	2026-02-17 10:33:29.752	\N	12	2	INR	2026-02-17 10:33:29.753	2026-02-17 10:34:36.693	5	2	\N
61	sub_SNYBUlHdi6210o	plan_SFzFpMUsPBCG1c	PAUSED	2026-03-05 12:50:42.641	\N	12	2	INR	2026-03-05 12:50:42.642	2026-03-05 12:51:40.338	5	1	\N
41	sub_SGVnRU9djZKD91	plan_SFzFpMUsPBCG1c	CANCELLED	2026-02-15 17:57:24.256	\N	12	2	INR	2026-02-15 17:57:24.257	2026-02-16 10:34:22.774	5	1	\N
42	sub_SGmsFLo5e3s0rN	plan_SFzFpMUsPBCG1c	CREATED	2026-02-16 10:39:44.764	\N	12	0	INR	2026-02-16 10:39:44.765	2026-02-16 10:39:44.765	5	1	\N
\.


--
-- TOC entry 5249 (class 0 OID 128490)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, "isVerified", "authType", "ProviderAuthId") FROM stdin;
5	test2	test2@gmail.com	$2b$10$0TwHV4O3ZgzI/BndobA4t.J3IRq8IlL15k5Cjls1Q5dAQiYgBuwAS	RECRUITER	t	EMAIL	\N
6	admin	test3@gmail.com	$2a$10$IR/HgmUuFCzzze58rD3LAO5cFyGd8fnGx.wXrQgnir0DUaSzml8A6	ADMIN	t	EMAIL	\N
10	test4	test4@gmail.com	$2b$10$kbp6bVlXWKB1WD.ySxl6JeQ.U6epjBK3IAOxNLoOw5aqRAfilsScW	RECRUITER	t	EMAIL	\N
11	test5	test5@gmail.com	$2b$10$DBMD2CGozV0TlzuH9N9ZXeWmtuxFDqrLfag6h6bP/X/xPr0w9xdoW	RECRUITER	t	EMAIL	\N
12	test6	test6@gmail.com	$2b$10$QAMlPNBA93SfFsZ8XcD37.6gXLj8GdIafa3E0Csji4SFizAAHUoNO	CANDIDATE	t	EMAIL	\N
13	test7	test7@gmail.com	$2b$10$3vp9x/LPumZeayjT86ozyeNeBLfiex2/P6QY3ByMrQqZEJfv4dnIe	CANDIDATE	t	EMAIL	\N
14	test8	test8@gmail.com	$2b$10$XbRNtTfqdbmjloRPm9SF9.OnjnNbe3lqdEOnwkgQNpc8Y4A2YqUCi	CANDIDATE	t	EMAIL	\N
15	test9	test9@gmail.com	$2b$10$nZDkbMxj3H0tbHkdc8Pa9ugPVH5Lh850WyJiH3rFX8ptj7KoWkD.e	CANDIDATE	t	EMAIL	\N
16	test10	test10@gmail.com	$2b$10$CZLdtRFjOxMrLJuFwisjwe/uzPqHZUAYhOM/8.ausQ9rV/PPq9Zuu	CANDIDATE	t	EMAIL	\N
17	test11	test11@gmail.com	$2b$10$MDn7l7enceP4tBzp7m8SPeuMUsteWvC8vx4CvAouGiquoch4z/C..	CANDIDATE	t	EMAIL	\N
35	TIRTH ROJARA	work.tirthrojara@gmail.com	\N	CANDIDATE	t	OAUTH	104786090748769641224
1	test1	test1@gmail.com	$2b$10$tivi7LKTWj5bdxPKeVEVCuVmTacKrUSLL.XAVbucpKdbXqvkSQ6MC	CANDIDATE	t	EMAIL	\N
28	dev 2	dev2@gmail.com	$2b$10$KXLerrBBx2A6P2zZ6muS5.leWsoh1/Cj7p272ExZ.W3YuxBSFXe/G	RECRUITER	t	EMAIL	\N
29	dev 3	dev3@gmail.com	$2b$10$WDrD8pyOop48lQqkIG.JXOtaVnMkeS649oLUsbkJgDW6Pp5GqA8jS	CANDIDATE	t	EMAIL	\N
30	dev 4	dev4@gmail.com	$2b$10$avVqubuQ6u2iIO/vqRtFuOenolJM2wqByvgg3Hjan.Hxo6j.NpuMe	RECRUITER	t	EMAIL	\N
31	dev 5	dev5@gmail.com	$2b$10$sbHSeO4uVDHLAIAojvz5uuOjWxImDGMfC8mdqfJhhEtG9FyZ0W5sK	RECRUITER	f	EMAIL	\N
24	dev mode	dev1@gmail.com	$2b$10$LzeMJY1D8VA08RLgS9kb2OEeaTJ/1hfLyP50JMSngcQzHM13FED8e	CANDIDATE	t	EMAIL	\N
32	Tirth Rojara	tirth744clg@gmail.com	$2b$10$2T0XezSn9FwJsCpwl/gxyuE2ouJWKe9qs2JQtQCG4vX.THmWmseJe	CANDIDATE	t	OAUTH	111775024968718260082
\.


--
-- TOC entry 5247 (class 0 OID 128360)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6dcd564e-2523-442b-b756-b539b3da3db2	eb740637698e07c49932753f8bb7ac0aaf10e1be75b37930c0ab0f0f6b4e7233	2025-12-04 22:00:55.876778+05:30	20251129170514_add_index_in_refresh_token_table	\N	\N	2025-12-04 22:00:55.598618+05:30	1
556df437-d614-46df-93b6-e1a6d5cc2b94	16b0ee4f0e7344efc61d2cd40739bb33ee365cd31f744320a241b757e43bfef1	2025-12-04 22:00:55.885847+05:30	20251204100213_remove_education_id_from_candidate_education_table_in_id	\N	\N	2025-12-04 22:00:55.878035+05:30	1
c293b142-3bcd-48f0-81c4-7bf7d9459680	e3961f218dac9cb734b9baf5ca104a69a958e60aa6460be1eabbf60f225f6d2a	2025-12-04 22:04:27.131063+05:30	20251204163427_add_id_in_candidate_education	\N	\N	2025-12-04 22:04:27.101796+05:30	1
c25f08c8-4793-4c6f-9491-4affd7d44245	eb740637698e07c49932753f8bb7ac0aaf10e1be75b37930c0ab0f0f6b4e7233	2025-11-29 22:35:14.496533+05:30	20251129170514_add_index_in_refresh_token_table	\N	\N	2025-11-29 22:35:14.421856+05:30	1
0e0b295c-a448-4eb9-8f5d-a418c670aae5	16b0ee4f0e7344efc61d2cd40739bb33ee365cd31f744320a241b757e43bfef1	\N	20251204100213_remove_education_id_from_candidate_education_table_in_id	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251204100213_remove_education_id_from_candidate_education_table_in_id\n\nDatabase error code: 23505\n\nDatabase error:\nERROR: could not create unique index "CandidateEducation_pkey"\nDETAIL: Key ("candidateProfileId")=(1) is duplicated.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23505), message: "could not create unique index \\"CandidateEducation_pkey\\"", detail: Some("Key (\\"candidateProfileId\\")=(1) is duplicated."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("CandidateEducation"), column: None, datatype: None, constraint: Some("CandidateEducation_pkey"), file: Some("tuplesortvariants.c"), line: Some(1557), routine: Some("comparetup_index_btree_tiebreak") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251204100213_remove_education_id_from_candidate_education_table_in_id"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251204100213_remove_education_id_from_candidate_education_table_in_id"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:236	2025-12-04 15:38:53.206468+05:30	2025-12-04 15:32:13.110561+05:30	0
9700c0da-efac-4ef9-948d-c7902598df20	16b0ee4f0e7344efc61d2cd40739bb33ee365cd31f744320a241b757e43bfef1	2025-12-04 15:38:53.208448+05:30	20251204100213_remove_education_id_from_candidate_education_table_in_id		\N	2025-12-04 15:38:53.208448+05:30	0
5dfd4ac3-d85f-4718-9007-9f4fda9c0d34	c2f14437e45eb90d552dd0a1e2412c8bd129119c17c71e44406ef4b261372323	2025-10-01 13:14:19.201728+05:30	20251001074419_add_company_image_table_save	\N	\N	2025-10-01 13:14:19.189748+05:30	1
2df4ddf9-0e28-41fe-9bf7-fe94362300b1	b509fc79fcb2f59c513071ab3519302cecdb42e34a98f2ca18dcb7f0ae812e37	2025-09-16 02:23:58.404727+05:30	20250915205358_only_user_model	\N	\N	2025-09-16 02:23:58.389344+05:30	1
4a4a60f8-39e5-4a1b-9ccf-b2b2117edc25	8f19b163624cd0098bc42cf1d96f92e0252e20873d76bc5f8ca2a1306cee2eb2	2025-09-22 17:27:55.376886+05:30	20250922115755_add	\N	\N	2025-09-22 17:27:55.361161+05:30	1
9a145c4f-2894-4e91-a62c-86a13b301f82	17c6e32a4b24095bdf42a362e9841524339a644b1dd411e89c564528abae7374	2025-09-16 13:36:04.54878+05:30	20250916080604_user_name_optional	\N	\N	2025-09-16 13:36:04.544773+05:30	1
85f703b6-9440-4558-9646-d839f32e7e54	92c94b414e999bcdde05a152b0e62f020bf3d75c66b0efa723a5774733f1452d	2025-09-16 14:25:14.73395+05:30	20250916085514_add_role_enum	\N	\N	2025-09-16 14:25:14.721056+05:30	1
65df123a-b766-4b00-a0a3-1be1cd544700	b7d95808bbfe29456c1d191da3fb6e33eb0469677187fdc7ff5c0cf5df2039d4	2025-09-17 00:56:23.833214+05:30	20250916192623_add_default_status_true	\N	\N	2025-09-17 00:56:23.829539+05:30	1
f28b4ef5-cec9-488d-b9d4-af769fc75fe3	557609b54837f9343e3c2beba1064a462e498e6ee6551a3be49ae00c37cc5b8b	2025-09-23 01:06:14.001241+05:30	20250922193613_add_unique_candidate_skill	\N	\N	2025-09-23 01:06:13.993981+05:30	1
22e74645-1e0f-4f13-aa49-7e33762439f2	091028a8f0053cd016fea1b7a1f568a1073b318ed671769f71423a070ffa67a6	2025-09-18 22:20:00.161515+05:30	20250918165000_caddidate_profile_added	\N	\N	2025-09-18 22:20:00.111626+05:30	1
02565069-80b8-4cba-a62b-50c7d76fc19b	18b4a6f913371eb9681768394865ae2511acea53eb5bdde80542e21cc6b7f775	2025-09-19 16:13:57.209384+05:30	20250919104357_add_db_data	\N	\N	2025-09-19 16:13:57.157683+05:30	1
82e2aab6-55bd-4eec-a68e-b03c7f3b3f29	704232b457ad576912b54bdecc0a2e3a6d49bec93870117a633ad93150128ad2	2025-09-21 13:13:24.169958+05:30	20250921074324_add	\N	\N	2025-09-21 13:13:24.145567+05:30	1
791ea4df-69f1-4614-8e0d-77fad10bd7e3	e0041d97fa4a5d6195792c518a0cd23c5db7e292b3e613873c038da3b93de41b	2025-09-23 13:14:52.911178+05:30	20250923074452_add_candidate_experience_table	\N	\N	2025-09-23 13:14:52.886351+05:30	1
b5e87277-c12d-4857-9f64-5797ffc4083a	0283d2c385e9c12402fcc2bdd6562a46999191d2e227819cf2ceafa7c537df29	2025-09-21 13:48:39.359243+05:30	20250921081839_add_candidate_language_table	\N	\N	2025-09-21 13:48:39.344659+05:30	1
a6ae33b2-5f17-4acd-b23f-32a5e644e9b1	6196c081fbfe77a5ea4034a258385bc8150027e7924a95c4df04a51bd6daa284	2025-09-21 14:07:41.617038+05:30	20250921083741_add_candidate_language_table	\N	\N	2025-09-21 14:07:41.612061+05:30	1
7d4c1f1d-92b7-4b97-ab16-af20bcb0e714	4c1e6b640b4dbd72ca933701e7df0c1645bac9c0fb3ef5d4b8ffdbac84b327d8	2025-10-02 10:37:00.297973+05:30	20251002050700_remove_industy_field_from_company_table	\N	\N	2025-10-02 10:37:00.280405+05:30	1
cf112bf1-933d-41f6-9759-742da671e826	00f05561d755373fe7389636e2606efc2b1dc0a745c009c3168907830b7e0ad0	2025-09-21 14:14:58.900012+05:30	20250921084458_add_level_col_candidate_language_table	\N	\N	2025-09-21 14:14:58.895539+05:30	1
3ee1ae2c-1783-4af1-ba14-0605426d34a3	f60a2ce98ac6b7fea05e5b924d10e0895dbfb28404f90d55718074ffc4fcce51	2025-09-24 17:01:55.716154+05:30	20250924113155_add_unique_c_experience	\N	\N	2025-09-24 17:01:55.700851+05:30	1
b1ccfb9c-255d-45b3-996c-9d7ad6d01944	088af1e4c5dc6de3a3e4587f8e455e0dcd78eb076db8ade7d65fbbd82081eb5b	2025-09-22 11:16:49.923421+05:30	20250922054649_add	\N	\N	2025-09-22 11:16:49.896938+05:30	1
57455687-a4f7-4fcf-868c-5490bfa1744e	c5f28a8bdc0419d5ba9afbf343e2f8536f9a17819ad01b6d5d88bbc252fac9da	2025-09-22 11:47:41.158447+05:30	20250922061741_add	\N	\N	2025-09-22 11:47:41.142297+05:30	1
df83228b-cd61-4a68-bb36-2a21043a8593	70575578643adca7f988477dfda390456caa32eb4a7a6fe6f156041a4d6eed03	2025-09-22 16:13:29.971272+05:30	20250922104329_add_skill_table	\N	\N	2025-09-22 16:13:29.96024+05:30	1
1bc7d83f-efd3-45b0-adbc-901becfae7f6	a3d027782477d353dd78d9d986b6d085ffe4b75ef896c158258f44c9cb8b89ef	2025-09-25 11:13:50.184645+05:30	20250925054350_add_company_table	\N	\N	2025-09-25 11:13:50.172913+05:30	1
42d414b6-1218-4e67-a421-d651eb6844ee	cad10db4d06302f5004ccafbe8f0d4a4f27e2b52fefd5262cfb264ed6b62ddd6	2025-09-25 11:14:39.948341+05:30	20250925054439_add_enum_team_size_range	\N	\N	2025-09-25 11:14:39.945322+05:30	1
aad71ea0-7ebd-457f-a04d-b8ec6f7da620	cbfbde87383852c29dcbf5cbbe61c65df5064d5718066e856aeba8293bdba447	2025-10-02 11:00:00.228555+05:30	20251002053000_add_industry_table	\N	\N	2025-10-02 11:00:00.204646+05:30	1
953c342d-d836-4548-bd55-dfbb730cfb80	50a0e38e205c685e6d7a333b1f2c1b422052754b9648f2025b4c182f91095801	2025-09-25 17:58:21.843847+05:30	20250925122821_add_team_size_label_optional	\N	\N	2025-09-25 17:58:21.833174+05:30	1
801f5529-7666-41d9-8301-df973ab9895d	beed9266df00f1deff168058da1a7beff2186b98f60be4809dcea71ea621358f	2025-09-25 18:01:41.383123+05:30	20250925123141_add_views_optional	\N	\N	2025-09-25 18:01:41.381682+05:30	1
f6365a4b-1e47-48b2-b668-69eb2229b5f1	ed8444e319d6001760f1e2711ee4dca58f5361793e179ce2b0fc99149ec03703	\N	20251002072242_add_unique_in_industry_skill_education	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251002072242_add_unique_in_industry_skill_education\n\nDatabase error code: 23505\n\nDatabase error:\nERROR: could not create unique index "Education_name_key"\nDETAIL: Key (name)=(Harvard University) is duplicated.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23505), message: "could not create unique index \\"Education_name_key\\"", detail: Some("Key (name)=(Harvard University) is duplicated."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("Education"), column: None, datatype: None, constraint: Some("Education_name_key"), file: Some("tuplesortvariants.c"), line: Some(1557), routine: Some("comparetup_index_btree_tiebreak") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251002072242_add_unique_in_industry_skill_education"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251002072242_add_unique_in_industry_skill_education"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:236	\N	2025-10-02 12:52:42.68527+05:30	0
\.


--
-- TOC entry 5332 (class 0 OID 0)
-- Dependencies: 252
-- Name: Apply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Apply_id_seq"', 91, true);


--
-- TOC entry 5333 (class 0 OID 0)
-- Dependencies: 222
-- Name: AuthOTP_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuthOTP_id_seq"', 26, true);


--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 266
-- Name: CandidateEducation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CandidateEducation_id_seq"', 28, true);


--
-- TOC entry 5335 (class 0 OID 0)
-- Dependencies: 235
-- Name: CandidateExperience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CandidateExperience_id_seq"', 20, true);


--
-- TOC entry 5336 (class 0 OID 0)
-- Dependencies: 224
-- Name: CandidateProfile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CandidateProfile_id_seq"', 39, true);


--
-- TOC entry 5337 (class 0 OID 0)
-- Dependencies: 233
-- Name: CandidateSkill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CandidateSkill_id_seq"', 42, true);


--
-- TOC entry 5338 (class 0 OID 0)
-- Dependencies: 264
-- Name: Chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Chat_id_seq"', 20, true);


--
-- TOC entry 5339 (class 0 OID 0)
-- Dependencies: 256
-- Name: CheckLimitForRecruiter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CheckLimitForRecruiter_id_seq"', 5, true);


--
-- TOC entry 5340 (class 0 OID 0)
-- Dependencies: 239
-- Name: CompanyImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CompanyImage_id_seq"', 10, true);


--
-- TOC entry 5341 (class 0 OID 0)
-- Dependencies: 243
-- Name: CompanyIndustry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CompanyIndustry_id_seq"', 64, true);


--
-- TOC entry 5342 (class 0 OID 0)
-- Dependencies: 237
-- Name: Company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Company_id_seq"', 37, true);


--
-- TOC entry 5343 (class 0 OID 0)
-- Dependencies: 228
-- Name: Education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Education_id_seq"', 22, true);


--
-- TOC entry 5344 (class 0 OID 0)
-- Dependencies: 241
-- Name: Industry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Industry_id_seq"', 5, true);


--
-- TOC entry 5345 (class 0 OID 0)
-- Dependencies: 245
-- Name: JobRole_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JobRole_id_seq"', 4, true);


--
-- TOC entry 5346 (class 0 OID 0)
-- Dependencies: 247
-- Name: Job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Job_id_seq"', 67, true);


--
-- TOC entry 5347 (class 0 OID 0)
-- Dependencies: 269
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 215, true);


--
-- TOC entry 5348 (class 0 OID 0)
-- Dependencies: 254
-- Name: Package_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Package_id_seq"', 2, true);


--
-- TOC entry 5349 (class 0 OID 0)
-- Dependencies: 262
-- Name: PaymentHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PaymentHistory_id_seq"', 71, true);


--
-- TOC entry 5350 (class 0 OID 0)
-- Dependencies: 258
-- Name: RecruiterPackage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RecruiterPackage_id_seq"', 8, true);


--
-- TOC entry 5351 (class 0 OID 0)
-- Dependencies: 220
-- Name: RefreshToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RefreshToken_id_seq"', 611, true);


--
-- TOC entry 5352 (class 0 OID 0)
-- Dependencies: 267
-- Name: SaveJob_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SaveJob_id_seq"', 66, true);


--
-- TOC entry 5353 (class 0 OID 0)
-- Dependencies: 231
-- Name: Skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Skill_id_seq"', 67, true);


--
-- TOC entry 5354 (class 0 OID 0)
-- Dependencies: 260
-- Name: Subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Subscription_id_seq"', 62, true);


--
-- TOC entry 5355 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 37, true);


--
-- TOC entry 5038 (class 2606 OID 128675)
-- Name: Apply Apply_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Apply"
    ADD CONSTRAINT "Apply_pkey" PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 128522)
-- Name: AuthOTP AuthOTP_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthOTP"
    ADD CONSTRAINT "AuthOTP_pkey" PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 128659)
-- Name: Benefit Benefit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Benefit"
    ADD CONSTRAINT "Benefit_pkey" PRIMARY KEY (name);


--
-- TOC entry 5005 (class 2606 OID 130030)
-- Name: CandidateEducation CandidateEducation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateEducation"
    ADD CONSTRAINT "CandidateEducation_pkey" PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 128590)
-- Name: CandidateExperience CandidateExperience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateExperience"
    ADD CONSTRAINT "CandidateExperience_pkey" PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 128533)
-- Name: CandidateProfile CandidateProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateProfile"
    ADD CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 128579)
-- Name: CandidateSkill CandidateSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateSkill"
    ADD CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY (id);


--
-- TOC entry 5058 (class 2606 OID 128736)
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY (id);


--
-- TOC entry 5042 (class 2606 OID 128693)
-- Name: CheckLimitForRecruiter CheckLimitForRecruiter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckLimitForRecruiter"
    ADD CONSTRAINT "CheckLimitForRecruiter_pkey" PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 128610)
-- Name: CompanyImage CompanyImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyImage"
    ADD CONSTRAINT "CompanyImage_pkey" PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 128626)
-- Name: CompanyIndustry CompanyIndustry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyIndustry"
    ADD CONSTRAINT "CompanyIndustry_pkey" PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 128601)
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 128555)
-- Name: Education Education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Education"
    ADD CONSTRAINT "Education_pkey" PRIMARY KEY (id);


--
-- TOC entry 5021 (class 2606 OID 128619)
-- Name: Industry Industry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Industry"
    ADD CONSTRAINT "Industry_pkey" PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 128666)
-- Name: JobBenefit JobBenefit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobBenefit"
    ADD CONSTRAINT "JobBenefit_pkey" PRIMARY KEY ("jobId", "benefitName");


--
-- TOC entry 5027 (class 2606 OID 128635)
-- Name: JobRole JobRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobRole"
    ADD CONSTRAINT "JobRole_pkey" PRIMARY KEY (id);


--
-- TOC entry 5031 (class 2606 OID 128652)
-- Name: JobSkill JobSkill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill"
    ADD CONSTRAINT "JobSkill_pkey" PRIMARY KEY ("jobId", "skillId");


--
-- TOC entry 5029 (class 2606 OID 128647)
-- Name: Job Job_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_pkey" PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 128540)
-- Name: Language Language_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Language"
    ADD CONSTRAINT "Language_pkey" PRIMARY KEY (name);


--
-- TOC entry 5066 (class 2606 OID 132355)
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 128685)
-- Name: Package Package_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Package"
    ADD CONSTRAINT "Package_pkey" PRIMARY KEY (id);


--
-- TOC entry 5052 (class 2606 OID 128726)
-- Name: PaymentHistory PaymentHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentHistory"
    ADD CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY (id);


--
-- TOC entry 5045 (class 2606 OID 128704)
-- Name: RecruiterPackage RecruiterPackage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecruiterPackage"
    ADD CONSTRAINT "RecruiterPackage_pkey" PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 128510)
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- TOC entry 5061 (class 2606 OID 132327)
-- Name: SaveJob SaveJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaveJob"
    ADD CONSTRAINT "SaveJob_pkey" PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 128572)
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- TOC entry 5049 (class 2606 OID 128715)
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 128500)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 128368)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5036 (class 1259 OID 128752)
-- Name: Apply_candidateProfileId_jobId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Apply_candidateProfileId_jobId_key" ON public."Apply" USING btree ("candidateProfileId", "jobId");


--
-- TOC entry 4993 (class 1259 OID 128741)
-- Name: AuthOTP_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AuthOTP_userId_key" ON public."AuthOTP" USING btree ("userId");


--
-- TOC entry 5012 (class 1259 OID 128748)
-- Name: CandidateExperience_id_candidateProfileId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CandidateExperience_id_candidateProfileId_key" ON public."CandidateExperience" USING btree (id, "candidateProfileId");


--
-- TOC entry 5000 (class 1259 OID 128744)
-- Name: CandidateLanguage_candidateProfileId_languageName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CandidateLanguage_candidateProfileId_languageName_key" ON public."CandidateLanguage" USING btree ("candidateProfileId", "languageName");


--
-- TOC entry 4994 (class 1259 OID 128742)
-- Name: CandidateProfile_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CandidateProfile_phone_key" ON public."CandidateProfile" USING btree (phone);


--
-- TOC entry 4997 (class 1259 OID 128743)
-- Name: CandidateProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CandidateProfile_userId_key" ON public."CandidateProfile" USING btree ("userId");


--
-- TOC entry 5009 (class 1259 OID 128747)
-- Name: CandidateSkill_candidateProfileId_skillId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CandidateSkill_candidateProfileId_skillId_key" ON public."CandidateSkill" USING btree ("candidateProfileId", "skillId");


--
-- TOC entry 5054 (class 1259 OID 128758)
-- Name: Chat_chatRoomId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Chat_chatRoomId_key" ON public."Chat" USING btree ("chatRoomId");


--
-- TOC entry 5055 (class 1259 OID 132369)
-- Name: Chat_companyId_candidateProfileId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Chat_companyId_candidateProfileId_key" ON public."Chat" USING btree ("companyId", "candidateProfileId");


--
-- TOC entry 5056 (class 1259 OID 132368)
-- Name: Chat_lastMessageAt_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Chat_lastMessageAt_id_key" ON public."Chat" USING btree ("lastMessageAt", id);


--
-- TOC entry 5043 (class 1259 OID 128753)
-- Name: CheckLimitForRecruiter_recruiterId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CheckLimitForRecruiter_recruiterId_key" ON public."CheckLimitForRecruiter" USING btree ("recruiterId");


--
-- TOC entry 5022 (class 1259 OID 128750)
-- Name: CompanyIndustry_companyId_industryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CompanyIndustry_companyId_industryId_key" ON public."CompanyIndustry" USING btree ("companyId", "industryId");


--
-- TOC entry 5001 (class 1259 OID 128745)
-- Name: Education_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Education_name_key" ON public."Education" USING btree (name);


--
-- TOC entry 5019 (class 1259 OID 128749)
-- Name: Industry_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Industry_name_key" ON public."Industry" USING btree (name);


--
-- TOC entry 5025 (class 1259 OID 128751)
-- Name: JobRole_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "JobRole_name_key" ON public."JobRole" USING btree (name);


--
-- TOC entry 5062 (class 1259 OID 132356)
-- Name: Message_chatId_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_chatId_createdAt_idx" ON public."Message" USING btree ("chatId", "createdAt");


--
-- TOC entry 5063 (class 1259 OID 132370)
-- Name: Message_chatId_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_chatId_isRead_idx" ON public."Message" USING btree ("chatId", "isRead");


--
-- TOC entry 5064 (class 1259 OID 132372)
-- Name: Message_createdAt_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Message_createdAt_id_key" ON public."Message" USING btree ("createdAt", id);


--
-- TOC entry 5053 (class 1259 OID 128757)
-- Name: PaymentHistory_razorpayPaymentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentHistory_razorpayPaymentId_key" ON public."PaymentHistory" USING btree ("razorpayPaymentId");


--
-- TOC entry 5046 (class 1259 OID 128754)
-- Name: RecruiterPackage_razorpaySubscriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RecruiterPackage_razorpaySubscriptionId_key" ON public."RecruiterPackage" USING btree ("razorpaySubscriptionId");


--
-- TOC entry 5047 (class 1259 OID 128755)
-- Name: RecruiterPackage_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RecruiterPackage_userId_key" ON public."RecruiterPackage" USING btree ("userId");


--
-- TOC entry 4986 (class 1259 OID 128740)
-- Name: RefreshToken_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RefreshToken_expiresAt_idx" ON public."RefreshToken" USING btree ("expiresAt");


--
-- TOC entry 4989 (class 1259 OID 128738)
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- TOC entry 4990 (class 1259 OID 128739)
-- Name: RefreshToken_token_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RefreshToken_token_userId_idx" ON public."RefreshToken" USING btree (token, "userId");


--
-- TOC entry 5059 (class 1259 OID 132328)
-- Name: SaveJob_candidateProfileId_jobId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SaveJob_candidateProfileId_jobId_key" ON public."SaveJob" USING btree ("candidateProfileId", "jobId");


--
-- TOC entry 5006 (class 1259 OID 128746)
-- Name: Skill_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Skill_name_key" ON public."Skill" USING btree (name);


--
-- TOC entry 5050 (class 1259 OID 128756)
-- Name: Subscription_razorpaySubscriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON public."Subscription" USING btree ("razorpaySubscriptionId");


--
-- TOC entry 4983 (class 1259 OID 128737)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 5088 (class 2606 OID 128869)
-- Name: Apply Apply_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Apply"
    ADD CONSTRAINT "Apply_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5089 (class 2606 OID 128864)
-- Name: Apply Apply_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Apply"
    ADD CONSTRAINT "Apply_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5090 (class 2606 OID 128874)
-- Name: Apply Apply_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Apply"
    ADD CONSTRAINT "Apply_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5068 (class 2606 OID 128764)
-- Name: AuthOTP AuthOTP_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthOTP"
    ADD CONSTRAINT "AuthOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5072 (class 2606 OID 128784)
-- Name: CandidateEducation CandidateEducation_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateEducation"
    ADD CONSTRAINT "CandidateEducation_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5073 (class 2606 OID 128789)
-- Name: CandidateEducation CandidateEducation_educationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateEducation"
    ADD CONSTRAINT "CandidateEducation_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES public."Education"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5076 (class 2606 OID 128804)
-- Name: CandidateExperience CandidateExperience_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateExperience"
    ADD CONSTRAINT "CandidateExperience_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5070 (class 2606 OID 128774)
-- Name: CandidateLanguage CandidateLanguage_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateLanguage"
    ADD CONSTRAINT "CandidateLanguage_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5071 (class 2606 OID 128779)
-- Name: CandidateLanguage CandidateLanguage_languageName_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateLanguage"
    ADD CONSTRAINT "CandidateLanguage_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES public."Language"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5069 (class 2606 OID 128769)
-- Name: CandidateProfile CandidateProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateProfile"
    ADD CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5074 (class 2606 OID 128794)
-- Name: CandidateSkill CandidateSkill_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateSkill"
    ADD CONSTRAINT "CandidateSkill_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5075 (class 2606 OID 128799)
-- Name: CandidateSkill CandidateSkill_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CandidateSkill"
    ADD CONSTRAINT "CandidateSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5097 (class 2606 OID 128909)
-- Name: Chat Chat_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5098 (class 2606 OID 128914)
-- Name: Chat Chat_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5091 (class 2606 OID 128879)
-- Name: CheckLimitForRecruiter CheckLimitForRecruiter_recruiterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheckLimitForRecruiter"
    ADD CONSTRAINT "CheckLimitForRecruiter_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5078 (class 2606 OID 128814)
-- Name: CompanyImage CompanyImage_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyImage"
    ADD CONSTRAINT "CompanyImage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5079 (class 2606 OID 128819)
-- Name: CompanyIndustry CompanyIndustry_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyIndustry"
    ADD CONSTRAINT "CompanyIndustry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5080 (class 2606 OID 128824)
-- Name: CompanyIndustry CompanyIndustry_industryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CompanyIndustry"
    ADD CONSTRAINT "CompanyIndustry_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES public."Industry"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5077 (class 2606 OID 128809)
-- Name: Company Company_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5086 (class 2606 OID 128859)
-- Name: JobBenefit JobBenefit_benefitName_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobBenefit"
    ADD CONSTRAINT "JobBenefit_benefitName_fkey" FOREIGN KEY ("benefitName") REFERENCES public."Benefit"(name) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5087 (class 2606 OID 128854)
-- Name: JobBenefit JobBenefit_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobBenefit"
    ADD CONSTRAINT "JobBenefit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5084 (class 2606 OID 128844)
-- Name: JobSkill JobSkill_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill"
    ADD CONSTRAINT "JobSkill_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5085 (class 2606 OID 128849)
-- Name: JobSkill JobSkill_skillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JobSkill"
    ADD CONSTRAINT "JobSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5081 (class 2606 OID 128829)
-- Name: Job Job_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5082 (class 2606 OID 128839)
-- Name: Job Job_jobRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES public."JobRole"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5083 (class 2606 OID 128834)
-- Name: Job Job_postById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Job"
    ADD CONSTRAINT "Job_postById_fkey" FOREIGN KEY ("postById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5101 (class 2606 OID 132358)
-- Name: Message Message_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public."Chat"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5096 (class 2606 OID 128904)
-- Name: PaymentHistory PaymentHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentHistory"
    ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5092 (class 2606 OID 128889)
-- Name: RecruiterPackage RecruiterPackage_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecruiterPackage"
    ADD CONSTRAINT "RecruiterPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public."Package"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5093 (class 2606 OID 128884)
-- Name: RecruiterPackage RecruiterPackage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecruiterPackage"
    ADD CONSTRAINT "RecruiterPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5067 (class 2606 OID 128759)
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 132329)
-- Name: SaveJob SaveJob_candidateProfileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaveJob"
    ADD CONSTRAINT "SaveJob_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES public."CandidateProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5100 (class 2606 OID 132334)
-- Name: SaveJob SaveJob_jobId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaveJob"
    ADD CONSTRAINT "SaveJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES public."Job"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5094 (class 2606 OID 128899)
-- Name: Subscription Subscription_packageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES public."Package"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5095 (class 2606 OID 128894)
-- Name: Subscription Subscription_recruiterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5307 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-03-09 23:55:15

--
-- PostgreSQL database dump complete
--

\unrestrict eO9YCnFWoqIMuo9Gv1HMmNwRRse2QlMliMTXDZWZARog8vlnTgkcQc9Cyi6t2gf

