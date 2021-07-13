import { Option } from "./types";

export const BASE_URL: string =
  // @ts-ignore OCL_API_HOST is injected at runtime via index.html
  window.OCL_API_HOST || "https://api.staging.openconceptlab.org";
export const TRADITIONAL_OCL_URL =
  // @ts-ignore TRADITIONAL_OCL_HOST is injected at runtime via index.html
  window.TRADITIONAL_OCL_HOST || "https://staging.openconceptlab.org";
export const OCL_SIGNUP_URL =
  // @ts-ignore OCL_SIGNUP_URL is injected at runtime via index.html
  window.OCL_SIGNUP_URL ||
  "https://app.staging.openconceptlab.org/#/accounts/signup";
export const BUILD: string =
  // @ts-ignore OCL_BUILD is injected at runtime via index.html
  window.OCL_BUILD || "local";

export const CUSTOM_VALIDATION_SCHEMA = "OpenMRS";

export const USER_TYPE = "users";
export const ORG_TYPE = "orgs";

export const option = (value: string, label: string = value): Option => ({
  value,
  label
});

export const LOCALES: { [key: string]: string }[] = [
  { value: "en", label: "English (en)" },
  { value: "aa", label: "Afar (aa)" },
  { value: "ab", label: "Abkhazian (ab)" },
  { value: "ae", label: "Avestan (ae)" },
  { value: "af", label: "Afrikaans (af)" },
  { value: "ak", label: "Akan (ak)" },
  { value: "am", label: "Amharic (am)" },
  { value: "an", label: "Aragonese (an)" },
  { value: "ar", label: "Arabic (ar)" },
  { value: "as", label: "Assamese (as)" },
  { value: "av", label: "Avaric (av)" },
  { value: "ay", label: "Aymara (ay)" },
  { value: "az", label: "Azerbaijani (az)" },
  { value: "ba", label: "Bashkir (ba)" },
  { value: "be", label: "Belarusian (be)" },
  { value: "bg", label: "Bulgarian (bg)" },
  { value: "bh", label: "Bihari languages (bh)" },
  { value: "bi", label: "Bislama (bi)" },
  { value: "bm", label: "Bambara (bm)" },
  { value: "bn", label: "Bengali (bn)" },
  { value: "bo", label: "Tibetan (bo)" },
  { value: "br", label: "Breton (br)" },
  { value: "bs", label: "Bosnian (bs)" },
  { value: "ca", label: "Catalan (ca)" },
  { value: "ce", label: "Chechen (ce)" },
  { value: "ch", label: "Chamorro (ch)" },
  { value: "co", label: "Corsican (co)" },
  { value: "cr", label: "Cree (cr)" },
  { value: "cs", label: "Czech (cs)" },
  { value: "cu", label: "Old Bulgarian (cu)" },
  { value: "cv", label: "Chuvash (cv)" },
  { value: "cy", label: "Welsh (cy)" },
  { value: "da", label: "Danish (da)" },
  { value: "de", label: "German (de)" },
  { value: "dv", label: "Divehi (dv)" },
  { value: "dz", label: "Dzongkha (dz)" },
  { value: "ee", label: "Ewe (ee)" },
  { value: "el", label: "Greek, Modern (1453-) (el)" },
  { value: "eo", label: "Esperanto (eo)" },
  { value: "es", label: "Spanish (es)" },
  { value: "et", label: "Estonian (et)" },
  { value: "eu", label: "Basque (eu)" },
  { value: "fa", label: "Persian (fa)" },
  { value: "ff", label: "Fulah (ff)" },
  { value: "fi", label: "Finnish (fi)" },
  { value: "fj", label: "Fijian (fj)" },
  { value: "fo", label: "Faroese (fo)" },
  { value: "fr", label: "French (fr)" },
  { value: "fy", label: "Western Frisian (fy)" },
  { value: "ga", label: "Irish (ga)" },
  { value: "gd", label: "Scottish Gaelic (gd)" },
  { value: "gl", label: "Galician (gl)" },
  { value: "gn", label: "Guarani (gn)" },
  { value: "gu", label: "Gujarati (gu)" },
  { value: "gv", label: "Manx (gv)" },
  { value: "ha", label: "Hausa (ha)" },
  { value: "he", label: "Hebrew (he)" },
  { value: "hi", label: "Hindi (hi)" },
  { value: "ho", label: "Hiri Motu (ho)" },
  { value: "hr", label: "Croatian (hr)" },
  { value: "ht", label: "Haitian Creole (ht)" },
  { value: "hu", label: "Hungarian (hu)" },
  { value: "hy", label: "Armenian (hy)" },
  { value: "hz", label: "Herero (hz)" },
  {
    value: "ia",
    label: "Interlingua (International Auxiliary Language Association) (ia)"
  },
  { value: "id", label: "Indonesian (id)" },
  { value: "ie", label: "Occidental (ie)" },
  { value: "ig", label: "Igbo (ig)" },
  { value: "ii", label: "Sichuan Yi (ii)" },
  { value: "ik", label: "Inupiaq (ik)" },
  { value: "io", label: "Ido (io)" },
  { value: "is", label: "Icelandic (is)" },
  { value: "it", label: "Italian (it)" },
  { value: "iu", label: "Inuktitut (iu)" },
  { value: "ja", label: "Japanese (ja)" },
  { value: "jv", label: "Javanese (jv)" },
  { value: "ka", label: "Georgian (ka)" },
  { value: "kg", label: "Kongo (kg)" },
  { value: "ki", label: "Kikuyu (ki)" },
  { value: "kj", label: "Kuanyama (kj)" },
  { value: "kk", label: "Kazakh (kk)" },
  { value: "kl", label: "Greenlandic (kl)" },
  { value: "km", label: "Central Khmer (km)" },
  { value: "kn", label: "Kannada (kn)" },
  { value: "ko", label: "Korean (ko)" },
  { value: "kr", label: "Kanuri (kr)" },
  { value: "ks", label: "Kashmiri (ks)" },
  { value: "ku", label: "Kurdish (ku)" },
  { value: "kv", label: "Komi (kv)" },
  { value: "kw", label: "Cornish (kw)" },
  { value: "ky", label: "Kirghiz (ky)" },
  { value: "la", label: "Latin (la)" },
  { value: "lb", label: "Letzeburgesch (lb)" },
  { value: "lg", label: "Ganda (lg)" },
  { value: "li", label: "Limburgan (li)" },
  { value: "ln", label: "Lingala (ln)" },
  { value: "lo", label: "Lao (lo)" },
  { value: "lt", label: "Lithuanian (lt)" },
  { value: "lu", label: "Luba-Katanga (lu)" },
  { value: "lv", label: "Latvian (lv)" },
  { value: "mg", label: "Malagasy (mg)" },
  { value: "mh", label: "Marshallese (mh)" },
  { value: "mi", label: "Maori (mi)" },
  { value: "mk", label: "Macedonian (mk)" },
  { value: "ml", label: "Malayalam (ml)" },
  { value: "mn", label: "Mongolian (mn)" },
  { value: "mr", label: "Marathi (mr)" },
  { value: "ms", label: "Malay (ms)" },
  { value: "mt", label: "Maltese (mt)" },
  { value: "my", label: "Burmese (my)" },
  { value: "na", label: "Nauru (na)" },
  { value: "nb", label: "Norwegian Bokmu00e5l (nb)" },
  { value: "nd", label: "Ndebele, North (nd)" },
  { value: "ne", label: "Nepali (ne)" },
  { value: "ng", label: "Ndonga (ng)" },
  { value: "nl", label: "Dutch (nl)" },
  { value: "nn", label: "Norwegian Nynorsk (nn)" },
  { value: "no", label: "Norwegian (no)" },
  { value: "nr", label: "Ndebele, South (nr)" },
  { value: "nv", label: "Navajo (nv)" },
  { value: "ny", label: "Chewa (ny)" },
  { value: "oc", label: "Occitan (post 1500) (oc)" },
  { value: "oj", label: "Ojibwa (oj)" },
  { value: "om", label: "Oromo (om)" },
  { value: "or", label: "Oriya (or)" },
  { value: "os", label: "Ossetian (os)" },
  { value: "pa", label: "Punjabi (pa)" },
  { value: "pi", label: "Pali (pi)" },
  { value: "pl", label: "Polish (pl)" },
  { value: "ps", label: "Pashto (ps)" },
  { value: "pt", label: "Portuguese (pt)" },
  { value: "qu", label: "Quechua (qu)" },
  { value: "rm", label: "Romansh (rm)" },
  { value: "rn", label: "Rundi (rn)" },
  { value: "ro", label: "Romanian (ro)" },
  { value: "ru", label: "Russian (ru)" },
  { value: "rw", label: "Kinyarwanda (rw)" },
  { value: "sa", label: "Sanskrit (sa)" },
  { value: "sc", label: "Sardinian (sc)" },
  { value: "sd", label: "Sindhi (sd)" },
  { value: "se", label: "Northern Sami (se)" },
  { value: "sg", label: "Sango (sg)" },
  { value: "si", label: "Sinhalese (si)" },
  { value: "sk", label: "Slovak (sk)" },
  { value: "sl", label: "Slovenian (sl)" },
  { value: "sm", label: "Samoan (sm)" },
  { value: "sn", label: "Shona (sn)" },
  { value: "so", label: "Somali (so)" },
  { value: "sq", label: "Albanian (sq)" },
  { value: "sr", label: "Serbian (sr)" },
  { value: "ss", label: "Swati (ss)" },
  { value: "st", label: "Sotho, Southern (st)" },
  { value: "su", label: "Sundanese (su)" },
  { value: "sv", label: "Swedish (sv)" },
  { value: "sw", label: "Swahili (sw)" },
  { value: "ta", label: "Tamil (ta)" },
  { value: "te", label: "Telugu (te)" },
  { value: "tg", label: "Tajik (tg)" },
  { value: "th", label: "Thai (th)" },
  { value: "ti", label: "Tigrinya (ti)" },
  { value: "tk", label: "Turkmen (tk)" },
  { value: "tl", label: "Tagalog (tl)" },
  { value: "tn", label: "Tswana (tn)" },
  { value: "to", label: "Tonga (Tonga Islands) (to)" },
  { value: "tr", label: "Turkish (tr)" },
  { value: "ts", label: "Tsonga (ts)" },
  { value: "tt", label: "Tatar (tt)" },
  { value: "tw", label: "Twi (tw)" },
  { value: "ty", label: "Tahitian (ty)" },
  { value: "ug", label: "Uighur (ug)" },
  { value: "uk", label: "Ukrainian (uk)" },
  { value: "ur", label: "Urdu (ur)" },
  { value: "uz", label: "Uzbek (uz)" },
  { value: "ve", label: "Venda (ve)" },
  { value: "vi", label: "Vietlabelse (vi)" },
  { value: "vo", label: "Volapu00fck (vo)" },
  { value: "wa", label: "Walloon (wa)" },
  { value: "wo", label: "Wolof (wo)" },
  { value: "xh", label: "Xhosa (xh)" },
  { value: "yi", label: "Yiddish (yi)" },
  { value: "yo", label: "Yoruba (yo)" },
  { value: "za", label: "Zhuang (za)" },
  { value: "zh", label: "Chinese (zh)" },
  { value: "zu", label: "Zulu (zu)" }
];

