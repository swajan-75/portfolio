/**
 * resolveIcon.tsx
 * Resolves a react-icons icon name string to a JSX element.
 * Uses a pre-built map approach so icons are explicitly imported and tree-shakeable.
 */

// Import only icons we actually need (explicit, not wildcard)
import {
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte,
  SiTypescript, SiJavascript, SiHtml5, SiCss3, SiTailwindcss,
  SiSass, SiBootstrap, SiGo, SiPython, SiNodedotjs,
  SiNestjs, SiDotnet, SiCplusplus, SiSharp,
  SiRust, SiPhp, SiRuby, SiKotlin, SiSwift, SiDart,
  SiScala, SiElixir, SiExpress, SiFastapi, SiDjango,
  SiFlask, SiSpringboot, SiLaravel, SiGraphql, SiOpenapiinitiative, SiSwagger,
  SiPostgresql, SiMysql, SiMongodb, SiFirebase, SiRedis,
  SiSqlite, SiSupabase, SiElasticsearch, SiAmazondynamodb,
  SiPrisma, SiDocker, SiKubernetes, SiAmazonwebservices, SiGooglecloud,
  SiVercel, SiNetlify, SiLinux, SiNginx,
  SiTerraform, SiGithubactions, SiGit, SiGithub, SiGitlab,
  SiAndroid, SiFlutter, SiTensorflow, SiPytorch, SiPandas,
  SiNumpy, SiOpenai, SiHuggingface, SiJupyter, SiFigma,
  SiStorybook, SiVite, SiWebpack, SiEslint, SiJest, SiVitest,
  SiCypress, SiPostman, SiGnubash,
  SiRubyonrails,
  SiDiscord, SiLeetcode, SiHackerrank, SiCodeforces,
} from "react-icons/si";

import {
  FaBrain, FaDatabase, FaCode, FaMobileAlt, FaServer,
  FaCloud, FaLock, FaCog, FaDocker, FaJava,
} from "react-icons/fa";

import {
  FiCpu, FiDatabase, FiServer, FiShield, FiCode,
  FiCloud, FiGlobe, FiMail, FiLink, FiBox,
  FiGithub, FiLinkedin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone,
} from "react-icons/fi";

import { TbBrandAzure } from "react-icons/tb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIconComponent = React.ComponentType<any>;

const ICON_MAP: Record<string, AnyIconComponent> = {
  // Simple Icons
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiSvelte,
  SiTypescript, SiJavascript, SiHtml5, SiCss3, SiTailwindcss,
  SiSass, SiBootstrap, SiGo, SiPython, SiNodedotjs,
  SiNestjs, SiDotnet, SiCplusplus, SiSharp,
  SiRust, SiPhp, SiRuby, SiKotlin, SiSwift, SiDart,
  SiScala, SiElixir, SiExpress, SiFastapi, SiDjango,
  SiFlask, SiSpringboot, SiLaravel, SiGraphql, SiOpenapiinitiative, SiSwagger,
  SiPostgresql, SiMysql, SiMongodb, SiFirebase, SiRedis,
  SiSqlite, SiSupabase, SiElasticsearch, SiAmazondynamodb,
  SiPrisma, SiDocker, SiKubernetes, SiAmazonwebservices, SiGooglecloud,
  SiVercel, SiNetlify, SiLinux, SiNginx,
  SiTerraform, SiGithubactions, SiGit, SiGithub, SiGitlab,
  SiAndroid, SiFlutter, SiTensorflow, SiPytorch, SiPandas,
  SiNumpy, SiOpenai, SiHuggingface, SiJupyter, SiFigma,
  SiStorybook, SiVite, SiWebpack, SiEslint, SiJest, SiVitest,
  SiCypress, SiPostman, SiGnubash,
  SiRubyonrails,
  SiDiscord, SiLeetcode, SiHackerrank, SiCodeforces,

  // Fallbacks for older names
  SiJava: FaJava,
  SiOpenapi: SiSwagger,
  SiAmazonaws: SiAmazonwebservices,
  SiMicrosoftazure: TbBrandAzure,
  SiBash: SiGnubash,

  // Font Awesome
  FaBrain, FaDatabase, FaCode, FaMobileAlt, FaServer,
  FaCloud, FaLock, FaCog, FaDocker, FaJava,
  
  // Tabler
  TbBrandAzure,

  // Feather Icons
  FiCpu, FiDatabase, FiServer, FiShield, FiCode,
  FiCloud, FiGlobe, FiMail, FiLink, FiBox,
  FiGithub, FiLinkedin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone,
};

/**
 * Given a react-icons name like "SiReact" or "FaCode",
 * returns a JSX element or null if not found.
 */
export function resolveIcon(
  name: string,
  props?: { className?: string; size?: number }
): React.ReactElement | null {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon {...(props ?? {})} />;
}

/**
 * Index of ICON_MAP keys by their bare, normalized name:
 * "SiJavascript" -> "javascript", "FaDatabase" -> "database".
 */
const NORMALIZED_KEYS: Record<string, string> = (() => {
  const index: Record<string, string> = {};
  for (const key of Object.keys(ICON_MAP)) {
    const bare = key.replace(/^(Si|Fa|Fi|Tb|Di|Io|Md|Bs)/, "").toLowerCase();
    if (!(bare in index)) index[bare] = key;
  }
  return index;
})();

/** Human-facing labels whose normalized form differs from the icon's own name. */
const NAME_ALIASES: Record<string, string> = {
  nextjs: "nextdotjs",
  node: "nodedotjs",
  nodejs: "nodedotjs",
  vue: "vuedotjs",
  vuejs: "vuedotjs",
  reactjs: "react",
  reactnative: "react",
  cpp: "cplusplus",
  cc: "cplusplus",
  csharp: "sharp",
  golang: "go",
  postgres: "postgresql",
  aws: "amazonwebservices",
  androidstudio: "android",
  linuxunixcli: "linux",
  dockercompose: "docker",
  firebasefirestorefcmauth: "firebase",
  website: "world",
  email: "mail",
};

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Resolves an icon from either an explicit react-icons key ("SiReact") or a
 * human label ("Next.js", "PostgreSQL", "github"). Falls back to the label when
 * stored icon data is missing, which is the common case for seeded content.
 */
export function resolveIconSmart(
  iconKey: string | undefined,
  label: string | undefined,
  props?: { className?: string; size?: number }
): React.ReactElement | null {
  const direct = iconKey ? resolveIcon(iconKey, props) : null;
  if (direct) return direct;

  if (!label) return null;
  const normalized = normalizeName(label);
  const target = NAME_ALIASES[normalized] ?? normalized;
  const mapKey = NORMALIZED_KEYS[target];
  if (!mapKey) return null;

  const Icon = ICON_MAP[mapKey];
  return <Icon {...(props ?? {})} />;
}

/**
 * Searches icon names matching a query string (case-insensitive).
 * Returns up to `limit` results.
 */
export function searchIcons(query: string, limit = 30): string[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return Object.keys(ICON_MAP)
    .filter((name) => name.toLowerCase().includes(q))
    .slice(0, limit);
}
