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