export const CONCEPT_CLASS_QUESTION = "Question";
export const CONCEPT_CLASSES_SET = ["LabSet", "MedSet", "ConvSet"];
export const CONCEPT_DATATYPE_NUMERIC = "Numeric";
export const CONCEPT_DATATYPE_CODED = "Coded";

export const CONCEPT_CLASSES: string[] = [
  "Diagnosis",
  "Symptom/Finding",
  "Procedure",
  CONCEPT_CLASS_QUESTION,
  "Drug",
  "Test",
  ...CONCEPT_CLASSES_SET,
  "Finding",
  "Anatomy",
  "Misc",
  "Symptom",
  "Specimen",
  "Misc-Order",
  "Workflow",
  "State",
  "Program",
  "Aggregate-Measurement",
  "Indicator",
  "Health-Care-Monitoring-Topics",
  "Radiology-Imaging-Procedure",
  "Frequency",
  "Pharmacologic-Drug-Class",
  "Units-of-Measure",
  "Organism",
  "Drug-form",
  "Medical-supply",
  "InteractSet"
];

export const DATA_TYPES: string[] = [
  "N/A",
  "Boolean",
  "Coded",
  "Complex",
  "Document",
  "Date",
  "Time",
  "Datetime",
  "Structured-Numeric",
  "Rule",
  CONCEPT_DATATYPE_NUMERIC,
  "Text"
];

export const NAME_TYPES: { [key: string]: string }[] = [
  { value: "FULLY_SPECIFIED", label: "Fully Specified" },
  { value: "null", label: "Synonym" }, // value here should be null but inputs html can't handle null as a value
  { value: "SHORT", label: "Short" },
  { value: "INDEX_TERM", label: "Index Term" }
];

export const MAP_TYPES: Option[] = [
  option("SAME-AS", "Same as"),
  option("NARROWER-THAN", "Narrower than"),
  option("BROADER-THAN", "Broader than"),
  ...[
    "Associated finding",
    "Associated morphology",
    "Associated procedure",
    "Associated with",
    "Causative agent",
    "Finding site",
    "Has specimen",
    "Laterality",
    "Severity"
  ].map((item: string) => option(item))
];
export const MAP_TYPE_Q_AND_A = option("Q-AND-A");
export const MAP_TYPE_CONCEPT_SET = option("CONCEPT-SET");

const CIEL_SOURCE_URL = "/orgs/CIEL/sources/CIEL/";
const PIH_SOURCE_URL = "/orgs/PIH/sources/PIH/";
const MSFOCP_SOURCE_URL = "/orgs/MSFOCP/sources/MSFOCP/";
const ALL_PUBLIC_SOURCES_URL = "/";

export const PREFERRED_SOURCES: { [key: string]: string } = {
  CIEL: CIEL_SOURCE_URL,
  PIH: PIH_SOURCE_URL,
  MSFOCP: MSFOCP_SOURCE_URL
};

export const PREFERRED_SOURCES_VIEW_ONLY: { [key: string]: string } = {
  "Public Sources": ALL_PUBLIC_SOURCES_URL,
  ...PREFERRED_SOURCES
};

export const VERIFIED_SOURCES = ["CIEL"];

export const CONTEXT = {
  create: "create",
  view: "view",
  edit: "edit"
};

export const CONCEPT_GENERAL: string[] = ["Include Retired", "Include Added Concepts"];
